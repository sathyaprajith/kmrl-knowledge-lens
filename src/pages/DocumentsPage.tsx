import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Download, Eye, Filter } from "lucide-react";

const DocumentsPage = () => {
  const documents = [
    {
      id: 1,
      title: "Monsoon Preparedness Safety Circular SC-2024-15",
      type: "Safety Circular",
      department: "Safety",
      date: "2024-03-10",
      author: "Safety Department",
      status: "Active",
      size: "2.4 MB",
      downloads: 156
    },
    {
      id: 2,
      title: "Emergency Response Protocol - Rainfall",
      type: "Protocol",
      department: "Operations",
      date: "2024-02-28",
      author: "Operations Team",
      status: "Current",
      size: "1.8 MB",
      downloads: 89
    },
    {
      id: 3,
      title: "ABC Infrastructure Invoice #INV-102",
      type: "Invoice",
      department: "Finance",
      date: "2024-03-05",
      author: "Finance Department",
      status: "Pending",
      size: "0.5 MB",
      downloads: 23
    },
    {
      id: 4,
      title: "Aluva Station Maintenance Report MR-AV-240315",
      type: "Report",
      department: "Maintenance",
      date: "2024-03-15",
      author: "Maintenance Team",
      status: "Completed",
      size: "3.2 MB",
      downloads: 67
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <h1 className="text-xl font-semibold">Documents</h1>
              </div>
              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Document Library</h2>
                    <p className="text-muted-foreground">Browse and manage all KMRL documents</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Upload Document
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">2,847</p>
                      <p className="text-sm text-muted-foreground">Total Documents</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">124</p>
                      <p className="text-sm text-muted-foreground">New This Month</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">45GB</p>
                      <p className="text-sm text-muted-foreground">Total Storage</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                    </div>
                  </Card>
                </div>

                {/* Documents List */}
                <Card className="p-6">
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-primary" />
                          <div className="space-y-1">
                            <h4 className="font-medium">{doc.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(doc.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {doc.author}
                              </span>
                              <span>{doc.size}</span>
                              <span>{doc.downloads} downloads</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={
                              doc.status === 'Active' ? 'default' : 
                              doc.status === 'Current' ? 'secondary' : 
                              doc.status === 'Pending' ? 'outline' : 'default'
                            }
                          >
                            {doc.status}
                          </Badge>
                          <Badge variant="outline">{doc.type}</Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DocumentsPage;