import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  type: 'pdf' | 'blog';
  url: string;
  thumbnail?: string;
  isFree: boolean;
  contentMdx?: string;
  examSlugs: string[];
}

const ContentSchema: Schema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'blog'], required: true },
  url: { type: String, required: true },
  thumbnail: { type: String },
  isFree: { type: Boolean, default: false },
  contentMdx: { type: String },
  examSlugs: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
