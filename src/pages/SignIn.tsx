import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { Eye, EyeOff, Lock, Mail, Shield, Users, Briefcase, HelpCircle, UserPlus, CheckCircle, Clock, XCircle, AlertTriangle, Scale, Cog, Wrench } from 'lucide-react';
import { userRegistrationService } from '@/services/userRegistrationService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Demo accounts for easy access
  const demoAccounts = [
    { email: 'admin@kmrl.co.in', password: 'admin123', role: 'Administrator', icon: Shield, color: 'bg-red-500' },
    { email: 'safety@kmrl.co.in', password: 'safety123', role: 'Safety', icon: AlertTriangle, color: 'bg-orange-500' },
    { email: 'legal@kmrl.co.in', password: 'legal123', role: 'Legal', icon: Scale, color: 'bg-indigo-500' },
    { email: 'hr@kmrl.co.in', password: 'hr123', role: 'Human Resources', icon: HelpCircle, color: 'bg-purple-500' },
    { email: 'finance@kmrl.co.in', password: 'finance123', role: 'Finance', icon: Briefcase, color: 'bg-green-500' },
    { email: 'operations@kmrl.co.in', password: 'operations123', role: 'Operations', icon: Cog, color: 'bg-cyan-500' },
    { email: 'it@kmrl.co.in', password: 'it123', role: 'IT Support', icon: Users, color: 'bg-blue-500' },
    { email: 'maintenance@kmrl.co.in', password: 'maintenance123', role: 'Maintenance', icon: Wrench, color: 'bg-yellow-600' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    if (isSignUp) {
      // Handle signup
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      if (!username.trim()) {
        setError('Username is required.');
        setIsLoading(false);
        return;
      }

      try {
        const result = await userRegistrationService.submitRegistration({
          username: username.trim(),
          email: email.trim(),
          password: password
        });

        setIsLoading(false);

        if (result.success) {
          setSuccess(result.message);
          // Clear form
          setUsername('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(result.message);
        }
      } catch (error) {
        setIsLoading(false);
        setError('Registration failed. Please try again.');
      }
    } else {
      // Handle signin
      // Check if user is trying to login with a registered account
      const userStatus = userRegistrationService.getUserStatus(email);
      
      if (userStatus.status === 'pending') {
        setError('Your account is pending admin approval. Please wait for approval before attempting to login.');
        setIsLoading(false);
        return;
      } else if (userStatus.status === 'rejected') {
        setError('Your account registration was rejected. Please contact support for assistance.');
        setIsLoading(false);
        return;
      }
      
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ok = await login(email, password);
      setIsLoading(false);
      
      if (ok) {
        navigate('/');
      } else {
        setError('Invalid email or password. Please try again or use one of the demo accounts below.');
      }
    }
  };

  const quickLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ok = await login(demoEmail, demoPassword);
    setIsLoading(false);
    
    if (ok) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl space-y-4 sm:space-y-6">
        
        {/* Logo and Header Section */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white">K</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-2 sm:px-0">
              {isSignUp ? 'Request access to K-Lens platform' : 'Sign in to your K-Lens account'}
            </p>
          </div>
        </div>

        {/* Main Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl text-center text-slate-900 dark:text-white">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center text-slate-600 dark:text-slate-400 text-sm sm:text-base px-2 sm:px-0">
              {isSignUp 
                ? 'Create your account and request admin approval' 
                : 'Enter your credentials to access the platform'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={submit} className="space-y-3 sm:space-y-4">
              {/* Username Field (only for signup) */}
              {isSignUp && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Username
                  </Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="username" 
                      type="text"
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="pl-10 h-10 sm:h-11 text-sm sm:text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-10 sm:h-11 text-sm sm:text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (only for signup) */}
              {isSignUp && (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 sm:top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
                      required={isSignUp}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 sm:top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-400 text-sm">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Sign In/Up Button */}
              <Button 
                type="submit" 
                className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="text-sm sm:text-base">
                      {isSignUp ? 'Creating Account...' : 'Signing in...'}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </span>
                )}
              </Button>
            </form>

            {/* Toggle Sign In/Sign Up */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                  setUsername('');
                  setConfirmPassword('');
                }}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>

            {/* Demo Accounts - only show for sign in */}
            {!isSignUp && (
              <>
                {/* Divider */}
                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="bg-white dark:bg-slate-800 px-3 sm:px-4 text-slate-500 dark:text-slate-400">
                      Or try a demo account
                    </span>
                  </div>
                </div>

                {/* Demo Accounts */}
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center">
                    Quick access with demo accounts:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-2">
                    {demoAccounts.map((account, index) => (
                      <button
                        key={index}
                        onClick={() => quickLogin(account.email, account.password)}
                        disabled={isLoading}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 text-left w-full min-h-[60px] sm:min-h-[auto]"
                      >
                        <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full ${account.color} flex items-center justify-center flex-shrink-0`}>
                          <account.icon className="h-4 w-4 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white truncate">
                            {account.role}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Demo Account
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Sign Up Information */}
            {isSignUp && (
              <div className="space-y-2 sm:space-y-3">
                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100">
                        Account Approval Process
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-200 mt-1 leading-relaxed">
                        Your account will need admin approval before you can access the platform. 
                        You'll receive an email notification once approved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center px-4">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            © 2025 K-Lens Document Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
