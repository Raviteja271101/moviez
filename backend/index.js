const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Define PORT first
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "https://moviez-phi.vercel.app",  // production
    "http://localhost:3000"           // development
  ],
  methods: ["GET", "POST", "OPTIONS"], // Added OPTIONS for preflight
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

// Sample route
app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend is connected to Backend!" });
});

// Schema & Model
const searchTrendSchema = new mongoose.Schema({
  searchTerm: { type: String, required: true, unique: true, trim: true, lowercase: true },
  count: { type: Number, default: 1 },
  movie_id: { type: Number, required: true },
  poster_url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SearchTrend = mongoose.model("SearchTrend", searchTrendSchema);

// Routes
app.post("/api/search", async (req, res) => {
  const { searchTerm, movie_id, poster_url } = req.body;
  console.log("Search saved:", { searchTerm, movie_id, poster_url });

  try {
    let trend = await SearchTrend.findOne({ searchTerm });

    if (trend) {
      trend.count += 1;
      trend.updatedAt = Date.now();
      await trend.save();
    } else {
      trend = await SearchTrend.create({
        searchTerm,
        movie_id,
        poster_url,
      });
    }

    res.json(trend);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/trending-movies", async (req, res) => {
  try {
    const movies = await SearchTrend.find({})
      .sort({ count: -1 })
      .limit(10)
      .lean();

    res.json(movies);
  } catch (error) {
    console.error("❌ Error fetching trending movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});
