import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Settings, Bell, Palette, Globe, Save, Edit, MapPin, Leaf } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
  crops: string;
  preferredLanguage: string;
  avatar?: string;
  joinedDate: Date;
  totalQueries: number;
  helpfulVotes: number;
}

interface ProfileProps {
  user?: UserProfile;
  onSave?: (updatedProfile: Partial<UserProfile>) => void;
  onSignOut?: () => void;
}

export default function Profile({ 
  user = {
    // todo: remove mock functionality
    id: '1',
    name: 'രാജു കുമാർ',
    mobile: '+91 9876543210',
    email: 'raju.kumar@email.com',
    location: 'തിരുവനന്തപുരം, കേരളം',
    crops: 'നെല്ല്, തെങ്ങ്, കുരുമുളക്, ഏലക്ക',
    preferredLanguage: 'malayalam',
    joinedDate: new Date('2023-08-15'),
    totalQueries: 45,
    helpfulVotes: 128
  },
  onSave = (profile) => console.log('Profile saved:', profile),
  onSignOut = () => console.log('Sign out clicked')
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const themeOptions = [
    { value: 'light', label: 'Light', description: 'Clean and bright' },
    { value: 'dark', label: 'Dark', description: 'Easy on the eyes' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2" data-testid="tab-settings">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2" data-testid="tab-notifications">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold" data-testid="text-username">{user.name}</h2>
                      <Badge variant="secondary" className="gap-1">
                        <Leaf className="h-3 w-3" />
                        Farmer
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="font-medium">{user.totalQueries}</span>
                        <span className="text-muted-foreground ml-1">Questions Asked</span>
                      </div>
                      <div>
                        <span className="font-medium">{user.helpfulVotes}</span>
                        <span className="text-muted-foreground ml-1">Helpful Votes</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Joined </span>
                        <span className="font-medium">{user.joinedDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                    data-testid="button-edit-profile"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and farming information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      data-testid="input-name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      disabled={!isEditing}
                      data-testid="input-mobile"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      data-testid="input-email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      data-testid="input-location"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="crops">Primary Crops</Label>
                  <Textarea
                    id="crops"
                    value={formData.crops}
                    onChange={(e) => handleInputChange('crops', e.target.value)}
                    disabled={!isEditing}
                    data-testid="textarea-crops"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select 
                    value={formData.preferredLanguage} 
                    onValueChange={(value) => handleInputChange('preferredLanguage', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="gap-2" data-testid="button-save">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the app's look and feel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {themeOptions.map((option) => (
                      <Card 
                        key={option.value}
                        className={`cursor-pointer transition-all hover-elevate ${
                          theme === option.value ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setTheme(option.value as any)}
                        data-testid={`card-theme-${option.value}`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Settings
                </CardTitle>
                <CardDescription>
                  Set your preferred language for AI responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="ai-language">AI Response Language</Label>
                  <Select value={formData.preferredLanguage} onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
                    <SelectTrigger data-testid="select-ai-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" onClick={onSignOut} data-testid="button-sign-out">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weather Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about weather conditions affecting your crops
                    </p>
                  </div>
                  <Switch data-testid="switch-weather" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Seasonal Farming Tips</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive seasonal advice and reminders for your crops
                    </p>
                  </div>
                  <Switch defaultChecked data-testid="switch-tips" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>New Advisory Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Get updates when new advisory content is published
                    </p>
                  </div>
                  <Switch defaultChecked data-testid="switch-content" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Query Response Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Reminders to check responses to your questions
                    </p>
                  </div>
                  <Switch defaultChecked data-testid="switch-reminders" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}