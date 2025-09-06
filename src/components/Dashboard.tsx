import { useState } from "react";
import { AlertCircle, FileText, TrendingUp, Calendar, User, Bell, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onNavigateToSearch?: () => void;
}

const Dashboard = ({ onNavigateToSearch }: DashboardProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  const quickStats = [
    { 
      label: "Active Alerts", 
      value: "12", 
      change: "+3 from last week",
      icon: AlertCircle, 
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    { 
      label: "Documents Processed", 
      value: "2,847", 
      change: "+147 today",
      icon: FileText, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      label: "Search Queries", 
      value: "456", 
      change: "+12% this week",
      icon: TrendingUp, 
      color: "text-success",
      bgColor: "bg-success/10"
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      title: "New Safety Circular Available",
      description: "Monsoon preparedness guidelines for all stations",
      type: "Safety",
      priority: "High",
      time: "2 hours ago",
      status: "unread"
    },
    {
      id: 2,
      title: "Invoice Payment Overdue",
      description: "ABC Infrastructure - Invoice #INV-102 (₹50,000)",
      type: "Finance",
      priority: "Critical",
      time: "4 hours ago",
      status: "unread"
    },
    {
      id: 3,
      title: "Maintenance Report Updated",
      description: "Aluva Station - Platform 2 inspection completed",
      type: "Maintenance",
      priority: "Medium",
      time: "6 hours ago",
      status: "read"
    }
  ];

  const recentSearches = [
    "Latest safety circulars for monsoon preparedness",
    "Pending vendor invoices over 30 days", 
    "Maintenance reports for Aluva station",
    "Policy updates from last month",
    "Emergency contact protocols"
  ];

  const upcomingTasks = [
    {
      task: "Review drainage inspection reports",
      deadline: "Today, 5:00 PM",
      status: "pending",
      department: "Safety"
    },
    {
      task: "Approve vendor payment requests",
      deadline: "Tomorrow, 10:00 AM",
      status: "in-progress",
      department: "Finance"
    },
    {
      task: "Submit monthly safety report",
      deadline: "March 15, 2024",
      status: "pending",
      department: "Operations"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Anil</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your documents and alerts today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                <div className={`h-2 w-2 rounded-full mt-2 ${alert.status === 'unread' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{alert.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={alert.priority === 'Critical' ? 'destructive' : alert.priority === 'High' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{alert.time}</span>
                    <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Search */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Quick Search</h3>
            <Button variant="outline" size="sm" onClick={onNavigateToSearch}>
              Advanced Search
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-3 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    onNavigateToSearch?.();
                  }
                }}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Searches</p>
              {recentSearches.slice(0, 3).map((search, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                  onClick={onNavigateToSearch}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
          <Button variant="outline" size="sm">View All Tasks</Button>
        </div>
        
        <div className="space-y-4">
          {upcomingTasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-3 w-3 rounded-full ${
                  task.status === 'completed' ? 'bg-success' : 
                  task.status === 'in-progress' ? 'bg-accent' : 'bg-muted-foreground/30'
                }`} />
                <div>
                  <p className="font-medium text-sm">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{task.deadline}</p>
                <Badge 
                  variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;