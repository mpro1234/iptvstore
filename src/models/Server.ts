// models/Server.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IServer extends Document {
  name: string;
  description: string;
  image: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  products: mongoose.Types.ObjectId[];
}

const serverSchema = new Schema<IServer>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }]
});

export default mongoose.model<IServer>("Server", serverSchema);
