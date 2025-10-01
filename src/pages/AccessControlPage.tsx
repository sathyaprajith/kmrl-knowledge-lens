import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, UserPlus, Edit, Trash2, Key, Eye, Settings, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { userRegistrationService } from "@/services/userRegistrationService";

const AccessControlPage = () => {
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<any[]>([]);

  // Redirect non-admin users
  useEffect(() => {
    if (auth.user?.role !== 'Administrator') {
      navigate('/');
      return;
    }
  }, [auth.user, navigate]);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = () => {
    try {
      // Load demo users from localStorage
      const raw = localStorage.getItem('k-lens:users:v1');
      if (raw) setUsers(JSON.parse(raw));
      
      // Load registration data
      const allRegistrationUsers = userRegistrationService.getAllUsers();
      const pendingRegistrations = userRegistrationService.getPendingRegistrations();
      
      setApprovedUsers(allRegistrationUsers.approved || []);
      setPendingUsers(pendingRegistrations.filter(u => u.status === 'pending') || []);
      setRejectedUsers(pendingRegistrations.filter(u => u.status === 'rejected') || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setApprovedUsers([]);
      setPendingUsers([]);
      setRejectedUsers([]);
    }
  };

  // Controlled form state for Add User dialog
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState('User');
  const [departmentInput, setDepartmentInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('changeme123');
  const [formError, setFormError] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);

  const resetForm = () => {
    setFirstName(''); setLastName(''); setEmailInput(''); setRoleInput('User'); setDepartmentInput(''); setPasswordInput('changeme123'); setFormError(null);
  };

  const createUser = () => {
    setFormError(null);
    if (!emailInput || !emailInput.includes('@')) {
      setFormError('Please provide a valid email');
      return;
    }
    const name = `${firstName} ${lastName}`.trim() || emailInput;
    try {
      auth.addUser({ email: emailInput, password: passwordInput, name, role: roleInput, department: departmentInput, permissions: [] });
      setCreatedCreds({ email: emailInput, password: passwordInput });
    } catch (e) {
      setFormError('Failed to create user');
      return;
    }
    loadAllUsers(); // Refresh all user data
    resetForm();
    setNewUserDialog(false);
  };

  const roles = [
    {
      name: "Administrator",
      description: "Full system access with user management",
      userCount: 1,
      permissions: ["All Permissions"]
    },
    {
      name: "Manager",
      description: "Department management with reporting access",
      userCount: 1,
      permissions: ["View Documents", "Create Reports", "Manage Team"]
    },
    {
      name: "Officer",
      description: "Specialized access for department operations",
      userCount: 1,
      permissions: ["View Documents", "Department Reports", "Incident Management"]
    },
    {
      name: "User",
      description: "Basic document access and viewing",
      userCount: 2,
      permissions: ["View Documents", "Basic Reports"]
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator": return "text-destructive bg-destructive/10";
      case "Manager": return "text-accent bg-accent/10";
      case "Officer": return "text-primary bg-primary/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "text-success bg-success/10" 
      : "text-muted-foreground bg-muted";
  };

  const formatDate = (date: string | Date) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) {
        return 'Invalid Date';
      }
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Only render for administrators
  if (auth.user?.role !== 'Administrator') {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <h1 className="text-xl font-semibold">Access Control</h1>
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
                    <p className="text-muted-foreground">Manage user access and permissions for the K-Lens system</p>
                  </div>
                  <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} type="email" placeholder="user@kmrl.co.in" />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={roleInput} onValueChange={(v) => setRoleInput(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.name} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select value={departmentInput} onValueChange={(v) => setDepartmentInput(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Operations">Operations</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                              <SelectItem value="Safety">Safety</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} type="password" />
                        </div>
                        {formError && <div className="text-destructive text-sm">{formError}</div>}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => { resetForm(); setNewUserDialog(false); }}>
                            Cancel
                          </Button>
                          <Button onClick={createUser}>
                            Create User
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{users.length + approvedUsers.length + pendingUsers.length}</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{users.length + approvedUsers.length}</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">{pendingUsers.length}</p>
                        <p className="text-sm text-muted-foreground">Pending Approval</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted/10 flex items-center justify-center">
                        <Key className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">4</p>
                        <p className="text-sm text-muted-foreground">User Roles</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="users" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="users" className="space-y-4">
                    {/* Demo Login Credentials */}
                    <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <Key className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-primary">Demo Login Credentials</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="font-medium">Admin Login:</div>
                          <div className="font-mono bg-background/50 p-2 rounded">
                            <div>Email: admin@kmrl.co.in</div>
                            <div>Password: admin123</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium">User Login:</div>
                          <div className="font-mono bg-background/50 p-2 rounded">
                            <div>Email: finance@kmrl.co.in</div>
                            <div>Password: user123</div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Users List */}
                    <div className="space-y-4">
                      {/* Demo Users */}
                      {users.map((user) => (
                        <Card key={`demo-${user.id}`} className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{user.name}</h4>
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">Demo</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline"
                                    className={getRoleColor(user.role)}
                                  >
                                    {user.role}
                                  </Badge>
                                  <Badge variant="outline">{user.department}</Badge>
                                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-4">
                                <p className="text-sm font-medium">Last Login</p>
                                <p className="text-sm text-muted-foreground">-</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              {(user.permissions || ['full_access']).map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Approved Registration Users */}
                      {approvedUsers.map((user) => (
                        <Card key={`approved-${user.id}`} className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                  {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{user.username}</h4>
                                  <Badge className="bg-green-100 text-green-800 text-xs">Registered</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">User</Badge>
                                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Approved: {formatDate(user.approvedDate)} by {user.approvedBy}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-4">
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-sm text-green-600">Can Login</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="text-xs">view documents</Badge>
                              <Badge variant="secondary" className="text-xs">basic reports</Badge>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Pending Registration Users */}
                      {pendingUsers.map((user) => (
                        <Card key={`pending-${user.id}`} className="p-6 border-amber-200 bg-amber-50/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                  {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{user.username}</h4>
                                  <Badge className="bg-amber-100 text-amber-800 text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Pending
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">User</Badge>
                                  <Badge className="bg-amber-100 text-amber-800">Awaiting Approval</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Requested: {formatDate(user.requestDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-4">
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-sm text-amber-600">Cannot Login</p>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Pending Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs opacity-50">view documents</Badge>
                              <Badge variant="outline" className="text-xs opacity-50">basic reports</Badge>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Rejected Registration Users */}
                      {rejectedUsers.map((user) => (
                        <Card key={`rejected-${user.id}`} className="p-6 border-red-200 bg-red-50/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                  {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{user.username}</h4>
                                  <Badge className="bg-red-100 text-red-800 text-xs">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Rejected
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">User</Badge>
                                  <Badge className="bg-red-100 text-red-800">Access Denied</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Requested: {formatDate(user.requestDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-4">
                                <p className="text-sm font-medium">Status</p>
                                <p className="text-sm text-red-600">Rejected</p>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')}>
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {/* Show message if no users */}
                      {users.length === 0 && approvedUsers.length === 0 && pendingUsers.length === 0 && rejectedUsers.length === 0 && (
                        <Card className="p-12 text-center">
                          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                          <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
                          <p className="text-muted-foreground">No users have been created or registered yet.</p>
                        </Card>
                      )}

                      {createdCreds && (
                        <Card className="p-4 border border-primary">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-muted-foreground">New user created</div>
                              <div className="font-mono mt-1">Email: {createdCreds.email}</div>
                              <div className="font-mono">Password: {createdCreds.password}</div>
                            </div>
                            <div>
                              <Button onClick={() => setCreatedCreds(null)}>Dismiss</Button>
                            </div>
                          </div>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="roles" className="space-y-4">
                    <div className="grid gap-4">
                      {roles.map((role) => (
                        <Card key={role.name} className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h4 className="text-lg font-semibold">{role.name}</h4>
                                <Badge variant="outline">{role.userCount} users</Badge>
                              </div>
                              <p className="text-muted-foreground">{role.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {role.permissions.map((permission) => (
                                  <Badge key={permission} variant="secondary" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-1" />
                                Configure
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
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

export default AccessControlPage;