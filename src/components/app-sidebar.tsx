import { useState } from "react";
import { Home, Search, FileText, BarChart3, Settings, Shield, Bell, HelpCircle, LogOut } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, badge: null },
  { title: "Search", url: "/search", icon: Search, badge: null },
  { title: "Documents", url: "/documents", icon: FileText, badge: "124" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, badge: null },
  { title: "Alerts", url: "/alerts", icon: Bell, badge: "3" },
];

const adminItems = [
  { title: "Access Control", url: "/access", icon: Shield, badge: null },
  { title: "Settings", url: "/settings", icon: Settings, badge: null },
];

const supportItems = [
  { title: "Help & Support", url: "/help", icon: HelpCircle, badge: null },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "text-muted-foreground hover:text-foreground hover:bg-muted/50";

  const MenuItem = ({ item }: { item: any }) => (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="h-10">
        <NavLink to={item.url} className={getNavCls(item.url)}>
          <item.icon className="h-4 w-4" />
          {!collapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant={isActive(item.url) ? "default" : "secondary"} className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="p-4">
        {/* Brand */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">K</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">K-Lens</h1>
              <p className="text-xs text-muted-foreground">Document Intelligence</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <MenuItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        {/* Admin Section */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Administration
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item) => (
                <MenuItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {supportItems.map((item) => (
                <MenuItem key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto pt-4">
          <Separator className="mb-4" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Sign Out</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}