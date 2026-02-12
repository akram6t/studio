'use server';

import connectDB from './db';
import ExamModel from '@/models/Exam';
import TestModel from '@/models/Test';
import UserModel from '@/models/User';
import BookModel from '@/models/Book';
import QuizModel from '@/models/Quiz';
import ContentModel from '@/models/Content';

// Standardized Data Interfaces
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
  clerkId: string;
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

/**
 * Robust JSON-safe transformation helper.
 * High-performance version using JSON round-trip to ensure zero Mongoose internal objects remain.
 */
function flatten<T>(doc: any): T {
  if (!doc) return doc;
  const json = JSON.parse(JSON.stringify(doc));
  
  const transform = (obj: any) => {
    if (Array.isArray(obj)) return obj.map(transform);
    if (obj !== null && typeof obj === 'object') {
      if (obj._id) {
        obj.id = obj._id.toString();
        delete obj._id;
      }
      Object.keys(obj).forEach(key => {
        obj[key] = transform(obj[key]);
      });
    }
    return obj;
  };

  return transform(json) as T;
}

// Data Fetching Actions
export async function getExams(): Promise<Exam[]> {
  await connectDB();
  const exams = await ExamModel.find().lean();
  if (exams.length === 0) return await seedExams();
  return exams.map(e => flatten<Exam>(e));
}

export async function getCategories(): Promise<string[]> {
  const exams = await getExams();
  return Array.from(new Set(exams.map(e => e.category)));
}

export async function getMockTests(slug: string): Promise<TestItem[]> {
  await connectDB();
  const query = slug === 'all' ? { type: 'mock' } : { type: 'mock', examSlug: slug };
  const tests = await TestModel.find(query).lean();
  if (tests.length === 0 && slug === 'all') return await seedTests();
  return tests.map(t => flatten<TestItem>(t));
}

export async function getTests(slug: string): Promise<TestItem[]> {
  await connectDB();
  const query = slug === 'all' ? { type: 'test' } : { type: 'test', examSlug: slug };
  const tests = await TestModel.find(query).lean();
  return tests.map(t => flatten<TestItem>(t));
}

export async function getPrevPapers(slug: string): Promise<TestItem[]> {
  await connectDB();
  const query = slug === 'all' ? { type: 'previous' } : { type: 'previous', examSlug: slug };
  const tests = await TestModel.find(query).lean();
  return tests.map(t => flatten<TestItem>(t));
}

export async function getQuizzes(slug: string): Promise<QuizItem[]> {
  await connectDB();
  const query = (slug === 'all' || !slug) ? {} : { examSlug: slug };
  const quizzes = await QuizModel.find(query).lean();
  if (quizzes.length === 0 && (!slug || slug === 'all')) return await seedQuizzes();
  return quizzes.map(q => flatten<QuizItem>(q));
}

export async function getContent(slug: string): Promise<ContentItem[]> {
  await connectDB();
  const query = (slug === 'all' || !slug) ? {} : { examSlug: slug };
  const content = await ContentModel.find(query).lean();
  if (content.length === 0 && (!slug || slug === 'all')) return await seedContent();
  return content.map(c => flatten<ContentItem>(c));
}

export async function getBooks(): Promise<Book[]> {
  await connectDB();
  const books = await BookModel.find().lean();
  if (books.length === 0) return await seedBooks();
  return books.map(b => flatten<Book>(b));
}

export async function getBookCategories(): Promise<string[]> {
  const books = await getBooks();
  return Array.from(new Set(books.map(b => b.category)));
}

