import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Calendar, 
  User, 
  Bell, 
  Search, 
  Clock, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown,
  Eye,
  Sparkles,
  Target,
  Heart,
  Smile,
  Zap,
  Coffee,
  Brain,
  TrendingDown,
  Award,
  Shield,
  Building2,
  AlertTriangle,
  Users,
  Settings,
  Scale
} from "lucide-react";
import type { AlertItem } from "@/integrations/Core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';

interface DashboardProps {
  onNavigateToSearch?: () => void;
}

const Dashboard = ({ onNavigateToSearch }: DashboardProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const { user } = useAuth();
  const [documentAlerts, setDocumentAlerts] = useState<AlertItem[]>([]);

  // Load document alerts from localStorage
  useEffect(() => {
    const storedAlerts = localStorage.getItem('kmrl-alerts');
    if (storedAlerts) {
      setDocumentAlerts(JSON.parse(storedAlerts));
    }
  }, []);

  // Role-specific quick stats
  const getQuickStats = () => {
    switch (user?.role) {
      case 'HR':
        return [
          { 
            label: "Pending Requests", 
            value: "8", 
            change: "+2 from yesterday",
            icon: User, 
            color: "text-purple-600",
            bgColor: "bg-purple-50"
          },
          { 
            label: "New Applications", 
            value: "24", 
            change: "+6 this week",
            icon: FileText, 
            color: "text-blue-600",
            bgColor: "bg-blue-50"
          },
          { 
            label: "Interviews Scheduled", 
            value: "12", 
            change: "Next 7 days",
            icon: Calendar, 
            color: "text-green-600",
            bgColor: "bg-green-50"
          },
        ];
      case 'IT':
        return [
          { 
            label: "Open Tickets", 
            value: "15", 
            change: "-3 from yesterday",
            icon: AlertCircle, 
            color: "text-red-600",
            bgColor: "bg-red-50"
          },
          { 
            label: "System Updates", 
            value: "4", 
            change: "Pending deployment",
            icon: TrendingUp, 
            color: "text-blue-600",
            bgColor: "bg-blue-50"
          },
          { 
            label: "Security Alerts", 
            value: "2", 
            change: "Requires attention",
            icon: Bell, 
            color: "text-orange-600",
            bgColor: "bg-orange-50"
          },
        ];
      case 'Finance':
        return [
          { 
            label: "Pending Invoices", 
            value: "23", 
            change: "₹1.2M total value",
            icon: FileText, 
            color: "text-green-600",
            bgColor: "bg-green-50"
          },
          { 
            label: "Overdue Payments", 
            value: "7", 
            change: "Urgent attention",
            icon: AlertCircle, 
            color: "text-red-600",
            bgColor: "bg-red-50"
          },
          { 
            label: "Budget Reviews", 
            value: "3", 
            change: "Due this week",
            icon: TrendingUp, 
            color: "text-blue-600",
            bgColor: "bg-blue-50"
          },
        ];
      default: // Administrator
        return [
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
    }
  };

  // Role-specific alerts including document alerts
  const getRecentAlerts = () => {
    // Convert document alerts to the expected format, filter by department
    const documentAlertsFormatted = documentAlerts
      .filter(alert => alert.status !== 'Resolved')
      .filter(alert => user?.role === 'Administrator' || alert.department === user?.role)
      .slice(0, 3)
      .map(alert => ({
        id: alert.id,
        title: alert.title,
        description: alert.description,
        type: `Document - ${alert.department}`,
        priority: alert.urgency,
        time: new Date(alert.createdAt).toLocaleString(),
        status: "unread",
        isDocumentAlert: true
      }));

    let roleAlerts = [];
    switch (user?.role) {
      case 'HR':
        return [
          ...documentAlertsFormatted,
          {
            id: 1,
            title: "Leave Request Pending",
            description: "John Doe - Medical Leave (5 days) - Requires approval",
            type: "Leave Management",
            priority: "Medium",
            time: "1 hour ago",
            status: "unread"
          },
          {
            id: 2,
            title: "Interview Scheduled",
            description: "Software Engineer position - Tomorrow 2:00 PM",
            type: "Recruitment",
            priority: "High",
            time: "3 hours ago",
            status: "unread"
          },
          {
            id: 3,
            title: "Payroll Processing",
            description: "Monthly payroll for March - Due in 2 days",
            type: "Payroll",
            priority: "Critical",
            time: "6 hours ago",
            status: "read"
          }
        ];
      case 'IT':
        return [
          ...documentAlertsFormatted,
          {
            id: 1,
            title: "Server Maintenance Alert",
            description: "Database server CPU usage at 85% - Requires attention",
            type: "Infrastructure",
            priority: "High",
            time: "30 minutes ago",
            status: "unread"
          },
          {
            id: 2,
            title: "Security Patch Available",
            description: "Windows Server updates - Schedule deployment",
            type: "Security",
            priority: "Medium",
            time: "2 hours ago",
            status: "unread"
          },
          {
            id: 3,
            title: "User Access Request",
            description: "New employee needs VPN access - Finance dept",
            type: "Access Management",
            priority: "Low",
            time: "4 hours ago",
            status: "read"
          }
        ];
      case 'Finance':
        return [
          ...documentAlertsFormatted,
          {
            id: 1,
            title: "Invoice Payment Overdue",
            description: "ABC Infrastructure - Invoice #INV-102 (₹50,000)",
            type: "Accounts Payable",
            priority: "Critical",
            time: "2 hours ago",
            status: "unread"
          },
          {
            id: 2,
            title: "Budget Variance Alert",
            description: "IT Department exceeded monthly budget by 15%",
            type: "Budget Control",
            priority: "High",
            time: "5 hours ago",
            status: "unread"
          },
          {
            id: 3,
            title: "Expense Report Submitted",
            description: "Travel expenses by Regional Manager - ₹12,000",
            type: "Expense Management",
            priority: "Medium",
            time: "1 day ago",
            status: "read"
          }
        ];
      default: // Administrator
        return [
          ...documentAlertsFormatted,
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
            title: "System Performance Alert",
            description: "Multiple departments reporting slow response times",
            type: "Operations",
            priority: "Critical",
            time: "4 hours ago",
            status: "unread"
          },
          {
            id: 3,
            title: "Quarterly Review Due",
            description: "Q1 performance reports compilation deadline approaching",
            type: "Management",
            priority: "Medium",
            time: "6 hours ago",
            status: "read"
          }
        ];
    }
  };

  // Role-specific recent searches
  const getRecentSearches = () => {
    switch (user?.role) {
      case 'HR':
        return [
          "Employee leave policies and procedures",
          "Salary structure and benefits documentation", 
          "Performance review templates",
          "Recruitment guidelines and forms",
          "Training and development programs"
        ];
      case 'IT':
        return [
          "Network security protocols and procedures",
          "System maintenance schedules", 
          "Software licensing agreements",
          "Hardware inventory reports",
          "Incident response procedures"
        ];
      case 'Finance':
        return [
          "Invoice processing procedures",
          "Budget allocation reports", 
          "Vendor payment terms and conditions",
          "Financial audit documents",
          "Expense reimbursement policies"
        ];
      default: // Administrator
        return [
          "Latest safety circulars for monsoon preparedness",
          "Pending vendor invoices over 30 days", 
          "Maintenance reports for Aluva station",
          "Policy updates from last month",
          "Emergency contact protocols"
        ];
    }
  };

  // Role-specific upcoming tasks
  const getUpcomingTasks = () => {
    switch (user?.role) {
      case 'HR':
        return [
          {
            task: "Review leave applications for April",
            deadline: "Today, 4:00 PM",
            status: "pending",
            department: "HR"
          },
          {
            task: "Conduct interview for Marketing Manager",
            deadline: "Tomorrow, 2:00 PM",
            status: "pending",
            department: "HR"
          },
          {
            task: "Submit monthly recruitment report",
            deadline: "March 20, 2024",
            status: "in-progress",
            department: "HR"
          }
        ];
      case 'IT':
        return [
          {
            task: "Deploy security patches to production servers",
            deadline: "Tonight, 11:00 PM",
            status: "pending",
            department: "IT"
          },
          {
            task: "Setup VPN access for new employees",
            deadline: "Tomorrow, 9:00 AM",
            status: "in-progress",
            department: "IT"
          },
          {
            task: "Complete quarterly backup verification",
            deadline: "March 25, 2024",
            status: "pending",
            department: "IT"
          }
        ];
      case 'Finance':
        return [
          {
            task: "Process vendor payment approvals",
            deadline: "Today, 5:00 PM",
            status: "pending",
            department: "Finance"
          },
          {
            task: "Review monthly budget variances",
            deadline: "Tomorrow, 10:00 AM",
            status: "in-progress",
            department: "Finance"
          },
          {
            task: "Prepare quarterly financial report",
            deadline: "March 30, 2024",
            status: "pending",
            department: "Finance"
          }
        ];
      default: // Administrator
        return [
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
    }
  };

  // Role-specific welcome message
  const getWelcomeMessage = () => {
    const firstName = user?.email?.split('@')[0]?.split('.')[0] || 'User';
    const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    
    switch (user?.role) {
      case 'HR':
        return {
          title: `Welcome back, ${capitalizedName}`,
          subtitle: "Manage employee requests, recruitment, and HR operations efficiently."
        };
      case 'IT':
        return {
          title: `Welcome back, ${capitalizedName}`,
          subtitle: "Monitor system health, security alerts, and support tickets."
        };
      case 'Finance':
        return {
          title: `Welcome back, ${capitalizedName}`,
          subtitle: "Track invoices, budget control, and financial operations."
        };
      default: // Administrator
        return {
          title: `Welcome back, ${capitalizedName}`,
          subtitle: "Here's what's happening with your documents and alerts today."
        };
    }
  };

  const welcomeMessage = getWelcomeMessage();
  const quickStats = getQuickStats();
  const recentAlerts = getRecentAlerts();
  const recentSearches = getRecentSearches();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced Welcome Section with Glass Effect and Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated Fluid Background */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(45deg, rgba(14, 165, 233, 0.08), rgba(6, 182, 212, 0.12), rgba(8, 145, 178, 0.08), rgba(14, 165, 233, 0.06))',
            backgroundSize: '400% 400%',
            animation: 'fluidGradient 12s ease infinite'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 rounded-3xl"></div>
        <Card className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-3xl p-8">
          <style>{`
            @keyframes fluidGradient {
              0% { 
                background-position: 0% 50%; 
                transform: scale(1);
              }
              25% { 
                background-position: 100% 50%; 
                transform: scale(1.01);
              }
              50% { 
                background-position: 100% 100%; 
                transform: scale(1);
              }
              75% { 
                background-position: 0% 100%; 
                transform: scale(1.01);
              }
              100% { 
                background-position: 0% 50%; 
                transform: scale(1);
              }
            }
          `}</style>
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              {/* KMRL Branding Section */}
              <div className="flex items-center gap-4 mb-2">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-white font-bold text-xl tracking-wider">KMRL</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Kochi Metro Rail Limited
                    </h2>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">K-Lens AI</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    🚇 <span className="italic">"Connecting Lives, Digitizing Intelligence"</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    {welcomeMessage.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    {welcomeMessage.subtitle}
                  </p>
                </div>
              </div>

              {/* Enhanced Tagline */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <p className="text-sm font-semibold text-center bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                  ✨ Transforming Document Intelligence • Empowering Metro Operations • Enhancing Employee Wellness ✨
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>Real-time data</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium">System Healthy</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                {/* KMRL Metro Train Illustration */}
                <div className="relative h-48 w-64 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-4 shadow-2xl border border-slate-200/50 dark:border-slate-600/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse"></div>
                  <div className="relative h-full w-full flex items-center justify-center">
                    <img 
                      src="/kmrl-metro-train.svg" 
                      alt="KMRL Metro Train" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-lg p-2 shadow-lg">
                      <div className="text-sm font-bold text-slate-800 dark:text-white">K-Lens AI</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">Smart Metro Operations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Quick Stats with Gradient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider truncate">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {stat.change.includes('+') ? (
                        <ArrowUp className="h-3 w-3 text-green-500" />
                      ) : stat.change.includes('-') ? (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      ) : (
                        <Target className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{stat.change}</p>
                </div>
                <div className="relative ml-2 sm:ml-4">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${stat.color}`} />
                  </div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-20"></div>
            </Card>
          </div>
        ))}
      </div>

      {/* Charts: role-specific views */}
      {user?.role === 'Administrator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Documents Processed</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={[
                    { week: 'W1', docs: 180 },{ week: 'W2', docs: 200 },{ week: 'W3', docs: 240 },{ week: 'W4', docs: 220 },
                    { week: 'W5', docs: 260 },{ week: 'W6', docs: 300 },{ week: 'W7', docs: 280 },{ week: 'W8', docs: 320 },
                    { week: 'W9', docs: 340 },{ week: 'W10', docs: 360 },{ week: 'W11', docs: 390 },{ week: 'W12', docs: 420 },
                  ]}>
                    <defs>
                      <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5a4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5a4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' 
                      }} 
                    />
                    <Area type="monotone" dataKey="docs" stroke="#0ea5a4" strokeWidth={2} fill="url(#colorDocs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Department Activity</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ dept: 'Safety', value: 820 }, { dept: 'Operations', value: 540 }, { dept: 'Finance', value: 430 }, { dept: 'Maintenance', value: 310 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="dept" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' 
                      }} 
                    />
                    <Bar dataKey="value" fill="url(#gradientBar)" radius={[8,8,0,0]} />
                    <defs>
                      <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6"/>
                        <stop offset="100%" stopColor="#ec4899"/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">File Types</h4>
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie 
                      dataKey="value" 
                      data={[
                        { name: 'PDF', value: 45, color: '#10b981' }, 
                        { name: 'DOCX', value: 25, color: '#3b82f6' }, 
                        { name: 'XLSX', value: 15, color: '#8b5cf6' }, 
                        { name: 'Images', value: 15, color: '#f59e0b' }
                      ]} 
                      outerRadius={80} 
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {[
                        { name: 'PDF', value: 45, color: '#10b981' }, 
                        { name: 'DOCX', value: 25, color: '#3b82f6' }, 
                        { name: 'XLSX', value: 15, color: '#8b5cf6' }, 
                        { name: 'Images', value: 15, color: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : user?.role === 'Finance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Invoices Over Time</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={[{ m: 'Jan', amt: 120 }, { m: 'Feb', amt: 200 }, { m: 'Mar', amt: 150 }, { m: 'Apr', amt: 240 }]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="m" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="amt" stroke="#fb7185" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Pending Payments by Vendor</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={[{ vendor: 'ABC', val: 45 }, { vendor: 'XYZ', val: 30 }, { vendor: 'LMN', val: 20 }]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendor" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="val" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : user?.role === 'IT' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">System Incidents (last 30 days)</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={[{ d: '01', incidents: 5 }, { d: '08', incidents: 2 }, { d: '15', incidents: 4 }, { d: '22', incidents: 1 }]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="d" />
                  <YAxis />
                  <Tooltip />
                  <Line dataKey="incidents" stroke="#06b6d4" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Open Support Tickets by Team</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={[{ team: 'Infra', val: 12 }, { team: 'Apps', val: 8 }, { team: 'Security', val: 3 }]}> 
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="team" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="val" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : user?.role === 'HR' || user?.role === 'Human Resources' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Open HR Requests</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie dataKey="value" data={[{ name: 'Leaves', value: 35 }, { name: 'Onboarding', value: 15 }, { name: 'Payroll', value: 10 }, { name: 'Performance', value: 8 }]} outerRadius={70} fill="#8b5cf6" label />
                    {[{ name: 'Leaves', value: 35, color: '#8b5cf6' }, { name: 'Onboarding', value: 15, color: '#ec4899' }, { name: 'Payroll', value: 10, color: '#06b6d4' }, { name: 'Performance', value: 8, color: '#10b981' }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Hiring Pipeline</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ stage: 'Applied', val: 120 }, { stage: 'Interview', val: 40 }, { stage: 'Offer', val: 12 }, { stage: 'Hired', val: 8 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="stage" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Bar dataKey="val" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : user?.role === 'Safety' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Safety Incidents Trend</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <LineChart data={[{ month: 'Jan', incidents: 2 }, { month: 'Feb', incidents: 1 }, { month: 'Mar', incidents: 3 }, { month: 'Apr', incidents: 0 }, { month: 'May', incidents: 1 }, { month: 'Jun', incidents: 2 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Line dataKey="incidents" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">Safety Training Completion</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ dept: 'Operations', completion: 95 }, { dept: 'Maintenance', completion: 88 }, { dept: 'Security', completion: 92 }, { dept: 'Admin', completion: 85 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="dept" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Bar dataKey="completion" fill="#f59e0b" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : user?.role === 'Operations' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Daily Passenger Traffic</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={[{ time: '6AM', passengers: 1200 }, { time: '9AM', passengers: 3800 }, { time: '12PM', passengers: 2200 }, { time: '3PM', passengers: 2800 }, { time: '6PM', passengers: 4200 }, { time: '9PM', passengers: 1800 }]}> 
                    <defs>
                      <linearGradient id="colorPassengers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Area type="monotone" dataKey="passengers" stroke="#06b6d4" strokeWidth={2} fill="url(#colorPassengers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Train Performance</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ route: 'Aluva-Petta', onTime: 94 }, { route: 'Petta-MG Road', onTime: 97 }, { route: 'MG Road-Ernakulam', onTime: 92 }, { route: 'Ernakulam-Edapally', onTime: 89 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="route" stroke="#64748b" fontSize={9} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Bar dataKey="onTime" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : user?.role === 'Maintenance' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Equipment Status</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie dataKey="value" data={[{ name: 'Operational', value: 85 }, { name: 'Maintenance', value: 10 }, { name: 'Repair', value: 5 }]} outerRadius={70} fill="#f59e0b" label />
                    {[{ name: 'Operational', value: 85, color: '#10b981' }, { name: 'Maintenance', value: 10, color: '#f59e0b' }, { name: 'Repair', value: 5, color: '#ef4444' }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Scheduled Maintenance</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ system: 'HVAC', pending: 8 }, { system: 'Escalators', pending: 5 }, { system: 'Power', pending: 3 }, { system: 'Signaling', pending: 2 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="system" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Bar dataKey="pending" fill="#3b82f6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : user?.role === 'Legal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Case Status Overview</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Scale className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie dataKey="value" data={[{ name: 'Active', value: 12 }, { name: 'Pending', value: 8 }, { name: 'Resolved', value: 25 }, { name: 'Appeal', value: 3 }]} outerRadius={70} fill="#6366f1" label />
                    {[{ name: 'Active', value: 12, color: '#ef4444' }, { name: 'Pending', value: 8, color: '#f59e0b' }, { name: 'Resolved', value: 25, color: '#10b981' }, { name: 'Appeal', value: 3, color: '#6366f1' }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Compliance Status</h4>
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={[{ area: 'Environmental', compliance: 98 }, { area: 'Safety', compliance: 95 }, { area: 'Labor', compliance: 92 }, { area: 'Financial', compliance: 96 }]}> 
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="area" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' }} />
                    <Bar dataKey="compliance" fill="#8b5cf6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-6 sm:p-8">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-r from-slate-500 to-gray-500 flex items-center justify-center mx-auto">
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">Department Overview</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Sign in with your specific department credentials to access tailored visualizations, analytics, and department-specific data insights.</p>
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Available Department Dashboards:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">Safety</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">Operations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">Maintenance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">Legal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">Finance</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">HR</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Enhanced Recent Alerts */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Recent Alerts</h3>
              </div>
              <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-md w-full sm:w-auto">
                View All
              </Button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={alert.id} className="group/item relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                  <div className="relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 cursor-pointer transition-all duration-300 group-hover/item:scale-[1.02]">
                    <div className="relative flex-shrink-0 self-start sm:self-auto">
                      <div className={`h-3 w-3 rounded-full ${alert.status === 'unread' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-slate-300 dark:bg-slate-600'} animate-pulse`} />
                      {alert.status === 'unread' && (
                        <div className="absolute inset-0 h-3 w-3 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white pr-2">{alert.title}</h4>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <Badge 
                            variant={alert.priority === 'Critical' ? 'destructive' : alert.priority === 'High' ? 'default' : 'secondary'}
                            className={`text-xs font-bold shadow-sm ${
                              alert.priority === 'Critical' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                              alert.priority === 'High' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' :
                              'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                            }`}
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{alert.time}</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50">{alert.type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Enhanced Quick Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Quick Search</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onNavigateToSearch}
                className="bg-white/50 hover:bg-white/80 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-md"
              >
                Advanced Search
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="relative group/search">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-20 group-focus-within/search:opacity-40 transition-opacity"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search documents, policies, reports..."
                    className="w-full pl-12 pr-4 py-4 text-sm bg-white/95 dark:bg-slate-800/95 border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder-slate-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        onNavigateToSearch?.();
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Recent Searches</p>
                </div>
                <div className="space-y-2">
                  {recentSearches.slice(0, 3).map((search, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-4 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-800/80 hover:bg-white/95 dark:hover:bg-slate-700/95 rounded-lg transition-all duration-300 hover:scale-[1.02] border border-slate-200/50 dark:border-slate-700/50"
                      onClick={onNavigateToSearch}
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-3 w-3 text-slate-400" />
                        <span className="truncate">{search}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Document Processing */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Recent Document Processing</h3>
            </div>
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-md">
              <a href="/upload" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Extract Text
              </a>
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* Sample processed documents */}
            {[
              {
                name: "Safety_Circular_2024.pdf",
                type: "PDF",
                processed: "2 hours ago",
                bulletPoints: 3,
                status: "completed"
              },
              {
                name: "Maintenance_Report.txt",
                type: "Text",
                processed: "1 day ago", 
                bulletPoints: 5,
                status: "completed"
              },
              {
                name: "Policy_Document.docx",
                type: "Document",
                processed: "2 days ago",
                bulletPoints: 8,
                status: "completed"
              }
            ].map((doc, index) => (
              <div key={index} className="group/doc relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl opacity-0 group-hover/doc:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-between p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 transition-all duration-300 group-hover/doc:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white leading-relaxed">{doc.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 font-medium">
                          {doc.type}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{doc.bulletPoints} bullet points extracted</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2 justify-end">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{doc.processed}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
                      Text Extracted
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Processing Stats */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-700/50">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">24</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">Files Processed</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">156</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">Bullet Points</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">3</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">File Types</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Upcoming Tasks */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <Card className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Upcoming Tasks</h3>
            </div>
            <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/80 border border-slate-300 text-slate-700 hover:text-slate-900 shadow-md w-full sm:w-auto">
              View All Tasks
            </Button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="group/task relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl opacity-0 group-hover/task:opacity-100 transition-opacity"></div>
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300/50 dark:hover:border-slate-600/50 transition-all duration-300 group-hover/task:scale-[1.02] gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className={`h-4 w-4 rounded-full transition-all duration-300 ${
                        task.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                        task.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-slate-400 to-slate-500'
                      }`} />
                      {task.status === 'in-progress' && (
                        <div className="absolute inset-0 h-4 w-4 rounded-full bg-blue-400 animate-ping opacity-75"></div>
                      )}
                      {task.status === 'completed' && (
                        <CheckCircle className="absolute inset-0 h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white leading-relaxed">{task.task}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-white/50 dark:bg-slate-800/50 font-medium">
                          {task.department}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 sm:text-right">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{task.deadline}</p>
                    </div>
                    <Badge 
                      variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}
                      className={`text-xs font-bold ${
                        task.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        task.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                        'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                      }`}
                    >
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Summary */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Task Progress</span>
              <span className="text-slate-900 dark:text-white font-bold">
                {upcomingTasks.filter(t => t.status === 'completed').length} of {upcomingTasks.length} completed
              </span>
            </div>
            <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(upcomingTasks.filter(t => t.status === 'completed').length / upcomingTasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>


    </div>
  );
};

export default Dashboard;