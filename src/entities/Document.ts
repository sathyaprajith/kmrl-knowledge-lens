// Document entity for KMRL Knowledge Lens

export interface DocumentData {
  id?: string;
  title: string;
  department: string;
  document_type: string;
  language: string;
  priority: string;
  content_summary: string;
  action_items: Array<{
    description: string;
    department: string;
    deadline: string;
    priority: string;
  }>;
  key_insights: string[];
  tags: string[];
  compliance_deadline: string | null;
  file_url: string;
  original_filename: string;
  source: string;
}

export class Document {
  static async create(documentData: DocumentData): Promise<DocumentData> {
    // In a real implementation, this would save to a database
    // For now, we'll just return the data and log it
    console.log('Document created:', documentData);
    
    // You could extend this to save to localStorage, IndexedDB, or send to a backend
    const id = documentData.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const savedDocument = {
      ...documentData,
      id,
      created_at: new Date().toISOString()
    };

    // Save to localStorage for persistence
    const existingDocs = JSON.parse(localStorage.getItem('kmrl_documents') || '[]');
    existingDocs.push(savedDocument);
    localStorage.setItem('kmrl_documents', JSON.stringify(existingDocs));

    return savedDocument;
  }

  static async getAll(): Promise<DocumentData[]> {
    const docs = JSON.parse(localStorage.getItem('kmrl_documents') || '[]');
    return docs;
  }

  static async getById(id: string): Promise<DocumentData | null> {
    const docs = await Document.getAll();
    return docs.find(doc => doc.id === id) || null;
  }
}
