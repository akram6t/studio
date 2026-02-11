import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'user';
  isPremium: boolean;
  premiumExpiry?: Date;
  status: 'active' | 'inactive';
  testsTaken: number;
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'creator', 'user'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  premiumExpiry: { type: Date },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  testsTaken: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);