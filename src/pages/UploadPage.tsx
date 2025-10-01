import React, { useState, useRef } from "react";
import { UploadFile, COMMON_DEPARTMENTS, createAlertFromDocument, type UploadFileResponse } from "@/integrations/Core";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { 
  Upload as UploadIcon, 
  FileText, 
  Image, 
  X, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Globe,
  Calendar,
  AlertTriangle,
  Building2,
  Save,
  Bell
} from "lucide-react";

import UploadZone from "../components/upload/UploadZone";
import WebContentExtractor from "../components/WebContentExtractor";

const UploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<UploadFileResponse | null>(null);
  const [showCategorization, setShowCategorization] = useState(false);
  
  // Categorization form state
  const [department, setDepartment] = useState<string>('');
  const [customDepartment, setCustomDepartment] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [alertTitle, setAlertTitle] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList) => {
    const validFiles = Array.from(selectedFiles).filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/') || 
      file.type === 'application/msword' || 
      file.type.includes('document') ||
      file.type.startsWith('text/') ||
      ['txt', 'md', 'csv', 'json', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(
        file.name.split('.').pop()?.toLowerCase() || ''
      )
    );
    
    if (validFiles.length === 0) {
      setError("Please select valid files (PDF, images, Word documents, or text files)");
      return;
    }
    
    setFiles(validFiles);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processDocument = async (file: File) => {
    setProcessing(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(50);
      const result = await UploadFile({ file });
      setProgress(100);
      setExtractedText(result);
      setShowCategorization(true);
    } catch (error) {
      setError(`Error extracting text: ${error.message}`);
      console.error("Text extraction error:", error);
    }
    
    setProcessing(false);
  };

  const handleSaveWithCategorization = async () => {
    if (!extractedText) return;

    const finalDepartment = department === 'custom' ? customDepartment : department;
    
    // Update the extracted text with categorization
    const categorizedDocument: UploadFileResponse = {
      ...extractedText,
      department: finalDepartment || 'General',
      deadline: deadline || undefined,
      urgency: urgency
    };

    // Create alert if urgency is High or Critical
    if (urgency === 'High' || urgency === 'Critical') {
      const alert = createAlertFromDocument(categorizedDocument);
      // Use custom alert title if provided
      if (alertTitle.trim()) {
        alert.title = alertTitle;
      }
      // Store alert in localStorage for now (you can implement proper storage later)
      const existingAlerts = JSON.parse(localStorage.getItem('kmrl-alerts') || '[]');
      localStorage.setItem('kmrl-alerts', JSON.stringify([...existingAlerts, alert]));
    }

    // Store document in localStorage
    const existingDocs = JSON.parse(localStorage.getItem('kmrl-documents') || '[]');
    localStorage.setItem('kmrl-documents', JSON.stringify([...existingDocs, categorizedDocument]));

    // Reset form
    setShowCategorization(false);
    setExtractedText(null);
    setFiles([]);
    setDepartment('');
    setCustomDepartment('');
    setDeadline('');
    setUrgency('Medium');
    setAlertTitle('');

    // Show success message
    let message = 'Document saved successfully!';
    if (urgency === 'High' || urgency === 'Critical') {
      const title = alertTitle || `Action Required: ${extractedText.filename}`;
      message = `Document saved successfully! Alert created: "${title}"`;
    }
    
    // Simple notification (you can replace with a proper toast library later)
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-xs">✓</span>
        </div>
        <span class="font-medium">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 4000);
  };

  const handleCancel = () => {
    setExtractedText(null);
    setFiles([]);
    setProgress(0);
    setError(null);
    setShowCategorization(false);
    setDepartment('');
    setCustomDepartment('');
    setDeadline('');
    setUrgency('Medium');
    setAlertTitle('');
  };

  const handleBack = () => {
    navigate("/documents");
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
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Documents
                </Button>
                <h1 className="text-xl font-semibold">Upload Document</h1>
              </div>
              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Document & Content Processing
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300">
                    Extract text from files (PDF, images, documents) and web content with AI-powered bullet point generation
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="files" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="files" className="flex items-center gap-2">
                      <UploadIcon className="w-4 h-4" />
                      File Upload
                    </TabsTrigger>
                    <TabsTrigger value="web" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Web Content
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="files" className="mt-6">

                {!extractedText ? (
                  <div className="space-y-6">
                    {/* Upload Zone */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UploadIcon className="w-5 h-5" />
                          Select Text Files
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <UploadZone 
                          onFileSelect={handleFileSelect}
                          ref={fileInputRef}
                        />
                      </CardContent>
                    </Card>

                    {/* File List */}
                    {files.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Selected Files ({files.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-6">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-6 h-6 text-green-500" />
                                  <div>
                                    <p className="font-medium text-slate-900 dark:text-white">
                                      {file.name}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {processing ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <span className="ml-3 text-slate-600 dark:text-slate-300">
                                  Extracting text from file...
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                Reading file content
                              </p>
                            </div>
                          ) : (
                            <Button 
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              onClick={() => processDocument(files[0])}
                              disabled={files.length === 0}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Extract Text & Create Bullet Points
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* File Info Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Processed: {extractedText.filename}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">File Type:</span> {extractedText.fileType}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {(extractedText.size / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bullet Points Card */}
                    {extractedText.bulletPoints && extractedText.bulletPoints.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Key Points Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {extractedText.bulletPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-slate-700 dark:text-slate-300">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Full Text Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-slate-600" />
                          Full Extracted Text
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Textarea
                          value={extractedText.text}
                          readOnly
                          className="min-h-[300px] font-mono text-sm"
                          placeholder="Extracted text will appear here..."
                        />
                        <div className="flex justify-end gap-3">
                          <Button variant="outline" onClick={handleCancel}>
                            <X className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                          <Button 
                            onClick={() => navigator.clipboard.writeText(extractedText.bulletPoints?.join('\n• ') || extractedText.text)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            Copy Bullet Points
                          </Button>
                          <Button 
                            onClick={() => navigator.clipboard.writeText(extractedText.text)}
                            variant="outline"
                          >
                            Copy Full Text
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Document Categorization Section */}
                    {showCategorization && (
                      <div className="space-y-6">
                        {/* Visual Separator */}
                        <div className="flex items-center justify-center py-4">
                          <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                          <div className="mx-4 text-slate-500 dark:text-slate-400 text-sm font-medium">
                            NEXT STEP
                          </div>
                          <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                        </div>

                        {/* Section Heading */}
                        <div className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                            📋 Document Categorization
                          </h2>
                          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Help us organize and prioritize this document by adding department information, 
                            urgency level, and deadline details for better tracking and automated alerts.
                          </p>
                        </div>

                        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                              <Building2 className="w-6 h-6 text-blue-600" />
                              Categorize Your Document
                            </CardTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Complete the information below to ensure proper organization and alert management
                            </p>
                          </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Department Selection */}
                          <div className="space-y-2">
                            <Label htmlFor="department" className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              Department
                            </Label>
                            <Select value={department} onValueChange={setDepartment}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {COMMON_DEPARTMENTS.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                                <SelectItem value="custom">Custom Department</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {department === 'custom' && (
                              <Input
                                placeholder="Enter custom department name"
                                value={customDepartment}
                                onChange={(e) => setCustomDepartment(e.target.value)}
                                className="mt-2"
                              />
                            )}
                          </div>

                          {/* Alert Title */}
                          <div className="space-y-2">
                            <Label htmlFor="alertTitle" className="flex items-center gap-2">
                              <Bell className="w-4 h-4" />
                              Alert Title (Optional)
                            </Label>
                            <div className="relative">
                              <Input
                                id="alertTitle"
                                placeholder="e.g., Urgent: Review Monthly Reports"
                                value={alertTitle}
                                onChange={(e) => setAlertTitle(e.target.value)}
                                className="font-medium"
                              />
                              {!alertTitle && extractedText && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                                  onClick={() => setAlertTitle(`Action Required: ${extractedText.filename}`)}
                                >
                                  Auto-generate
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Custom title for the alert. If left empty, a default title will be generated from the document name.
                            </p>
                          </div>

                          {/* Urgency Level */}
                          <div className="space-y-2">
                            <Label htmlFor="urgency" className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Urgency Level
                            </Label>
                            <Select value={urgency} onValueChange={(value: 'Low' | 'Medium' | 'High' | 'Critical') => setUrgency(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Low">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="Medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="High">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    High
                                  </div>
                                </SelectItem>
                                <SelectItem value="Critical">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Critical
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Deadline */}
                          <div className="space-y-2">
                            <Label htmlFor="deadline" className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Deadline (Optional)
                            </Label>
                            <Input
                              type="date"
                              value={deadline}
                              onChange={(e) => setDeadline(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>

                          {/* High/Critical urgency warning */}
                          {(urgency === 'High' || urgency === 'Critical') && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                This document will be added to the alerts system due to its {urgency.toLowerCase()} urgency level.
                                {alertTitle && (
                                  <>
                                    <br />
                                    <span className="font-medium">Alert will be titled:</span> "{alertTitle}"
                                  </>
                                )}
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={() => setShowCategorization(false)}>
                              Skip Categorization
                            </Button>
                            <Button 
                              onClick={handleSaveWithCategorization}
                              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      </div>
                    )}
                  </div>
                )}
                  </TabsContent>

                  <TabsContent value="web" className="mt-6">
                    <WebContentExtractor />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UploadPage;
