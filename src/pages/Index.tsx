import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SearchInterface from "@/components/SearchInterface";
import SearchResults from "@/components/SearchResults";
import DocumentViewer from "@/components/DocumentViewer";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleDocumentOpen = (document: any) => {
    setSelectedDocument(document);
    setShowDocViewer(true);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            {!showResults ? (
              <SearchInterface />
            ) : (
              <SearchResults query={searchQuery} />
            )}
          </div>
        </main>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={showDocViewer}
        onClose={() => setShowDocViewer(false)}
        document={selectedDocument}
      />
    </div>
  );
};

export default Index;
