const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: path.join(__dirname, "tmp") });

app.use(express.json());

app.get("/", (req, res) => res.send("K-Lens file server"));

app.post("/api/upload", upload.array("files"), async (req, res) => {
  try {
    const results = [];
    for (const file of req.files) {
      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      const record = {
        name: file.originalname,
        size: file.size,
        ext,
        mimetype: file.mimetype,
      };

      // Simple text extraction for text-like files
      if (
        file.mimetype.startsWith("text") ||
        ["txt", "md", "csv", "json"].includes(ext)
      ) {
        try {
          const txt = fs.readFileSync(file.path, "utf8");
          record.summary = txt.slice(0, 800) + (txt.length > 800 ? "…" : "");
        } catch (e) {
          record.summary = "(Could not read file)";
        }
      } else {
        record.summary = "(Preview unavailable)";
      }

      results.push(record);
    }

    res.json({ ok: true, files: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`File server listening on http://localhost:${PORT}`)
);
