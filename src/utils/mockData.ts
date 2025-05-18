
import { Deck } from "@/types/types";
import { v4 as uuidv4 } from "@/utils/uuid";

export const generateMockDecks = (): Deck[] => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  return [
    {
      id: "deck-1",
      name: "Basic JavaScript Concepts",
      description: "Essential JavaScript concepts every developer should know",
      cards: [
        {
          id: "card-1-1",
          question: "What is a closure in JavaScript?",
          answer: "A closure is a function that has access to its outer function's variables even after the outer function has returned.",
          tags: ["javascript", "functions"],
          lastReviewed: now - 2 * oneDay,
          nextReview: now - oneDay,
          repetitions: 2,
          easeFactor: 2.5,
          interval: 2,
        },
        {
          id: "card-1-2",
          question: "What is the difference between let and var in JavaScript?",
          answer: "var is function-scoped while let is block-scoped. let was introduced in ES6 and is the preferred way to declare variables.",
          tags: ["javascript", "variables"],
          lastReviewed: now - 3 * oneDay,
          nextReview: now,
          repetitions: 1,
          easeFactor: 2.5,
          interval: 1,
        },
        {
          id: "card-1-3",
          question: "What is the purpose of the 'use strict' directive in JavaScript?",
          answer: "It enables strict mode which catches common coding mistakes and 'unsafe' actions like assigning to undeclared variables.",
          tags: ["javascript"],
          lastReviewed: now - oneDay,
          nextReview: now + oneDay,
          repetitions: 3,
          easeFactor: 2.7,
          interval: 3,
        },
      ],
      createdAt: now - 7 * oneDay,
      lastStudied: now - oneDay,
      tags: ["javascript", "programming"],
      theme: "default",
    },
    {
      id: "deck-2",
      name: "React Hooks",
      description: "Understanding and using React Hooks effectively",
      cards: [
        {
          id: "card-2-1",
          question: "What is useState hook used for?",
          answer: "The useState hook lets you add state to functional components in React.",
          tags: ["react", "hooks"],
          lastReviewed: now - oneDay,
          nextReview: now + oneDay,
          repetitions: 2,
          easeFactor: 2.6,
          interval: 2,
        },
        {
          id: "card-2-2",
          question: "When does useEffect run?",
          answer: "useEffect runs after every render by default. You can control when it runs by specifying dependencies in the dependency array.",
          tags: ["react", "hooks"],
          lastReviewed: null,
          nextReview: null,
          repetitions: 0,
          easeFactor: 2.5,
          interval: 1,
        },
        {
          id: "card-2-3",
          question: "What is the purpose of useContext?",
          answer: "useContext accepts a context object and returns the current context value for that context.",
          tags: ["react", "hooks", "context"],
          lastReviewed: now - 4 * oneDay,
          nextReview: now - 2 * oneDay,
          repetitions: 1,
          easeFactor: 2.2,
          interval: 1,
        },
        {
          id: "card-2-4",
          question: "How does useReducer differ from useState?",
          answer: "useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.",
          tags: ["react", "hooks", "state"],
          lastReviewed: null,
          nextReview: null,
          repetitions: 0,
          easeFactor: 2.5,
          interval: 1,
        },
      ],
      createdAt: now - 14 * oneDay,
      lastStudied: now - oneDay,
      tags: ["react", "javascript", "hooks"],
      theme: "neon",
    },
    {
      id: "deck-3",
      name: "CSS Flexbox & Grid",
      description: "Modern CSS layout techniques",
      cards: [
        {
          id: "card-3-1",
          question: "What is the main difference between Flexbox and Grid?",
          answer: "Flexbox is one-dimensional and works with either rows or columns, while Grid is two-dimensional and works with both rows and columns simultaneously.",
          tags: ["css", "layout"],
          lastReviewed: now - 3 * oneDay,
          nextReview: now,
          repetitions: 2,
          easeFactor: 2.5,
          interval: 3,
        },
        {
          id: "card-3-2",
          question: "What does 'flex: 1' mean?",
          answer: "It's shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%. It allows the element to grow and shrink as needed, taking up available space.",
          tags: ["css", "flexbox"],
          lastReviewed: now - 2 * oneDay,
          nextReview: now + oneDay,
          repetitions: 3,
          easeFactor: 2.8,
          interval: 4,
        },
      ],
      createdAt: now - 10 * oneDay,
      lastStudied: now - 3 * oneDay,
      tags: ["css", "layout", "design"],
      theme: "minimal",
    },
  ];
};

export const initializeWithMockData = () => {
  const localStorageKey = "neurospark_decks";
  
  // Only initialize if not already done
  if (!localStorage.getItem(localStorageKey)) {
    const mockDecks = generateMockDecks();
    localStorage.setItem(localStorageKey, JSON.stringify(mockDecks));
  }
  
  // Initialize user stats if not present
  const statsKey = "neurospark_user_stats";
  if (!localStorage.getItem(statsKey)) {
    const now = Date.now();
    const mockStats = {
      streakDays: 3,
      totalReviews: 32,
      lastReviewDate: now - 24 * 60 * 60 * 1000, // Yesterday
      studyHistory: [
        {
          deckId: "deck-1",
          startTime: now - 7 * 24 * 60 * 60 * 1000,
          endTime: now - 7 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000,
          cardsReviewed: 10,
          cardsCorrect: 7,
        },
        {
          deckId: "deck-2",
          startTime: now - 5 * 24 * 60 * 60 * 1000,
          endTime: now - 5 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000,
          cardsReviewed: 12,
          cardsCorrect: 9,
        },
        {
          deckId: "deck-1",
          startTime: now - 2 * 24 * 60 * 60 * 1000,
          endTime: now - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000,
          cardsReviewed: 5,
          cardsCorrect: 4,
        },
        {
          deckId: "deck-3",
          startTime: now - 24 * 60 * 60 * 1000,
          endTime: now - 24 * 60 * 60 * 1000 + 15 * 60 * 1000,
          cardsReviewed: 5,
          cardsCorrect: 3,
        },
      ],
    };
    
    localStorage.setItem(statsKey, JSON.stringify(mockStats));
  }
};
