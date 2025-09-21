import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Redirect } from "wouter";

interface AuthFormProps {
  mode?: 'signin' | 'signup';
}

export default function AuthForm({ 
  mode = 'signin'
}: AuthFormProps) {
  const [location, setLocation] = useLocation();
  const { loginMutation, registerMutation, user } = useAuth();
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    mobile: '',
    email: '',
    location: '',
    crops: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'malayalam'
  });

  // If user is authenticated, redirect to query interface
  if (user) {
    return <Redirect to="/query" />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentMode === 'signin') {
      loginMutation.mutate({
        username: formData.username || formData.email,
        password: formData.password
      });
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      registerMutation.mutate({
        name: formData.name,
        username: formData.username || formData.email,
        email: formData.email,
        mobile: formData.mobile,
        location: formData.location,
        crops: formData.crops,
        password: formData.password,
        preferredLanguage: formData.preferredLanguage
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl mx-auto mb-4">
            <Leaf className="h-10 w-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {currentMode === 'signin' ? 'Sign In' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {currentMode === 'signin' 
              ? 'Welcome back to FarmerAssist' 
              : 'Join the Kerala farming community'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentMode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    data-testid="input-name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    data-testid="input-username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    data-testid="input-mobile"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="District, Kerala"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    data-testid="input-location"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crops">Primary Crops</Label>
                  <Textarea
                    id="crops"
                    placeholder="Rice, coconut, spices..."
                    value={formData.crops}
                    onChange={(e) => handleInputChange('crops', e.target.value)}
                    data-testid="input-crops"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select 
                    value={formData.preferredLanguage} 
                    onValueChange={(value) => handleInputChange('preferredLanguage', value)}
                  >
                    <SelectTrigger data-testid="select-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentMode === 'signin' && (
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  data-testid="input-username"
                  required
                />
              </div>
            )}

            {currentMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  data-testid="input-email"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  data-testid="input-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {currentMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  data-testid="input-confirm-password"
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending || registerMutation.isPending}
              data-testid="button-submit"
            >
              {loginMutation.isPending || registerMutation.isPending 
                ? 'Please wait...' 
                : (currentMode === 'signin' ? 'Sign In' : 'Create Account')
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {currentMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="ghost"
                className="p-0 ml-1 h-auto"
                onClick={() => setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin')}
                data-testid="button-mode-switch"
              >
                {currentMode === 'signin' ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}