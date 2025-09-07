import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail,
  FileText,
  Users,
  Lightbulb,
  Download
} from "lucide-react";
import { useState } from "react";

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      id: "login",
      question: "How do I log into K-Lens?",
      answer: "Use your KMRL email address and password. For demo access, use admin@kmrl.co.in with password 'admin123' for admin access, or finance@kmrl.co.in with 'user123' for regular user access."
    },
    {
      id: "search",
      question: "How do I search for documents?",
      answer: "Use the search bar on the dashboard. You can ask questions in natural language like 'Show me safety reports from last month' or search for specific document types, authors, or dates."
    },
    {
      id: "ai-insights",
      question: "What are AI insights and how do they work?",
      answer: "AI insights analyze your documents to provide summaries, extract key information, and identify patterns. They help you quickly understand document content without reading everything manually."
    },
    {
      id: "permissions",
      question: "Why can't I access certain documents?",
      answer: "Document access is controlled by your role and department. Contact your administrator if you need access to specific documents or if you believe you should have access."
    },
    {
      id: "alerts",
      question: "How do I manage alerts and notifications?",
      answer: "Visit the Alerts page to view, manage, and forward notifications. You can also configure notification preferences in Settings > Notifications."
    },
    {
      id: "upload",
      question: "Can I upload my own documents?",
      answer: "Yes, you can upload documents through the Documents page. Supported formats include PDF, Word, Excel, PowerPoint, and images. Documents are automatically processed for search."
    },
    {
      id: "offline",
      question: "Can I access K-Lens offline?",
      answer: "K-Lens requires an internet connection for most features. However, recently viewed documents may be cached for limited offline access."
    },
    {
      id: "mobile",
      question: "Is K-Lens available on mobile devices?",
      answer: "Yes, K-Lens is fully responsive and works on mobile devices and tablets through your web browser. A dedicated mobile app is planned for future release."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with K-Lens",
      description: "A comprehensive introduction to K-Lens features and navigation",
      duration: "5 min read",
      type: "Guide"
    },
    {
      title: "Advanced Search Techniques",
      description: "Learn how to use AI-powered search effectively",
      duration: "3 min read",
      type: "Tutorial"
    },
    {
      title: "Managing User Permissions",
      description: "For administrators: how to set up and manage user access",
      duration: "7 min read",
      type: "Admin Guide"
    },
    {
      title: "Document Upload Best Practices",
      description: "Tips for organizing and uploading documents effectively",
      duration: "4 min read",
      type: "Best Practice"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <h1 className="text-xl font-semibold">Help & Support</h1>
              </div>
              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold">How can we help you?</h2>
                  <p className="text-muted-foreground">Find answers, tutorials, and get support for K-Lens</p>
                </div>

                {/* Search */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search for help articles, FAQs, or tutorials..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Step-by-step video guides for common tasks
                    </p>
                    <Button variant="outline" size="sm">
                      Watch Now
                    </Button>
                  </Card>

                  <Card className="p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get instant help from our support team
                    </p>
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </Card>

                  <Card className="p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <Book className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="font-semibold mb-2">Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete documentation and API reference
                    </p>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="faq" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="faq" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                    </div>
                    
                    <Accordion type="single" collapsible className="space-y-2">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {filteredFaqs.length === 0 && searchQuery && (
                      <Card className="p-8 text-center">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search terms or browse our tutorials
                        </p>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="tutorials" className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Book className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Tutorials & Guides</h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {tutorials.map((tutorial, index) => (
                        <Card key={index} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{tutorial.title}</h4>
                                <Badge variant="outline">{tutorial.type}</Badge>
                              </div>
                              <p className="text-muted-foreground">{tutorial.description}</p>
                              <p className="text-sm text-muted-foreground">{tutorial.duration}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Read Guide
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Contact Support</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Phone Support</h4>
                            <p className="text-sm text-muted-foreground">24/7 emergency support</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-mono text-lg">+91-484-123-4567</p>
                          <p className="text-sm text-muted-foreground">
                            Available 24/7 for critical issues
                          </p>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Email Support</h4>
                            <p className="text-sm text-muted-foreground">Get detailed help via email</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-mono">support@k-lens.kmrl.co.in</p>
                          <p className="text-sm text-muted-foreground">
                            Response within 4 hours during business hours
                          </p>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <h4 className="font-semibold">IT Department</h4>
                            <p className="text-sm text-muted-foreground">Internal KMRL IT support</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-mono">ext. 2500</p>
                          <p className="text-sm text-muted-foreground">
                            Internal extension for KMRL employees
                          </p>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-muted/10 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Live Chat</h4>
                            <p className="text-sm text-muted-foreground">Instant messaging support</p>
                          </div>
                        </div>
                        <Button className="w-full">
                          Start Chat Session
                        </Button>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Resources & Downloads</h3>
                    </div>

                    <div className="grid gap-4">
                      <Card className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Book className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">User Manual</h4>
                              <p className="text-sm text-muted-foreground">Complete K-Lens user guide (PDF)</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Lightbulb className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Quick Reference Guide</h4>
                              <p className="text-sm text-muted-foreground">Essential tips and shortcuts</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-success" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Admin Training Material</h4>
                              <p className="text-sm text-muted-foreground">For system administrators</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted/10 flex items-center justify-center">
                              <Video className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Video Tutorial Series</h4>
                              <p className="text-sm text-muted-foreground">Comprehensive video training</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Watch Online
                          </Button>
                        </div>
                      </Card>
                    </div>
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

export default HelpPage;