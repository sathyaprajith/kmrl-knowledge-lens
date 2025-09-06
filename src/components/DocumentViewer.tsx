import { useState } from "react";
import { X, Download, Share2, Bookmark, ExternalLink, Eye, Calendar, User, FileText, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any;
}

const DocumentViewer = ({ isOpen, onClose, document }: DocumentViewerProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  if (!isOpen || !document) return null;

  // Mock document data
  const docData = {
    title: "Monsoon Preparedness Safety Circular SC-2024-15",
    type: "Safety Circular",
    date: "2024-03-10",
    author: "Safety Department",
    status: "Active",
    classification: "Internal",
    language: "English",
    size: "2.4 MB",
    pages: 8,
    summary: [
      "Mandatory drainage inspection at all stations before June 15th, 2024",
      "Implementation of waterlogging prevention measures",
      "Updated emergency contact protocols for monsoon season",
      "Staff safety guidelines during heavy rainfall conditions",
      "Passenger safety protocols during weather emergencies"
    ],
    keyEntities: [
      { type: "Date", value: "June 15th, 2024", context: "Inspection deadline" },
      { type: "Location", value: "All KMRL Stations", context: "Scope of application" },
      { type: "Department", value: "Safety Department", context: "Issuing authority" },
      { type: "Protocol", value: "Code Yellow", context: "Emergency response level" },
      { type: "Contact", value: "safety@kmrl.co.in", context: "Emergency contact" }
    ],
    relatedDocs: [
      { title: "Emergency Response Protocol - Rainfall", type: "Protocol", date: "2024-02-28" },
      { title: "Station Maintenance Checklist", type: "Checklist", date: "2024-01-20" },
      { title: "Monsoon Safety Training Manual", type: "Manual", date: "2023-05-15" }
    ],
    actionItems: [
      { task: "Complete drainage inspection", deadline: "June 15, 2024", status: "pending" },
      { task: "Update emergency contact list", deadline: "April 1, 2024", status: "completed" },
      { task: "Conduct staff safety briefing", deadline: "May 30, 2024", status: "in-progress" }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-8 bg-background border rounded-xl shadow-2xl flex overflow-hidden">
        {/* Document Content Panel */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{docData.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {docData.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {docData.author}
                </span>
                <Badge variant={docData.status === 'Active' ? 'default' : 'secondary'}>
                  {docData.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Document Viewer */}
          <div className="flex-1 p-6 bg-muted/30">
            <div className="w-full h-full bg-background rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Document Preview</p>
                <p className="text-sm">PDF content would be displayed here</p>
                <Button variant="outline" className="mt-4">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Native Viewer
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* K-Lens AI Panel */}
        <div className="w-96 border-l bg-muted/20 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-gradient-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">AI</span>
              </div>
              <h3 className="font-semibold">K-Lens Analysis</h3>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
              <TabsTrigger value="entities" className="text-xs">Key Info</TabsTrigger>
              <TabsTrigger value="related" className="text-xs">Related</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="summary" className="p-6 pt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Document Summary</h4>
                  <ul className="space-y-2">
                    {docData.summary.map((point, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="entities" className="p-6 pt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Key Information</h4>
                  <div className="space-y-3">
                    {docData.keyEntities.map((entity, index) => (
                      <div key={index} className="p-3 rounded-lg border bg-background">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">{entity.type}</Badge>
                        </div>
                        <p className="font-medium text-sm">{entity.value}</p>
                        <p className="text-xs text-muted-foreground">{entity.context}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="related" className="p-6 pt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Related Documents</h4>
                  <div className="space-y-2">
                    {docData.relatedDocs.map((doc, index) => (
                      <div key={index} className="p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-pointer">
                        <p className="font-medium text-sm">{doc.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                          <span className="text-xs text-muted-foreground">{doc.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="p-6 pt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Action Items</h4>
                  <div className="space-y-3">
                    {docData.actionItems.map((action, index) => (
                      <div key={index} className="p-3 rounded-lg border bg-background">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">{action.task}</p>
                          <Badge 
                            variant={action.status === 'completed' ? 'default' : action.status === 'in-progress' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {action.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Due: {action.deadline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;