import { useState } from "react";
import { Search, Mic, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
}

const SearchInterface = ({ onSearch }: SearchInterfaceProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      onSearch?.(query);
    }, 1500);
  };

  const suggestedQueries = [
    "Latest safety circulars for monsoon preparedness",
    "Pending vendor invoices over 30 days",
    "Maintenance reports for Aluva station",
    "Policy updates from last month"
  ];

  const quickStats = [
    { label: "Open Incidents", value: "12", icon: AlertCircle, color: "text-accent" },
    { label: "Pending Invoices", value: "₹2.4L", icon: FileText, color: "text-primary" },
    { label: "New Documents", value: "24", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Search Bar */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ask about any{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              KMRL document
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Get instant answers from thousands of documents in English or Malayalam
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 p-2 border-2 border-input rounded-xl bg-background shadow-md focus-within:border-primary focus-within:shadow-lg transition-all">
            <Search className="h-5 w-5 text-muted-foreground ml-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about any KMRL document..."
              className="flex-1 px-2 py-3 text-base bg-transparent border-none outline-none placeholder:text-muted-foreground"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="rounded-lg px-6"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Suggested Queries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Popular Searches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedQueries.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 text-left justify-start hover:bg-muted/50"
              onClick={() => {
                setQuery(suggestion);
                setTimeout(() => onSearch?.(suggestion), 100);
              }}
            >
              <Search className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">{suggestion}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="space-y-2">
          {[
            { doc: "Safety Circular SC-2024-15", time: "2 hours ago", type: "Circular" },
            { doc: "Invoice ABC-INF-2024-102", time: "4 hours ago", type: "Invoice" },
            { doc: "Maintenance Report MR-AV-240315", time: "Yesterday", type: "Report" },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{item.doc}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{item.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;