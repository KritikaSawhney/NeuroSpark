
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Award, BarChart2 } from "lucide-react";
import { DeckCard } from "@/components/deck/DeckCard";
import { DeckForm } from "@/components/deck/DeckForm";
import { DeckView } from "@/components/deck/DeckView";
import { FlashcardReview } from "@/components/flashcard/FlashcardReview";
import { ReviewCompleteDialog } from "@/components/flashcard/ReviewCompleteDialog";
import { StatsOverview } from "@/components/stats/StatsOverview";
import { Deck, Flashcard, ReviewRating } from "@/types/types";
import { getAllDecks, getDeckById, saveDeck, updateDeck, deleteDeck, addCardToDeck, updateCardInDeck, deleteCardFromDeck, getUserStats, recordStudySession } from "@/utils/localStorage";
import { getDueCards, calculateNextReview } from "@/utils/srsAlgorithm";
import { initializeWithMockData } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import triggerConfetti from "@/utils/confetti";

const Index: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [view, setView] = useState<"decks" | "deck" | "study">("decks");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [showDeckForm, setShowDeckForm] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [reviewStats, setReviewStats] = useState({ totalCards: 0, correctCards: 0, timeSpent: 0 });
  const [userStats, setUserStats] = useState(getUserStats());
  
  // Add cursor trail effect
  useEffect(() => {
    const createTrailDot = (e: MouseEvent) => {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      document.body.appendChild(dot);
      
      // Remove dot after animation completes
      setTimeout(() => {
        dot.remove();
      }, 800);
    };
    
    window.addEventListener('mousemove', createTrailDot);
    
    return () => {
      window.removeEventListener('mousemove', createTrailDot);
    };
  }, []);
  
  // Load data on initial render
  useEffect(() => {
    initializeWithMockData();
    loadDecks();
    
    // Add entrance animation class to body
    document.body.classList.add('animate-fade-in');
    
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);
  
  const loadDecks = () => {
    setDecks(getAllDecks());
    setUserStats(getUserStats());
  };
  
  // Handlers for deck management
  const handleCreateDeck = (deckData: Omit<Deck, "id" | "createdAt" | "cards">) => {
    const newDeck = saveDeck({
      ...deckData,
      cards: [] // Add empty cards array to fix TypeScript error
    });
    setDecks([...decks, newDeck]);
    toast({
      title: "Deck Created",
      description: `"${newDeck.name}" has been created successfully.`,
    });
    triggerConfetti();
  };
  
  const handleEditDeck = (deckData: Omit<Deck, "id" | "createdAt" | "cards">) => {
    if (editingDeck) {
      const updatedDeck = updateDeck({
        ...editingDeck,
        name: deckData.name,
        description: deckData.description,
        tags: deckData.tags,
        theme: deckData.theme
      });
      
      setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
      setEditingDeck(null);
      
      // Update active deck if that's the one being edited
      if (activeDeck && activeDeck.id === updatedDeck.id) {
        setActiveDeck(updatedDeck);
      }
      
      toast({
        title: "Deck Updated",
        description: `"${updatedDeck.name}" has been updated successfully.`,
      });
    }
  };
  
  const handleDeleteDeck = (deckId: string) => {
    const deckToDelete = decks.find(d => d.id === deckId);
    if (deckToDelete) {
      deleteDeck(deckId);
      setDecks(decks.filter(deck => deck.id !== deckId));
      toast({
        title: "Deck Deleted",
        description: `"${deckToDelete.name}" has been deleted.`,
        variant: "destructive"
      });
    }
  };
  
  // Handlers for deck view
  const handleOpenDeck = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setActiveDeck(deck);
      setView("deck");
    }
  };
  
  const handleAddCard = (cardData: Pick<Flashcard, "question" | "answer" | "tags">) => {
    if (activeDeck) {
      const newCard = addCardToDeck(activeDeck.id, cardData);
      if (newCard) {
        const updatedDeck = getDeckById(activeDeck.id);
        if (updatedDeck) {
          setActiveDeck(updatedDeck);
          setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
          toast({
            title: "Card Added",
            description: "New flashcard has been added to the deck.",
          });
        }
      }
    }
  };
  
  const handleEditCard = (updatedCard: Flashcard) => {
    if (activeDeck) {
      const result = updateCardInDeck(activeDeck.id, updatedCard);
      if (result) {
        const updatedDeck = getDeckById(activeDeck.id);
        if (updatedDeck) {
          setActiveDeck(updatedDeck);
          setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
          toast({
            title: "Card Updated",
            description: "Flashcard has been updated successfully.",
          });
        }
      }
    }
  };
  
  const handleDeleteCard = (cardId: string) => {
    if (activeDeck) {
      const result = deleteCardFromDeck(activeDeck.id, cardId);
      if (result) {
        const updatedDeck = getDeckById(activeDeck.id);
        if (updatedDeck) {
          setActiveDeck(updatedDeck);
          setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
          toast({
            title: "Card Deleted",
            description: "Flashcard has been removed from the deck.",
            variant: "destructive"
          });
        }
      }
    }
  };
  
  // Handlers for study mode
  const handleStartStudy = () => {
    if (activeDeck) {
      const dueCards = getDueCards(activeDeck.cards);
      
      if (dueCards.length === 0) {
        toast({
          title: "No Cards Due",
          description: "There are no cards due for review in this deck.",
        });
        return;
      }
      
      // Shuffle the cards
      const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
      setStudyCards(shuffled);
      setView("study");
    }
  };
  
  const handleCardReview = (cardId: string, rating: ReviewRating) => {
    if (!activeDeck) return;
    
    // Find the card in the deck
    const cardIndex = activeDeck.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;
    
    // Calculate new review intervals
    const updatedCard = calculateNextReview(activeDeck.cards[cardIndex], rating);
    
    // Update card in the deck
    const updatedDeck = {
      ...activeDeck,
      cards: [
        ...activeDeck.cards.slice(0, cardIndex),
        updatedCard,
        ...activeDeck.cards.slice(cardIndex + 1)
      ],
      lastStudied: Date.now()
    };
    
    updateDeck(updatedDeck);
    setActiveDeck(updatedDeck);
    setDecks(decks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
  };
  
  const handleReviewComplete = (stats: { totalCards: number; correctCards: number; timeSpent: number }) => {
    setReviewStats(stats);
    setShowCompleteDialog(true);
    
    // Record this study session
    if (activeDeck) {
      recordStudySession({
        deckId: activeDeck.id,
        startTime: Date.now() - stats.timeSpent,
        endTime: Date.now(),
        cardsReviewed: stats.totalCards,
        cardsCorrect: stats.correctCards
      });
      
      setUserStats(getUserStats());
      
      // Trigger a celebration animation for completing a review session
      if (stats.correctCards / stats.totalCards >= 0.8) {
        triggerConfetti();
      }
    }
  };
  
  // Get a personalized suggestion based on user's decks
  const getSuggestion = () => {
    if (decks.length === 0) {
      return { message: "Create your first deck to start learning!" };
    }
    
    const now = Date.now();
    
    // Find decks with cards due for review
    const decksWithDueCards = decks
      .map(deck => ({
        deck,
        dueCount: deck.cards.filter(card => !card.nextReview || card.nextReview <= now).length
      }))
      .filter(item => item.dueCount > 0)
      .sort((a, b) => b.dueCount - a.dueCount);
    
    if (decksWithDueCards.length > 0) {
      const top = decksWithDueCards[0];
      return {
        message: `You have ${top.dueCount} cards due in "${top.deck.name}"`,
        deckId: top.deck.id,
        deckName: top.deck.name,
        count: top.dueCount
      };
    }
    
    // Find the deck that hasn't been studied in a long time
    const oldestStudiedDeck = decks
      .filter(deck => deck.cards.length > 0)
      .sort((a, b) => {
        const aTime = a.lastStudied || 0;
        const bTime = b.lastStudied || 0;
        return aTime - bTime;
      })[0];
    
    if (oldestStudiedDeck) {
      const message = oldestStudiedDeck.lastStudied
        ? `It's been a while since you studied "${oldestStudiedDeck.name}". Ready for a review?`
        : `You haven't studied "${oldestStudiedDeck.name}" yet. Ready to start?`;
      
      return {
        message,
        deckId: oldestStudiedDeck.id,
        deckName: oldestStudiedDeck.name
      };
    }
    
    return { message: "Create some flashcards to start learning!" };
  };
  
  const renderContent = () => {
    switch (view) {
      case "decks":
        const suggestion = getSuggestion();
        
        return (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gradient animate-pulse">My Decks</h1>
                <p className="text-muted-foreground mt-1 typing-effect">
                  Manage and study your flashcard decks
                </p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/stats")}
                  className="hover:scale-105 transition-all"
                >
                  <BarChart2 size={18} className="mr-2 animate-bounce-subtle" /> Stats
                </Button>
                <Button 
                  onClick={() => setShowDeckForm(true)}
                  className="hover:scale-105 transition-all bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                >
                  <Plus size={18} className="mr-2 animate-bounce-subtle" /> New Deck
                </Button>
              </div>
            </div>
            
            {userStats.streakDays > 0 && (
              <div className="glass rounded-lg p-4 mb-8 flex items-center animate-scale-in hover:scale-105 transition-transform duration-300 card-shine">
                <Award className="h-10 w-10 text-primary mr-4 animate-badge-pulse" />
                <div>
                  <h3 className="font-semibold">
                    {userStats.streakDays} Day{userStats.streakDays !== 1 ? 's' : ''} Streak!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Keep it up to build your knowledge!
                  </p>
                </div>
              </div>
            )}
            
            <div className="glass rounded-lg p-4 mb-8 hover:shadow-lg transition-all duration-300 animate-float">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Suggested Now</h3>
                  <p className="text-muted-foreground">{suggestion.message}</p>
                </div>
                {suggestion.deckId && (
                  <Button 
                    variant="secondary" 
                    onClick={() => handleOpenDeck(suggestion.deckId)}
                    className="hover:scale-105 transition-transform duration-300 animate-pulse"
                  >
                    <BookOpen size={16} className="mr-2 animate-bounce-subtle" /> Study Now
                  </Button>
                )}
              </div>
            </div>
            
            {decks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map((deck, index) => (
                  <div 
                    key={deck.id}
                    className="animate-fade-in deck-card-wrapper"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <DeckCard 
                      deck={deck} 
                      onStudy={handleOpenDeck} 
                      onEdit={() => {
                        setEditingDeck(deck);
                        setShowDeckForm(true);
                      }} 
                      onDelete={handleDeleteDeck}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed rounded-lg animate-pulse">
                <h3 className="text-xl font-medium mb-2">No Decks Created Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first flashcard deck to start learning
                </p>
                <Button 
                  onClick={() => setShowDeckForm(true)}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
                >
                  <Plus size={18} className="mr-2" /> Create Deck
                </Button>
              </div>
            )}
            
            <DeckForm 
              open={showDeckForm}
              onClose={() => {
                setShowDeckForm(false);
                setEditingDeck(null);
              }}
              onSave={editingDeck ? handleEditDeck : handleCreateDeck}
              initialData={editingDeck || undefined}
            />
          </div>
        );
        
      case "deck":
        if (!activeDeck) {
          return null;
        }
        return (
          <DeckView 
            deck={activeDeck}
            onBack={() => {
              setView("decks");
              setActiveDeck(null);
              loadDecks();
            }}
            onStudy={handleStartStudy}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDeleteCard={handleDeleteCard}
          />
        );
        
      case "study":
        if (!activeDeck) {
          return null;
        }
        return (
          <FlashcardReview
            deckName={activeDeck.name}
            cards={studyCards}
            onBack={() => {
              setView("deck");
              setStudyCards([]);
            }}
            onCardReview={handleCardReview}
            onComplete={handleReviewComplete}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      {renderContent()}
      
      <ReviewCompleteDialog
        open={showCompleteDialog}
        onClose={() => setShowCompleteDialog(false)}
        stats={reviewStats}
        onReviewAgain={() => {
          setShowCompleteDialog(false);
          handleStartStudy();
        }}
        onViewStats={() => {
          setShowCompleteDialog(false);
          navigate("/stats");
        }}
      />
    </MainLayout>
  );
};

export default Index;
