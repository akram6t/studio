
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

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/600/400`;

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

export const getMockTests = (slug: string): TestItem[] => [
  { id: 'm1', title: 'Full Length Mock Test 1', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: true, type: 'mock' },
  { id: 'm2', title: 'Full Length Mock Test 2', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: false, type: 'mock' },
  { id: 'm3', title: 'Speed Test - Quantitative', durationInMinutes: 45, marks: 50, numberOfQuestions: 50, isFree: true, type: 'mock' },
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
  { id: 'c1', title: 'Preparation Strategy Guide', type: 'pdf', url: '#', thumbnail: PlaceHolderImages.find(img => img.id === 'book-cover-1')?.imageUrl },
  { id: 'c2', title: 'Last 10 Year Analysis', type: 'ppt', url: '#', thumbnail: PlaceHolderImages.find(img => img.id === 'book-cover-2')?.imageUrl },
  { id: 'c3', title: 'How to score 90+ in English', type: 'blog', url: '#', thumbnail: 'https://picsum.photos/seed/blog-study/300/400' },
  { id: 'c4', title: 'Important Formulas Sheet', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/formulas/300/400' },
  { id: 'c5', title: 'Mathematics Shortcut Tricks', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/tricks/300/400' },
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
