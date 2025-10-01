// Enhanced text extraction from multiple file types including PDFs and images
import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface UploadFileParams {
  file: File;
  department?: string;
  deadline?: string;
  urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface UploadFileResponse {
  text: string;
  filename: string;
  size: number;
  fileType: string;
  bulletPoints?: string[];
  department?: string;
  deadline?: string;
  urgency?: 'Low' | 'Medium' | 'High' | 'Critical';
  id?: string;
  createdAt?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  department: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline?: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  documentId?: string;
}

// Function to convert text to bullet points
function formatAsBulletPoints(text: string): string[] {
  if (!text) return [];
  
  // Split by sentences and paragraphs
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10) // Filter out very short fragments
    .slice(0, 10); // Limit to 10 bullet points
  
  return sentences.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
}

// PDF text extraction using PDF.js (client-side)
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      
      // Try text extraction first
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      if (pageText.trim()) {
        fullText += pageText + '\n';
      } else {
        // If no text found, try OCR on the page (image-based PDF)
        console.log(`Page ${pageNum} appears to be image-based, attempting OCR...`);
        try {
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          }).promise;            // Convert canvas to blob and run OCR
            const imageBlob = await new Promise<Blob>((resolve) => {
              canvas.toBlob(resolve as BlobCallback, 'image/png');
            });
            
            if (imageBlob) {
              const ocrText = await extractTextFromImage(imageBlob as File);
              fullText += `[Page ${pageNum} OCR]: ${ocrText}\n`;
            }
          }
        } catch (ocrError) {
          console.error(`OCR failed for page ${pageNum}:`, ocrError);
          fullText += `[Page ${pageNum}]: Could not extract text from image-based content\n`;
        }
      }
    }
    
    return fullText.trim() || 'No text content found in PDF';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return `Error extracting text from PDF: ${error.message}. Please try uploading the PDF as individual page images for better OCR results.`;
  }
}

// Image OCR using browser-based approach
async function extractTextFromImage(file: File): Promise<string> {
  try {
    // Import Tesseract.js dynamically
    const Tesseract = await import('tesseract.js');
    
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: m => console.log(m) // Log progress
      }
    );
    
    return text.trim() || 'No text found in image';
  } catch (error) {
    console.error('OCR extraction error:', error);
    return `Error extracting text from image: ${error.message}. The image might be unclear or in an unsupported format.`;
  }
}

export async function UploadFile({ file, department, deadline, urgency }: UploadFileParams): Promise<UploadFileResponse> {
  const fileType = file.type || 'unknown';
  let extractedText = '';

  try {
    if (fileType === 'application/pdf') {
      extractedText = await extractTextFromPDF(file);
    } else if (fileType.startsWith('image/')) {
      extractedText = await extractTextFromImage(file);
    } else if (fileType.startsWith('text/') || 
               file.name.toLowerCase().endsWith('.txt') || 
               file.name.toLowerCase().endsWith('.md') ||
               file.name.toLowerCase().endsWith('.csv')) {
      // Handle text files
      extractedText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    } else {
      // Try to read as text anyway
      extractedText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    }

    const bulletPoints = formatAsBulletPoints(extractedText);
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: documentId,
      text: extractedText || 'Could not extract text from file',
      filename: file.name,
      size: file.size,
      fileType,
      bulletPoints,
      department,
      deadline,
      urgency,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Failed to process ${file.name}: ${error.message}`);
  }
}

// Function to create alert from document
export function createAlertFromDocument(document: UploadFileResponse): AlertItem {
  return {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: `Document Alert: ${document.filename}`,
    description: document.bulletPoints?.[0] || document.text.substring(0, 100) + '...',
    department: document.department || 'General',
    urgency: document.urgency || 'Medium',
    deadline: document.deadline,
    status: 'Open',
    createdAt: document.createdAt || new Date().toISOString(),
    documentId: document.id
  };
}

// Common departments list
export const COMMON_DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'IT/Technology',
  'Legal',
  'Operations',
  'Marketing',
  'Sales',
  'Customer Service',
  'Quality Assurance',
  'Research & Development',
  'Procurement',
  'Facilities',
  'Security',
  'Compliance',
  'General'
] as const;
