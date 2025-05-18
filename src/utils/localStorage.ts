
import { Deck, Flashcard, StudySession, UserStats } from "@/types/types";
import { v4 as uuidv4 } from "@/utils/uuid";

// Local storage keys
const DECKS_KEY = "neurospark_decks";
const USER_STATS_KEY = "neurospark_user_stats";

// Get all decks
export const getAllDecks = (): Deck[] => {
  const decksJson = localStorage.getItem(DECKS_KEY);
  return decksJson ? JSON.parse(decksJson) : [];
};

// Get a single deck by ID
export const getDeckById = (id: string): Deck | undefined => {
  const decks = getAllDecks();
  return decks.find((deck) => deck.id === id);
};

// Save a new deck
export const saveDeck = (deck: Omit<Deck, "id" | "createdAt">): Deck => {
  const decks = getAllDecks();
  const newDeck: Deck = {
    ...deck,
    id: uuidv4(),
    createdAt: Date.now(),
  };
  
  localStorage.setItem(DECKS_KEY, JSON.stringify([...decks, newDeck]));
  return newDeck;
};

// Update an existing deck
export const updateDeck = (updatedDeck: Deck): Deck => {
  const decks = getAllDecks();
  const updatedDecks = decks.map((deck) =>
    deck.id === updatedDeck.id ? updatedDeck : deck
  );
  
  localStorage.setItem(DECKS_KEY, JSON.stringify(updatedDecks));
  return updatedDeck;
};

// Delete a deck
export const deleteDeck = (id: string): void => {
  const decks = getAllDecks();
  const updatedDecks = decks.filter((deck) => deck.id !== id);
  localStorage.setItem(DECKS_KEY, JSON.stringify(updatedDecks));
};

// Add a flashcard to a deck
export const addCardToDeck = (
  deckId: string,
  card: Omit<Flashcard, "id" | "lastReviewed" | "nextReview" | "repetitions" | "easeFactor" | "interval">
): Flashcard | null => {
  const deck = getDeckById(deckId);
  if (!deck) return null;
  
  const newCard: Flashcard = {
    ...card,
    id: uuidv4(),
    lastReviewed: null,
    nextReview: null,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 1,
  };
  
  deck.cards.push(newCard);
  updateDeck(deck);
  
  return newCard;
};

// Update a flashcard in a deck
export const updateCardInDeck = (deckId: string, updatedCard: Flashcard): Flashcard | null => {
  const deck = getDeckById(deckId);
  if (!deck) return null;
  
  deck.cards = deck.cards.map((card) =>
    card.id === updatedCard.id ? updatedCard : card
  );
  
  updateDeck(deck);
  return updatedCard;
};

// Delete a flashcard from a deck
export const deleteCardFromDeck = (deckId: string, cardId: string): boolean => {
  const deck = getDeckById(deckId);
  if (!deck) return false;
  
  deck.cards = deck.cards.filter((card) => card.id !== cardId);
  updateDeck(deck);
  
  return true;
};

// Get user stats
export const getUserStats = (): UserStats => {
  const statsJson = localStorage.getItem(USER_STATS_KEY);
  if (statsJson) {
    return JSON.parse(statsJson);
  }
  
  // Initialize with default values
  return {
    streakDays: 0,
    totalReviews: 0,
    lastReviewDate: null,
    studyHistory: [],
  };
};

// Update user stats
export const updateUserStats = (stats: UserStats): void => {
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
};

// Record a study session
export const recordStudySession = (session: StudySession): void => {
  const stats = getUserStats();
  
  // Add new session
  stats.studyHistory.push(session);
  
  // Update total reviews
  stats.totalReviews += session.cardsReviewed;
  
  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  if (!stats.lastReviewDate) {
    stats.streakDays = 1;
  } else {
    const lastDate = new Date(stats.lastReviewDate);
    lastDate.setHours(0, 0, 0, 0);
    const lastDateTimestamp = lastDate.getTime();
    
    const dayDifference = Math.round(
      (todayTimestamp - lastDateTimestamp) / (1000 * 60 * 60 * 24)
    );
    
    if (dayDifference === 1) {
      // Consecutive day
      stats.streakDays += 1;
    } else if (dayDifference > 1) {
      // Streak broken
      stats.streakDays = 1;
    }
    // If dayDifference is 0, it's the same day, so streakDays doesn't change
  }
  
  // Update last review date
  stats.lastReviewDate = todayTimestamp;
  
  updateUserStats(stats);
};
