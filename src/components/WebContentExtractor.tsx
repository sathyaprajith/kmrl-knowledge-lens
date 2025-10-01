import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Download, 
  Copy, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";

interface WebContent {
  title: string;
  content: string;
  url: string;
  bulletPoints: string[];
  extractedAt: string;
}

const WebContentExtractor = () => {
  const [url, setUrl] = useState("");
  const [extractedContent, setExtractedContent] = useState<WebContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to convert text to bullet points
  const formatAsBulletPoints = (text: string): string[] => {
    if (!text) return [];
    
    // Split by sentences and paragraphs
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 15) // Filter out very short fragments
      .slice(0, 10); // Limit to 10 bullet points
    
    return sentences.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1));
  };

  const extractWebContent = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Since we can't directly scrape websites from the client due to CORS,
      // we'll simulate the process or use a proxy service
      // In a real implementation, this would go through your backend
      
      // For demonstration, let's simulate content extraction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      
      const simulatedContent = `
This is extracted content from the website: ${url}

Key Information:
- Website content has been successfully extracted
- The content includes main text, headings, and structured information
- Text has been processed and formatted for easy reading
- Multiple sections and paragraphs have been identified
- Important points have been highlighted for quick review
- Links and navigation elements have been filtered out
- Only meaningful content has been retained for analysis

Additional Details:
- Content extraction completed successfully
- Text formatting has been preserved where possible
- Special characters and encoding have been handled appropriately
- The extracted content is ready for further processing or analysis
      `.trim();

      const content: WebContent = {
        title: `Content from ${new URL(url).hostname}`,
        content: simulatedContent,
        url: url,
        bulletPoints: formatAsBulletPoints(simulatedContent),
        extractedAt: new Date().toLocaleString()
      };

      setExtractedContent(content);
    } catch (error) {
      console.error('Web extraction error:', error);
      setError(`Failed to extract content from URL: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyBulletPoints = () => {
    if (extractedContent?.bulletPoints) {
      const bulletText = extractedContent.bulletPoints.map(point => `• ${point}`).join('\n');
      navigator.clipboard.writeText(bulletText);
    }
  };

  const copyFullContent = () => {
    if (extractedContent?.content) {
      navigator.clipboard.writeText(extractedContent.content);
    }
  };

  const clearContent = () => {
    setExtractedContent(null);
    setUrl("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Web Content Extractor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={extractWebContent}
              disabled={loading || !url.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Extract Content
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p>Enter a website URL to extract and format its content into bullet points.</p>
            <p className="mt-1">
              <strong>Note:</strong> Due to browser security restrictions, this is a demonstration. 
              In production, content extraction would be handled by the backend server.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Content Display */}
      {extractedContent && (
        <div className="space-y-6">
          {/* Content Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Extracted from: {extractedContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Source:</span>
                  <a 
                    href={extractedContent.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 truncate"
                  >
                    {extractedContent.url}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Extracted:</span>
                  <span>{extractedContent.extractedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bullet Points Card */}
          {extractedContent.bulletPoints && extractedContent.bulletPoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600" />
                  Key Points Summary
                  <Badge variant="secondary" className="ml-auto">
                    {extractedContent.bulletPoints.length} points
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {extractedContent.bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Full Content Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-600" />
                Full Extracted Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={extractedContent.content}
                readOnly
                className="min-h-[300px] font-mono text-sm"
                placeholder="Extracted content will appear here..."
              />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={clearContent}>
                  Clear
                </Button>
                <Button 
                  onClick={copyBulletPoints}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Bullet Points
                </Button>
                <Button 
                  onClick={copyFullContent}
                  variant="outline"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Full Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebContentExtractor;
