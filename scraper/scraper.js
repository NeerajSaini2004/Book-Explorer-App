import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const BASE_URL = "https://books.toscrape.com/";



// ✅ Local Book schema for scraper
const BookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  availability: String,
  inStock: Boolean,
  rating: String,
  bookUrl: String,
  thumbnail: String,
  category: String,
});
const Book = mongoose.model("Book", BookSchema);

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected for scraper");
}

async function scrapeBooks() {
  let url = BASE_URL;
  let allBooks = [];

  while (url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
      
    $(".product_pod").each((_, el) => {
      const title = $(el).find("h3 a").attr("title");
      const price = parseFloat($(el).find(".price_color").text().replace("£", ""));
      const availability = $(el).find(".availability").text().trim();
      const inStock = availability.includes("In stock");
      const rating = $(el).find("p.star-rating").attr("class").split(" ")[1];
      const bookUrl = new URL($(el).find("h3 a").attr("href"), url).href;
      const thumbnail = new URL($(el).find("img").attr("src"), BASE_URL).href;
      const category = $(".breadcrumb li:nth-child(3) a").text().trim() || "Default";
      // const category = $(".breadcrumb li.active").text().trim() || "Default";

      allBooks.push({
        title,
        price,
        availability,
        inStock,
        rating,
        bookUrl,
        thumbnail,
        category,
      });

    });

    const next = $(".next a").attr("href");
    url = next ? new URL(next, url).href : null;
  }

  // ✅ Clear & Save
  await Book.deleteMany({});
  await Book.insertMany(allBooks);

  console.log("📚 Books scraped & saved:", allBooks.length);
  process.exit(0);
}

connectDB().then(scrapeBooks);
