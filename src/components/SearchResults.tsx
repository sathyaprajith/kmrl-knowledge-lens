import { FileText, ExternalLink, Calendar, User, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SearchResultsProps {
  query: string;
}

const SearchResults = ({ query }: SearchResultsProps) => {
  // Mock data for demonstration
  const aiAnswer = {
    text: "Based on your query about monsoon preparedness, there are 3 active safety circulars. The latest directive SC-2024-15 mandates drainage inspection at all stations before June 15th. Critical points include: waterlogging prevention measures, emergency contact protocols, and staff safety guidelines during heavy rainfall.",
    confidence: 94,
    sources: 3
  };

  const sourceDocuments = [
    {
      id: "1",
      title: "Monsoon Preparedness Safety Circular SC-2024-15",
      snippet: "All stations must complete drainage system inspection and waterlogging prevention measures before June 15th, 2024. Emergency protocols...",
      source: "SharePoint > Safety > Circulars",
      date: "2024-03-10",
      type: "Circular",
      language: "English",
      relevance: 98,
      status: "Active"
    },
    {
      id: "2", 
      title: "Emergency Response Protocol - Rainfall",
      snippet: "During heavy rainfall exceeding 50mm/hour, implement Code Yellow protocol. Station managers must ensure passenger safety and coordinate...",
      source: "Email > safety@kmrl.co.in",
      date: "2024-02-28",
      type: "Protocol",
      language: "English",
      relevance: 85,
      status: "Current"
    },
    {
      id: "3",
      title: "Aluva Station Flood Risk Assessment",
      snippet: "Vulnerability analysis indicates high risk zones near platforms 2-3. Recommended mitigation includes improved drainage capacity...",
      source: "Maximo > Risk Assessments",
      date: "2024-01-15", 
      type: "Assessment",
      language: "English",
      relevance: 78,
      status: "Under Review"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* AI Generated Answer */}
      <Card className="p-6 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">AI</span>
              </div>
              <h3 className="text-lg font-semibold">K-Lens Analysis</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success">
                {aiAnswer.confidence}% Confidence
              </Badge>
              <Badge variant="outline">
                {aiAnswer.sources} Sources
              </Badge>
            </div>
          </div>
          
          <p className="text-foreground leading-relaxed">
            {aiAnswer.text}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>✓ Fact-checked against {aiAnswer.sources} documents</span>
            <span>•</span>
            <span>Last updated: Today</span>
          </div>
        </div>
      </Card>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Found {sourceDocuments.length} relevant documents</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Date Range</Button>
          <Button variant="outline" size="sm">Document Type</Button>
          <Button variant="outline" size="sm">Language</Button>
        </div>
      </div>

      <Separator />

      {/* Source Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Source Documents</h3>
        
        {sourceDocuments.map((doc) => (
          <Card key={doc.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {doc.title}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {doc.snippet}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge 
                    variant={doc.status === 'Active' ? 'default' : doc.status === 'Current' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {doc.status}
                  </Badge>
                  <span className="text-xs text-success font-medium">
                    {doc.relevance}% match
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(doc.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{doc.source}</span>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {doc.type}
                </Badge>
                
                <Badge variant="outline" className="text-xs">
                  {doc.language}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    View Full Document
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View in K-Lens
                  </Button>
                </div>
                
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline">
          Load More Results
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;