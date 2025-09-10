require("dotenv").config(); // ✅ Load .env variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("./models/User");
const Watchlist = require("./models/watchlist");
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// ================= AUTH ROUTES =================

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= WATCHLIST ROUTES =================

// Get watchlist
app.get("/api/watchlist", auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.userId });
    res.json({ movies: watchlist?.movies || [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add movie manually
app.post("/api/watchlist", auth, async (req, res) => {
  const { movieId, title, poster } = req.body;
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (!watchlist) watchlist = new Watchlist({ user: req.user.userId, movies: [] });

    if (!watchlist.movies.some(m => m.movieId === movieId)) {
      watchlist.movies.push({ movieId, title, poster });
      await watchlist.save();
    }

    res.json({ movies: watchlist.movies });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove movie
app.delete("/api/watchlist/:movieId", auth, async (req, res) => {
  const { movieId } = req.params;
  try {
    const watchlist = await Watchlist.findOne({ user: req.user.userId });
    if (watchlist) {
      watchlist.movies = watchlist.movies.filter(m => m.movieId !== movieId);
      await watchlist.save();
    }
    res.json({ movies: watchlist?.movies || [] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= OMDb MOVIE SEARCH =================
app.get("/api/movies/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`
    );

    if (response.data.Response === "False") {
      return res.status(404).json({ message: response.data.Error });
    }

    const movies = response.data.Search.map((movie) => ({
      movieId: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));

    res.json({ movies });
  } catch (err) {
    console.error("OMDb API error:", err);
    res.status(500).json({ message: "Error fetching from OMDb" });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
