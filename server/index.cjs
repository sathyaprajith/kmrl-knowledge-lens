const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Optional: better-sqlite3 for persistence
let Database;
try {
  Database = require("better-sqlite3");
} catch (e) {
  console.warn(
    "better-sqlite3 not installed or failed to load. Persistence disabled."
  );
}

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

const TMP_DIR = path.join(__dirname, "tmp");
const FILES_DIR = path.join(__dirname, "files");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR, { recursive: true });

const upload = multer({ dest: TMP_DIR });

app.use(express.json());

// Initialize DB if available
let db;
if (Database) {
  const dbPath = path.join(__dirname, "documents.sqlite");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.prepare(
    `CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      name TEXT,
      path TEXT,
      size INTEGER,
      ext TEXT,
      mimetype TEXT,
      summary TEXT,
      title TEXT,
      department TEXT,
      document_type TEXT,
      language TEXT,
      priority TEXT,
      content_summary TEXT,
      action_items TEXT,
      key_insights TEXT,
      tags TEXT,
      compliance_deadline TEXT,
      created_at INTEGER
    )`
  ).run();
}

const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function callOpenAISummary(text) {
  if (!OPENAI_KEY) return null;
  try {
    // Use the Chat Completions API via fetch; Node 18+ has global fetch
    const prompt = `Summarize the following document concisely (one short paragraph):\n\n${text.slice(
      0,
      2000
    )}`;
    const body = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.2,
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      console.warn("OpenAI responded with", r.status);
      return null;
    }
    const j = await r.json();
    const content = j?.choices?.[0]?.message?.content;
    return content || null;
  } catch (e) {
    console.warn("OpenAI call failed", e?.message || e);
    return null;
  }
}

async function analyzeDocumentComprehensively(text, filename) {
  if (!OPENAI_KEY) {
    // Fallback analysis without AI
    return {
      title: filename.replace(/\.[^/.]+$/, ""),
      department: "general",
      document_type: "other",
      language: "english",
      priority: "medium",
      content_summary: text.slice(0, 500) + (text.length > 500 ? "..." : ""),
      action_items: [],
      key_insights: ["Document uploaded successfully"],
      tags: ["uploaded", "processed"],
      compliance_deadline: null,
    };
  }

  try {
    const prompt = `Please analyze this document and extract the following information:
    - Title or main subject
    - Department it belongs to (engineering, maintenance, operations, finance, hr, procurement, safety, legal, executive, general)
    - Document type (engineering_drawing, maintenance_report, incident_report, invoice, purchase_order, regulatory_directive, safety_circular, policy, meeting_minutes, correspondence, other)
    - Language (english, malayalam, bilingual)
    - Priority level (low, medium, high, urgent)
    - A detailed summary of the content
    - Extract any action items with descriptions, responsible departments, deadlines, and priorities
    - Key insights or important points
    - Relevant tags for searchability
    - Any compliance deadline mentioned

    Document content:
    ${text.slice(0, 3000)}`;

    const body = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.1,
      functions: [
        {
          name: "analyze_document",
          description: "Extract structured information from a document",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string" },
              department: {
                type: "string",
                enum: [
                  "engineering",
                  "maintenance",
                  "operations",
                  "finance",
                  "hr",
                  "procurement",
                  "safety",
                  "legal",
                  "executive",
                  "general",
                ],
              },
              document_type: {
                type: "string",
                enum: [
                  "engineering_drawing",
                  "maintenance_report",
                  "incident_report",
                  "invoice",
                  "purchase_order",
                  "regulatory_directive",
                  "safety_circular",
                  "policy",
                  "meeting_minutes",
                  "correspondence",
                  "other",
                ],
              },
              language: {
                type: "string",
                enum: ["english", "malayalam", "bilingual"],
              },
              priority: {
                type: "string",
                enum: ["low", "medium", "high", "urgent"],
              },
              content_summary: { type: "string" },
              action_items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    description: { type: "string" },
                    department: { type: "string" },
                    deadline: { type: "string" },
                    priority: {
                      type: "string",
                      enum: ["low", "medium", "high", "urgent"],
                    },
                  },
                },
              },
              key_insights: {
                type: "array",
                items: { type: "string" },
              },
              tags: {
                type: "array",
                items: { type: "string" },
              },
              compliance_deadline: { type: "string" },
            },
            required: [
              "title",
              "department",
              "document_type",
              "language",
              "priority",
              "content_summary",
            ],
          },
        },
      ],
      function_call: { name: "analyze_document" },
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      console.warn("OpenAI comprehensive analysis failed with", r.status);
      return null;
    }

    const j = await r.json();
    const functionCall = j?.choices?.[0]?.message?.function_call;

    if (functionCall && functionCall.name === "analyze_document") {
      return JSON.parse(functionCall.arguments);
    }

    return null;
  } catch (e) {
    console.warn("Comprehensive analysis failed", e?.message || e);
    return null;
  }
}

app.get("/", (req, res) => res.send("K-Lens file server"));

