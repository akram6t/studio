/**
 * @fileOverview Standardized Data Layer for the ExamPrep platform.
 * All functions return static mock data synchronously to ensure high performance
 * and stability in a backend-free environment.
 */

export interface Exam {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  overviewMdx?: string;
  trending: boolean;
  image: string;
  stages: string[];
  subjects: string[];
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
  status?: 'published' | 'draft';
  examSlug?: string;
  examSlugs?: string[];
}

export interface QuizItem {
  id: string;
  title: string;
  questions: number;
  timeLimit: number;
  tags: string[];
  examSlug?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'pdf' | 'blog';
  url: string;
  thumbnail?: string;
  isFree: boolean;
  contentMdx?: string;
  examSlug?: string;
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

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'user';
  isPremium: boolean;
  premiumExpiry?: string;
  status: 'active' | 'inactive';
  testsTaken: number;
}

export interface Question {
  id: string;
  q: string;
  options: string[];
  answer: number;
  mdx?: boolean;
}

export interface TopicSet {
  id: string;
  title: string;
  questions: number;
  timeLimit: number;
  isCompleted: boolean;
  isFree: boolean;
  languages?: string[];
}

export interface PracticeSet {
  id: string;
  title: string;
  totalQuestions: number;
  completedQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video' | 'other';
  url: string;
  size: string;
  createdAt: string;
}

