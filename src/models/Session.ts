import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  userId: string;
  expiresAt: Date;
}

const SessionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// TTL index to automatically remove expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session;
