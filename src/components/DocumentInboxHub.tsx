import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, Globe, ChevronDown, Sparkles, FileText, Calendar, Building2, AlertTriangle, Download, Eye, Clock } from "lucide-react";
import type { UploadFileResponse } from "@/integrations/Core";
import { useAuth } from "@/lib/auth";

interface DocumentInboxHubProps {
  onDocumentSelect?: (document: any) => void;
  showSummarizeAll?: boolean;
}

export const DocumentInboxHub: React.FC<DocumentInboxHubProps> = ({ 
  onDocumentSelect,
  showSummarizeAll = true 
}) => {
  const { user } = useAuth();
  const [language] = useState('english'); // Default language
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['high-risk', 'urgent', 'normal']);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  // Get user's department from the auth context
  const userDepartment = user?.role || "Administrator";

  // Load documents from various sources
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage (processed documents)
      const storedDocs = localStorage.getItem('kmrl-documents');
      const processedDocs = storedDocs ? JSON.parse(storedDocs) : [];

      // Sample documents from various sources - comprehensive list for all departments
      const allSampleDocs = [
        // Safety Department Documents
        {
          id: 'email-001',
          title: 'Monsoon Preparedness - Emergency Protocol Update',
          source: 'Email',
          department: 'Safety',
          language: 'English',
          priority: 'high-risk',
          date: new Date().toISOString(),
          author: 'Safety Department',
          content: 'Updated emergency protocols for monsoon season...',
          type: 'Safety Alert'
        },
        {
          id: 'safety-002',
          title: 'Track Inspection Report - Sector 7',
          source: 'File Upload',
          department: 'Safety',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 86400000).toISOString(),
          author: 'Safety Inspector',
          content: 'Weekly track safety inspection findings...',
          type: 'Inspection Report'
        },
        {
          id: 'safety-003',
          title: 'Fire Safety Drill Documentation',
          source: 'Web Portal',
          department: 'Safety',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'Safety Team',
          content: 'Monthly fire safety drill results and analysis...',
          type: 'Drill Report'
        },

        // Legal Department Documents
        {
          id: 'legal-001',
          title: 'Environmental Permit Renewal Application',
          source: 'Email',
          department: 'Legal',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 43200000).toISOString(),
          author: 'Legal Department',
          content: 'Environmental clearance renewal documentation...',
          type: 'Legal Document'
        },
        {
          id: 'legal-002',
          title: 'Vendor Contract Amendment - ElectroTech',
          source: 'File Upload',
          department: 'Legal',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 129600000).toISOString(),
          author: 'Legal Advisor',
          content: 'Contract amendment for electrical maintenance vendor...',
          type: 'Contract'
        },
        {
          id: 'legal-003',
          title: 'Compliance Audit Report Q3 2025',
          source: 'Web Portal',
          department: 'Legal',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 216000000).toISOString(),
          author: 'Compliance Team',
          content: 'Quarterly compliance audit findings and recommendations...',
          type: 'Audit Report'
        },

        // HR Department Documents
        {
          id: 'hr-001',
          title: 'Staff Training Certification Records',
          source: 'File Upload',
          department: 'HR',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 64800000).toISOString(),
          author: 'HR Manager',
          content: 'Technical staff certification expiry notices...',
          type: 'Training Record'
        },
        {
          id: 'hr-002',
          title: 'Employee Handbook 2025 Update',
          source: 'Email',
          department: 'HR',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 151200000).toISOString(),
          author: 'HR Department',
          content: 'Annual employee handbook revision and updates...',
          type: 'Policy Document'
        },
        {
          id: 'hr-003',
          title: 'Performance Review Templates Q3',
          source: 'Web Portal',
          department: 'HR',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 237600000).toISOString(),
          author: 'HR Team',
          content: 'Quarterly performance review documentation...',
          type: 'HR Form'
        },

        // Finance Department Documents
        {
          id: 'finance-001',
          title: 'Q4 Budget Proposal 2025',
          source: 'File Upload',
          department: 'Finance',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 32400000).toISOString(),
          author: 'Finance Manager',
          content: 'Quarterly operational budget proposal...',
          type: 'Budget Document'
        },
        {
          id: 'finance-002',
          title: 'Vendor Payment Invoice - MNT-2025-0892',
          source: 'Email',
          department: 'Finance',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 118800000).toISOString(),
          author: 'Accounts Team',
          content: 'Overdue payment notice for maintenance contractor...',
          type: 'Invoice'
        },
        {
          id: 'finance-003',
          title: 'GST Returns September 2025',
          source: 'Web Portal',
          department: 'Finance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 205200000).toISOString(),
          author: 'Tax Officer',
          content: 'Monthly GST filing documentation...',
          type: 'Tax Document'
        },

        // Operations Department Documents
        {
          id: 'operations-001',
          title: 'New Train Service Update - പുതിയ ട്രെയിൻ സേവന അപ്ഡേറ്റ്',
          source: 'Web Portal',
          department: 'Operations',
          language: 'Hybrid',
          priority: 'urgent',
          date: new Date(Date.now() - 86400000).toISOString(),
          author: 'Operations Team',
          content: 'അമൃത് ഗേറ്റ് സ്റ്റേഷന്റെ പുതിയ ട്രെയിൻ സേവന അപ്ഡേറ്റ് - New train service starts at Amrut Gate Station...',
          type: 'Service Update'
        },
        {
          id: 'operations-002',
          title: 'Passenger Traffic Report September 2025',
          source: 'File Upload',
          department: 'Operations',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'Operations Manager',
          content: 'Monthly passenger capacity analysis and recommendations...',
          type: 'Traffic Report'
        },
        {
          id: 'operations-003',
          title: 'Signal Maintenance Schedule - Central Station',
          source: 'Email',
          department: 'Operations',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 259200000).toISOString(),
          author: 'Signal Engineer',
          content: 'Quarterly signal system maintenance schedule...',
          type: 'Maintenance Schedule'
        },

        // IT Department Documents
        {
          id: 'it-001',
          title: 'System Backup Failure Alert',
          source: 'Email',
          department: 'IT',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 1800000).toISOString(),
          author: 'IT Support',
          content: 'Automated backup system failure notification...',
          type: 'System Alert'
        },
        {
          id: 'it-002',
          title: 'Security Patch Update Notice',
          source: 'Web Portal',
          department: 'IT',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 88200000).toISOString(),
          author: 'IT Security',
          content: 'Critical security patches for ticket management system...',
          type: 'Security Update'
        },
        {
          id: 'it-003',
          title: 'Network Diagnostic Report',
          source: 'File Upload',
          department: 'IT',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 174600000).toISOString(),
          author: 'Network Team',
          content: 'WiFi connectivity issues analysis and resolution...',
          type: 'Diagnostic Report'
        },

        // Maintenance Department Documents
        {
          id: 'maintenance-001',
          title: 'മെയിന്റനൻസ് റിപ്പോർട്ട് - അലുവ സ്റ്റേഷൻ',
          source: 'File Upload',
          department: 'Maintenance',
          language: 'Malayalam',
          priority: 'normal',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'Maintenance Team',
          content: 'അലുവ സ്റ്റേഷന്റെ പതിവ് പരിശോധന റിപ്പോർട്ട്...',
          type: 'Maintenance Report'
        },
        {
          id: 'maintenance-002',
          title: 'Escalator Repair Status - Aluva Station',
          source: 'Email',
          department: 'Maintenance',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 259200000).toISOString(),
          author: 'Maintenance Engineer',
          content: 'Escalator malfunction repair status and timeline...',
          type: 'Repair Report'
        },
        {
          id: 'maintenance-003',
          title: 'AC Maintenance Schedule All Stations',
          source: 'Web Portal',
          department: 'Maintenance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 345600000).toISOString(),
          author: 'Facilities Team',
          content: 'Monthly air conditioning maintenance schedule...',
          type: 'Maintenance Schedule'
        }
      ];

      // Filter documents based on user's department (Administrator sees all)
      const sampleDocs = userDepartment === "Administrator" 
        ? allSampleDocs 
        : allSampleDocs.filter(doc => doc.department === userDepartment);

      // Combine processed documents with sample documents
      const allDocs = [
        ...processedDocs.map((doc: UploadFileResponse) => ({
          id: doc.id,
          title: doc.filename,
          source: 'File Upload',
          department: doc.department || 'General',
          language: 'English',
          priority: doc.urgency?.toLowerCase() || 'normal',
          date: doc.createdAt || new Date().toISOString(),
          author: 'System',
          content: doc.text || '',
          type: doc.fileType?.split('/')[1]?.toUpperCase() || 'Document',
          originalDoc: doc
        })),
        ...sampleDocs
      ];

      setDocuments(allDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setSelectedPriorities([...selectedPriorities, priority]);
    } else {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    }
  };

  const handleSummarizeAll = async () => {
    setSummarizing(true);
    try {
      // Simulate AI summarization process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a summary of filtered documents
      const filteredDocs = getFilteredDocuments();
      const summary = `
📊 Document Summary Report
📅 Generated: ${new Date().toLocaleString()}
📄 Total Documents: ${filteredDocs.length}

🔍 Key Insights:
• ${filteredDocs.filter(d => d.priority === 'high-risk').length} High Risk documents requiring immediate attention
• ${filteredDocs.filter(d => d.priority === 'urgent').length} Urgent items pending review
• ${filteredDocs.filter(d => d.department === 'Safety').length} Safety-related documents
• ${filteredDocs.filter(d => d.department === 'Operations').length} Operations updates

📋 Recent Activity:
${filteredDocs.slice(0, 5).map(doc => `• ${doc.title} (${doc.department})`).join('\n')}

💡 Recommendations:
• Prioritize high-risk safety documents
• Review urgent operational updates
• Ensure compliance with new protocols
      `;

      // Save summary to clipboard or show in modal
      navigator.clipboard.writeText(summary);
      alert('AI Summary generated and copied to clipboard!');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Error generating summary. Please try again.');
    } finally {
      setSummarizing(false);
    }
  };

  const getFilteredDocuments = () => {
    return documents.filter(doc => {
      const matchesSearch = searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = selectedSource === 'all' || doc.source === selectedSource;
      const matchesLanguage = selectedLanguage === 'all' || doc.language === selectedLanguage;
      const matchesPriority = selectedPriorities.includes(doc.priority);

      return matchesSearch && matchesSource && matchesLanguage && matchesPriority;
    });
  };

  const filteredDocuments = getFilteredDocuments();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high-risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high-risk':
        return <AlertTriangle className="h-3 w-3" />;
      case 'urgent':
        return <Clock className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const sources = ['All Sources', 'Email', 'Web Portal', 'File Upload', 'API Integration'];
  const departments = ['All Departments', 'Safety', 'Operations', 'Maintenance', 'Finance', 'HR', 'IT'];
  const languages = ['All Languages', 'Malayalam', 'English', 'Hybrid'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Inbox & AI Summarization Hub
            </h1>
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-muted-foreground">
            {language === 'malayalam' 
              ? 'AI-പവേർഡ് ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് ഒന്നിലധികം സ്രോതസുകളിൽ നിന്ന്'
              : 'AI-powered document processing from multiple sources'
            }
          </p>
        </div>
        {showSummarizeAll && (
          <Button 
            onClick={handleSummarizeAll}
            disabled={summarizing || filteredDocuments.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {summarizing ? 'Summarizing...' : 'Summarize All'}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filters & Search</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Source</label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Web Portal">Web Portal</SelectItem>
                <SelectItem value="File Upload">File Upload</SelectItem>
                <SelectItem value="API Integration">API Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Checkboxes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high-risk"
                  checked={selectedPriorities.includes('high-risk')}
                  onCheckedChange={(checked) => handlePriorityChange('high-risk', checked as boolean)}
                />
                <label htmlFor="high-risk" className="text-sm text-red-700 font-medium">High Risk</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={selectedPriorities.includes('urgent')}
                  onCheckedChange={(checked) => handlePriorityChange('urgent', checked as boolean)}
                />
                <label htmlFor="urgent" className="text-sm text-orange-700 font-medium">Urgent</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="normal"
                  checked={selectedPriorities.includes('normal')}
                  onCheckedChange={(checked) => handlePriorityChange('normal', checked as boolean)}
                />
                <label htmlFor="normal" className="text-sm text-green-700 font-medium">Normal</label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Actions</label>
            <div className="flex flex-col gap-2">
              {showSummarizeAll && (
                <Button 
                  onClick={handleSummarizeAll}
                  disabled={summarizing || filteredDocuments.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
                  size="sm"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {summarizing ? 'Processing...' : 'Summarize All'}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSource('all');
                  setSelectedLanguage('all');
                  setSelectedPriorities(['high-risk', 'urgent', 'normal']);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">
              {language === 'malayalam' ? 'ഡോക്യുമെന്റുകൾ' : 'Documents'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-red-700 border-red-200">
              {filteredDocuments.filter(d => d.priority === 'high-risk').length} High Risk
            </Badge>
            <Badge variant="outline" className="text-orange-700 border-orange-200">
              {filteredDocuments.filter(d => d.priority === 'urgent').length} Urgent
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-200">
              {filteredDocuments.filter(d => d.priority === 'normal').length} Normal
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No documents match your current filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
                onClick={() => onDocumentSelect?.(doc.originalDoc || doc)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getPriorityIcon(doc.priority)}
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {doc.department}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {doc.source}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {doc.language}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge className={`text-xs ${getPriorityColor(doc.priority)}`}>
                    {doc.priority.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {doc.type}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" title="View Document">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentInboxHub;