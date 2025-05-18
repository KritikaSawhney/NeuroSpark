
import { Flashcard, ReviewRating } from "@/types/types";

// Simplified SM-2 algorithm for spaced repetition
export const calculateNextReview = (
  card: Flashcard,
  rating: ReviewRating
): Flashcard => {
  const now = Date.now();
  let { repetitions, easeFactor, interval } = card;

  // Update ease factor based on rating
  switch (rating) {
    case "again":
      repetitions = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      interval = 1;
      break;
    case "hard":
      repetitions = Math.max(0, repetitions - 1);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      interval = Math.max(1, Math.ceil(interval * 1.2));
      break;
    case "good":
      repetitions += 1;
      interval = repetitions === 1 ? 1 : 
                 repetitions === 2 ? 3 : 
                 Math.ceil(interval * easeFactor);
      break;
    case "easy":
      repetitions += 1;
      easeFactor = easeFactor + 0.1;
      interval = Math.ceil(interval * easeFactor * 1.3);
      break;
  }
  
  // Calculate next review date (interval is in days)
  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    repetitions,
    easeFactor,
    interval,
    lastReviewed: now,
    nextReview,
  };
};

export const getDueCards = (cards: Flashcard[]): Flashcard[] => {
  const now = Date.now();
  return cards.filter(card => 
    card.nextReview === null || card.nextReview <= now
  );
};

export const getReviewStatus = (cards: Flashcard[]): {
  dueCount: number;
  learningCount: number;
  masteredCount: number;
} => {
  const now = Date.now();
  const dueCount = cards.filter(card => 
    card.nextReview === null || card.nextReview <= now
  ).length;
  
  const learningCount = cards.filter(card => 
    card.repetitions > 0 && card.repetitions < 5
  ).length;
  
  const masteredCount = cards.filter(card => 
    card.repetitions >= 5
  ).length;
  
  return { dueCount, learningCount, masteredCount };
};
