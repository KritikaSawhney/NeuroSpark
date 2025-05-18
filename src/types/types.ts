
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  lastReviewed: number | null;
  nextReview: number | null;
  repetitions: number;
  easeFactor: number;
  interval: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  lastStudied: number | null;
  tags: string[];
  theme: DeckTheme;
}

export type DeckTheme = 
  | "default"
  | "neon"
  | "minimal"
  | "notebook"
  | "sci-fi";

export interface StudySession {
  deckId: string;
  startTime: number;
  endTime: number | null;
  cardsReviewed: number;
  cardsCorrect: number;
}

export interface UserStats {
  streakDays: number;
  totalReviews: number;
  lastReviewDate: number | null;
  studyHistory: StudySession[];
}

export type ReviewRating = "again" | "hard" | "good" | "easy";