export async function getQuestions(setId: string): Promise<Question[]> {
  return [
    { id: 'q1', q: 'Find the value of $x$ in the equation $2^x = 1024$.', options: ['8', '9', '10', '12'], answer: 2, mdx: true },
    { id: 'q2', q: 'What is the largest 3-digit prime number?', options: ['991', '997', '993', '987'], answer: 1, mdx: false },
    { id: 'q3', q: 'Evaluate the integral: $\\int_{0}^{1} x^2 dx$', options: ['$1/2$', '$1/3$', '$1/4$', '$1$'], answer: 1, mdx: true },
    { id: 'q4', q: 'The sum of the first $n$ natural numbers is given by which formula?', options: ['$n^2$', '$\\frac{n(n+1)}{2}$', '$n(n+1)$', '$\\frac{n(n-1)}{2}$'], answer: 1, mdx: true },
    { id: 'q5', q: 'Which of these is NOT an irrational number?', options: ['$\\sqrt{2}$', '$\\pi$', '$\\sqrt{9}$', '$e$'], answer: 2, mdx: true }
  ];
}

// Seeding Functions
async function seedExams() {
  await connectDB();
  const count = await ExamModel.countDocuments();
  if (count > 0) return (await ExamModel.find().lean()).map(e => flatten<Exam>(e));

  const initial = [
    { slug: 'ssc-gd-constable', title: 'SSC GD Constable', category: 'SSC Exams', description: 'Staff Selection Commission - General Duty Constable Exam Preparation.', trending: true, image: 'https://picsum.photos/seed/ssc-exam/600/400', stages: ['Full Length'], subjects: ['General Intelligence', 'English Language', 'Quantitative Aptitude', 'General Awareness'] },
    { slug: 'gate-exam', title: 'GATE 2024', category: 'Engineering', description: 'Graduate Aptitude Test in Engineering for engineering graduates.', trending: true, image: 'https://picsum.photos/seed/gate-exam/600/400', stages: ['Technical Paper'], subjects: ['Engineering Mathematics', 'Technical Subject', 'General Aptitude'] },
    { slug: 'ccat-exam', title: 'CDAC C-CAT', category: 'IT/Software', description: 'CDAC Common Admission Test for PG Diploma courses.', trending: false, image: 'https://picsum.photos/seed/cdac-exam/600/400', stages: ['Section A', 'Section B', 'Section C'], subjects: ['English', 'Mathematics', 'Reasoning', 'Computer Fundamentals', 'Data Structures', 'C Programming', 'OS'] },
    { slug: 'upsc-civil-services', title: 'UPSC Civil Services', category: 'Civil Services', description: 'The premier exam for IAS, IPS, and IPS services in India.', trending: true, image: 'https://picsum.photos/seed/upsc-exam/600/400', stages: ['Prelims Paper I', 'Prelims Paper II (CSAT)'], subjects: ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Current Affairs'] }
  ];
  const inserted = await ExamModel.insertMany(initial);
  return inserted.map((e: any) => flatten<Exam>(e));
}

async function seedTests() {
  await connectDB();
  const count = await TestModel.countDocuments({ type: 'mock' });
  if (count > 0) return (await TestModel.find({ type: 'mock' }).lean()).map(t => flatten<TestItem>(t));

  const initial = [
    { title: 'Full Length Mock Test 1', durationInMinutes: 120, marks: 100, numberOfQuestions: 100, isFree: true, type: 'mock', subject: 'Full Length', status: 'published', examSlug: 'ssc-gd-constable' },
    { title: 'Percentage & Fractions', durationInMinutes: 30, marks: 25, numberOfQuestions: 25, isFree: false, type: 'test', subject: 'Quantitative Aptitude', status: 'published', examSlug: 'ssc-gd-constable' },
    { title: 'Official Paper 2024 (Shift 1)', durationInMinutes: 90, marks: 160, numberOfQuestions: 80, isFree: true, type: 'previous', subject: '2024', status: 'published', examSlug: 'ssc-gd-constable' }
  ];
  const inserted = await TestModel.insertMany(initial);
  return inserted.map((t: any) => flatten<TestItem>(t));
}

async function seedBooks() {
  await connectDB();
  const count = await BookModel.countDocuments();
  if (count > 0) return (await BookModel.find().lean()).map(b => flatten<Book>(b));

  const initial = [
    { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', category: 'SSC Exams', price: 450, rating: 4.8, image: 'https://picsum.photos/seed/book1/300/400', pages: 750, language: 'English' },
    { title: 'Modern Reasoning', author: 'Dr. R.S. Aggarwal', category: 'Reasoning', price: 380, rating: 4.7, image: 'https://picsum.photos/seed/book2/300/400', pages: 620, language: 'English' }
  ];
  const inserted = await BookModel.insertMany(initial);
  return inserted.map((b: any) => flatten<Book>(b));
}

async function seedQuizzes() {
  await connectDB();
  const count = await QuizModel.countDocuments();
  if (count > 0) return (await QuizModel.find().lean()).map(q => flatten<QuizItem>(q));

  const initial = [
    { title: 'Daily Current Affairs Quiz', questions: 10, timeLimit: 5, tags: ['CA', 'General Knowledge'], examSlug: 'ssc-gd-constable' },
    { title: 'Numerical Ability Mini Quiz', questions: 15, timeLimit: 12, tags: ['Quant', 'Math'], examSlug: 'ssc-gd-constable' }
  ];
  const inserted = await QuizModel.insertMany(initial);
  return inserted.map((q: any) => flatten<QuizItem>(q));
}

async function seedContent() {
  await connectDB();
  const count = await ContentModel.countDocuments();
  if (count > 0) return (await ContentModel.find().lean()).map(c => flatten<ContentItem>(c));

  const initial = [
    { title: 'SSC GD Preparation Strategy', type: 'pdf', url: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf', thumbnail: 'https://picsum.photos/seed/guide-1/300/400', isFree: true, examSlug: 'ssc-gd-constable' },
    { title: '10 Year Exam Analysis', type: 'blog', url: '#', thumbnail: 'https://picsum.photos/seed/analysis-1/300/400', isFree: false, contentMdx: '# Analysis\nPatterns matter.', examSlug: 'ssc-gd-constable' }
  ];
  const inserted = await ContentModel.insertMany(initial);
  return inserted.map((c: any) => flatten<ContentItem>(c));
}

export async function getUsers(): Promise<SystemUser[]> {
  await connectDB();
  const users = await UserModel.find().lean();
  return users.map(u => flatten<SystemUser>(u));
}

export async function syncUser(clerkUser: any) {
  await connectDB();
  const email = clerkUser.primaryEmailAddress?.emailAddress;
  const existing = await UserModel.findOne({ email: email });
  
  if (!existing) {
    const adminEmail = "developeruniqe@gmail.com";
    const dbUser = await UserModel.create({
      clerkId: clerkUser.id,
      name: clerkUser.fullName || email.split('@')[0],
      email: email,
      role: email === adminEmail ? 'admin' : 'user',
      isPremium: false,
      status: 'active'
    });
    return flatten<SystemUser>(dbUser);
  }
  return flatten<SystemUser>(existing);
}

export async function getTopicSets(topicId: string) {
  return [
    { id: 's1', title: 'Practice Set 1: Basic Level', questions: 10, timeLimit: 10, isCompleted: true, isFree: true },
    { id: 's2', title: 'Practice Set 2: Intermediate', questions: 15, timeLimit: 15, isCompleted: false, isFree: true },
    { id: 's3', title: 'Practice Set 3: Advanced Concepts', questions: 20, timeLimit: 20, isCompleted: false, isFree: false }
  ];
}

export async function getPracticeSets(subjectId: string) {
  return [
    { id: 'number-systems', title: 'Number Systems', totalQuestions: 30, completedQuestions: 12, difficulty: 'Easy' },
    { id: 'profit-loss', title: 'Profit & Loss', totalQuestions: 50, completedQuestions: 0, difficulty: 'Medium' }
  ];
}

export async function getMediaItems() {
  return [
    { id: 'm1', name: 'ssc-banner.jpg', type: 'image', url: 'https://picsum.photos/seed/ssc-exam/600/400', size: '1.2MB', createdAt: '2024-03-15' }
  ];
}
