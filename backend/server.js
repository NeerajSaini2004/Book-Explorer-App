import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ✅ Default test route
app.get("/", (req, res) => res.send("Book Explorer API running"));

// ✅ Routes
app.use("/api", bookRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