// New endpoint for comprehensive document processing
app.post("/api/process-document", upload.single("file"), async (req, res) => {
  console.log("Received document processing request");
  try {
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    console.log("Processing file:", req.file.originalname);

    const file = req.file;
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    const id = crypto.randomUUID();
    const finalName = `${id}-${file.originalname}`.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );
    const finalPath = path.join(FILES_DIR, finalName);

    // Move from tmp to files dir
    fs.renameSync(file.path, finalPath);

    // Extract text for analysis
    let textForAnalysis = null;
    if (
      file.mimetype.startsWith("text") ||
      ["txt", "md", "csv", "json"].includes(ext)
    ) {
      try {
        textForAnalysis = fs.readFileSync(finalPath, "utf8");
      } catch (e) {
        console.warn("Failed to read text file:", e.message);
      }
    }

    // Perform comprehensive analysis
    let analysisResult = null;
    if (textForAnalysis) {
      analysisResult = await analyzeDocumentComprehensively(
        textForAnalysis,
        file.originalname
      );
    }

    if (!analysisResult) {
      // Fallback if AI analysis fails
      analysisResult = {
        title: file.originalname.replace(/\.[^/.]+$/, ""),
        department: "general",
        document_type: "other",
        language: "english",
        priority: "medium",
        content_summary: textForAnalysis
          ? textForAnalysis.slice(0, 500) +
            (textForAnalysis.length > 500 ? "..." : "")
          : "(Content could not be analyzed)",
        action_items: [],
        key_insights: ["Document uploaded successfully"],
        tags: ["uploaded"],
        compliance_deadline: null,
      };
    }

    const documentData = {
      id,
      name: file.originalname,
      path: finalPath,
      size: file.size,
      ext,
      mimetype: file.mimetype,
      summary: analysisResult.content_summary,
      file_url: `/files/${finalName}`,
      original_filename: file.originalname,
      ...analysisResult,
      created_at: Date.now(),
    };

    // Save to database if available
    if (db) {
      const stmt = db.prepare(`
        INSERT INTO documents (
          id, name, path, size, ext, mimetype, summary, title, department, 
          document_type, language, priority, content_summary, action_items, 
          key_insights, tags, compliance_deadline, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        documentData.name,
        documentData.path,
        documentData.size,
        documentData.ext,
        documentData.mimetype,
        documentData.summary,
        analysisResult.title,
        analysisResult.department,
        analysisResult.document_type,
        analysisResult.language,
        analysisResult.priority,
        analysisResult.content_summary,
        JSON.stringify(analysisResult.action_items || []),
        JSON.stringify(analysisResult.key_insights || []),
        JSON.stringify(analysisResult.tags || []),
        analysisResult.compliance_deadline,
        documentData.created_at
      );
    }

    res.json({
      ok: true,
      document: documentData,
    });
  } catch (err) {
    console.error("Document processing error:", err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Serve files
app.use("/files", express.static(FILES_DIR));

app.post("/api/upload", upload.array("files"), async (req, res) => {
  try {
    const results = [];
    for (const file of req.files) {
      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      const id = crypto.randomUUID();
      const finalName = `${id}-${file.originalname}`.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      const finalPath = path.join(FILES_DIR, finalName);

      // Move from tmp to files dir
      fs.renameSync(file.path, finalPath);

      const record = {
        id,
        name: file.originalname,
        size: file.size,
        ext,
        mimetype: file.mimetype,
        summary: "(Processing)",
      };

      // Basic local text extraction for common text-like files
      let textForSummary = null;
      if (
        file.mimetype.startsWith("text") ||
        ["txt", "md", "csv", "json"].includes(ext)
      ) {
        try {
          const txt = fs.readFileSync(finalPath, "utf8");
          textForSummary = txt;
        } catch (e) {
          // ignore
        }
      }

      // If we have text and an OPENAI key, call LLM for a better summary
      if (textForSummary && OPENAI_KEY) {
        const llm = await callOpenAISummary(textForSummary);
        if (llm) record.summary = llm;
        else
          record.summary =
            textForSummary.slice(0, 800) +
            (textForSummary.length > 800 ? "…" : "");
      } else if (textForSummary) {
        record.summary =
          textForSummary.slice(0, 800) +
          (textForSummary.length > 800 ? "…" : "");
      } else {
        record.summary = "(Preview unavailable)";
      }

      // Persist to DB if available
      if (db) {
        const stmt = db.prepare(
          "INSERT INTO documents (id, name, path, size, ext, mimetype, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        stmt.run(
          id,
          record.name,
          finalPath,
          record.size,
          record.ext,
          record.mimetype,
          record.summary,
          Date.now()
        );
      }

      results.push(record);
    }

    res.json({ ok: true, files: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Cleanup temporary files (and old files in FILES_DIR) older than 24 hours
const CLEANUP_INTERVAL = 1000 * 60 * 60; // 1 hour
const MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

function cleanupOldFiles() {
  [TMP_DIR, FILES_DIR].forEach((dir) => {
    try {
      const items = fs.readdirSync(dir);
      items.forEach((name) => {
        try {
          const p = path.join(dir, name);
          const st = fs.statSync(p);
          if (Date.now() - st.mtimeMs > MAX_AGE) {
            fs.unlinkSync(p);
            // If db exists, remove corresponding entry
            if (db) {
              const del = db.prepare("DELETE FROM documents WHERE path = ?");
              del.run(p);
            }
          }
        } catch (e) {
          // ignore individual errors
        }
      });
    } catch (e) {
      // ignore
    }
  });
}

setInterval(cleanupOldFiles, CLEANUP_INTERVAL);
// Run once at startup
cleanupOldFiles();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`File server listening on http://localhost:${PORT}`)
);
