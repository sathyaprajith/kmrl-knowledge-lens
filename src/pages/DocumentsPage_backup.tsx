import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { DocumentInboxHub } from "@/components/DocumentInboxHub";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, Download, Eye, Filter, Upload, Building2, AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { UploadFileResponse } from "@/integrations/Core";

const DocumentsPage = () => {
  const [storedDocuments, setStoredDocuments] = useState<UploadFileResponse[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [showInboxHub, setShowInboxHub] = useState(true);

  // Load documents from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('kmrl-documents');
    if (stored) {
      setStoredDocuments(JSON.parse(stored));
    }
  }, []);

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

  // Functionality handlers
  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleDownloadDocument = (doc: any) => {
    // For demo purposes, create a simple text file with document info
    const content = `Document: ${doc.title}
Department: ${doc.department}
Date: ${doc.date}
Author: ${doc.author}
Type: ${doc.type}
Size: ${doc.size}
Status: ${doc.status}
Downloads: ${doc.downloads}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewExtractedText = (doc: UploadFileResponse) => {
    setSelectedDocument(doc);
    setViewerOpen(true);
  };

  const handleCopyBulletPoints = (doc: UploadFileResponse) => {
    if (doc.bulletPoints && doc.bulletPoints.length > 0) {
      const bulletText = doc.bulletPoints.join('\n• ');
      navigator.clipboard.writeText('• ' + bulletText);
      // Simple notification (you could use a toast library for better UX)
      alert('Bullet points copied to clipboard!');
    }
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelectedDocument(null);
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
                <h1 className="text-xl font-semibold">Documents</h1>
              </div>
              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-6">
                {/* Toggle between Inbox Hub and Traditional View */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={showInboxHub ? "default" : "outline"}
                      onClick={() => setShowInboxHub(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Document Inbox & AI Hub
                    </Button>
                    <Button
                      variant={!showInboxHub ? "default" : "outline"}
                      onClick={() => setShowInboxHub(false)}
                    >
                      Traditional Library
                    </Button>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => window.location.href = '/upload'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    AI Upload & Analysis
                  </Button>
                </div>

                {/* Conditional Rendering */}
                {showInboxHub ? (
                  <DocumentInboxHub 
                    onDocumentSelect={handleViewDocument}
                    showSummarizeAll={true}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Document Library</h2>
                        <p className="text-muted-foreground">Browse and manage all KMRL documents</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setFilterOpen(!filterOpen)}
                        >
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
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
                          <div 
                            key={doc.id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                            onClick={() => handleViewDocument(doc)}
                          >
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
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDocument(doc);
                                }}
                                title="View Document"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(doc);
                                }}
                                title="Download Document"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Processed Documents Section */}
                    {storedDocuments.length > 0 && (
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-semibold">Processed Documents</h3>
                            <p className="text-muted-foreground">Documents processed with text extraction and categorization</p>
                          </div>
                          <Badge variant="outline">{storedDocuments.length} Documents</Badge>
                        </div>
                        
                        <div className="space-y-4">
                          {storedDocuments.map((doc) => (
                            <div 
                              key={doc.id} 
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                              onClick={() => handleViewExtractedText(doc)}
                            >
                              <div className="flex items-center gap-4">
                                <FileText className="h-8 w-8 text-blue-600" />
                                <div className="space-y-1">
                                  <h4 className="font-medium">{doc.filename}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </span>
                                    <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                    {doc.department && (
                                      <span className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        {doc.department}
                                      </span>
                                    )}
                                    {doc.bulletPoints && (
                                      <span>{doc.bulletPoints.length} bullet points</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {doc.urgency && (
                                  <Badge 
                                    variant="outline"
                                    className={`${
                                      doc.urgency === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                                      doc.urgency === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                      doc.urgency === 'Medium' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                      'border-green-500 text-green-700 bg-green-50'
                                    }`}
                                  >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {doc.urgency}
                                  </Badge>
                                )}
                                <Badge variant="outline">{doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  title="View extracted text"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewExtractedText(doc);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  title="Copy bullet points"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyBulletPoints(doc);
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Document Library</h2>
                    <p className="text-muted-foreground">Browse and manage all KMRL documents</p>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFilterOpen(!filterOpen)}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => window.location.href = '/upload'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        AI Upload & Analysis
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
                      <div 
                        key={doc.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                        onClick={() => handleViewDocument(doc)}
                      >
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(doc);
                            }}
                            title="View Document"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadDocument(doc);
                            }}
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Processed Documents Section */}
                {storedDocuments.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold">Processed Documents</h3>
                        <p className="text-muted-foreground">Documents processed with text extraction and categorization</p>
                      </div>
                      <Badge variant="outline">{storedDocuments.length} Documents</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {storedDocuments.map((doc) => (
                        <div 
                          key={doc.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                          onClick={() => handleViewExtractedText(doc)}
                        >
                          <div className="flex items-center gap-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div className="space-y-1">
                              <h4 className="font-medium">{doc.filename}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown date'}
                                </span>
                                <span>{(doc.size / 1024).toFixed(1)} KB</span>
                                {doc.department && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {doc.department}
                                  </span>
                                )}
                                {doc.bulletPoints && (
                                  <span>{doc.bulletPoints.length} bullet points</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {doc.urgency && (
                              <Badge 
                                variant="outline"
                                className={`${
                                  doc.urgency === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                                  doc.urgency === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                  doc.urgency === 'Medium' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                  'border-green-500 text-green-700 bg-green-50'
                                }`}
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {doc.urgency}
                              </Badge>
                            )}
                            <Badge variant="outline">{doc.fileType.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="View extracted text"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewExtractedText(doc);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="Copy bullet points"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyBulletPoints(doc);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewerOpen && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {selectedDocument.title || selectedDocument.filename || 'Document Viewer'}
              </h3>
              <Button variant="ghost" size="sm" onClick={closeViewer}>
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-auto max-h-[70vh]">
              {/* For regular documents */}
              {selectedDocument.title && !selectedDocument.filename && (
                <div className="space-y-6">
                  {/* Document Header */}
                  <div className="border-b pb-4">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedDocument.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="outline">{selectedDocument.type}</Badge>
                      <Badge 
                        variant={
                          selectedDocument.status === 'Active' ? 'default' : 
                          selectedDocument.status === 'Current' ? 'secondary' : 
                          selectedDocument.status === 'Pending' ? 'outline' : 'default'
                        }
                      >
                        {selectedDocument.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Document Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">Department:</strong>
                        <span className="text-gray-600">{selectedDocument.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">Author:</strong>
                        <span className="text-gray-600">{selectedDocument.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">Date:</strong>
                        <span className="text-gray-600">{new Date(selectedDocument.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">File Size:</strong>
                        <span className="text-gray-600">{selectedDocument.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">Downloads:</strong>
                        <span className="text-gray-600">{selectedDocument.downloads} times</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Description/Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong className="text-gray-700 block mb-2">Document Summary:</strong>
                    <p className="text-gray-600">
                      {selectedDocument.type === 'Safety Circular' && 
                        'This safety circular contains important guidelines and procedures for ensuring workplace safety and compliance with regulations.'
                      }
                      {selectedDocument.type === 'Protocol' && 
                        'This protocol document outlines standard operating procedures and emergency response guidelines.'
                      }
                      {selectedDocument.type === 'Invoice' && 
                        'This invoice contains payment details and financial information for services rendered.'
                      }
                      {selectedDocument.type === 'Report' && 
                        'This report contains detailed analysis and findings from operational activities.'
                      }
                    </p>
                  </div>
                </div>
              )}
              
              {/* For processed documents */}
              {selectedDocument.filename && (selectedDocument.text || selectedDocument.extractedText) && (
                <div className="space-y-6">
                  {/* Document Header */}
                  <div className="border-b pb-4">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{selectedDocument.filename}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {selectedDocument.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                      {selectedDocument.urgency && (
                        <Badge 
                          variant="outline"
                          className={`${
                            selectedDocument.urgency === 'Critical' ? 'border-red-500 text-red-700 bg-red-50' :
                            selectedDocument.urgency === 'High' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                            selectedDocument.urgency === 'Medium' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                            'border-green-500 text-green-700 bg-green-50'
                          }`}
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {selectedDocument.urgency}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Document Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {selectedDocument.department && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <strong className="text-gray-700">Department:</strong>
                          <span className="text-gray-600">{selectedDocument.department}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">File Size:</strong>
                        <span className="text-gray-600">{(selectedDocument.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <strong className="text-gray-700">Processed:</strong>
                        <span className="text-gray-600">
                          {selectedDocument.createdAt ? 
                            new Date(selectedDocument.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 
                            'Unknown date'
                          }
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedDocument.deadline && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-gray-500" />
                          <strong className="text-gray-700">Deadline:</strong>
                          <span className="text-gray-600">{selectedDocument.deadline}</span>
                        </div>
                      )}
                      {selectedDocument.bulletPoints && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <strong className="text-gray-700">Bullet Points:</strong>
                          <span className="text-gray-600">{selectedDocument.bulletPoints.length} items</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedDocument.bulletPoints && selectedDocument.bulletPoints.length > 0 && (
                    <div>
                      <strong>Bullet Points:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {selectedDocument.bulletPoints.map((point: string, index: number) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <strong>Extracted Text:</strong>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-96 overflow-auto">
                      <pre className="whitespace-pre-wrap text-sm">{selectedDocument.text || selectedDocument.extractedText || 'No text content available'}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for any document that doesn't match above conditions */}
              {!selectedDocument.title && !selectedDocument.filename && (
                <div className="space-y-4">
                  <div className="text-center text-gray-500">
                    <p>Document information not available</p>
                    <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(selectedDocument, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filter Documents</h3>
              <Button variant="ghost" size="sm" onClick={() => setFilterOpen(false)}>
                ✕
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">All Departments</option>
                  <option value="Safety">Safety</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Document Type</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">All Types</option>
                  <option value="Safety Circular">Safety Circular</option>
                  <option value="Protocol">Protocol</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Report">Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Current">Current</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setFilterOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
};

export default DocumentsPage;