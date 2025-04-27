// models/Ad.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAd extends Document {
  imageUrl: string;
  link?: string; // إن أحببت رابط عند الضغط على الإعلان
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const adSchema = new Schema<IAd>({
  imageUrl: { type: String, required: true },
  link: { type: String, default: "" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAd>("Ad", adSchema);
