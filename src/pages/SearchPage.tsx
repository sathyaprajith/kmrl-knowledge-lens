import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import SearchInterface from "@/components/SearchInterface";
import SearchResults from "@/components/SearchResults";
import DocumentViewer from "@/components/DocumentViewer";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleBackToSearch = () => {
    setShowResults(false);
  };

  const handleDocumentOpen = (document: any) => {
    setSelectedDocument(document);
    setShowDocViewer(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                
                <div className="hidden md:flex flex-1 max-w-md">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Quick search..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          handleSearch(e.currentTarget.value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              {!showResults ? (
                <SearchInterface onSearch={handleSearch} />
              ) : (
                <SearchResults 
                  query={searchQuery} 
                  onDocumentOpen={handleDocumentOpen}
                  onBackToSearch={handleBackToSearch}
                />
              )}
            </div>
          </main>
        </div>

        <DocumentViewer
          isOpen={showDocViewer}
          onClose={() => setShowDocViewer(false)}
          document={selectedDocument}
        />
      </div>
    </SidebarProvider>
  );
};

export default SearchPage;