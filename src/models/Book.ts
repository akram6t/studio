import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  pages: number;
  language: string;
  stockStatus: 'in-stock' | 'out-of-stock';
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  image: { type: String, required: true },
  pages: { type: Number, required: true },
  language: { type: String, default: 'English' },
  stockStatus: { type: String, enum: ['in-stock', 'out-of-stock'], default: 'in-stock' }
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
