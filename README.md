

📚 Book Explorer App

A full-stack MERN project that scrapes books data from Books to Scrape
, stores it in MongoDB, and provides a professional dashboard to search, filter, and explore books with category filters, price range, ratings, stock availability, and basket support.

🚀 Features

🔎 Search by title

🎛 Filters: category, rating, price range, in-stock only

📖 Book details modal with description, rating, price

🛒 Basket system with cart drawer & checkout preview

📊 Dashboard layout with sidebar, KPIs, and pagination (5-button sliding window with dots)

⚡ Scraper: pulls fresh data (1000+ books) from Books to Scrape and saves in MongoDB

🛠 Tech Stack

Frontend: React + Vite + TailwindCSS

Backend: Node.js + Express

Database: MongoDB (Mongoose)

Scraper: Axios + Cheerio

Styling: TailwindCSS (responsive dashboard layout)

📂 Project Structure
Book Explorer App/
│── backend/        # Express + MongoDB server
│   ├── models/Book.js
│   ├── routes/bookRoutes.js
│   └── server.js
│
│── frontend/       # React + Vite + Tailwind dashboard
│   ├── src/App.jsx
│   ├── src/index.css
│   └── tailwind.config.js
│
│── scraper/        # Web scraper (Books to Scrape)
│   └── scraper.js
│
│── .env            # MongoDB URI + config
│── README.md

⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/NeerajSaini2004/Book-Explorer-App.git
cd "Book Explorer App"

2. Setup MongoDB

Install MongoDB
 locally OR use MongoDB Atlas
.

Create a new database book_explorer.

Get your MongoDB connection string.

3. Configure Environment Variables

In the project root, create a .env file:

MONGODB_URI=mongodb://127.0.0.1:27017/book_explorer
PORT=4000

4. Install Backend
cd backend
npm install


Run backend:

npm run dev


Server will start at:
👉"http://localhost:4000/api"

5. Scrape Book Data
cd scraper
npm install
npm run scrape


✅ This will connect to MongoDB, scrape 1000+ books, and save them with categories.

6. Install Frontend
cd ../frontend
npm install


Run frontend:

npm run dev


👉 Open http://localhost:5173

🎛 Usage

Use the sidebar + topbar filters to refine books.

Click book card → modal with description, price, rating.

Click Add → item added to basket (cart drawer on right).

Use pagination (Prev/Next or numbered buttons with dots).

📸 Screenshots

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/f23e03aa-d5cc-4adc-a0e4-f1773a75d23d" />

🔄 Refresh Data

From dashboard Quick Actions → Refresh Scraper, or run manually:

cd scraper
npm run scrape

✅ Future Improvements

User login & authentication

Wishlist / save for later

Checkout flow with payment integration

Advanced analytics dashboard with charts

👨‍💻 Author

Developed by Your Name Neeraj saini ✨
