
import React, { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { getUserStats } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";
import { Trophy, Sparkles } from "lucide-react";

const Stats: React.FC = () => {
  const navigate = useNavigate();
  const userStats = getUserStats();
  
  useEffect(() => {
    // Add floating sparkles
    const createSparkle = () => {
      const sparkle = document.createElement('div');
      const container = document.getElementById('stats-container');
      
      if (!container) return;
      
      const size = Math.random() * 6 + 3;
      const top = Math.random() * container.offsetHeight;
      const left = Math.random() * container.offsetWidth;
      
      sparkle.className = 'absolute rounded-full animate-pulse';
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.backgroundColor = `hsla(var(--primary), ${Math.random() * 0.7 + 0.3})`;
      sparkle.style.top = `${top}px`;
      sparkle.style.left = `${left}px`;
      sparkle.style.opacity = '0';
      sparkle.style.boxShadow = `0 0 ${size + 2}px hsla(var(--primary), 0.8)`;
      sparkle.style.transition = 'all 0.5s ease-out';
      
      container.appendChild(sparkle);
      
      // Animate the sparkle
      setTimeout(() => {
        sparkle.style.opacity = '1';
        
        setTimeout(() => {
          sparkle.style.opacity = '0';
          sparkle.style.transform = 'translateY(-20px)';
          
          setTimeout(() => {
            sparkle.remove();
          }, 500);
        }, 1000 + Math.random() * 1000);
      }, 10);
    };
    
    const interval = setInterval(createSparkle, 300);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return (
    <MainLayout>
      <div id="stats-container" className="animate-fade-in relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 animate-pulse">My Stats</h1>
            <p className="text-muted-foreground mt-1 typing-effect">
              Track your learning progress and performance
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="hover:scale-105 transition-all"
          >
            Back to Decks
          </Button>
        </div>
        
        {userStats.totalReviews > 0 && (
          <div className="glass rounded-lg p-4 mb-8 animate-float card-shine">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <Trophy className="h-10 w-10 text-yellow-500 mr-2 animate-badge-pulse" />
                <div>
                  <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
                  <p className="text-sm">You've completed {userStats.totalReviews} card reviews</p>
                </div>
              </div>
              <Button 
                variant="secondary"
                className="animate-shimmer bg-gradient-to-r from-primary/20 to-primary/10"
              >
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                View All Achievements
              </Button>
            </div>
          </div>
        )}
        
        <StatsOverview stats={userStats} />
        
        <div className="mt-8 flex items-center justify-center">
          <div className="text-center p-6 glass rounded-lg max-w-lg animate-fade-in hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-xl mb-2 text-gradient">Memory Tip of the Day</h3>
            <p className="text-muted-foreground">
              Studies show that reviewing material just before you go to sleep can improve retention by up to 30%. Try a quick review session before bedtime!
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Stats;
