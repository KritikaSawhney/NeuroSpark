
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-10 glass p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neuro-purple to-neuro-light-purple">
              NeuroSpark
            </h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
