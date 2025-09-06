import { useEffect, useMemo, useState } from "react";
import "./index.css"; // Tailwind required

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const LIMIT = 12;

function IconChartPlaceholder() {
  return (
    <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="11" width="3" height="8" rx="1.2" className="fill-current text-blue-200" />
      <rect x="8.5" y="6" width="3" height="13" rx="1.2" className="fill-current text-blue-300" />
      <rect x="14" y="3" width="3" height="16" rx="1.2" className="fill-current text-blue-400" />
    </svg>
  );
}

function KPI({ title, value, delta, icon }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
      <div className="p-3 rounded-md bg-blue-50">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        {delta && <div className="text-xs text-green-600 mt-1">{delta}</div>}
      </div>
    </div>
  );
}

export default function App() {
  // data + filters
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [rating, setRating] = useState("");

  // UI
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [basket, setBasket] = useState([]);

  const categories = useMemo(() => [
    "Travel","Mystery","Historical Fiction","Classics","Romance","Fantasy",
    "Science Fiction","Poetry","Horror","Business","Thriller","Fiction",
    "Philosophy","Nonfiction","Biography","History"
  ], []);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // Reset page when filters change
  useEffect(() => setPage(1), [search, category, minPrice, maxPrice, inStock, rating]);

  useEffect(() => {
    const q = new URLSearchParams();
    q.set("page", page);
    q.set("limit", LIMIT);
    if (search) q.set("search", search);
    if (category) q.set("category", category);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    if (inStock) q.set("inStock", "true");
    if (rating) q.set("rating", rating);

    fetch(`${API_BASE}/books?${q.toString()}`)
      .then(r => r.json())
      .then(data => {
        setBooks(data.books || []);
        setTotal(data.total || 0);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [page, search, category, minPrice, maxPrice, inStock, rating]);

  // smart page numbers window (max 5 visible)
  const pageNumbers = useMemo(() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, page - 2);
    let end = start + maxVisible - 1;
    if (end > totalPages) { end = totalPages; start = totalPages - maxVisible + 1; }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  function addToBasket(book) {
    setBasket(b => [...b, book]);
  }

  function removeFromBasket(index) {
    setBasket(b => b.filter((_, i) => i !== index));
  }

  // small UI helpers
  const totalAmount = basket.reduce((s, it) => s + (it.price || 0), 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Top layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-600">Book Explorer</h2>
            <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
          </div>

          <nav className="px-4 pb-6">
            <ul className="space-y-1">
              <li className="px-3 py-2 rounded-md bg-blue-50 text-blue-700 font-medium">Dashboard</li>
              <li className="px-3 py-2 rounded-md hover:bg-gray-100">Books</li>
              <li className="px-3 py-2 rounded-md hover:bg-gray-100">Scraper</li>
              <li className="px-3 py-2 rounded-md hover:bg-gray-100">Analytics</li>
              <li className="px-3 py-2 rounded-md hover:bg-gray-100">Settings</li>
            </ul>
          </nav>

          <div className="px-4">
            <div className="text-xs text-gray-500">Quick Filters</div>
            <div className="mt-2 space-y-2">
              <button onClick={() => { setCategory(""); setSearch(""); }} className="w-full text-left px-3 py-2 bg-gray-100 rounded">Clear Filters</button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <input
                  className="border rounded-lg p-2 w-80 focus:ring-2 focus:ring-blue-500"
                  placeholder="Search books, authors..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
  value={category}
  onChange={e => setCategory(e.target.value)}
>
  <option value="">All categories</option>
  {categories.map(c => (
    <option key={c} value={c}>{c}</option>
  ))}
</select>
                <select value={rating} onChange={e => setRating(e.target.value)} className="border rounded p-2">
                  <option value="">All ratings</option>
                  <option value="One">⭐</option>
                  <option value="Two">⭐⭐</option>
                  <option value="Three">⭐⭐⭐</option>
                  <option value="Four">⭐⭐⭐⭐</option>
                  <option value="Five">⭐⭐⭐⭐⭐</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4">
                <KPI title="Total Books" value={total} delta="+4.2%" icon={<IconChartPlaceholder/>} />
                <KPI title="In Cart" value={basket.length} />
              </div>
              <button onClick={() => setCartOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Cart ({basket.length})</button>
            </div>
          </div>

          {/* KPI row (mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:hidden">
            <KPI title="Total" value={total} icon={<IconChartPlaceholder/>} />
            <KPI title="In Cart" value={basket.length} />
            <KPI title="Avg Price" value={`£${(total ? (books.reduce((s, b) => s + (b.price || 0), 0) / books.length || 0).toFixed(2) : "0.00")}`} />
          </div>

          {/* Content area: left = list, right = mini-analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: book grid */}
            <section className="lg:col-span-3">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">Showing <span className="font-semibold">{books.length}</span> books — Page <span className="font-semibold">{page}</span> of {totalPages}</div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500 mr-2">Show</label>
                  <select value={LIMIT} disabled className="border p-1 rounded">12</select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map(b => (
                  <article key={b._id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden">
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img src={b.thumbnail} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2">{b.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">{b.category}</div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <div className="text-sm text-gray-700 font-medium">£{b.price}</div>
                          <div className={`text-xs ${b.inStock ? "text-green-600" : "text-red-600"}`}>{b.availability}</div>
                        </div>
                        <div className="flex flex-col gap-2 w-32">
                          <button onClick={() => { addToBasket(b); }} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Add</button>
                          <button onClick={() => setSelectedBook(b)} className="border px-2 py-1 rounded text-sm">Details</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination (smart, compact + dots) */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50">Prev</button>

                {/* first + dots if needed */}
                {pageNumbers[0] > 1 && (
                  <>
                    <button onClick={() => setPage(1)} className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50">1</button>
                    {pageNumbers[0] > 2 && <span className="px-2">…</span>}
                  </>
                )}

                {/* visible pages */}
                {pageNumbers.map((num, idx) => (
                  <button key={num} onClick={() => setPage(num)} className={`px-3 py-1 rounded-md border ${page === num ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}>{num}</button>
                ))}

                {/* trailing dots + last */}
                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-2">…</span>}
                    <button onClick={() => setPage(totalPages)} className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50">{totalPages}</button>
                  </>
                )}

                <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50 disabled:opacity-50">Next</button>
              </div>

            </section>

            {/* Right: mini analytics / actions */}
            <aside className="lg:col-span-1">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Avg price</div>
                      <div className="text-xl font-bold">£{(books.length ? (books.reduce((s,b)=>s+(b.price||0),0)/books.length).toFixed(2) : "0.00")}</div>
                    </div>
                    <IconChartPlaceholder />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">Quick Actions</div>
                  <div className="mt-3 flex flex-col gap-2">
                    <button onClick={() => fetch(`${API_BASE}/refresh`, { method: 'POST' }).then(()=>alert('Refresh triggered'))} className="w-full border px-3 py-2 rounded">Refresh Scraper</button>
                    <button onClick={() => { setCategory(""); setSearch(""); }} className="w-full bg-gray-100 px-3 py-2 rounded">Clear Filters</button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500">Top categories</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {categories.slice(0,6).map(c => <li key={c} className="flex justify-between"><span>{c}</span><span className="text-gray-500">12</span></li>)}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Selected book modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <button onClick={() => setSelectedBook(null)} className="absolute top-3 right-3 text-gray-500">✕</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <img src={selectedBook.thumbnail} alt={selectedBook.title} className="w-full h-64 object-cover rounded" />
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                <div className="text-sm text-gray-500">{selectedBook.category}</div>
                <p className="mt-3 text-gray-700">{selectedBook.description || "No description available"}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="text-2xl font-semibold">£{selectedBook.price}</div>
                  <div className={`text-sm ${selectedBook.inStock ? "text-green-600" : "text-red-600"}`}>{selectedBook.availability}</div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button onClick={() => { addToBasket(selectedBook); setSelectedBook(null); }} className="bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
                  <button onClick={() => setSelectedBook(null)} className="px-4 py-2 border rounded">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 z-50 bg-white shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Basket ({basket.length})</h3>
            <button onClick={() => setCartOpen(false)} className="text-gray-500">✕</button>
          </div>

          <div className="space-y-3 overflow-y-auto h-[70vh]">
            {basket.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 border-b pb-3">
                <img src={it.thumbnail} alt={it.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-500">£{it.price}</div>
                </div>
                <button onClick={() => removeFromBasket(idx)} className="text-sm px-2 py-1 border rounded">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between font-semibold">
              <div>Total</div>
              <div>£{totalAmount}</div>
            </div>
            <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
