# 🎬 Movie Watchlist - Backend

This is the **backend** of the Movie Watchlist application built with **Node.js, Express, and MongoDB**.  
It handles user authentication, watchlist management, and integrates with the **OMDb API** for movie data.

---

## 🔗 Live API

Base URL: [https://movie-watchlist-backend-ksvq.onrender.com](https://movie-watchlist-backend-ksvq.onrender.com)  
 
Deployment 
This project is deployed on Vercel:
Production URL: https://movie-watchlist-breadlee.vercel.app/

Example endpoints:
- `POST /api/signup` → Create a new user  
- `POST /api/login` → Login and get JWT token  
- `GET /api/watchlist` → Fetch user’s watchlist (requires JWT)  
- `POST /api/watchlist` → Add a movie to watchlist  
- `DELETE /api/watchlist/:movieId` → Remove a movie  
- `GET /api/movies/search?query=batman` → Search movies (OMDb API)  

---

## 🛠 Features

- User authentication with JWT
- MongoDB database integration with Mongoose
- Secure password hashing with bcrypt
- Movie search using OMDb API
- Watchlist CRUD operations
- Deployed on **Render**

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (MongoDB Atlas)
- **Authentication:** JWT, bcrypt
- **API Integration:** OMDb API
- **Deployment:** Render

---

📁 Frontend Repo

The frontend for this project is here:
https://github.com/Breadlee05/Movie-watchlist-Frontend

👨‍💻 Author :
P.Breadlee 
GitHub: https://github.com/Breadlee05
Portfolio: https://breadlee-portfolio.vercel.app/
