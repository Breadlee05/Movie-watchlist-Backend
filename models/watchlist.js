const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movies: [
        {
            movieId: String,   // You can also store title, poster, etc.
            title: String,
            poster: String,
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);
