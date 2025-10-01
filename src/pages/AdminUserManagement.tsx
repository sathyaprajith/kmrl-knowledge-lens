import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Calendar,
  Users,
  UserCheck,
  UserX,
  Bell,
  AlertCircle,
  RefreshCw,
  Search,
  Shield,
  Edit,
  Database,
  Settings,
  Plus
} from 'lucide-react';
import { userRegistrationService, PendingUser } from '@/services/userRegistrationService';

const AdminUserManagement = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [demoUsers, setDemoUsers] = useState<any[]>([]);
  const [allStoredUsers, setAllStoredUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState<{[key: string]: string}>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      console.log('Loading user management data...');
      setIsLoading(true);
      
      // Initialize with safe defaults
      let pendingData: PendingUser[] = [];
      let approvedData: any[] = [];
      let demoData: any[] = [];
      let notificationsData: any[] = [];
      
      // Safely load pending registrations
      try {
        pendingData = userRegistrationService.getPendingRegistrations() || [];
        console.log('Pending users loaded:', pendingData.length);
      } catch (err) {
        console.warn('Error loading pending users:', err);
        pendingData = [];
      }
      
      // Safely load all users
      try {
        const allUsers = userRegistrationService.getAllUsers();
        approvedData = allUsers?.approved || [];
        console.log('Approved users loaded:', approvedData.length);
      } catch (err) {
        console.warn('Error loading approved users:', err);
        approvedData = [];
      }
      
      // Safely load admin notifications
      try {
        notificationsData = userRegistrationService.getAdminNotifications() || [];
        console.log('Notifications loaded:', notificationsData.length);
      } catch (err) {
        console.warn('Error loading notifications:', err);
        notificationsData = [];
      }
      
      // Safely load demo users from localStorage
      try {
        const demoUsersData = localStorage.getItem('k-lens:users:v1');
        if (demoUsersData) {
          demoData = JSON.parse(demoUsersData);
          if (!Array.isArray(demoData)) {
            demoData = [];
          }
        }
        console.log('Demo users loaded:', demoData.length);
      } catch (err) {
        console.warn('Error loading demo users:', err);
        demoData = [];
      }
      
      // Update all state with safe data
      setPendingUsers(pendingData);
      setApprovedUsers(approvedData);
      setDemoUsers(demoData);
      setAllStoredUsers(demoData);
      setNotifications(notificationsData);
      
      console.log('Data loaded successfully - Pending:', pendingData.length, 'Approved:', approvedData.length, 'Demo:', demoData.length);
      
      // Clear any existing error message
      if (message) {
        setMessage('');
      }
      
    } catch (error) {
      console.error('Critical error loading data:', error);
      
      // Set safe default values
      setPendingUsers([]);
      setApprovedUsers([]);
      setDemoUsers([]);
      setAllStoredUsers([]);
      setNotifications([]);
      
      setMessage('Error loading user data. Please refresh the page or check the console for details.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (userId: string, username: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Approving user:', userId, username);
      const result = await userRegistrationService.approveRegistration(userId, 'Admin User');
      
      console.log('Approval result:', result);
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        
        // Force a delay before reloading data to ensure localStorage is updated
        setTimeout(() => {
          loadData(); // Refresh data
        }, 100);
        
        // Also switch to approved tab to show the newly approved user
        setTimeout(() => {
          setActiveTab('approved');
        }, 200);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setMessage('Failed to approve user. Please try again.');
      setMessageType('error');
    }

    setIsLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleReject = async (userId: string, username: string) => {
    setIsLoading(true);
    setMessage('');

    try {
      const reason = rejectionReason[userId] || '';
      const result = await userRegistrationService.rejectRegistration(userId, 'Admin User', reason);
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        setRejectionReason(prev => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
        setShowRejectModal(null);
        loadData(); // Refresh data
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Failed to reject user. Please try again.');
      setMessageType('error');
    }

    setIsLoading(false);
    setTimeout(() => setMessage(''), 5000);
  };

  const clearNotifications = () => {
    userRegistrationService.clearAdminNotifications();
    setNotifications([]);
    setMessage('All notifications cleared.');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDate = (date: string | Date | null | undefined) => {
    try {
      if (!date) {
        return 'N/A';
      }
      
      let dateObj: Date;
      
      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return 'N/A';
      }
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date provided:', date);
        return 'Invalid Date';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', date);
      return 'Format Error';
    }
  };

  const filteredPendingUsers = pendingUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovedUsers = approvedUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDemoUsers = demoUsers.filter(user =>
    (user.name || user.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStatusBadge = (status: string, isDemo: boolean = false) => {
    if (isDemo) {
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Shield className="h-3 w-3 mr-1" />Demo</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
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
                <h1 className="text-xl font-semibold">User Management</h1>
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
                    <h2 className="text-2xl font-bold">User & Role Management</h2>
                    <p className="text-muted-foreground">
                      Comprehensive user management, registrations, and system access control
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={loadData} disabled={isLoading} variant="outline">
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh Data
                    </Button>
                    <Button 
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all user registration data? This cannot be undone.')) {
                          userRegistrationService.resetToDefaults();
                          loadData();
                          setMessage('All user registration data has been reset');
                          setMessageType('success');
                          setTimeout(() => setMessage(''), 3000);
                        }
                      }} 
                      disabled={isLoading}
                      variant="destructive"
                      size="sm"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Reset Data
                    </Button>
                  </div>
                </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold text-amber-600">{pendingUsers.length}</div>
                <div className="text-sm text-gray-500">Pending Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{approvedUsers.length}</div>
                <div className="text-sm text-gray-500">Approved Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{demoUsers.length}</div>
                <div className="text-sm text-gray-500">Demo Accounts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{pendingUsers.length + approvedUsers.length + demoUsers.length}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={messageType === 'success' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'}>
          <AlertCircle className={`h-4 w-4 ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          <AlertDescription className={messageType === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
            {message}
          </AlertDescription>
        </Alert>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
                <Badge variant="secondary">{notifications.length}</Badge>
              </CardTitle>
              <CardDescription>System notifications and updates</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearNotifications}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100">{notification.message}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{formatDate(notification.timestamp)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* User Management Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
        key={`tabs-${pendingUsers.length}-${approvedUsers.length}-${demoUsers.length}`}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending ({pendingUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Approved ({approvedUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Demo ({demoUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>All Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Pending Users Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Registration Requests</CardTitle>
              <CardDescription>Review and approve or reject new user registration requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-16 w-16 mx-auto mb-4 text-gray-300 animate-spin" />
                  <p className="text-lg font-medium">Loading...</p>
                </div>
              ) : filteredPendingUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No pending requests</p>
                  <p className="text-sm">All registration requests have been processed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPendingUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{user.username}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Requested: {formatDate(user.requestDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {getUserStatusBadge(user.status)}
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleApprove(user.id, user.username)}
                              disabled={isLoading}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setShowRejectModal(user.id)}
                              disabled={isLoading}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Rejection Modal */}
                      {showRejectModal === user.id && (
                        <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium">Reason for rejection (optional):</Label>
                            <Textarea
                              placeholder="Enter reason for rejection..."
                              value={rejectionReason[user.id] || ''}
                              onChange={(e) => setRejectionReason(prev => ({ ...prev, [user.id]: e.target.value }))}
                              className="w-full"
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(user.id, user.username)}
                                disabled={isLoading}
                              >
                                Confirm Rejection
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowRejectModal(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approved Users Tab */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Users</CardTitle>
              <CardDescription>Users who have been approved and can access the system</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-16 w-16 mx-auto mb-4 text-gray-300 animate-spin" />
                  <p className="text-lg font-medium">Loading...</p>
                </div>
              ) : filteredApprovedUsers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No approved users yet</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Approved Date</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApprovedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDate(user.approvedDate)}</TableCell>
                        <TableCell>{user.approvedBy}</TableCell>
                        <TableCell>{getUserStatusBadge('approved')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Users Tab */}
        <TabsContent value="demo">
          <Card>
            <CardHeader>
              <CardTitle>Demo Accounts</CardTitle>
              <CardDescription>System demo accounts for testing and demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDemoUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{getUserStatusBadge('demo', true)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Users Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Users Overview</CardTitle>
              <CardDescription>Complete overview of all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{pendingUsers.length}</div>
                    <div className="text-sm text-amber-800 dark:text-amber-200">Pending Approval</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{approvedUsers.length}</div>
                    <div className="text-sm text-green-800 dark:text-green-200">Approved Users</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{demoUsers.length}</div>
                    <div className="text-sm text-blue-800 dark:text-blue-200">Demo Accounts</div>
                  </div>
                </div>

                {/* Combined Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name/Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Demo Users */}
                    {demoUsers.map((user) => (
                      <TableRow key={`demo-${user.id}`}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">Demo Account</Badge>
                        </TableCell>
                        <TableCell>{getUserStatusBadge('demo', true)}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Approved Users */}
                    {approvedUsers.map((user) => (
                      <TableRow key={`approved-${user.id}`}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Registered User</Badge>
                        </TableCell>
                        <TableCell>{getUserStatusBadge('approved')}</TableCell>
                        <TableCell>{formatDate(user.approvedDate)}</TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Pending Users */}
                    {pendingUsers.map((user) => (
                      <TableRow key={`pending-${user.id}`}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-100 text-amber-800">Registration Request</Badge>
                        </TableCell>
                        <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                        <TableCell>{formatDate(user.requestDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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

export default AdminUserManagement;
