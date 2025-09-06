import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, FileText, Clock, Download } from "lucide-react";

const AnalyticsPage = () => {
  const stats = [
    {
      title: "Total Searches",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: BarChart3
    },
    {
      title: "Documents Accessed",
      value: "3,456",
      change: "+8%",
      trend: "up",
      icon: FileText
    },
    {
      title: "Active Users",
      value: "89",
      change: "+15%",
      trend: "up",
      icon: Users
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: "-5%",
      trend: "down",
      icon: Clock
    }
  ];

  const topSearches = [
    { query: "Safety circulars monsoon", count: 156, category: "Safety" },
    { query: "Vendor invoices pending", count: 134, category: "Finance" },
    { query: "Maintenance reports Aluva", count: 98, category: "Maintenance" },
    { query: "Emergency protocols", count: 87, category: "Safety" },
    { query: "Policy updates 2024", count: 76, category: "HR" }
  ];

  const recentActivity = [
    {
      action: "Document Uploaded",
      description: "Safety Circular SC-2024-15 uploaded by Safety Dept",
      time: "2 hours ago",
      user: "safety@kmrl.co.in"
    },
    {
      action: "Search Performed",
      description: "Query: 'monsoon preparedness guidelines'",
      time: "3 hours ago", 
      user: "anil.kumar@kmrl.co.in"
    },
    {
      action: "Document Downloaded",
      description: "Emergency Response Protocol downloaded",
      time: "4 hours ago",
      user: "ops.manager@kmrl.co.in"
    },
    {
      action: "Alert Generated",
      description: "Critical invoice payment overdue alert",
      time: "5 hours ago",
      user: "System"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <h1 className="text-xl font-semibold">Analytics & Insights</h1>
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
                    <h2 className="text-2xl font-bold">Platform Analytics</h2>
                    <p className="text-muted-foreground">Monitor usage patterns and system performance</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" size="sm">Last 30 Days</Button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`h-3 w-3 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'} ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                            <span className={`text-xs ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                              {stat.change} vs last month
                            </span>
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Searches */}
                  <Card className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Top Search Queries</h3>
                      <div className="space-y-3">
                        {topSearches.map((search, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="space-y-1">
                              <p className="font-medium text-sm">{search.query}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">{search.category}</Badge>
                                <span className="text-xs text-muted-foreground">{search.count} searches</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">#{index + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Recent Activity */}
                  <Card className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Recent Activity</h3>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                            <div className="flex-1 space-y-1">
                              <p className="font-medium text-sm">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>{activity.time}</span>
                                <span>•</span>
                                <span>{activity.user}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Chart Placeholder */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Usage Trends</h3>
                    <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-lg font-medium">Interactive Charts Coming Soon</p>
                        <p className="text-sm">Document search and usage analytics visualization</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AnalyticsPage;