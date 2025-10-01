import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Building, 
  Tag, 
  AlertTriangle, 
  CheckCircle, 
  Edit,
  Save,
  X
} from 'lucide-react';

interface ActionItem {
  description: string;
  department: string;
  deadline: string;
  priority: string;
}

interface DocumentData {
  title: string;
  department: string;
  document_type: string;
  language: string;
  priority: string;
  content_summary: string;
  action_items: ActionItem[];
  key_insights: string[];
  tags: string[];
  compliance_deadline?: string;
  file_url: string;
  original_filename: string;
}

interface DocumentPreviewProps {
  documentData: DocumentData;
  onSave: (data: DocumentData) => void;
  onCancel: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  documentData,
  onSave,
  onCancel
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'engineering': return 'bg-blue-100 text-blue-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'operations': return 'bg-green-100 text-green-800';
      case 'finance': return 'bg-purple-100 text-purple-800';
      case 'hr': return 'bg-pink-100 text-pink-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="text-2xl text-slate-900 dark:text-white">
                {documentData.title}
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-300">
                {documentData.original_filename}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(documentData.priority)}>
                {documentData.priority.toUpperCase()}
              </Badge>
              <Badge className={getDepartmentColor(documentData.department)}>
                {documentData.department.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Document Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Type:</span>
                <span className="text-slate-900 dark:text-white capitalize">
                  {documentData.document_type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-700 dark:text-slate-300">Language:</span>
                <span className="text-slate-900 dark:text-white capitalize">
                  {documentData.language}
                </span>
              </div>
              {documentData.compliance_deadline && (
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Compliance Deadline:
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {documentData.compliance_deadline}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {documentData.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {documentData.content_summary}
          </p>
        </CardContent>
      </Card>

      {/* Key Insights */}
      {documentData.key_insights && documentData.key_insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {documentData.key_insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      {documentData.action_items && documentData.action_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentData.action_items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {item.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.deadline}
                        </span>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={() => onSave(documentData)} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Document
        </Button>
      </div>
    </div>
  );
};

export default DocumentPreview;
