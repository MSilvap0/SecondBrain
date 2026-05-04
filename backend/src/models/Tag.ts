import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  color?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TagSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model<ITag>('Tag', TagSchema);
