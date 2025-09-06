import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
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
  );
};

export default Header;