import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  numberOfQuestions: number;
  timeLimit: number;
  tags: string[];
  examSlugs: string[];
  isActive: boolean;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  numberOfQuestions: { type: Number, required: true },
  timeLimit: { type: Number, required: true },
  tags: [{ type: String }],
  examSlugs: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);
