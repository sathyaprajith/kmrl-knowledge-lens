import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Search, Globe, ChevronDown, Sparkles, FileText, Calendar, Building2, AlertTriangle, Download, Eye, Clock } from "lucide-react";
import type { UploadFileResponse } from "@/integrations/Core";
import { useAuth } from "@/lib/auth";

interface DocumentInboxHubProps {
  onDocumentSelect?: (document: any) => void;
  showSummarizeAll?: boolean;
}

export const DocumentInboxHub: React.FC<DocumentInboxHubProps> = ({ 
  onDocumentSelect,
  showSummarizeAll = true 
}) => {
  const { user } = useAuth();
  const [language] = useState('english'); // Default language
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['high-risk', 'urgent', 'normal']);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  // Get user's department from the auth context
  const userDepartment = user?.role || "Administrator";

  // Load documents from various sources
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage (processed documents)
      const storedDocs = localStorage.getItem('kmrl-documents');
      const processedDocs = storedDocs ? JSON.parse(storedDocs) : [];

      // Sample documents from various sources - comprehensive list for all departments
      const allSampleDocs = [
        // Safety Department Documents
        {
          id: 'email-001',
          title: 'Monsoon Preparedness - Emergency Protocol Update',
          source: 'Email',
          department: 'Safety',
          language: 'English',
          priority: 'high-risk',
          date: new Date().toISOString(),
          author: 'Rajesh Kumar - Chief Safety Officer',
          content: 'Updated emergency protocols for monsoon season 2025. Key changes: evacuation routes modified for tunnel sections, emergency lighting upgraded to LED systems, water pumping capacity increased by 40% at all underground stations. Implementation deadline: October 15, 2025. Training mandatory for all station staff.',
          type: 'Safety Alert'
        },
        {
          id: 'safety-002',
          title: 'Track Inspection Report - Sector 7 (Kalamassery to Aluva)',
          source: 'File Upload',
          department: 'Safety',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 86400000).toISOString(),
          author: 'Priya Menon - Track Safety Inspector',
          content: 'Weekly safety inspection completed for 12.8 km track section. Findings: 3 minor rail joint loose bolts at KM 15.2, vegetation clearance required near Companypady Bridge, drainage blockage at 2 locations. Corrective action deadline: October 3, 2025. Track speed restricted to 65 kmph until repairs completed.',
          type: 'Inspection Report'
        },
        {
          id: 'safety-003',
          title: 'Fire Safety Drill Documentation - Ernakulam South Station',
          source: 'Web Portal',
          department: 'Safety',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'Anil Thomas - Fire Safety Coordinator',
          content: 'Monthly fire safety drill conducted on September 28, 2025 at 2:30 PM. Participation: 45 staff members, 12 security personnel. Evacuation time: 4 minutes 23 seconds (target: 5 minutes). Areas for improvement: PA system clarity in Platform 2, fire extinguisher access blocked by vendor stalls. Next drill: October 28, 2025.',
          type: 'Drill Report'
        },

        // Legal Department Documents
        {
          id: 'legal-001',
          title: 'Environmental Permit Renewal Application - NOC/2025/ENV/089',
          source: 'Email',
          department: 'Legal',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 43200000).toISOString(),
          author: 'Advocate Sunitha Nair - Legal Advisor',
          content: 'Environmental clearance renewal application submitted to Kerala State Pollution Control Board. Permit validity expires: November 15, 2025. Documents submitted: EIA report, waste management plan, noise pollution assessment. Application fee: ₹2,50,000. Expected approval: October 25, 2025. Non-compliance penalty: ₹10 lakh per day.',
          type: 'Legal Document'
        },
        {
          id: 'legal-002',
          title: 'Vendor Contract Amendment - ElectroTech Solutions Pvt Ltd',
          source: 'File Upload',
          department: 'Legal',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 129600000).toISOString(),
          author: 'CA Vinod Krishnan - Contract Manager',
          content: 'Contract amendment required for electrical maintenance vendor due to GST rate changes and revised safety standards. Original contract value: ₹4.2 crore (3 years). Proposed amendment: addition of LED upgrade clause, penalty restructuring for delays, insurance coverage increased to ₹50 lakh. Legal review deadline: October 5, 2025.',
          type: 'Contract'
        },
        {
          id: 'legal-003',
          title: 'Compliance Audit Report Q3 2025 - RITES Assessment',
          source: 'Web Portal',
          department: 'Legal',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 216000000).toISOString(),
          author: 'RITES Audit Team - Principal Auditor',
          content: 'Quarterly compliance audit conducted by RITES from Sept 15-22, 2025. Key findings: 5 critical non-conformities related to signaling protocols, 12 minor observations on safety documentation. Compliance score: 87% (target: 95%). Action plan required within 15 days. Re-audit scheduled: November 10, 2025.',
          type: 'Audit Report'
        },

        // HR Department Documents
        {
          id: 'hr-001',
          title: 'Staff Training Certification Records - Technical Personnel',
          source: 'File Upload',
          department: 'HR',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 64800000).toISOString(),
          author: 'Deepa Pillai - HR Manager (Training)',
          content: 'Technical certification status: 23 signal technicians, 15 track maintenance staff, 8 electrical engineers. Expiring certifications: 12 within 30 days. Renewal cost: ₹3.5 lakh. Training scheduled: October 10-15, 2025 at IRISET Secunderabad. Travel & accommodation budget approved: ₹8.2 lakh.',
          type: 'Training Record'
        },
        {
          id: 'hr-002',
          title: 'Employee Handbook 2025 Update - Version 3.2',
          source: 'Email',
          department: 'HR',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 151200000).toISOString(),
          author: 'Ravi Shankar - Deputy General Manager (HR)',
          content: 'Annual employee handbook revision incorporating new policies: flexible working hours for administrative staff, updated leave policy (increased maternity leave to 180 days), revised disciplinary procedures. Translation to Malayalam in progress. Distribution deadline: October 31, 2025. Digital copies uploaded to employee portal.',
          type: 'Policy Document'
        },
        {
          id: 'hr-003',
          title: 'Performance Review Templates Q3 - Appraisal Cycle 2025',
          source: 'Web Portal',
          department: 'HR',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 237600000).toISOString(),
          author: 'Meera Nair - Assistant Manager (HR Operations)',
          content: 'Q3 performance review for 347 employees across all departments. New KPI metrics: safety compliance score, customer service rating, technical proficiency assessment. Review period: July-September 2025. Completion deadline: October 10, 2025. Salary increment budget: ₹2.8 crore (average 8.5% increase).',
          type: 'HR Form'
        },

        // Finance Department Documents
        {
          id: 'finance-001',
          title: 'Q4 Budget Proposal 2025-26 - Operational Expenditure',
          source: 'File Upload',
          department: 'Finance',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 32400000).toISOString(),
          author: 'Sriram Iyer - Chief Financial Officer',
          content: 'Q4 operational budget: ₹128.5 crore. Major allocations: staff salaries (45%), maintenance (25%), energy costs (15%), administration (10%), contingency (5%). Revenue projection: ₹95.2 crore from operations, ₹40 crore government subsidy. Board approval required by October 8, 2025.',
          type: 'Budget Document'
        },
        {
          id: 'finance-002',
          title: 'Vendor Payment Invoice - MNT-2025-0892 - Overdue Notice',
          source: 'Email',
          department: 'Finance',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 118800000).toISOString(),
          author: 'Accounts Payable Team - Lakshmi Menon',
          content: 'Payment overdue to M/s. Kerala Rail Infrastructure Ltd. Invoice amount: ₹12,45,000 for track maintenance materials. Due date: September 15, 2025. Overdue by: 16 days. Late payment penalty: ₹1,245 per day. Vendor threatening service suspension. Payment authorization required urgently.',
          type: 'Invoice'
        },
        {
          id: 'finance-003',
          title: 'GST Returns September 2025 - GSTIN: 32AABCK7654M1Z5',
          source: 'Web Portal',
          department: 'Finance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 205200000).toISOString(),
          author: 'Suresh Kumar - Tax Officer',
          content: 'Monthly GST filing for September 2025. Gross receipts: ₹8.5 crore, GST collected: ₹45.9 lakh, Input tax credit: ₹32.1 lakh, Net GST payable: ₹13.8 lakh. Filing deadline: October 20, 2025. E-way bills generated: 1,247. Return filing software updated to latest version.',
          type: 'Tax Document'
        },

        // Operations Department Documents
        {
          id: 'operations-001',
          title: 'New Train Service Update - Aluva-Thripunithura Extension',
          source: 'Web Portal',
          department: 'Operations',
          language: 'Hybrid',
          priority: 'urgent',
          date: new Date(Date.now() - 86400000).toISOString(),
          author: 'Vishnu Prasad - Operations Manager',
          content: 'പുതിയ ട്രെയിൻ സേവനം: അലുവ-തൃപ്പൂണിത്തുറ റൂട്ടിൽ 6 മിനിറ്റ് ഇടവേളയിൽ സർവീസ് - New train service on Aluva-Thripunithura route with 6-minute frequency during peak hours. Service starts: October 5, 2025. Additional rolling stock: 4 coaches. Expected daily ridership: 45,000 passengers. Revenue projection: ₹2.8 lakh per day.',
          type: 'Service Update'
        },
        {
          id: 'operations-002',
          title: 'Passenger Traffic Report September 2025 - Route Performance Analysis',
          source: 'File Upload',
          department: 'Operations',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'Anitha Krishnan - Traffic Planning Officer',
          content: 'Monthly ridership: 28.5 lakh passengers (15% increase from August). Peak hour loading: 110% on Line 1, 85% on Line 2. Revenue collection: ₹18.2 crore. Most crowded stations: Ernakulam South (8.2 lakh), Aluva (6.5 lakh). Recommendations: increase frequency during 8-10 AM, deploy additional crowd management staff.',
          type: 'Traffic Report'
        },
        {
          id: 'operations-003',
          title: 'Signal Maintenance Schedule - Central Station Control Room',
          source: 'Email',
          department: 'Operations',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 259200000).toISOString(),
          author: 'Rajesh Nair - Signal & Telecom Engineer',
          content: 'Quarterly signal system maintenance at Central Control Room scheduled for October 12-13, 2025 (2:00 AM - 6:00 AM). Work scope: software updates for 24 signal controllers, hardware inspection of relay panels, backup system testing. Service disruption: 15 minutes maximum. Maintenance cost: ₹4.5 lakh.',
          type: 'Maintenance Schedule'
        },

        // IT Department Documents
        {
          id: 'it-001',
          title: 'System Backup Failure Alert',
          source: 'Email',
          department: 'IT',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 1800000).toISOString(),
          author: 'IT Support',
          content: 'Automated backup system failure notification...',
          type: 'System Alert'
        },
        {
          id: 'it-002',
          title: 'Security Patch Update Notice',
          source: 'Web Portal',
          department: 'IT',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 88200000).toISOString(),
          author: 'IT Security',
          content: 'Critical security patches for ticket management system...',
          type: 'Security Update'
        },
        {
          id: 'it-003',
          title: 'Network Diagnostic Report',
          source: 'File Upload',
          department: 'IT',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 174600000).toISOString(),
          author: 'Network Team',
          content: 'WiFi connectivity issues analysis and resolution...',
          type: 'Diagnostic Report'
        },

        // Maintenance Department Documents
        {
          id: 'maintenance-001',
          title: 'മെയിന്റനൻസ് റിപ്പോർട്ട് - അലുവ സ്റ്റേഷൻ',
          source: 'File Upload',
          department: 'Maintenance',
          language: 'Malayalam',
          priority: 'normal',
          date: new Date(Date.now() - 172800000).toISOString(),
          author: 'Maintenance Team',
          content: 'അലുവ സ്റ്റേഷന്റെ പതിവ് പരിശോധന റിപ്പോർട്ട്...',
          type: 'Maintenance Report'
        },
        {
          id: 'maintenance-002',
          title: 'Escalator Repair Status - Aluva Station',
          source: 'Email',
          department: 'Maintenance',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 259200000).toISOString(),
          author: 'Maintenance Engineer',
          content: 'Escalator malfunction repair status and timeline...',
          type: 'Repair Report'
        },
        {
          id: 'maintenance-003',
          title: 'AC Maintenance Schedule All Stations',
          source: 'Web Portal',
          department: 'Maintenance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 345600000).toISOString(),
          author: 'Facilities Team',
          content: 'Monthly air conditioning maintenance schedule...',
          type: 'Maintenance Schedule'
        },

        // Additional Safety Department Documents
        {
          id: 'safety-004',
          title: 'Emergency Response Protocol Update',
          source: 'File Upload',
          department: 'Safety',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 432000000).toISOString(),
          author: 'Emergency Response Team',
          content: 'Updated emergency response procedures for flooding scenarios...',
          type: 'Protocol Document'
        },
        {
          id: 'safety-005',
          title: 'CCTV Coverage Report - All Stations',
          source: 'Web Portal',
          department: 'Safety',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 518400000).toISOString(),
          author: 'Security Team',
          content: 'Comprehensive CCTV coverage analysis and recommendations...',
          type: 'Security Report'
        },
        {
          id: 'safety-006',
          title: 'First Aid Training Completion Report',
          source: 'Email',
          department: 'Safety',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 604800000).toISOString(),
          author: 'Training Coordinator',
          content: 'Monthly first aid training completion status for all staff...',
          type: 'Training Report'
        },
        {
          id: 'safety-007',
          title: 'Platform Safety Barrier Inspection',
          source: 'File Upload',
          department: 'Safety',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 691200000).toISOString(),
          author: 'Safety Inspector',
          content: 'Quarterly inspection of platform safety barriers and gates...',
          type: 'Inspection Report'
        },

        // Additional Legal Department Documents
        {
          id: 'legal-004',
          title: 'Land Acquisition Documentation - Phase 3',
          source: 'File Upload',
          department: 'Legal',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 777600000).toISOString(),
          author: 'Land Acquisition Team',
          content: 'Legal documentation for Phase 3 expansion land acquisition...',
          type: 'Land Document'
        },
        {
          id: 'legal-005',
          title: 'Insurance Policy Renewal Notice',
          source: 'Email',
          department: 'Legal',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 864000000).toISOString(),
          author: 'Insurance Officer',
          content: 'Annual insurance policy renewal for rolling stock and infrastructure...',
          type: 'Insurance Document'
        },
        {
          id: 'legal-006',
          title: 'Regulatory Compliance Checklist Q3',
          source: 'Web Portal',
          department: 'Legal',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 950400000).toISOString(),
          author: 'Compliance Officer',
          content: 'Quarterly regulatory compliance verification checklist...',
          type: 'Compliance Document'
        },
        {
          id: 'legal-007',
          title: 'Passenger Rights Information Update',
          source: 'File Upload',
          department: 'Legal',
          language: 'Hybrid',
          priority: 'normal',
          date: new Date(Date.now() - 1036800000).toISOString(),
          author: 'Legal Advisor',
          content: 'വാടക പാസത്തിന്റെ പാസഞ്ചെര് റൈറ്റ്‌സ് അപ്ഡേറ്റ് - Passenger rights information update...',
          type: 'Information Document'
        },

        // Additional HR Department Documents
        {
          id: 'hr-004',
          title: 'Employee Attendance Analysis September',
          source: 'File Upload',
          department: 'HR',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 1123200000).toISOString(),
          author: 'HR Analytics Team',
          content: 'Monthly employee attendance patterns and analysis...',
          type: 'Analytics Report'
        },
        {
          id: 'hr-005',
          title: 'Recruitment Drive - Technical Positions',
          source: 'Email',
          department: 'HR',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 1209600000).toISOString(),
          author: 'Recruitment Team',
          content: 'Open positions for signal engineers and maintenance technicians...',
          type: 'Job Posting'
        },
        {
          id: 'hr-006',
          title: 'Employee Wellness Program Report',
          source: 'Web Portal',
          department: 'HR',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 1296000000).toISOString(),
          author: 'Wellness Coordinator',
          content: 'Quarterly employee wellness program participation and feedback...',
          type: 'Wellness Report'
        },
        {
          id: 'hr-007',
          title: 'Salary Structure Revision Proposal',
          source: 'File Upload',
          department: 'HR',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 1382400000).toISOString(),
          author: 'Compensation Team',
          content: 'Annual salary structure revision based on market analysis...',
          type: 'Compensation Document'
        },

        // Additional Finance Department Documents
        {
          id: 'finance-004',
          title: 'Revenue Analysis Report Q3 2025',
          source: 'File Upload',
          department: 'Finance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 1468800000).toISOString(),
          author: 'Revenue Team',
          content: 'Quarterly revenue analysis including ticket sales and commercial income...',
          type: 'Revenue Report'
        },
        {
          id: 'finance-005',
          title: 'Cost Optimization Study - Energy Consumption',
          source: 'Email',
          department: 'Finance',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 1555200000).toISOString(),
          author: 'Cost Analysis Team',
          content: 'Study on reducing energy costs across all stations and operations...',
          type: 'Cost Analysis'
        },
        {
          id: 'finance-006',
          title: 'Asset Depreciation Schedule Update',
          source: 'Web Portal',
          department: 'Finance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 1641600000).toISOString(),
          author: 'Asset Management',
          content: 'Updated depreciation schedules for rolling stock and infrastructure...',
          type: 'Asset Document'
        },
        {
          id: 'finance-007',
          title: 'Bank Reconciliation Report September',
          source: 'File Upload',
          department: 'Finance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 1728000000).toISOString(),
          author: 'Accounts Team',
          content: 'Monthly bank reconciliation for all operational accounts...',
          type: 'Financial Report'
        },

        // Additional Operations Department Documents
        {
          id: 'operations-004',
          title: 'Train Schedule Optimization Study',
          source: 'File Upload',
          department: 'Operations',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 1814400000).toISOString(),
          author: 'Operations Planning',
          content: 'Analysis of current train schedules and optimization recommendations...',
          type: 'Planning Document'
        },
        {
          id: 'operations-005',
          title: 'കേര്‍ന്നൽ സ്റ്റേഷന്‍ കൃത്രിമ പരിശോധന - Kernel Station Platform Inspection',
          source: 'Email',
          department: 'Operations',
          language: 'Hybrid',
          priority: 'normal',
          date: new Date(Date.now() - 1900800000).toISOString(),
          author: 'Platform Inspector',
          content: 'കേര്‍ന്നൽ സ്റ്റേഷന്‍ പ്ലാറ്റ്‌ഫോം സുരക്ഷാ പരിശോധന - Platform safety inspection at Kernel Station...',
          type: 'Inspection Report'
        },
        {
          id: 'operations-006',
          title: 'Customer Feedback Analysis Report',
          source: 'Web Portal',
          department: 'Operations',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 1987200000).toISOString(),
          author: 'Customer Service Team',
          content: 'Monthly analysis of passenger feedback and service improvement suggestions...',
          type: 'Feedback Report'
        },
        {
          id: 'operations-007',
          title: 'Emergency Evacuation Drill Results',
          source: 'File Upload',
          department: 'Operations',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 2073600000).toISOString(),
          author: 'Emergency Coordinator',
          content: 'Results and analysis of quarterly emergency evacuation drills...',
          type: 'Emergency Report'
        },

        // Additional IT Department Documents
        {
          id: 'it-004',
          title: 'Cybersecurity Audit Report 2025',
          source: 'File Upload',
          department: 'IT',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 2160000000).toISOString(),
          author: 'Security Auditor',
          content: 'Annual cybersecurity audit findings and recommendations...',
          type: 'Security Audit'
        },
        {
          id: 'it-005',
          title: 'Mobile App Performance Metrics',
          source: 'Email',
          department: 'IT',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 2246400000).toISOString(),
          author: 'Mobile Development Team',
          content: 'Monthly performance metrics for KMRL mobile application...',
          type: 'Performance Report'
        },
        {
          id: 'it-006',
          title: 'Data Center Migration Plan',
          source: 'Web Portal',
          department: 'IT',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 2332800000).toISOString(),
          author: 'Infrastructure Team',
          content: 'Comprehensive plan for data center migration to cloud infrastructure...',
          type: 'Migration Plan'
        },
        {
          id: 'it-007',
          title: 'Software License Audit Report',
          source: 'File Upload',
          department: 'IT',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 2419200000).toISOString(),
          author: 'IT Compliance Officer',
          content: 'Annual software license audit and compliance verification...',
          type: 'Compliance Report'
        },

        // Additional Maintenance Department Documents
        {
          id: 'maintenance-004',
          title: 'Rolling Stock Maintenance Schedule Q4',
          source: 'File Upload',
          department: 'Maintenance',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 2505600000).toISOString(),
          author: 'Rolling Stock Team',
          content: 'Quarterly maintenance schedule for all trains and coaches...',
          type: 'Maintenance Schedule'
        },
        {
          id: 'maintenance-005',
          title: 'ട്രാക് മെയിന്റനൻസ് റിപ്പോർട്ട് - Track Maintenance Report',
          source: 'Email',
          department: 'Maintenance',
          language: 'Hybrid',
          priority: 'normal',
          date: new Date(Date.now() - 2592000000).toISOString(),
          author: 'Track Maintenance Team',
          content: 'പാലക്കാട് മുതൽ കൊച്ചി വരെയുള്ള ട്രാക് മെയിന്റനൻസ് റിപ്പോർട്ട് - Track maintenance report from Palakkad to Kochi...',
          type: 'Track Report'
        },
        {
          id: 'maintenance-006',
          title: 'Electrical System Overhaul Plan',
          source: 'Web Portal',
          department: 'Maintenance',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 2678400000).toISOString(),
          author: 'Electrical Team',
          content: 'Comprehensive electrical system overhaul plan for aging infrastructure...',
          type: 'Overhaul Plan'
        },
        {
          id: 'maintenance-007',
          title: 'Spare Parts Inventory Management',
          source: 'File Upload',
          department: 'Maintenance',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 2764800000).toISOString(),
          author: 'Inventory Manager',
          content: 'Monthly inventory report for critical spare parts and components...',
          type: 'Inventory Report'
        },

        // Cross-Department Documents
        {
          id: 'admin-001',
          title: 'Annual Board Meeting Minutes',
          source: 'File Upload',
          department: 'Administrator',
          language: 'English',
          priority: 'high-risk',
          date: new Date(Date.now() - 2851200000).toISOString(),
          author: 'Board Secretary',
          content: 'Minutes from annual board meeting covering strategic decisions...',
          type: 'Meeting Minutes'
        },
        {
          id: 'admin-002',
          title: 'Stakeholder Communication Report',
          source: 'Email',
          department: 'Administrator',
          language: 'English',
          priority: 'normal',
          date: new Date(Date.now() - 2937600000).toISOString(),
          author: 'Communications Team',
          content: 'Monthly report on stakeholder communications and public relations...',
          type: 'Communication Report'
        },
        {
          id: 'admin-003',
          title: 'Environmental Impact Assessment Update',
          source: 'Web Portal',
          department: 'Administrator',
          language: 'English',
          priority: 'urgent',
          date: new Date(Date.now() - 3024000000).toISOString(),
          author: 'Environmental Team',
          content: 'Updated environmental impact assessment for expansion projects...',
          type: 'Environmental Report'
        }
      ];

      // Filter documents based on user's department (Administrator sees all)
      const sampleDocs = userDepartment === "Administrator" 
        ? allSampleDocs 
        : allSampleDocs.filter(doc => doc.department === userDepartment);

      // Combine processed documents with sample documents
      const allDocs = [
        ...processedDocs.map((doc: UploadFileResponse) => ({
          id: doc.id,
          title: doc.filename,
          source: 'File Upload',
          department: doc.department || 'General',
          language: 'English',
          priority: doc.urgency?.toLowerCase() || 'normal',
          date: doc.createdAt || new Date().toISOString(),
          author: 'System',
          content: doc.text || '',
          type: doc.fileType?.split('/')[1]?.toUpperCase() || 'Document',
          originalDoc: doc
        })),
        ...sampleDocs
      ];

      setDocuments(allDocs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setSelectedPriorities([...selectedPriorities, priority]);
    } else {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    }
  };

  const handleSummarizeAll = async () => {
    setSummarizing(true);
    try {
      // Simulate AI summarization process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a summary of filtered documents
      const filteredDocs = getFilteredDocuments();
      const summary = `
📊 Document Summary Report
📅 Generated: ${new Date().toLocaleString()}
📄 Total Documents: ${filteredDocs.length}

🔍 Key Insights:
• ${filteredDocs.filter(d => d.priority === 'high-risk').length} High Risk documents requiring immediate attention
• ${filteredDocs.filter(d => d.priority === 'urgent').length} Urgent items pending review
• ${filteredDocs.filter(d => d.department === 'Safety').length} Safety-related documents
• ${filteredDocs.filter(d => d.department === 'Operations').length} Operations updates

📋 Recent Activity:
${filteredDocs.slice(0, 5).map(doc => `• ${doc.title} (${doc.department})`).join('\n')}

💡 Recommendations:
• Prioritize high-risk safety documents
• Review urgent operational updates
• Ensure compliance with new protocols
      `;

      // Save summary to clipboard or show in modal
      navigator.clipboard.writeText(summary);
      alert('AI Summary generated and copied to clipboard!');
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Error generating summary. Please try again.');
    } finally {
      setSummarizing(false);
    }
  };

  const getFilteredDocuments = () => {
    return documents.filter(doc => {
      const matchesSearch = searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSource = selectedSource === 'all' || doc.source === selectedSource;
      const matchesLanguage = selectedLanguage === 'all' || doc.language === selectedLanguage;
      const matchesPriority = selectedPriorities.includes(doc.priority);

      return matchesSearch && matchesSource && matchesLanguage && matchesPriority;
    });
  };

  const filteredDocuments = getFilteredDocuments();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high-risk':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'urgent':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'normal':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high-risk':
        return <AlertTriangle className="h-3 w-3" />;
      case 'urgent':
        return <Clock className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const sources = ['All Sources', 'Email', 'Web Portal', 'File Upload', 'API Integration'];
  const departments = ['All Departments', 'Safety', 'Operations', 'Maintenance', 'Finance', 'HR', 'IT'];
  const languages = ['All Languages', 'Malayalam', 'English', 'Hybrid'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Document Inbox & AI Summarization Hub
            </h1>
            <Globe className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-muted-foreground">
            {language === 'malayalam' 
              ? 'AI-പവേർഡ് ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് ഒന്നിലധികം സ്രോതസുകളിൽ നിന്ന്'
              : 'AI-powered document processing from multiple sources'
            }
          </p>
        </div>
        {showSummarizeAll && (
          <Button 
            onClick={handleSummarizeAll}
            disabled={summarizing || filteredDocuments.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {summarizing ? 'Summarizing...' : 'Summarize All'}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filters & Search</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {/* Search */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Source</label>
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Web Portal">Web Portal</SelectItem>
                <SelectItem value="File Upload">File Upload</SelectItem>
                <SelectItem value="API Integration">API Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Checkboxes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="high-risk"
                  checked={selectedPriorities.includes('high-risk')}
                  onCheckedChange={(checked) => handlePriorityChange('high-risk', checked as boolean)}
                />
                <label htmlFor="high-risk" className="text-sm text-red-700 font-medium">High Risk</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={selectedPriorities.includes('urgent')}
                  onCheckedChange={(checked) => handlePriorityChange('urgent', checked as boolean)}
                />
                <label htmlFor="urgent" className="text-sm text-orange-700 font-medium">Urgent</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="normal"
                  checked={selectedPriorities.includes('normal')}
                  onCheckedChange={(checked) => handlePriorityChange('normal', checked as boolean)}
                />
                <label htmlFor="normal" className="text-sm text-green-700 font-medium">Normal</label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Actions</label>
            <div className="flex flex-col gap-2">
              {showSummarizeAll && (
                <Button 
                  onClick={handleSummarizeAll}
                  disabled={summarizing || filteredDocuments.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
                  size="sm"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {summarizing ? 'Processing...' : 'Summarize All'}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSource('all');
                  setSelectedLanguage('all');
                  setSelectedPriorities(['high-risk', 'urgent', 'normal']);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">
              {language === 'malayalam' ? 'ഡോക്യുമെന്റുകൾ' : 'Documents'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-red-700 border-red-200">
              {filteredDocuments.filter(d => d.priority === 'high-risk').length} High Risk
            </Badge>
            <Badge variant="outline" className="text-orange-700 border-orange-200">
              {filteredDocuments.filter(d => d.priority === 'urgent').length} Urgent
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-200">
              {filteredDocuments.filter(d => d.priority === 'normal').length} Normal
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No documents match your current filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-muted/50 hover:shadow-md hover:border-primary/20 dark:hover:border-primary/40 transition-all duration-200 cursor-pointer gap-3 sm:gap-0"
                onClick={() => onDocumentSelect?.(doc.originalDoc || doc)}
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-1 sm:mt-0">
                    {getPriorityIcon(doc.priority)}
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight">{doc.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(doc.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {doc.department}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {doc.source}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doc.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(doc.priority)}`}>
                      {doc.priority.replace('-', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                      {doc.type}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" title="View Document" className="h-8 w-8 p-0">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentInboxHub;