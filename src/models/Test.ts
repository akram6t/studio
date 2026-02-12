import mongoose, { Schema, Document } from 'mongoose';

export interface ITest extends Document {
  title: string;
  durationInMinutes: number;
  marks: number;
  numberOfQuestions: number;
  isFree: boolean;
  type: 'mock' | 'test' | 'previous';
  subject?: string;
  status: 'published' | 'draft';
  examSlugs: string[]; // Supports multiple associated exams
}

const TestSchema: Schema = new Schema({
  title: { type: String, required: true },
  durationInMinutes: { type: Number, required: true },
  marks: { type: Number, required: true },
  numberOfQuestions: { type: Number, required: true },
  isFree: { type: Boolean, default: true },
  type: { type: String, enum: ['mock', 'test', 'previous'], required: true },
  subject: { type: String },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  examSlugs: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);
