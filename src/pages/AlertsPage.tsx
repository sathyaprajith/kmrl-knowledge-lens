import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle, XCircle, Bell } from "lucide-react";

const AlertsPage = () => {
  const alerts = [
    {
      id: 1,
      title: "Critical: Invoice Payment Overdue",
      description: "ABC Infrastructure - Invoice #INV-102 (₹50,000) is 15 days overdue",
      type: "Finance",
      priority: "Critical",
      time: "2 hours ago",
      status: "unread",
      action: "Review Payment"
    },
    {
      id: 2,
      title: "New Safety Circular Available",
      description: "Monsoon preparedness guidelines for all stations - immediate action required",
      type: "Safety",
      priority: "High",
      time: "4 hours ago",
      status: "unread",
      action: "Review & Distribute"
    },
    {
      id: 3,
      title: "Maintenance Window Scheduled",
      description: "Aluva Station - Platform 2 maintenance scheduled for March 20th, 2:00 AM",
      type: "Maintenance",
      priority: "Medium",
      time: "6 hours ago",
      status: "read",
      action: "Acknowledge"
    },
    {
      id: 4,
      title: "Document Approval Required",
      description: "Emergency Response Protocol update requires department head approval",
      type: "Approval",
      priority: "High",
      time: "1 day ago",
      status: "read",
      action: "Approve"
    },
    {
      id: 5,
      title: "System Backup Completed",
      description: "Weekly document backup completed successfully - 2.8TB archived",
      type: "System",
      priority: "Low",
      time: "2 days ago",
      status: "read",
      action: "View Report"
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{alert.type}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                {alert.action}
                              </Button>
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