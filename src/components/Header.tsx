import { Bell, User, LogOut, UserPlus, Settings, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  let theme, setTheme, isDark;
  
  try {
    ({ theme, setTheme, isDark } = useTheme());
  } catch (error) {
    // Fallback if ThemeProvider is not available
    theme = 'light';
    setTheme = () => {};
    isDark = false;
  }
  
  const displayName = user?.name ?? user?.email ?? 'Guest User';
  const department = user?.role ?? 'Guest';
  const navigate = useNavigate();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/alerts')} title="Open alerts" aria-label="Open alerts">
        <Bell className="h-4 w-4" />
        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          3
        </Badge>
      </Button>

      {/* Dark Mode Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" title="Toggle theme" aria-label="Toggle theme">
            {getThemeIcon()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Light
            {theme === 'light' && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Dark
            {theme === 'dark' && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            System
            {theme === 'system' && <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="flex items-center gap-2 ml-2">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{department}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{department}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/signin')}>
              <UserPlus className="mr-2 h-4 w-4" />
              Switch User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;