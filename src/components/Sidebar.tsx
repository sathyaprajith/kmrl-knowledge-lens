import { Home, Search, FileText, BarChart3, Settings, Shield, Bell, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const navigationItems = [
    { icon: Home, label: "Dashboard", badge: null, active: true },
    { icon: Search, label: "Search", badge: null },
    { icon: FileText, label: "Documents", badge: "124" },
    { icon: BarChart3, label: "Analytics", badge: null },
    { icon: Bell, label: "Alerts", badge: "3" },
  ];

  const adminItems = [
    { icon: Shield, label: "Access Control", badge: null },
    { icon: Settings, label: "Settings", badge: null },
  ];

  const supportItems = [
    { icon: HelpCircle, label: "Help & Support", badge: null },
  ];

  const MenuItem = ({ icon: Icon, label, badge, active = false, onClick }: any) => (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={`w-full justify-start gap-3 h-10 ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <Badge variant={active ? "default" : "secondary"} className="text-xs">
          {badge}
        </Badge>
      )}
    </Button>
  );

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-background border-r`}>
      <div className="flex flex-col h-full p-4">
        {/* Navigation */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-3">
            Navigation
          </h3>
          {navigationItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={item.active}
            />
          ))}
        </div>

        <Separator className="my-6" />

        {/* Admin Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 mb-3">
            Administration
          </h3>
          {adminItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
            />
          ))}
        </div>

        <Separator className="my-6" />

        {/* Support */}
        <div className="space-y-2">
          {supportItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
            />
          ))}
        </div>

        {/* User Section */}
        <div className="mt-auto pt-4">
          <Separator className="mb-4" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;