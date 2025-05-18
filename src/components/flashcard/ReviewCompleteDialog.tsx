
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Clock, BarChart2, RotateCw } from "lucide-react";
import confetti from "@/utils/confetti";

interface ReviewCompleteDialogProps {
  open: boolean;
  onClose: () => void;
  stats: {
    totalCards: number;
    correctCards: number;
    timeSpent: number;
  };
  onReviewAgain: () => void;
  onViewStats: () => void;
}

export const ReviewCompleteDialog: React.FC<ReviewCompleteDialogProps> = ({
  open,
  onClose,
  stats,
  onReviewAgain,
  onViewStats,
}) => {
  const { totalCards, correctCards, timeSpent } = stats;
  const percentage = Math.round((correctCards / totalCards) * 100);
  const isHighScore = percentage >= 80;
  
  React.useEffect(() => {
    if (open && isHighScore) {
      confetti();
    }
  }, [open, isHighScore]);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Review Complete!
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Great job on completing your review session
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {isHighScore ? (
              <Award size={64} className="text-primary animate-pulse" />
            ) : (
              <CheckCircle size={64} className="text-primary" />
            )}
          </div>
          
          <div className="text-3xl font-bold mb-2">{percentage}%</div>
          <p className="text-muted-foreground mb-6">
            You got {correctCards} out of {totalCards} cards correct
          </p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">{formatTime(timeSpent)}</div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <BarChart2 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Cards</div>
              <div className="font-medium">{totalCards}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button variant="outline" onClick={onReviewAgain}>
            <RotateCw size={16} className="mr-2" /> Review Again
          </Button>
          <Button onClick={onViewStats}>
            <BarChart2 size={16} className="mr-2" /> View Stats
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
