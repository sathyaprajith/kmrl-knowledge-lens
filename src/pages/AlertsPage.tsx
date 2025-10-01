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
import { useAuth } from "@/lib/auth";

const AlertsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("alerts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [criticalOnly, setCriticalOnly] = useState(false);

  // Get user's department from the auth context
  const userDepartment = user?.role || "Administrator";

  // Sample alerts data - comprehensive list for all departments
  const allAlerts = [
    // Safety Department
    {
      id: "SA-001",
      title: "Safety Bulletin Deadline - Fire Safety Compliance SB/2025/089",
      description: "Critical safety documentation review required for fire safety systems at 6 underground stations. NFPA compliance audit scheduled October 12, 2025. Non-compliance may result in ₹5 lakh penalty and service suspension.",
      department: "Safety",
      timeAgo: "2 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Fire Safety Protocol Rev 2.1 - NFPA Standards",
      action: "Resolve"
    },
    {
      id: "SA-002",
      title: "Emergency Drill Report Pending - Ernakulam Junction",
      description: "Monthly emergency evacuation drill report for Ernakulam Junction Station overdue by 48 hours. RITES audit compliance requires submission within 72 hours. Involves 45 station staff and 12 security personnel.",
      department: "Safety",
      timeAgo: "6 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Emergency Drill Report - Sept 2025 - ERN/JN/001",
      action: "Resolve"
    },
    {
      id: "SA-003",
      title: "Track Inspection Overdue - Sector 7 (KM 15.2-18.5)",
      description: "Weekly track safety inspection for 3.3 km section between Kalamassery-Aluva is 3 days overdue. Track speed restricted to 65 kmph. Critical rail joint inspection required at KM 15.2 near Companypady Bridge.",
      department: "Safety",
      timeAgo: "3 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Track Inspection Checklist - Sector 7 - TSI/2025/007",
      action: "Resolve"
    },

    // Legal Department
    {
      id: "LE-001",
      title: "Environmental Permit Renewal Due - NOC/2025/ENV/089",
      description: "Environmental clearance from Kerala State Pollution Control Board expires November 15, 2025. Application submitted with ₹2.5 lakh fee. Requires EIA report update and noise pollution assessment for new extension work.",
      department: "Legal",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Environmental Clearance - KSPCB Application",
      action: "Resolve"
    },
    {
      id: "LE-002",
      title: "Contract Amendment Required - ElectroTech Solutions (₹4.2 Cr)",
      description: "Electrical maintenance vendor contract requires immediate amendment due to GST rate changes and revised IEEE safety standards. Original 3-year contract value ₹4.2 crore. Insurance coverage to be increased to ₹50 lakh.",
      department: "Legal",
      timeAgo: "4 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Vendor Contract - ETS/2022/AMN/003 - Amendment",
      action: "Resolve"
    },
    {
      id: "LE-003",
      title: "RITES Compliance Audit Findings - Action Plan Required",
      description: "RITES quarterly audit (Sept 15-22, 2025) identified 5 critical non-conformities in signaling protocols and 12 minor observations. Compliance score: 87% (target: 95%). Action plan submission deadline: October 10, 2025.",
      department: "Legal",
      timeAgo: "2 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "RITES Audit Report Q3-2025 - Compliance Action Plan",
      action: "Resolve"
    },

    // HR Department
    {
      id: "HR-001",
      title: "Staff Training Certification Expiring - IRISET Secunderabad",
      description: "46 technical staff certifications expire within 30 days: 23 signal technicians, 15 track maintenance, 8 electrical engineers. IRISET training scheduled Oct 10-15. Budget approved: ₹8.2 lakh (travel + accommodation).",
      department: "HR",
      timeAgo: "5 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Training Records 2024 - IRISET Certification Renewal",
      action: "Resolve"
    },
    {
      id: "HR-002",
      title: "Employee Handbook Update - Version 3.2 Distribution",
      description: "Annual employee handbook revision (347 pages) incorporating new policies: flexible working hours, extended maternity leave (180 days), revised disciplinary procedures. Malayalam translation pending. Distribution deadline: Oct 31, 2025.",
      department: "HR",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Employee Handbook 2025 - Version 3.2 - Final Draft",
      action: "Resolve"
    },
    {
      id: "HR-003",
      title: "Performance Review Cycle - 347 Employees Pending",
      description: "Q3 performance reviews pending for 347 employees across all departments. New KPI metrics include safety compliance, customer service rating. Completion deadline: October 10, 2025. Salary increment budget: ₹2.8 crore (avg 8.5%).",
      department: "HR",
      timeAgo: "8 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Q3 Performance Review Template - Appraisal Cycle 2025",
      action: "Resolve"
    },

    // Finance Department
    {
      id: "FN-001",
      title: "Q4 Budget Approval Pending - ₹128.5 Crore Operational Budget",
      description: "Q4 operational budget (₹128.5 crore) requires board approval by October 8, 2025. Major allocations: staff salaries (45%), maintenance (25%), energy (15%). Revenue projection: ₹95.2 crore operations + ₹40 crore govt subsidy.",
      department: "Finance",
      timeAgo: "3 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Q4 Budget Proposal 2025-26 - Board Presentation",
      action: "Resolve"
    },
    {
      id: "FN-002",
      title: "Vendor Payment Overdue - Kerala Rail Infrastructure (₹12.45 L)",
      description: "Payment to M/s. Kerala Rail Infrastructure Ltd overdue by 16 days. Invoice amount: ₹12,45,000 for track maintenance materials. Late penalty: ₹1,245/day. Vendor threatening service suspension. Authorization required urgently.",
      department: "Finance",
      timeAgo: "1 day ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Invoice #MNT-2025-0892 - Payment Authorization",
      action: "Resolve"
    },
    {
      id: "FN-003",
      title: "GST Filing Deadline - GSTIN: 32AABCK7654M1Z5",
      description: "Monthly GST filing deadline October 20, 2025. September 2025 data: Gross receipts ₹8.5 crore, GST collected ₹45.9 lakh, Input credit ₹32.1 lakh, Net payable ₹13.8 lakh. 1,247 e-way bills generated.",
      department: "Finance",
      timeAgo: "2 days ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "GST Returns September 2025 - Filing Documentation",
      action: "Resolve"
    },

    // Operations Department
    {
      id: "OP-001",
      title: "Service Disruption Alert - Aluva-Thripunithura Extension Launch",
      description: "New service launch on October 5, 2025 requires passenger notification 72 hours in advance. 6-minute frequency during peak hours. Expected ridership: 45,000/day. Revenue projection: ₹2.8 lakh/day. 4 additional coaches deployed.",
      department: "Operations",
      timeAgo: "4 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Service Launch Plan - Aluva-Thripunithura Route",
      action: "Resolve"
    },
    {
      id: "OP-002",
      title: "Peak Hour Capacity Review - 110% Loading on Line 1",
      description: "September ridership: 28.5 lakh passengers (15% increase). Peak hour loading exceeded: Line 1 at 110%, Line 2 at 85%. Most crowded: Ernakulam South (8.2L), Aluva (6.5L). Requires frequency increase 8-10 AM.",
      department: "Operations",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Passenger Traffic Analysis Sept 2025 - Capacity Report",
      action: "Resolve"
    },
    {
      id: "OP-003",
      title: "Signal System Maintenance - Central Control Room",
      description: "Quarterly maintenance scheduled October 12-13, 2025 (2:00-6:00 AM). Work scope: 24 signal controllers software update, relay panel inspection, backup testing. Max service disruption: 15 minutes. Cost: ₹4.5 lakh.",
      department: "Operations",
      timeAgo: "6 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Signal Maintenance Protocol - Central Control Room",
      action: "Resolve"
    },

    // IT Department
    {
      id: "IT-001",
      title: "System Backup Failure",
      description: "Automated backup system failed for 3 consecutive days. Data integrity at risk.",
      department: "IT",
      timeAgo: "30 minutes ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Backup System Error Log",
      action: "Resolve"
    },
    {
      id: "IT-002",
      title: "Security Patch Update",
      description: "Critical security patches available for ticket management system. Installation required.",
      department: "IT",
      timeAgo: "2 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Security Update Notes",
      action: "Resolve"
    },
    {
      id: "IT-003",
      title: "Network Performance Issues",
      description: "WiFi connectivity issues reported at 3 stations. Investigation and resolution needed.",
      department: "IT",
      timeAgo: "4 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Network Diagnostic Report",
      action: "Resolve"
    },

    // Maintenance Department
    {
      id: "MN-001",
      title: "Escalator Malfunction",
      description: "Escalator at Aluva Station has been non-operational for 48 hours. Repair urgently needed.",
      department: "Maintenance",
      timeAgo: "2 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Escalator Maintenance Log",
      action: "Resolve"
    },
    {
      id: "MN-002",
      title: "Air Conditioning Service",
      description: "Monthly AC maintenance due for all station facilities. Service scheduling required.",
      department: "Maintenance",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "AC Maintenance Schedule",
      action: "Resolve"
    },
    {
      id: "MN-003",
      title: "Platform Cleaning Equipment",
      description: "Automated platform cleaning system requires replacement parts. Service disruption possible.",
      department: "Maintenance",
      timeAgo: "8 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Equipment Replacement Request",
      action: "Resolve"
    },

    // Additional Safety Department Alerts
    {
      id: "SA-004",
      title: "Fire Safety Equipment Inspection Overdue",
      description: "Annual fire safety equipment inspection for Edapally Station is 5 days overdue. Schedule immediately.",
      department: "Safety",
      timeAgo: "5 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Fire Safety Inspection Checklist",
      action: "Resolve"
    },
    {
      id: "SA-005",
      title: "CCTV Camera Malfunction - Platform 3",
      description: "Security camera on Platform 3 at Kalamassery Station has been offline for 12 hours.",
      department: "Safety",
      timeAgo: "12 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "CCTV Maintenance Log",
      action: "Resolve"
    },
    {
      id: "SA-006",
      title: "Emergency Lighting System Test Required",
      description: "Monthly emergency lighting system test pending for all underground sections.",
      department: "Safety",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Emergency Systems Test Protocol",
      action: "Resolve"
    },
    {
      id: "SA-007",
      title: "Staff Safety Training Certification Expiry",
      description: "15 safety personnel certifications expire within 2 weeks. Renewal training required.",
      department: "Safety",
      timeAgo: "3 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Safety Training Records",
      action: "Resolve"
    },

    // Additional Legal Department Alerts
    {
      id: "LE-004",
      title: "Insurance Claim Deadline Approaching",
      description: "Insurance claim for equipment damage must be filed within 48 hours or coverage will be void.",
      department: "Legal",
      timeAgo: "6 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Insurance Claim Form IC-2025-089",
      action: "Resolve"
    },
    {
      id: "LE-005",
      title: "Data Protection Compliance Review",
      description: "Annual GDPR compliance review requires legal department input by October 10th.",
      department: "Legal",
      timeAgo: "2 days ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Data Protection Assessment",
      action: "Resolve"
    },
    {
      id: "LE-006",
      title: "Land Lease Agreement Renewal Notice",
      description: "Land lease agreement for Aluva depot expires in 30 days. Renewal negotiation required.",
      department: "Legal",
      timeAgo: "1 week ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Land Lease Agreement AL-2020-03",
      action: "Resolve"
    },
    {
      id: "LE-007",
      title: "Vendor Contract Breach Investigation",
      description: "Cleaning services contractor failed to meet SLA requirements. Legal action assessment needed.",
      department: "Legal",
      timeAgo: "3 days ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Contract Breach Report CLN-2025-02",
      action: "Resolve"
    },

    // Additional HR Department Alerts
    {
      id: "HR-004",
      title: "Employee Background Verification Pending",
      description: "Background verification for 8 new hires pending completion before joining date.",
      department: "HR",
      timeAgo: "2 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Background Verification Checklist",
      action: "Resolve"
    },
    {
      id: "HR-005",
      title: "Annual Leave Accumulation Alert",
      description: "12 employees have exceeded maximum leave accumulation limits. Action required.",
      department: "HR",
      timeAgo: "4 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Leave Balance Report",
      action: "Resolve"
    },
    {
      id: "HR-006",
      title: "Medical Insurance Policy Renewal",
      description: "Group medical insurance policy expires October 15th. Renewal documentation required.",
      department: "HR",
      timeAgo: "1 week ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Medical Insurance Policy MI-2024",
      action: "Resolve"
    },
    {
      id: "HR-007",
      title: "Exit Interview Completion Pending",
      description: "Exit interviews for 3 departed employees remain incomplete. HR follow-up required.",
      department: "HR",
      timeAgo: "5 days ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Exit Interview Forms",
      action: "Resolve"
    },

    // Additional Finance Department Alerts
    {
      id: "FN-004",
      title: "Bank Account Reconciliation Discrepancy",
      description: "₹2.3 lakh discrepancy found in operational account reconciliation. Investigation required.",
      department: "Finance",
      timeAgo: "1 hour ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Bank Reconciliation Report Sept-2025",
      action: "Resolve"
    },
    {
      id: "FN-005",
      title: "Petty Cash Audit Findings",
      description: "Internal audit identified irregularities in petty cash management at 3 stations.",
      department: "Finance",
      timeAgo: "3 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Petty Cash Audit Report",
      action: "Resolve"
    },
    {
      id: "FN-006",
      title: "Revenue Collection System Malfunction",
      description: "Ticket vending machine at Ernakulam South not transmitting revenue data for 24 hours.",
      department: "Finance",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Revenue System Error Log",
      action: "Resolve"
    },
    {
      id: "FN-007",
      title: "Annual Financial Audit Preparation",
      description: "External auditors require all financial documents ready by October 20th. Preparation ongoing.",
      department: "Finance",
      timeAgo: "1 week ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Annual Audit Checklist 2025",
      action: "Resolve"
    },

    // Additional Operations Department Alerts
    {
      id: "OP-004",
      title: "Train Delay Pattern Analysis Required",
      description: "Line 1 showing 15% increase in delays during morning peak. Root cause analysis needed.",
      department: "Operations",
      timeAgo: "2 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Delay Analysis Report",
      action: "Resolve"
    },
    {
      id: "OP-005",
      title: "Platform Overcrowding Safety Alert",
      description: "Platform capacity exceeded during evening rush at Lissie Station. Safety measures required.",
      department: "Operations",
      timeAgo: "4 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Platform Capacity Monitor",
      action: "Resolve"
    },
    {
      id: "OP-006",
      title: "Train Door Sensor Malfunction",
      description: "Coach 3 of Train KM-07 reporting intermittent door sensor issues. Safety inspection required.",
      department: "Operations",
      timeAgo: "30 minutes ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Train Safety Log KM-07",
      action: "Resolve"
    },
    {
      id: "OP-007",
      title: "Passenger Information System Update",
      description: "Digital displays at 4 stations showing incorrect arrival times. System update required.",
      department: "Operations",
      timeAgo: "2 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "PIS Maintenance Log",
      action: "Resolve"
    },

    // Additional IT Department Alerts
    {
      id: "IT-004",
      title: "Database Server Performance Critical",
      description: "Primary database server CPU usage at 95% for 2 hours. Immediate optimization required.",
      department: "IT",
      timeAgo: "2 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Server Performance Monitor",
      action: "Resolve"
    },
    {
      id: "IT-005",
      title: "Email Server Storage Capacity Warning",
      description: "Email server storage at 88% capacity. Archive or expansion required within 48 hours.",
      department: "IT",
      timeAgo: "6 hours ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Storage Capacity Report",
      action: "Resolve"
    },
    {
      id: "IT-006",
      title: "Mobile App Login Issues Reported",
      description: "Multiple users reporting login failures on KMRL mobile app. Investigation required.",
      department: "IT",
      timeAgo: "1 hour ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Mobile App Error Log",
      action: "Resolve"
    },
    {
      id: "IT-007",
      title: "Firewall Rule Configuration Update",
      description: "New security requirements mandate firewall rule updates across all network segments.",
      department: "IT",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Firewall Configuration Guide",
      action: "Resolve"
    },

    // Additional Maintenance Department Alerts
    {
      id: "MN-004",
      title: "Track Ballast Inspection Overdue",
      description: "Track ballast inspection for Section C-7 is 10 days overdue. Safety compliance at risk.",
      department: "Maintenance",
      timeAgo: "10 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Track Inspection Schedule",
      action: "Resolve"
    },
    {
      id: "MN-005",
      title: "Power Supply Unit Failure - Edapally",
      description: "Backup power supply unit at Edapally Station failed during routine test. Replacement needed.",
      department: "Maintenance",
      timeAgo: "4 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Power System Maintenance Log",
      action: "Resolve"
    },
    {
      id: "MN-006",
      title: "Tunnel Lighting Maintenance Required",
      description: "12 LED fixtures in tunnel section between JLN Stadium and Kaloor require replacement.",
      department: "Maintenance",
      timeAgo: "1 day ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Tunnel Lighting Inventory",
      action: "Resolve"
    },
    {
      id: "MN-007",
      title: "Coach Interior Deep Cleaning Overdue",
      description: "Monthly deep cleaning for Coaches KM-15 to KM-20 is 5 days overdue. Schedule immediately.",
      department: "Maintenance",
      timeAgo: "5 days ago",
      priority: "MEDIUM",
      status: "open",
      documentTitle: "Coach Cleaning Schedule",
      action: "Resolve"
    },

    // Critical Cross-Department Alerts
    {
      id: "CR-001",
      title: "Emergency Response Drill Coordination",
      description: "Multi-department emergency response drill scheduled for October 5th requires coordination.",
      department: "Safety",
      timeAgo: "2 days ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Emergency Drill Coordination Plan",
      action: "Resolve"
    },
    {
      id: "CR-002",
      title: "Service Disruption Communication",
      description: "Planned maintenance disruption requires coordinated passenger communication across all channels.",
      department: "Operations",
      timeAgo: "6 hours ago",
      priority: "HIGH",
      status: "open",
      documentTitle: "Service Disruption Communication Plan",
      action: "Resolve"
    }
  ];

  // Filter alerts based on user's department (Administrator sees all)
  const alerts = userDepartment === "Administrator" 
    ? allAlerts 
    : allAlerts.filter(alert => alert.department === userDepartment);

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Alerts & Compliance Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Monitor critical alerts, compliance deadlines, and document-driven risks</p>
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
                <TabsContent value="alerts" className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
                    {/* Main Content - Left Side (3/4) */}
                    <div className="xl:col-span-3 space-y-4 sm:space-y-6">
                      {/* Timeline Navigation */}
                      <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                          <h3 className="text-lg font-semibold">Next 30 Days Timeline</h3>
                          <Button variant="outline" size="sm" onClick={exportCSV} className="w-full sm:w-auto">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <div className="flex space-x-1 overflow-x-auto flex-1 pb-2">
                            {calendarData.map((day, index) => (
                              <div key={index} className={`flex flex-col items-center p-2 sm:p-3 rounded-lg min-w-[50px] sm:min-w-[60px] text-center ${
                                day.isToday ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600' : 
                                day.isHighlighted ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-600' : 
                                'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}>
                                <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{day.dayName}</span>
                                <span className={`text-sm sm:text-base font-bold ${day.isToday ? 'text-blue-700 dark:text-blue-300' : day.isHighlighted ? 'text-red-700 dark:text-red-300' : 'text-gray-800 dark:text-gray-200'}`}>
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
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>

                      {/* Filters */}
                      <Card className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-full sm:w-48">
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
                          
                          <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search alerts..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 w-full"
                            />
                          </div>

                          <div className="flex items-center space-x-2 whitespace-nowrap">
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
                            alert.priority === 'HIGH' ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-500' : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-500'
                          }`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-shrink-0">
                                      {alert.id}
                                    </span>
                                    <Badge 
                                      variant={alert.priority === 'HIGH' ? 'destructive' : 'secondary'}
                                      className={`${alert.priority === 'HIGH' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'} flex-shrink-0`}
                                    >
                                      {alert.priority}
                                    </Badge>
                                  </div>
                                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-tight">{alert.title}</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">{alert.description}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  <span className="flex items-center gap-2">
                                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="truncate">{alert.department}</span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="truncate">{alert.timeAgo}</span>
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{alert.documentTitle}</span>
                                </div>
                              </div>
                              <div className="ml-0 sm:ml-6 mt-4 sm:mt-0">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
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
                          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Compliance Timeline</h3>
                        </div>
                        <div className="space-y-4">
                          {complianceTimeline.map((item) => (
                            <div key={item.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="flex items-start gap-3 mb-2">
                                <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400 mt-1" />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{item.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-3">
                                <span className="text-gray-500 dark:text-gray-400">{item.department}</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">{item.daysLeft}d left</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.deadline}</div>
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