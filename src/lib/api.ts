
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

export const EXAMS: Exam[] = [
  {
    id: '1',
    slug: 'ssc-gd-constable',
    title: 'SSC GD Constable',
    category: 'SSC Exams',
    description: 'Staff Selection Commission - General Duty Constable Exam Preparation.',
    trending: true,
    image: 'https://picsum.photos/seed/ssc/400/250'
  },
  {
    id: '2',
    slug: 'gate-exam',
    title: 'GATE 2024',
    category: 'Engineering',
    description: 'Graduate Aptitude Test in Engineering for engineering graduates.',
    trending: true,
    image: 'https://picsum.photos/seed/gate/400/250'
  },
  {
    id: '3',
    slug: 'ccat-exam',
    title: 'CDAC C-CAT',
    category: 'IT/Software',
    description: 'CDAC Common Admission Test for PG Diploma courses.',
    trending: false,
    image: 'https://picsum.photos/seed/cdac/400/250'
  },
  {
    id: '4',
    slug: 'upsc-civil-services',
    title: 'UPSC Civil Services',
    category: 'Civil Services',
    description: 'The premier exam for IAS, IPS, and IFS services in India.',
    trending: true,
    image: 'https://picsum.photos/seed/upsc/400/250'
  }
];

export const CATEGORIES = Array.from(new Set(EXAMS.map(e => e.category)));

export const getMockTests = (slug: string): TestItem[] => [
  { id: 'm1', title: 'Full Length Mock Test 1', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: true, type: 'mock' },
  { id: 'm2', title: 'Full Length Mock Test 2', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: false, type: 'mock' },
  { id: 'm3', title: 'Speed Test - Quantitative', durationInMinutes: 45, marks: 50, numberOfQuestions: 50, isFree: true, type: 'mock' },
];

export const getTests = (slug: string): TestItem[] => [
  { id: 't1', title: 'Subject Test: English Language', durationInMinutes: 30, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test' },
  { id: 't2', title: 'Subject Test: General Intelligence', durationInMinutes: 30, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test' },
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
  { id: 'c1', title: 'Preparation Strategy Guide', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/book1/300/400' },
  { id: 'c2', title: 'Last 10 Year Analysis', type: 'ppt', url: '#', thumbnail: 'https://picsum.photos/seed/book2/300/400' },
  { id: 'c3', title: 'How to score 90+ in English', type: 'blog', url: '#', thumbnail: 'https://picsum.photos/seed/book3/300/400' },
  { id: 'c4', title: 'Important Formulas Sheet', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/book4/300/400' },
  { id: 'c5', title: 'Mathematics Shortcut Tricks', type: 'pdf', url: '#', thumbnail: 'https://picsum.photos/seed/book5/300/400' },
];
