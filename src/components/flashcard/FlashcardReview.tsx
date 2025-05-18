
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, RotateCw } from "lucide-react";
import { Flashcard } from "@/types/types";
import { FlashcardComponent } from "./FlashcardComponent";
import { ReviewRating } from "@/types/types";
import { ReviewButtons } from "./ReviewButtons";

interface FlashcardReviewProps {
  deckName: string;
  cards: Flashcard[];
  onBack: () => void;
  onCardReview: (cardId: string, rating: ReviewRating) => void;
  onComplete: (stats: { totalCards: number; correctCards: number; timeSpent: number }) => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  deckName,
  cards,
  onBack,
  onCardReview,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Count cards rated "good" or "easy" as correct
  const handleCardReview = (rating: ReviewRating) => {
    if (rating === "good" || rating === "easy") {
      setCorrectCount(prev => prev + 1);
    }
    
    onCardReview(cards[currentIndex].id, rating);
    
    // Animate out current card
    setIsAnimating(true);
    setTimeout(() => {
      setFlipped(false);
      // Move to next card after a short delay
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onComplete({
            totalCards: cards.length,
            correctCards: correctCount + (rating === "good" || rating === "easy" ? 1 : 0),
            timeSpent: Date.now() - startTime,
          });
        }
        setIsAnimating(false);
      }, 300);
    }, 300);
  };

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      if (!flipped && e.key === " ") {
        e.preventDefault();
        setFlipped(true);
      } else if (flipped) {
        if (e.key === "1" || e.key === "a") {
          handleCardReview("again");
        } else if (e.key === "2" || e.key === "h") {
          handleCardReview("hard");
        } else if (e.key === "3" || e.key === "g") {
          handleCardReview("good");
        } else if (e.key === "4" || e.key === "e") {
          handleCardReview("easy");
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipped, currentIndex, isAnimating]);
  
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    return [
      hours,
      minutes % 60,
      seconds % 60
    ].map(unit => String(unit).padStart(2, '0')).join(':');
  };
  
  const progress = ((currentIndex + (flipped ? 0.5 : 0)) / cards.length) * 100;
  
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{deckName}</h2>
            <p className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {cards.length}
            </p>
          </div>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock size={16} className="mr-2" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </header>
      
      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex-1 flex justify-center items-center">
        {cards.length > 0 && (
          <div className={`w-full max-w-2xl ${isAnimating ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
            <FlashcardComponent
              card={cards[currentIndex]}
              flipped={flipped}
              onClick={() => !flipped && setFlipped(true)}
            />
          </div>
        )}
      </div>
      
      <div className="mt-6">
        {!flipped ? (
          <div className="flex justify-center">
            <Button variant="outline" size="lg" onClick={() => setFlipped(true)}>
              Show Answer
              <span className="ml-2 opacity-50">(Space)</span>
            </Button>
          </div>
        ) : (
          <ReviewButtons onReview={handleCardReview} />
        )}
      </div>
    </div>
  );
};
