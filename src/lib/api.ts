import { PlaceHolderImages } from './placeholder-images';

export interface Exam {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  trending: boolean;
  image: string;
}

export interface TestItem {
  id: string;
  title: string;
  durationInMinutes: number;
  marks: number;
  numberOfQuestions: number;
  isFree: boolean;
  type: 'mock' | 'test' | 'previous';
  subject?: string;
}

export interface QuizItem {
  id: string;
  title: string;
  questions: number;
  timeLimit: number;
  tags: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'blog';
  url: string;
  thumbnail?: string;
  isFree: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  pages: number;
  language: string;
}

export interface PracticeSet {
  id: string;
  title: string;
  totalQuestions: number;
  completedQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TopicSet {
  id: string;
  title: string;
  questions: number;
  timeLimit: number;
  isCompleted: boolean;
  isFree: boolean;
}

const getImage = (id: string) => {
  if (!PlaceHolderImages) return `https://picsum.photos/seed/${id}/600/400`;
  return PlaceHolderImages.find(img => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/600/400`;
};

export const EXAMS: Exam[] = [
  {
    id: '1',
    slug: 'ssc-gd-constable',
    title: 'SSC GD Constable',
    category: 'SSC Exams',
    description: 'Staff Selection Commission - General Duty Constable Exam Preparation.',
    trending: true,
    image: getImage('exam-ssc')
  },
  {
    id: '2',
    slug: 'gate-exam',
    title: 'GATE 2024',
    category: 'Engineering',
    description: 'Graduate Aptitude Test in Engineering for engineering graduates.',
    trending: true,
    image: getImage('exam-gate')
  },
  {
    id: '3',
    slug: 'ccat-exam',
    title: 'CDAC C-CAT',
    category: 'IT/Software',
    description: 'CDAC Common Admission Test for PG Diploma courses.',
    trending: false,
    image: getImage('exam-cat')
  },
  {
    id: '4',
    slug: 'upsc-civil-services',
    title: 'UPSC Civil Services',
    category: 'Civil Services',
    description: 'The premier exam for IAS, IPS, and IFS services in India.',
    trending: true,
    image: getImage('exam-upsc')
  }
];

export const CATEGORIES = Array.from(new Set(EXAMS.map(e => e.category)));

export const BOOKS: Book[] = [
  { id: 'b1', title: 'Quantitative Aptitude for Competitive Exams', author: 'R.S. Aggarwal', category: 'SSC Exams', price: 450, rating: 4.8, image: 'https://picsum.photos/seed/book1/300/400', pages: 750, language: 'English' },
  { id: 'b2', title: 'Modern Approach to Verbal Reasoning', author: 'Dr. R.S. Aggarwal', category: 'Reasoning', price: 380, rating: 4.7, image: 'https://picsum.photos/seed/book2/300/400', pages: 620, language: 'English' },
  { id: 'b3', title: 'GATE Engineering Mathematics', author: 'Made Easy Publications', category: 'Engineering', price: 550, rating: 4.9, image: 'https://picsum.photos/seed/book3/300/400', pages: 500, language: 'English' },
  { id: 'b4', title: 'Indian Polity for UPSC', author: 'M. Laxmikanth', category: 'Civil Services', price: 620, rating: 4.9, image: 'https://picsum.photos/seed/book4/300/400', pages: 800, language: 'English' },
  { id: 'b5', title: 'Word Power Made Easy', author: 'Norman Lewis', category: 'English', price: 150, rating: 4.8, image: 'https://picsum.photos/seed/book5/300/400', pages: 400, language: 'English' },
  { id: 'b6', title: 'Fast Track Objective Arithmetic', author: 'Rajesh Verma', category: 'SSC Exams', price: 280, rating: 4.5, image: 'https://picsum.photos/seed/book6/300/400', pages: 450, language: 'Hindi' },
  { id: 'b7', title: 'Object-Oriented Programming with C++', author: 'E. Balagurusamy', category: 'IT/Software', price: 420, rating: 4.6, image: 'https://picsum.photos/seed/book7/300/400', pages: 580, language: 'English' },
  { id: 'b8', title: 'Geography of India', author: 'Majid Husain', category: 'Civil Services', price: 490, rating: 4.4, image: 'https://picsum.photos/seed/book8/300/400', pages: 600, language: 'English' },
  { id: 'b9', title: 'English Grammar & Composition', author: 'Wren & Martin', category: 'English', price: 250, rating: 4.8, image: 'https://picsum.photos/seed/book9/300/400', pages: 350, language: 'English' },
  { id: 'b10', title: 'Data Interpretation Master', author: 'Pearson', category: 'Banking', price: 340, rating: 4.3, image: 'https://picsum.photos/seed/book10/300/400', pages: 300, language: 'English' },
  { id: 'b11', title: 'Aptitude Cracked', author: 'Kaplan', category: 'IT/Software', price: 599, rating: 4.7, image: 'https://picsum.photos/seed/book11/300/400', pages: 420, language: 'English' },
  { id: 'b12', title: 'Cracking the Coding Interview', author: 'Gayle Laakmann', category: 'IT/Software', price: 899, rating: 4.9, image: 'https://picsum.photos/seed/book12/300/400', pages: 700, language: 'English' },
];

export const BOOK_CATEGORIES = Array.from(new Set(BOOKS.map(b => b.category)));

export const getMockTests = (slug: string): TestItem[] => [
  { id: 'm1', title: 'Full Length Mock Test 1', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: true, type: 'mock', subject: 'Full Length' },
  { id: 'm2', title: 'CDAC Section A: English/Math', durationInMinutes: 60, marks: 150, numberOfQuestions: 50, isFree: false, type: 'mock', subject: 'Section A' },
  { id: 'm3', title: 'CDAC Section B: OS/DS/C++', durationInMinutes: 60, marks: 150, numberOfQuestions: 50, isFree: true, type: 'mock', subject: 'Section B' },
  { id: 'm4', title: 'CTET Level 1 (Primary)', durationInMinutes: 150, marks: 150, numberOfQuestions: 150, isFree: false, type: 'mock', subject: 'Level 1 (Primary)' },
  { id: 'm5', title: 'CTET Level 2 (Upper Primary)', durationInMinutes: 150, marks: 150, numberOfQuestions: 150, isFree: true, type: 'mock', subject: 'Level 2 (Upper Primary)' },
];

export const getTests = (slug: string): TestItem[] => [
  { id: 't1', title: 'Percentage & Fractions', durationInMinutes: 30, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test', subject: 'Quantitative Aptitude' },
  { id: 't2', title: 'Profit, Loss & Discount', durationInMinutes: 30, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test', subject: 'Quantitative Aptitude' },
  { id: 't3', title: 'Direct & Indirect Speech', durationInMinutes: 20, marks: 20, numberOfQuestions: 20, isFree: true, type: 'test', subject: 'English Language' },
  { id: 't4', title: 'Reading Comprehension Master', durationInMinutes: 40, marks: 30, numberOfQuestions: 15, isFree: false, type: 'test', subject: 'English Language' },
  { id: 't5', title: 'Coding Decoding Advanced', durationInMinutes: 25, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test', subject: 'Reasoning Ability' },
  { id: 't6', title: 'Syllogism Specialist', durationInMinutes: 15, marks: 10, numberOfQuestions: 10, isFree: true, type: 'test', subject: 'Reasoning Ability' },
  { id: 't7', title: 'Indian Constitution & Polity', durationInMinutes: 30, marks: 50, numberOfQuestions: 50, isFree: false, type: 'test', subject: 'General Awareness' },
  { id: 't8', title: 'Modern Indian History', durationInMinutes: 30, marks: 50, numberOfQuestions: 50, isFree: true, type: 'test', subject: 'General Awareness' },
];

export const getPrevPapers = (slug: string): TestItem[] => [
  { id: 'p1', title: 'SSC GD 2022 Official Paper (Shift 1)', durationInMinutes: 90, marks: 160, numberOfQuestions: 80, isFree: true, type: 'previous' },
  { id: 'p2', title: 'SSC GD 2021 Official Paper', durationInMinutes: 90, marks: 100, numberOfQuestions: 100, isFree: true, type: 'previous' },
];

export const getQuizzes = (slug: string): QuizItem[] => [
  { id: 'q1', title: 'Daily Current Affairs Quiz', questions: 10, timeLimit: 5, tags: ['CA', 'General Knowledge'] },
  { id: 'q2', title: 'Numerical Ability Mini Quiz', questions: 15, timeLimit: 12, tags: ['Quant', 'Math'] },
  { id: 'q3', title: 'English Grammar Booster', questions: 20, timeLimit: 10, tags: ['English', 'Grammar'] },
];

export const getContent = (slug: string): ContentItem[] => [
  { id: 'c1', title: 'Preparation Strategy Guide', type: 'pdf', url: '#', thumbnail: getImage('book-cover-1'), isFree: true },
  { id: 'c2', title: 'Last 10 Year Analysis', type: 'ppt', url: '#', thumbnail: getImage('book-cover-2'), isFree: false },
  { id: 'c3', title: 'How to score 90+ in English', type: 'blog', url: '#', thumbnail: 'https://picsum.photos/seed/blog-study/300/400', isFree: true },
  { id: 'c4', title: 'Important Formulas Sheet', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/formulas/300/400', isFree: false },
  { id: 'c5', title: 'Mathematics Shortcut Tricks', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/tricks/300/400', isFree: false },
];

export const getPracticeSets = (subjectId: string): PracticeSet[] => {
  switch (subjectId) {
    case 'quant':
      return [
        { id: 'number-systems', title: 'Number Systems', totalQuestions: 30, completedQuestions: 12, difficulty: 'Easy' },
        { id: 'profit-loss', title: 'Profit & Loss', totalQuestions: 50, completedQuestions: 0, difficulty: 'Medium' },
        { id: 'time-work', title: 'Time & Work', totalQuestions: 40, completedQuestions: 40, difficulty: 'Medium' },
        { id: 'data-interpretation', title: 'Data Interpretation', totalQuestions: 25, completedQuestions: 5, difficulty: 'Hard' },
        { id: 'si-ci', title: 'Simple & Compound Interest', totalQuestions: 35, completedQuestions: 0, difficulty: 'Medium' },
      ];
    case 'english':
      return [
        { id: 'reading-comp', title: 'Reading Comprehension', totalQuestions: 20, completedQuestions: 10, difficulty: 'Medium' },
        { id: 'sentence-corr', title: 'Sentence Correction', totalQuestions: 50, completedQuestions: 0, difficulty: 'Easy' },
        { id: 'vocab-idioms', title: 'Vocabulary & Idioms', totalQuestions: 100, completedQuestions: 100, difficulty: 'Medium' },
        { id: 'fill-blanks', title: 'Fill in the Blanks', totalQuestions: 40, completedQuestions: 5, difficulty: 'Easy' },
      ];
    case 'reasoning':
      return [
        { id: 'syllogism', title: 'Syllogism', totalQuestions: 30, completedQuestions: 30, difficulty: 'Medium' },
        { id: 'seating-arr', title: 'Seating Arrangement', totalQuestions: 25, completedQuestions: 0, difficulty: 'Hard' },
        { id: 'blood-rel', title: 'Blood Relations', totalQuestions: 20, completedQuestions: 15, difficulty: 'Easy' },
        { id: 'coding-decoding', title: 'Coding-Decoding', totalQuestions: 40, completedQuestions: 10, difficulty: 'Medium' },
      ];
    case 'gk':
      return [
        { id: 'history', title: 'Indian History', totalQuestions: 150, completedQuestions: 50, difficulty: 'Medium' },
        { id: 'geography', title: 'Geography', totalQuestions: 120, completedQuestions: 0, difficulty: 'Medium' },
        { id: 'science', title: 'General Science', totalQuestions: 200, completedQuestions: 20, difficulty: 'Easy' },
        { id: 'ca-2024', title: 'Current Affairs 2024', totalQuestions: 300, completedQuestions: 300, difficulty: 'Medium' },
      ];
    default:
      return [];
  }
};

export const getTopicSets = (topicId: string): TopicSet[] => [
  { id: 's1', title: 'Practice Set 1: Basic Level', questions: 10, timeLimit: 10, isCompleted: true, isFree: true },
  { id: 's2', title: 'Practice Set 2: Intermediate', questions: 15, timeLimit: 15, isCompleted: false, isFree: true },
  { id: 's3', title: 'Practice Set 3: Advanced Concepts', questions: 20, timeLimit: 20, isCompleted: false, isFree: false },
  { id: 's4', title: 'Practice Set 4: Mix Bag', questions: 25, timeLimit: 25, isCompleted: false, isFree: false },
  { id: 's5', title: 'Practice Set 5: Speed Test', questions: 15, timeLimit: 10, isCompleted: false, isFree: false },
];
