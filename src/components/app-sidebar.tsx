import { useState, useEffect } from "react";
import { Home, Search, FileText, BarChart3, Settings, Shield, Bell, HelpCircle, LogOut, Heart, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from '@/lib/auth';
import { Badge } from "@/components/ui/badge";
import { userRegistrationService } from '@/services/userRegistrationService';

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, badge: null },
  { title: "Search", url: "/search", icon: Search, badge: null },
  { title: "Documents", url: "/documents", icon: FileText, badge: "124" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, badge: null },
  { title: "Alerts", url: "/alerts", icon: Bell, badge: "3" },
  { title: "Employee Wellness", url: "/wellness", icon: Heart, badge: "NEW" },
];

// Admin items will be created dynamically with pending user count

const supportItems = [
  { title: "Help & Support", url: "/help", icon: HelpCircle, badge: null },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { logout, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [pendingCount, setPendingCount] = useState(0);

  // Update pending registrations count
  useEffect(() => {
    const updatePendingCount = () => {
      const pending = userRegistrationService.getPendingRegistrations();
      setPendingCount(pending.length);
    };

    updatePendingCount();
    
    // Set up interval to refresh count every 30 seconds
    const interval = setInterval(updatePendingCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Create admin items with dynamic badge for user management
  const adminItems = [
    { title: "User Management", url: "/admin/users", icon: Users, badge: pendingCount > 0 ? pendingCount.toString() : null },
    { title: "Access Control", url: "/access", icon: Shield, badge: null },
    { title: "Settings", url: "/settings", icon: Settings, badge: null },
  ];

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-r-2 border-primary font-medium shadow-sm" 
      : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-200 ease-in-out";

  const MenuItem = ({ item }: { item: any }) => (
    <SidebarMenuItem className="group">
      <SidebarMenuButton 
        asChild 
        className="h-11 group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 rounded-xl transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-sm"
        tooltip={item.title}
      >
        <NavLink to={item.url} className={`${getNavCls(item.url)} rounded-xl px-3 py-2 flex items-center gap-3 transition-all duration-300 ease-in-out`}>
          <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="flex-1 group-data-[collapsible=icon]:sr-only font-medium">{item.title}</span>
          {item.badge && (
            <Badge 
              variant={isActive(item.url) ? "default" : "secondary"} 
              className="text-xs group-data-[collapsible=icon]:hidden animate-pulse"
            >
              {item.badge}
            </Badge>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent className="p-5 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:px-2 flex flex-col h-full bg-gradient-to-b from-background to-background/95">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-primary to-purple-600 flex items-center justify-center shrink-0 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 sidebar-brand-glow">
            <span className="text-lg font-bold text-white group-data-[collapsible=icon]:text-xl">K</span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden transition-all duration-300 ease-in-out">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">K-Lens</h1>
            <p className="text-xs text-muted-foreground font-medium">Document Intelligence</p>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="group-data-[collapsible=icon]:px-1 mb-6">
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 group-data-[collapsible=icon]:sr-only px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
              {navigationItems.map((item) => (
                <MenuItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only visible to Administrators */}
        {user?.role === 'Administrator' && (
          <SidebarGroup className="group-data-[collapsible=icon]:px-1 mb-6">
            <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 group-data-[collapsible=icon]:sr-only px-2">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
                {adminItems.map((item) => (
                  <MenuItem key={item.url} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Actions Section */}
        <div className="mt-auto">
          {/* Help - positioned logically before sign out */}
          <SidebarGroup className="group-data-[collapsible=icon]:px-1 mb-4">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {supportItems.map((item) => (
                  <MenuItem key={item.url} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Sign Out */}
          <SidebarGroup className="group-data-[collapsible=icon]:px-1">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="group">
                  <SidebarMenuButton 
                    className="h-11 text-muted-foreground hover:text-destructive group-data-[collapsible=icon]:h-11 group-data-[collapsible=icon]:w-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 rounded-xl transition-all duration-300 ease-in-out hover:bg-destructive/10 hover:scale-[1.02] hover:shadow-sm" 
                    onClick={() => logout()}
                    tooltip="Sign Out"
                  >
                    <LogOut className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="group-data-[collapsible=icon]:sr-only font-medium">Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}