import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Clock, CheckCircle, XCircle, Bell, Forward, Timer, TrendingUp, Share } from "lucide-react";
import { useState } from "react";

const AlertsPage = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  
  const alerts = [
    {
      id: 1,
      title: "Critical: Invoice Payment Overdue",
      description: "ABC Infrastructure - Invoice #INV-102 (₹50,000) is 15 days overdue",
      type: "Finance",
      priority: "Critical",
      time: "2 hours ago",
      status: "unread",
      action: "Review Payment",
      timeSaved: "45 min",
      aiInsight: "AI identified potential duplicate payment risk"
    },
    {
      id: 2,
      title: "New Safety Circular Available",
      description: "Monsoon preparedness guidelines for all stations - immediate action required",
      type: "Safety",
      priority: "High",
      time: "4 hours ago",
      status: "unread",
      action: "Review & Distribute",
      timeSaved: "1.2 hrs",
      aiInsight: "Auto-categorized as critical safety update"
    },
    {
      id: 3,
      title: "Maintenance Window Scheduled",
      description: "Aluva Station - Platform 2 maintenance scheduled for March 20th, 2:00 AM",
      type: "Maintenance",
      priority: "Medium",
      time: "6 hours ago",
      status: "read",
      action: "Acknowledge",
      timeSaved: "20 min",
      aiInsight: "Optimal scheduling based on historical data"
    },
    {
      id: 4,
      title: "Document Approval Required",
      description: "Emergency Response Protocol update requires department head approval",
      type: "Approval",
      priority: "High",
      time: "1 day ago",
      status: "read",
      action: "Approve",
      timeSaved: "35 min",
      aiInsight: "Pre-validated compliance requirements"
    },
    {
      id: 5,
      title: "System Backup Completed",
      description: "Weekly document backup completed successfully - 2.8TB archived",
      type: "System",
      priority: "Low",
      time: "2 days ago",
      status: "read",
      action: "View Report",
      timeSaved: "15 min",
      aiInsight: "Auto-verified backup integrity"
    }
  ];

  const priorityColors = {
    Critical: "text-destructive bg-destructive/10",
    High: "text-accent bg-accent/10",
    Medium: "text-primary bg-primary/10",
    Low: "text-muted-foreground bg-muted"
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
                <h1 className="text-xl font-semibold">Alerts & Notifications</h1>
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
                    <h2 className="text-2xl font-bold">Active Alerts</h2>
                    <p className="text-muted-foreground">Stay updated with important notifications and actions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Mark All Read
                    </Button>
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Alert Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">2</p>
                        <p className="text-sm text-muted-foreground">Critical</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">3</p>
                        <p className="text-sm text-muted-foreground">High Priority</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">5</p>
                        <p className="text-sm text-muted-foreground">Pending Action</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Resolved Today</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Timer className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">4.2 hrs</p>
                        <p className="text-sm text-muted-foreground">Time Saved Today</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Alerts List */}
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <Card key={alert.id} className={`p-6 transition-all hover:shadow-md ${alert.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className={`h-2 w-2 rounded-full mt-3 ${alert.status === 'unread' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">{alert.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline"
                                className={priorityColors[alert.priority as keyof typeof priorityColors]}
                              >
                                {alert.priority}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{alert.time}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground">{alert.description}</p>
                          
                          {/* AI Insights & Time Saved */}
                          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">AI Insight:</span>
                              <span className="text-sm text-muted-foreground">{alert.aiInsight}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <Timer className="h-4 w-4 text-success" />
                              <span className="text-sm font-medium text-success">Saved: {alert.timeSaved}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{alert.type}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                {alert.action}
                              </Button>
                              <Dialog open={forwardDialogOpen && selectedAlert?.id === alert.id} onOpenChange={setForwardDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedAlert(alert)}
                                  >
                                    <Forward className="h-4 w-4 mr-1" />
                                    Forward
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Forward Alert</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="recipient">Forward to</Label>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select team member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="operations">Operations Team</SelectItem>
                                          <SelectItem value="maintenance">Maintenance Team</SelectItem>
                                          <SelectItem value="safety">Safety Department</SelectItem>
                                          <SelectItem value="finance">Finance Team</SelectItem>
                                          <SelectItem value="manager">Department Manager</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="message">Additional Message</Label>
                                      <Textarea 
                                        id="message"
                                        placeholder="Add a note for the recipient..."
                                        className="min-h-[80px]"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" onClick={() => setForwardDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={() => {
                                        // Handle forward logic here
                                        setForwardDialogOpen(false);
                                        setSelectedAlert(null);
                                      }}>
                                        <Share className="h-4 w-4 mr-1" />
                                        Forward Alert
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm">
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center">
                  <Button variant="outline">Load More Alerts</Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AlertsPage;