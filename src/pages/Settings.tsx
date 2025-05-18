
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Cog, Save, Star, Sparkles, Bell, Palette, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import triggerConfetti from "@/utils/confetti";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [notifications, setNotifications] = useState(true);
  const [cardAnimations, setCardAnimations] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [sessionLength, setSessionLength] = useState(20);
  const [username, setUsername] = useState("NeuroSpark User");
  const [selectedThemeColor, setSelectedThemeColor] = useState("#9b87f5"); // Default theme color
  
  useEffect(() => {
    // Apply the selected theme color from localStorage on component mount
    const savedThemeColor = localStorage.getItem("themeColor");
    if (savedThemeColor) {
      applyThemeColor(savedThemeColor);
      setSelectedThemeColor(savedThemeColor);
    }
  }, []);

  const applyThemeColor = (color: string) => {
    // Update CSS variables for primary colors
    document.documentElement.style.setProperty('--primary-hue', getHue(color));
    document.documentElement.style.setProperty('--primary-saturation', getSaturation(color) + "%");
    document.documentElement.style.setProperty('--primary-lightness', getLightness(color) + "%");
    
    // Store the color preference
    localStorage.setItem("themeColor", color);
  };

  // Helper functions to extract HSL values from hex
  const getHue = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "260"; // Default hue value
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max === min) {
      h = 0; // achromatic
    } else {
      const d = max - min;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    
    return h.toString();
  };
  
  const getSaturation = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "66"; // Default saturation value
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let s = 0;
    let l = (max + min) / 2;
    
    if (max === min) {
      s = 0; // achromatic
    } else {
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    }
    
    return (s * 100).toString();
  };
  
  const getLightness = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "75"; // Default lightness value
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    return ((max + min) / 2 * 100).toString();
  };
  
  const hexToRgb = (hex: string): {r: number, g: number, b: number} | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const handleThemeColorChange = (color: string) => {
    setSelectedThemeColor(color);
    applyThemeColor(color);
    toast({
      title: "Theme color changed!",
      description: "Your color preference has been updated.",
    });
  };
  
  const handleSaveSettings = () => {
    // Save all settings to localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("cardAnimations", JSON.stringify(cardAnimations));
    localStorage.setItem("showConfetti", JSON.stringify(showConfetti));
    localStorage.setItem("sessionLength", sessionLength.toString());
    localStorage.setItem("username", username);
    localStorage.setItem("themeColor", selectedThemeColor);
    
    // Apply theme color again to ensure it's set
    applyThemeColor(selectedThemeColor);
    
    // Show success toast
    toast({
      title: "Settings saved successfully!",
      description: "Your preferences have been updated.",
    });
    
    if (showConfetti) {
      triggerConfetti();
    }
  };
  
  // Define available theme colors
  const themeColors = [
    "#9b87f5", // neuro-purple
    "#76A9FA", // blue
    "#38b2ac", // teal
    "#f56565", // red
    "#ed8936", // orange
    "#ecc94b", // yellow
  ];
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neuro-purple to-neuro-light-purple">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Customize your NeuroSpark experience
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="hover:scale-105 transition-all"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Cog className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Star className="mr-2 h-4 w-4" />
              Premium
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow duration-500">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your basic app preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="username" className="text-base">Username</Label>
                      <p className="text-sm text-muted-foreground">Your display name in the app</p>
                    </div>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="max-w-xs animate-pulse-subtle"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="session-length" className="text-base">Study Session Length</Label>
                      <p className="text-sm text-muted-foreground">Maximum cards to review in one session</p>
                    </div>
                    <div className="flex items-center space-x-4 max-w-xs w-full">
                      <Slider
                        id="session-length"
                        defaultValue={[sessionLength]}
                        max={50}
                        min={5}
                        step={5}
                        onValueChange={(values) => setSessionLength(values[0])}
                        className="animate-shimmer"
                      />
                      <span className="w-12 text-center">{sessionLength}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="card-animations" className="text-base">Card Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable fancy card transitions</p>
                    </div>
                    <Switch
                      id="card-animations"
                      checked={cardAnimations}
                      onCheckedChange={setCardAnimations}
                      className="animate-bounce-subtle"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="confetti" className="text-base">Celebration Effects</Label>
                      <p className="text-sm text-muted-foreground">Show confetti on achievements</p>
                    </div>
                    <Switch
                      id="confetti"
                      checked={showConfetti}
                      onCheckedChange={setShowConfetti}
                      className="animate-bounce-subtle"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow duration-500">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how NeuroSpark looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="theme-mode" className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                    </div>
                    <Switch
                      id="theme-mode"
                      checked={darkMode}
                      onCheckedChange={(checked) => {
                        document.documentElement.classList.toggle("dark", checked);
                        setDarkMode(checked);
                      }}
                      className="animate-bounce-subtle"
                    />
                  </div>
                  
                  <div className="pt-6">
                    <h3 className="mb-4 text-base font-medium">Theme Colors</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {themeColors.map((color) => (
                        <button
                          key={color}
                          className={`w-full h-12 rounded-md transition-all hover:scale-110 border-4 ${color === selectedThemeColor ? 'border-white dark:border-gray-200 shadow-lg animate-pulse' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleThemeColorChange(color)}
                          aria-label={`Select ${color} theme`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow duration-500">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how NeuroSpark notifies you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders to study</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      className="animate-bounce-subtle"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Label htmlFor="reminder-time" className="text-base mb-2 block">Daily Reminder Time</Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      defaultValue="18:00"
                      className="max-w-xs animate-pulse-subtle"
                      disabled={!notifications}
                    />
                    <p className="text-sm text-muted-foreground mt-1">When to remind you about due cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <Sparkles className="h-24 w-24 text-yellow-400 opacity-20 animate-pulse" />
              </div>
              <CardHeader>
                <CardTitle>Premium Features</CardTitle>
                <CardDescription>
                  Unlock advanced features with NeuroSpark Premium
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold flex items-center mb-2">
                      <DollarSign className="h-5 w-5 mr-2 text-primary animate-pulse" />
                      NeuroSpark Premium
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start animate-fade-in" style={{ animationDelay: "0.1s" }}>
                        <Star className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
                        <span>Unlimited flashcard decks</span>
                      </li>
                      <li className="flex items-start animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        <Star className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
                        <span>Advanced analytics and insights</span>
                      </li>
                      <li className="flex items-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
                        <Star className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
                        <span>Cloud synchronization across devices</span>
                      </li>
                      <li className="flex items-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
                        <Star className="h-5 w-5 mr-2 text-yellow-500 shrink-0 mt-0.5 animate-pulse" />
                        <span>Custom card templates and themes</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-4 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 transition-opacity animate-shimmer">
                      Upgrade to Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            className="px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity animate-pulse hover:animate-none"
          >
            <Save className="mr-2 h-5 w-5 animate-bounce-subtle" /> Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
