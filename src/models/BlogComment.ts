import mongoose, { Document, Schema } from "mongoose";

export interface IBlogComment extends Document {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  status: "pending" | "approved" | "rejected";
  isVisible: boolean;
}

const blogCommentSchema = new Schema<IBlogComment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isVisible: { type: Boolean, default: false },
});

export default mongoose.model<IBlogComment>("BlogComment", blogCommentSchema);
