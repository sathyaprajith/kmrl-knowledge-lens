import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Database, 
  Wifi, 
  Shield, 
  Bell, 
  Eye, 
  Download, 
  Upload,
  Server,
  Clock,
  Globe,
  Palette
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [autoSync, setAutoSync] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (auth.user?.role !== 'Administrator') {
      navigate('/');
      return;
    }
  }, [auth.user, navigate]);

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
                <h1 className="text-xl font-semibold">Settings</h1>
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
                    <h2 className="text-2xl font-bold">System Settings</h2>
                    <p className="text-muted-foreground">Configure K-Lens system preferences and integrations</p>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="general" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-6">
                    {/* Organization Settings */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Settings className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Organization Settings</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="orgName">Organization Name</Label>
                          <Input id="orgName" defaultValue="Kochi Metro Rail Limited (KMRL)" />
                        </div>
                        <div>
                          <Label htmlFor="domain">Domain</Label>
                          <Input id="domain" defaultValue="kmrl.co.in" />
                        </div>
                        <div>
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select defaultValue="ist">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                              <SelectItem value="utc">UTC</SelectItem>
                              <SelectItem value="est">Eastern Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="language">Default Language</Label>
                          <Select defaultValue="en">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ml">Malayalam</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    {/* AI & Search Settings */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">AI & Search Configuration</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="autoSync">Auto-sync Documents</Label>
                            <p className="text-sm text-muted-foreground">Automatically sync new documents from connected sources</p>
                          </div>
                          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                        </div>
                        <div>
                          <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                          <Select defaultValue="15">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="aiModel">AI Model</Label>
                          <Select defaultValue="gpt4">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt4">GPT-4 (Recommended)</SelectItem>
                              <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude">Claude-3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    {/* UI Preferences */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Palette className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Interface Preferences</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="darkMode">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                        <div>
                          <Label htmlFor="itemsPerPage">Items per Page</Label>
                          <Select defaultValue="20">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="integrations" className="space-y-6">
                    {/* Document Sources */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Document Sources</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Database className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">SharePoint</h4>
                              <p className="text-sm text-muted-foreground">kmrl.sharepoint.com</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-success bg-success/10">Connected</Badge>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                              <Server className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-medium">Maximo</h4>
                              <p className="text-sm text-muted-foreground">Asset Management System</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-success bg-success/10">Connected</Badge>
                            <Button variant="outline" size="sm">Configure</Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-muted/10 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="font-medium">Email Integration</h4>
                              <p className="text-sm text-muted-foreground">Exchange Server</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-muted-foreground bg-muted">Pending</Badge>
                            <Button variant="outline" size="sm">Setup</Button>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* API Configuration */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Wifi className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">API Configuration</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="apiUrl">API Base URL</Label>
                          <Input id="apiUrl" defaultValue="https://api.k-lens.kmrl.co.in/v1" />
                        </div>
                        <div>
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input id="apiKey" type="password" defaultValue="••••••••••••••••" />
                        </div>
                        <div>
                          <Label htmlFor="rateLimiting">Rate Limiting (requests/minute)</Label>
                          <Input id="rateLimiting" type="number" defaultValue="1000" />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Bell className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Notification Preferences</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive alerts and updates via email</p>
                          </div>
                          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="pushNotifications">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Browser push notifications for urgent alerts</p>
                          </div>
                          <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                        </div>

                        <div>
                          <Label htmlFor="notificationTypes">Notification Types</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {[
                              "Document Updates",
                              "System Alerts",
                              "Safety Notifications",
                              "Maintenance Schedules",
                              "Financial Reports",
                              "User Activity"
                            ].map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <input type="checkbox" defaultChecked className="rounded" />
                                <label className="text-sm">{type}</label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="emailTemplate">Email Template</Label>
                          <Textarea 
                            id="emailTemplate" 
                            placeholder="Customize notification email template..."
                            className="min-h-[100px]"
                            defaultValue="Dear {user_name},

You have a new notification from K-Lens:

{notification_content}

Best regards,
K-Lens System"
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Security Settings</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Select defaultValue="30">
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="240">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="passwordPolicy">Password Policy</Label>
                          <div className="space-y-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <label className="text-sm">Minimum 8 characters</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <label className="text-sm">Require uppercase letters</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <label className="text-sm">Require numbers</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <label className="text-sm">Require special characters</label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="dataEncryption">Data Encryption</Label>
                          <Select defaultValue="aes256">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aes256">AES-256 (Recommended)</SelectItem>
                              <SelectItem value="aes128">AES-128</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="auditLogging">Audit Logging</Label>
                          <p className="text-sm text-muted-foreground mb-2">Track user activities and system changes</p>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <label className="text-sm">Log user login/logout</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <label className="text-sm">Log document access</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <label className="text-sm">Log system changes</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="system" className="space-y-6">
                    {/* System Status */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Server className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">System Status</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Server Status</span>
                            <Badge variant="outline" className="text-success bg-success/10">Online</Badge>
                          </div>
                          <p className="text-2xl font-bold">99.9%</p>
                          <p className="text-sm text-muted-foreground">Uptime</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Database</span>
                            <Badge variant="outline" className="text-success bg-success/10">Healthy</Badge>
                          </div>
                          <p className="text-2xl font-bold">2.8TB</p>
                          <p className="text-sm text-muted-foreground">Storage Used</p>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">AI Service</span>
                            <Badge variant="outline" className="text-success bg-success/10">Active</Badge>
                          </div>
                          <p className="text-2xl font-bold">124ms</p>
                          <p className="text-sm text-muted-foreground">Avg Response</p>
                        </div>
                      </div>
                    </Card>

                    {/* Maintenance */}
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">Maintenance</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">Temporarily disable user access for maintenance</p>
                          </div>
                          <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                        </div>
                        
                        <div>
                          <Label htmlFor="backupSchedule">Backup Schedule</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Every Hour</SelectItem>
                              <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download Logs
                          </Button>
                          <Button variant="outline">
                            <Upload className="h-4 w-4 mr-2" />
                            System Backup
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Save Settings */}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Reset to Defaults</Button>
                      <Button>Save All Settings</Button>
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

export default SettingsPage;