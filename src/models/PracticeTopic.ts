import mongoose, { Schema, Document } from 'mongoose';

/**
 * Question Schema for individual questions
 */
const QuestionSchema = new Schema({
  q: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true }, // Index 0-3
  mdx: { type: Boolean, default: false }
});

/**
 * TopicSet Schema for specific practice sets within a topic
 */
const TopicSetSchema = new Schema({
  setId: { type: String, required: true },
  title: { type: String, required: true },
  timeLimit: { type: Number, default: 10 },
  isFree: { type: Boolean, default: true },
  languages: [{ type: String }], // Selected languages for this set
  // Localized questions: { "English": [Question], "Hindi": [Question] }
  localizedQuestions: {
    type: Map,
    of: [QuestionSchema]
  },
  order: { type: Number, default: 0 }
});

export interface IPracticeTopic extends Document {
  topicId: string;
  subjectId: string; // e.g., 'quant', 'reasoning'
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sets: any[];
  order: number;
}

const PracticeTopicSchema: Schema = new Schema({
  topicId: { type: String, required: true, unique: true },
  subjectId: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  sets: [TopicSetSchema],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.PracticeTopic || mongoose.model<IPracticeTopic>('PracticeTopic', PracticeTopicSchema);
