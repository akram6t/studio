import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
  title: string;
  questions: number;
  timeLimit: number;
  tags: string[];
  examSlug?: string;
}

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  questions: { type: Number, required: true },
  timeLimit: { type: Number, required: true },
  tags: [{ type: String }],
  examSlug: { type: String }
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);