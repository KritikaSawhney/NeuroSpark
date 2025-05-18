
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Apply saved theme color on app load
  useEffect(() => {
    // Apply theme color from localStorage if it exists
    const savedThemeColor = localStorage.getItem("themeColor");
    if (savedThemeColor) {
      // This is a simplified version - the full conversion happens in Settings.tsx
      const setHSLFromHex = (hex: string) => {
        try {
          // Convert hex to rgb
          const r = parseInt(hex.substring(1, 3), 16) / 255;
          const g = parseInt(hex.substring(3, 5), 16) / 255;
          const b = parseInt(hex.substring(5, 7), 16) / 255;
          
          // Find max and min values
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          
          // Calculate lightness
          const l = (max + min) / 2;
          
          // Calculate saturation
          let s = 0;
          if (max !== min) {
            s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
          }
          
          // Calculate hue
          let h = 0;
          if (max !== min) {
            if (max === r) h = (g - b) / (max - min) + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / (max - min) + 2;
            else h = (r - g) / (max - min) + 4;
            h *= 60;
          }
          
          // Set CSS variables
          document.documentElement.style.setProperty('--primary-hue', h.toString());
          document.documentElement.style.setProperty('--primary-saturation', (s * 100) + "%");
          document.documentElement.style.setProperty('--primary-lightness', (l * 100) + "%");
        } catch (e) {
          console.error("Error applying theme color:", e);
        }
      };
      
      setHSLFromHex(savedThemeColor);
    }
    
    // Apply dark mode from localStorage if it exists
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
