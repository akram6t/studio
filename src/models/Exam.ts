import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  slug: string;
  title: string;
  category: string;
  description: string;
  overviewMdx?: string;
  trending: boolean;
  image: string;
  stages: string[];
  subjects: string[];
  order: number;
}

const ExamSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  overviewMdx: { type: String },
  trending: { type: Boolean, default: false },
  image: { type: String, required: true },
  stages: [{ type: String }],
  subjects: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
