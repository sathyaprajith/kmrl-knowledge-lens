import { Search, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">K</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">K-Lens</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">KMRL Document Intelligence</p>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-2 ml-2">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">Anil Kumar</p>
              <p className="text-xs text-muted-foreground">Operations Manager</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;