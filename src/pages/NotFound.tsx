
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Add floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      const size = Math.random() * 10 + 5;
      const speed = Math.random() * 2 + 1;
      const angle = Math.random() * 360;
      const container = document.getElementById('particle-container');
      
      if (!container) return;
      
      particle.className = 'absolute rounded-full';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `hsla(var(--primary), ${Math.random() * 0.5 + 0.2})`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${speed + 2}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particle.style.transform = `rotate(${angle}deg)`;
      
      // Add float animation
      particle.style.animation = 'float 5s ease-in-out infinite';
      
      container.appendChild(particle);
      
      // Remove particle after some time
      setTimeout(() => {
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, 500);
      }, 5000 + Math.random() * 5000);
    };
    
    const particleInterval = setInterval(createParticle, 300);
    
    return () => {
      clearInterval(particleInterval);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/30 to-background p-4 relative overflow-hidden">
      <div id="particle-container" className="absolute inset-0 overflow-hidden z-0"></div>
      
      <div className="text-center glass rounded-lg p-8 max-w-md animate-float z-10 hover:shadow-xl transition-shadow duration-500">
        <div className="text-8xl font-bold mb-4 text-gradient animate-pulse">404</div>
        <h1 className="text-2xl font-bold mb-4 typing-effect">Oops! This page doesn't exist</h1>
        <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="default"
            className="bg-gradient-to-r from-primary to-primary/70 hover:opacity-90 transition-opacity animate-float"
            onClick={() => navigate("/")}
          >
            <Home size={18} className="mr-2 animate-bounce-subtle" /> Return to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="hover:scale-105 transition-all animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <ArrowLeft size={18} className="mr-2" /> Go Back
          </Button>
        </div>
        
        {/* Add a randomly appearing and disappearing message */}
        <div className="mt-8 text-sm text-primary/70 animate-fade-in" style={{ animationDelay: "1s" }}>
          <p className="animate-pulse">Lost in the digital void? Let's find your way back...</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
