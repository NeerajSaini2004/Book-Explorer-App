import express from "express";
import Book from "../models/Book.js";
import { exec } from "child_process";

const router = express.Router();

// GET /api/books with filters + category
router.get("/books", async (req, res) => {
  try {
    let {
      page = 1,
      limit = 12,
      search,
      rating,
      minPrice,
      maxPrice,
      inStock,
      category,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (rating) query.rating = rating;
    if (minPrice) query.price = { ...query.price, $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: parseFloat(maxPrice) };
    if (inStock === "true") query.inStock = true;
   if (category) query.category = { $regex: `^${category.trim()}$`, $options: "i" };



    // ✅ Category filter
    if (category) query.category = category;

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      books,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/books/:id
router.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ error: "Not found" });
  res.json(book);
});

// POST /api/refresh → run scraper
router.post("/refresh", (req, res) => {
  exec("cd scraper && npm run scrape", (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.json({ success: true, output: stdout });
  });
});

export default router;
