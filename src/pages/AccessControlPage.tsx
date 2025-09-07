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
import { Shield, Users, UserPlus, Edit, Trash2, Key, Eye, Settings } from "lucide-react";
import { useState } from "react";

const AccessControlPage = () => {
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@kmrl.co.in",
      role: "Administrator",
      department: "IT",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["full_access", "user_management", "system_settings"],
      isDemo: true
    },
    {
      id: 2,
      name: "Operations Manager",
      email: "ops.manager@kmrl.co.in",
      role: "Manager",
      department: "Operations",
      status: "active",
      lastLogin: "1 day ago",
      permissions: ["view_documents", "create_reports", "manage_alerts"],
      isDemo: true
    },
    {
      id: 3,
      name: "Safety Officer",
      email: "safety@kmrl.co.in",
      role: "Officer",
      department: "Safety",
      status: "active",
      lastLogin: "3 hours ago",
      permissions: ["view_documents", "safety_reports", "incident_management"],
      isDemo: true
    },
    {
      id: 4,
      name: "Finance User",
      email: "finance@kmrl.co.in",
      role: "User",
      department: "Finance",
      status: "active",
      lastLogin: "5 hours ago",
      permissions: ["view_documents", "financial_reports"],
      isDemo: true
    },
    {
      id: 5,
      name: "Maintenance Engineer",
      email: "maintenance@kmrl.co.in",
      role: "User",
      department: "Maintenance",
      status: "inactive",
      lastLogin: "2 weeks ago",
      permissions: ["view_documents", "maintenance_reports"],
      isDemo: true
    }
  ];

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
                            <Input id="firstName" placeholder="Enter first name" />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Enter last name" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="user@kmrl.co.in" />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.name} value={role.name.toLowerCase()}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="operations">Operations</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="safety">Safety</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="it">IT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setNewUserDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => {
                            setNewUserDialog(false);
                          }}>
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
                        <p className="text-lg font-bold">5</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">4</p>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Key className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">4</p>
                        <p className="text-sm text-muted-foreground">User Roles</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted/10 flex items-center justify-center">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Permissions</p>
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
                      {users.map((user) => (
                        <Card key={user.id} className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary-foreground">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{user.name}</h4>
                                  {user.isDemo && (
                                    <Badge variant="outline" className="text-xs">Demo</Badge>
                                  )}
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
                                  <Badge 
                                    variant="outline"
                                    className={getStatusColor(user.status)}
                                  >
                                    {user.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-right mr-4">
                                <p className="text-sm font-medium">Last Login</p>
                                <p className="text-sm text-muted-foreground">{user.lastLogin}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              {user.permissions.map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission.replace('_', ' ')}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))}
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