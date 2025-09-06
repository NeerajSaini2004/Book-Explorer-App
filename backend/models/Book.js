import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, index: true },
  price: { type: Number, index: true },
  category: { type: String, default: "Default" },
  availability: String,
  inStock: Boolean,
  rating: String,
  bookUrl: String,
  thumbnail: String,
  
}, { timestamps: true });

BookSchema.index({ title: "text" });

export default mongoose.model("Book", BookSchema);
