import { useState } from "react";
import { 
  Heart,
  Smile,
  Zap,
  Coffee,
  Brain,
  TrendingDown,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Target,
  Award,
  Shield,
  User,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header";

const WellnessPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <h2 className="text-xl font-semibold">Employee Wellness Impact</h2>
              </div>
              <Header />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <WellnessContent />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const WellnessContent = () => {
  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/5 via-purple-600/5 to-indigo-600/5 rounded-3xl"></div>
        <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Employee Wellness Impact
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                    How K-Lens transforms employee well-being and productivity
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-pink-200/50 dark:border-pink-700/50">
                <p className="text-sm font-semibold text-center bg-gradient-to-r from-pink-700 to-purple-700 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
                  ✨ Reducing Stress • Boosting Productivity • Improving Work-Life Balance ✨
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">+47%</div>
                  <div className="text-xs text-green-600 dark:text-green-500">Overall Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Wellness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Time Saved */}
        <div className="group/metric relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
          <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 p-8 rounded-2xl shadow-xl group-hover/metric:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">3.2hrs</p>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1 justify-end">
                  <ArrowUp className="h-4 w-4" />
                  Daily saved
                </p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Time Saved</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Per employee per day on document searches</p>
            <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </Card>
        </div>

        {/* Stress Reduction */}
        <div className="group/metric relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
          <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 p-8 rounded-2xl shadow-xl group-hover/metric:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Smile className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">68%</p>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1 justify-end">
                  <TrendingDown className="h-4 w-4" />
                  Reduced
                </p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Stress Levels</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reduction in document search frustration</p>
            <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </Card>
        </div>

        {/* Energy Boost */}
        <div className="group/metric relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
          <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 p-8 rounded-2xl shadow-xl group-hover/metric:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">+85%</p>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1 justify-end">
                  <ArrowUp className="h-4 w-4" />
                  Increased
                </p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Energy Levels</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Improved focus and mental clarity</p>
            <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </Card>
        </div>

        {/* Work-Life Balance */}
        <div className="group/metric relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity"></div>
          <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 p-8 rounded-2xl shadow-xl group-hover/metric:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">9.2/10</p>
                <p className="text-sm text-green-600 font-medium flex items-center gap-1 justify-end">
                  <ArrowUp className="h-4 w-4" />
                  Rating
                </p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Work-Life Balance</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Employee satisfaction score</p>
            <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </Card>
        </div>
      </div>

      {/* Wellness Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
          <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Mental Health Improvement</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={[
                  { month: 'Jan', before: 6.2, after: 7.8 },
                  { month: 'Feb', before: 6.1, after: 8.2 },
                  { month: 'Mar', before: 5.9, after: 8.7 },
                  { month: 'Apr', before: 6.0, after: 9.1 },
                  { month: 'May', before: 5.8, after: 9.3 },
                  { month: 'Jun', before: 6.3, after: 9.5 }
                ]}>
                  <defs>
                    <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[5, 10]} stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' 
                    }} 
                    formatter={(value, name) => [
                      `${value}/10`, 
                      name === 'before' ? 'Before K-Lens' : 'After K-Lens'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="before" 
                    stroke="#ef4444" 
                    strokeWidth={2} 
                    fill="url(#colorBefore)" 
                    name="before"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="after" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fill="url(#colorAfter)" 
                    name="after"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
          <Card className="relative bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Productivity Impact</h3>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { metric: 'Focus Time', improvement: 92 },
                  { metric: 'Task Completion', improvement: 78 },
                  { metric: 'Job Satisfaction', improvement: 85 },
                  { metric: 'Team Collaboration', improvement: 71 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)' 
                    }} 
                    formatter={(value) => [`+${value}%`, 'Improvement']}
                  />
                  <Bar dataKey="improvement" fill="url(#gradientProductivity)" radius={[8,8,0,0]} />
                  <defs>
                    <linearGradient id="gradientProductivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981"/>
                      <stop offset="100%" stopColor="#059669"/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Employee Testimonials */}
      <Card className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Testimonials</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="group/testimonial relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl opacity-0 group-hover/testimonial:opacity-100 transition-opacity"></div>
            <Card className="relative bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl group-hover/testimonial:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Sarah M.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">HR Manager</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                "K-Lens saved me 4 hours daily! No more digging through files. I can focus on meaningful work and leave office on time. My stress levels have dropped significantly."
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-4 w-4 text-pink-500 fill-current" />
                ))}
              </div>
            </Card>
          </div>

          <div className="group/testimonial relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl opacity-0 group-hover/testimonial:opacity-100 transition-opacity"></div>
            <Card className="relative bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl group-hover/testimonial:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Raj K.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">IT Specialist</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                "My stress levels dropped dramatically. Finding system docs is instant now. More time for innovation and less frustration! Work feels enjoyable again."
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-4 w-4 text-pink-500 fill-current" />
                ))}
              </div>
            </Card>
          </div>

          <div className="group/testimonial relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl opacity-0 group-hover/testimonial:opacity-100 transition-opacity"></div>
            <Card className="relative bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl group-hover/testimonial:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Priya S.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Finance Analyst</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                "Work-life balance improved significantly. Quick document access means I finish tasks faster and have quality family time. Best workplace improvement ever!"
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-4 w-4 text-pink-500 fill-current" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Overall Impact Summary */}
      <Card className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border border-green-200/50 dark:border-green-700/50 shadow-xl rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-900 dark:text-green-100">Overall Wellness Impact</h3>
              <p className="text-lg text-green-700 dark:text-green-300">K-Lens transforms the entire employee experience</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-green-900 dark:text-green-100">96%</p>
            <p className="text-lg text-green-700 dark:text-green-300">Would recommend K-Lens</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WellnessPage;
