import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, Bell, FileText, Building2, Download, CalendarDays, Activity, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const AlertsPage = () => {
  const [activeTab, setActiveTab] = useState("alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [criticalOnly, setCriticalOnly] = useState(false);

  // Sample alerts data
  const alerts = [
    {
      id: "SA",
      title: "Safety Bulletin Deadline - March 12, 2025",
      description: "Critical safety documentation review required before implementation of new track safety protocols.",
      department: "Safety",
      timeAgo: "2 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Safety Protocol Rev 2.1",
      action: "Resolve"
    },
    {
      id: "LE",
      title: "Environmental Permit Renewal Due",
      description: "Environmental clearance documentation needs renewal before April 15, 2025.",
      department: "Legal",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Environmental Clearance",
      action: "Resolve"
    },
    {
      id: "HR",
      title: "Staff Training Certification Expiring",
      description: "Technical staff certifications expire in 30 days. Renewal process must begin immediately.",
      department: "HR",
      timeAgo: "5 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Training Records 2024",
      action: "Resolve"
    }
  ];

  // Sample compliance timeline data
  const complianceTimeline = [
    {
      id: 1,
      title: "Track Maintenance Inspection",
      description: "Quarterly track maintenance inspection required",
      department: "Safety",
      daysLeft: 9,
      deadline: "September 15, 2025"
    },
    {
      id: 2,
      title: "Q3 Financial Report",
      description: "Complete third quarter financial review and compliance check",
      department: "Finance",
      daysLeft: 24,
      deadline: "September 30, 2025"
    },
    {
      id: 3,
      title: "Environmental Monitoring Report",
      description: "Submit quarterly environmental monitoring documentation",
      department: "Legal",
      daysLeft: 39,
      deadline: "October 15, 2025"
    }
  ];

  // Generate calendar data for next 30 days
  const generateCalendarData = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 17; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const isToday = i === 0;
      const isHighlighted = i === 5 || i === 12; // Sample highlighted dates
      
      days.push({
        date,
        dayName,
        dayNumber,
        isToday,
        isHighlighted,
        events: i === 5 ? 2 : i === 12 ? 1 : 0
      });
    }
    
    return days;
  };

  const calendarData = generateCalendarData();

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === '' || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
      alert.department.toLowerCase() === selectedDepartment.toLowerCase();
    
    const matchesCritical = !criticalOnly || alert.priority === 'HIGH';
    
    return matchesSearch && matchesDepartment && matchesCritical;
  });

  // Export CSV function
  const exportCSV = () => {
    const csvData = filteredAlerts.map(alert => ({
      ID: alert.id,
      Title: alert.title,
      Priority: alert.priority,
      Department: alert.department,
      Status: alert.status,
      TimeAgo: alert.timeAgo
    }));
    
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kmrl-alerts.csv';
    a.click();
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
                <h1 className="text-xl font-semibold">Alerts & Compliance</h1>
              </div>
              <Header />
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Alerts & Compliance Dashboard</h1>
                <p className="text-gray-600 mt-2">Monitor critical alerts, compliance deadlines, and document-driven risks</p>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-auto grid-cols-3 mb-8">
                  <TabsTrigger value="alerts" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Alerts & Notifications
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Compliance Calendar
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Timeline View
                  </TabsTrigger>
                </TabsList>

                {/* Alerts & Notifications Tab */}
                <TabsContent value="alerts" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content - Left Side (3/4) */}
                    <div className="lg:col-span-3 space-y-6">
                      {/* Timeline Navigation */}
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Next 30 Days Timeline</h3>
                          <Button variant="outline" size="sm" onClick={exportCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <div className="flex space-x-1 overflow-x-auto flex-1">
                            {calendarData.map((day, index) => (
                              <div key={index} className={`flex flex-col items-center p-3 rounded-lg min-w-[60px] text-center ${
                                day.isToday ? 'bg-blue-100 border-2 border-blue-300' : 
                                day.isHighlighted ? 'bg-red-100 border-2 border-red-300' : 
                                'bg-gray-50 hover:bg-gray-100'
                              }`}>
                                <span className="text-xs text-gray-600 mb-1">{day.dayName}</span>
                                <span className={`font-bold ${day.isToday ? 'text-blue-700' : day.isHighlighted ? 'text-red-700' : 'text-gray-800'}`}>
                                  {day.dayNumber}
                                </span>
                                {day.events > 0 && (
                                  <div className="flex space-x-1 mt-1">
                                    {Array.from({length: day.events}).map((_, i) => (
                                      <div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>

                      {/* Filters */}
                      <Card className="p-4">
                        <div className="flex items-center gap-4">
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Departments</SelectItem>
                              <SelectItem value="safety">Safety</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="legal">Legal</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search alerts..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="critical-only"
                              checked={criticalOnly}
                              onCheckedChange={(checked) => setCriticalOnly(checked === true)}
                            />
                            <label htmlFor="critical-only" className="text-sm font-medium">
                              Critical Only
                            </label>
                          </div>
                        </div>
                      </Card>

                      {/* Alert Cards */}
                      <div className="space-y-4">
                        {filteredAlerts.map((alert) => (
                          <Card key={alert.id} className={`p-6 border-l-4 ${
                            alert.priority === 'HIGH' ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
                          }`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                    {alert.id}
                                  </span>
                                  <h3 className="font-semibold text-lg text-gray-900">{alert.title}</h3>
                                  <Badge 
                                    variant={alert.priority === 'HIGH' ? 'destructive' : 'secondary'}
                                    className={alert.priority === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-blue-100 text-blue-800 border-blue-200'}
                                  >
                                    {alert.priority}
                                  </Badge>
                                </div>
                                <p className="text-gray-700 mb-4 leading-relaxed">{alert.description}</p>
                                <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                                  <span className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    {alert.department}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {alert.timeAgo}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{alert.documentTitle}</span>
                                </div>
                              </div>
                              <div className="ml-6">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Compliance Timeline - Right Side (1/4) */}
                    <div className="space-y-6">
                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold">Compliance Timeline</h3>
                        </div>
                        <div className="space-y-4">
                          {complianceTimeline.map((item) => (
                            <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex items-start gap-3 mb-2">
                                <Clock className="h-4 w-4 text-blue-500 mt-1" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-3">
                                <span className="text-gray-500">{item.department}</span>
                                <span className="font-semibold text-blue-600">{item.daysLeft}d left</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{item.deadline}</div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Compliance Calendar Tab */}
                <TabsContent value="calendar" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Compliance Calendar</h3>
                    <p className="text-gray-600">Calendar view coming soon...</p>
                  </Card>
                </TabsContent>

                {/* Timeline View Tab */}
                <TabsContent value="timeline" className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Timeline View</h3>
                    <p className="text-gray-600">Timeline view coming soon...</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AlertsPage;