// STATIC MOCK DATA
const STATIC_EXAMS: Exam[] = [
  { id: '1', slug: 'ssc-gd-constable', title: 'SSC GD Constable', category: 'SSC Exams', description: 'Staff Selection Commission - General Duty Constable Exam Preparation.', trending: true, image: 'https://picsum.photos/seed/ssc-exam/600/400', stages: ['Full Length'], subjects: ['General Intelligence', 'English Language', 'Quantitative Aptitude', 'General Awareness'] },
  { id: '2', slug: 'gate-exam', title: 'GATE 2024', category: 'Engineering', description: 'Graduate Aptitude Test in Engineering for engineering graduates.', trending: true, image: 'https://picsum.photos/seed/gate-exam/600/400', stages: ['Technical Paper'], subjects: ['Engineering Mathematics', 'Technical Subject', 'General Aptitude'] },
  { id: '3', slug: 'ccat-exam', title: 'CDAC C-CAT', category: 'IT/Software', description: 'CDAC Common Admission Test for PG Diploma courses.', trending: false, image: 'https://picsum.photos/seed/cdac-exam/600/400', stages: ['Section A', 'Section B', 'Section C'], subjects: ['English', 'Mathematics', 'Reasoning', 'Computer Fundamentals', 'Data Structures', 'C Programming', 'OS'] },
  { id: '4', slug: 'upsc-civil-services', title: 'UPSC Civil Services', category: 'Civil Services', description: 'The premier exam for IAS, IPS, and IPS services in India.', trending: true, image: 'https://picsum.photos/seed/upsc-exam/600/400', stages: ['Prelims Paper I', 'Prelims Paper II (CSAT)'], subjects: ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Current Affairs'] }
];

const STATIC_TESTS: TestItem[] = [
  { id: 't1', title: 'Full Length Mock Test 1', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: true, type: 'mock', subject: 'Full Length', examSlug: 'ssc-gd-constable', examSlugs: ['ssc-gd-constable'] },
  { id: 't2', title: 'Percentage & Fractions', durationInMinutes: 30, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test', subject: 'Quantitative Aptitude', examSlug: 'ssc-gd-constable', examSlugs: ['ssc-gd-constable', 'ccat-exam'] },
  { id: 't3', title: 'Official Paper 2024 (Shift 1)', durationInMinutes: 90, marks: 160, numberOfQuestions: 80, isFree: true, type: 'previous', subject: '2024', examSlug: 'ssc-gd-constable', examSlugs: ['ssc-gd-constable'] }
];

const STATIC_BOOKS: Book[] = [
  { id: 'b1', title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', category: 'SSC Exams', price: 450, rating: 4.8, image: 'https://picsum.photos/seed/book1/300/400', pages: 750, language: 'English' },
  { id: 'b2', title: 'Modern Reasoning', author: 'Dr. R.S. Aggarwal', category: 'Reasoning', price: 380, rating: 4.7, image: 'https://picsum.photos/seed/book2/300/400', pages: 620, language: 'English' }
];

const STATIC_QUIZZES: QuizItem[] = [
  { id: 'q1', title: 'Daily Current Affairs Quiz', questions: 10, timeLimit: 5, tags: ['CA', 'GK'], examSlug: 'ssc-gd-constable' },
  { id: 'q2', title: 'Numerical Ability Mini Quiz', questions: 15, timeLimit: 12, tags: ['Quant'], examSlug: 'ssc-gd-constable' }
];

const STATIC_CONTENT: ContentItem[] = [
  { id: 'c1', title: 'SSC GD Preparation Strategy', type: 'pdf', url: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf', thumbnail: 'https://picsum.photos/seed/guide-1/300/400', isFree: true, examSlug: 'ssc-gd-constable' },
  { id: 'c2', title: '10 Year Exam Analysis', type: 'blog', url: '#', thumbnail: 'https://picsum.photos/seed/analysis-1/300/400', isFree: false, contentMdx: '# Analysis\nPatterns matter.', examSlug: 'ssc-gd-constable' }
];

const STATIC_USERS: SystemUser[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@logicalbook.com', role: 'admin', isPremium: true, status: 'active', testsTaken: 45 },
  { id: 'u2', name: 'Demo Student', email: 'student@example.com', role: 'user', isPremium: false, status: 'active', testsTaken: 12 }
];

const STATIC_MEDIA: MediaItem[] = [
  { id: 'm1', name: 'ssc-banner.jpg', type: 'image', url: 'https://picsum.photos/seed/ssc-exam/600/400', size: '1.2MB', createdAt: '2024-03-15' },
  { id: 'm2', name: 'guide-thumbnail.png', type: 'image', url: 'https://picsum.photos/seed/guide-1/300/400', size: '450KB', createdAt: '2024-03-14' }
];

// Data Fetching Actions
export function getExams(): Exam[] {
  return STATIC_EXAMS;
}

export function getCategories(): string[] {
  return Array.from(new Set(STATIC_EXAMS.map(e => e.category)));
}

export function getMockTests(slug: string): TestItem[] {
  if (slug === 'all') return STATIC_TESTS.filter(t => t.type === 'mock');
  return STATIC_TESTS.filter(t => t.type === 'mock' && t.examSlug === slug);
}

export function getTests(slug: string): TestItem[] {
  if (slug === 'all') return STATIC_TESTS.filter(t => t.type === 'test');
  return STATIC_TESTS.filter(t => t.type === 'test' && t.examSlug === slug);
}

export function getPrevPapers(slug: string): TestItem[] {
  if (slug === 'all') return STATIC_TESTS.filter(t => t.type === 'previous');
  return STATIC_TESTS.filter(t => t.type === 'previous' && t.examSlug === slug);
}

export function getQuizzes(slug: string): QuizItem[] {
  if (slug === 'all' || !slug) return STATIC_QUIZZES;
  return STATIC_QUIZZES.filter(q => q.examSlug === slug);
}

export function getContent(slug: string): ContentItem[] {
  if (slug === 'all' || !slug) return STATIC_CONTENT;
  return STATIC_CONTENT.filter(c => c.examSlug === slug);
}

export function getBooks(): Book[] {
  return STATIC_BOOKS;
}

export function getBookCategories(): string[] {
  return Array.from(new Set(STATIC_BOOKS.map(b => b.category)));
}

export function getQuestions(setId: string): Question[] {
  return [
    { id: 'q1', q: 'Find the value of $x$ in the equation $2^x = 1024$.', options: ['8', '9', '10', '12'], answer: 2, mdx: true },
    { id: 'q2', q: 'What is the largest 3-digit prime number?', options: ['991', '997', '993', '987'], answer: 1, mdx: false },
    { id: 'q3', q: 'Evaluate the integral: $\\int_{0}^{1} x^2 dx$', options: ['$1/2$', '$1/3$', '$1/4$', '$1$'], answer: 1, mdx: true },
    { id: 'q4', q: 'The sum of the first $n$ natural numbers is given by which formula?', options: ['$n^2$', '$\\frac{n(n+1)}{2}$', '$n(n+1)$', '$\\frac{n(n-1)}{2}$'], answer: 1, mdx: true },
    { id: 'q5', q: 'Which of these is NOT an irrational number?', options: ['$\\sqrt{2}$', '$\\pi$', '$\\sqrt{9}$', '$e$'], answer: 2, mdx: true }
  ];
}

export function getUsers(): SystemUser[] {
  return STATIC_USERS;
}

export function getMediaItems(): MediaItem[] {
  return STATIC_MEDIA;
}

export function getTopicSets(topicId: string): TopicSet[] {
  return [
    { id: 's1', title: 'Practice Set 1: Basic Level', questions: 10, timeLimit: 10, isCompleted: true, isFree: true, languages: ['English', 'Hindi'] },
    { id: 's2', title: 'Practice Set 2: Intermediate', questions: 15, timeLimit: 15, isCompleted: false, isFree: true, languages: ['English'] },
    { id: 's3', title: 'Practice Set 3: Advanced Concepts', questions: 20, timeLimit: 20, isCompleted: false, isFree: false, languages: ['English', 'Hindi', 'Marathi'] }
  ];
}

export function getPracticeSets(subjectId: string): PracticeSet[] {
  return [
    { id: 'number-systems', title: 'Number Systems', totalQuestions: 30, completedQuestions: 12, difficulty: 'Easy' },
    { id: 'profit-loss', title: 'Profit & Loss', totalQuestions: 50, completedQuestions: 0, difficulty: 'Medium' }
  ];
}
