import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_USER = process.env.REACT_APP_API_USER || "admin";
const API_PASS = process.env.REACT_APP_API_PASS || "admin123";

function authHeaders(extra = {}) {
  return {
    Authorization: "Basic " + btoa(`${API_USER}:${API_PASS}`),
    "Content-Type": "application/json",
    ...extra,
  };
}

function App() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [notification, setNotification] = useState("");
  const [form, setForm] = useState({
    title: "",
    poster: "",
    genre: "",
    watched: false,
  });

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line
  }, []);

  function fetchMovies() {
    fetch(`${API_URL}/api/movies`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: form.title,
      posterUrl: form.poster,
      genre: form.genre,
      watched: form.watched,
    };

    fetch(`${API_URL}/api/movies`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Create failed " + r.status);
        return r.json();
      })
      .then((created) => {
        setMovies((m) => [...m, created]);
        showNotification("Movie added successfully!");
        setForm({ title: "", poster: "", genre: "", watched: false });
      })
      .catch((err) => {
        console.error(err);
        showNotification("Error adding movie");
      });
  }

  function deleteMovie(id) {
    fetch(`${API_URL}/api/movies/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Delete failed " + r.status);
        setMovies((m) => m.filter((x) => x.id !== id));
        showNotification("Movie removed from watchlist!");
      })
      .catch((err) => {
        console.error(err);
        showNotification("Error removing movie");
      });
  }

  function toggleWatched(id) {
    fetch(`${API_URL}/api/movies/${id}/toggle`, {
      method: "PUT",
      headers: authHeaders(),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Toggle failed " + r.status);
        return r.json();
      })
      .then((updated) => {
        setMovies((m) => m.map((x) => (x.id === updated.id ? updated : x)));
        showNotification("Status updated!");
      })
      .catch((err) => {
        console.error(err);
        showNotification("Error updating status");
      });
  }

  function getFiltered() {
    if (filter === "all") return movies;
    if (filter === "watched") return movies.filter((m) => m.watched);
    return movies.filter((m) => !m.watched);
  }

  const watchedCount = movies.filter((m) => m.watched).length;

  return (
    <div className="container">
      <header>
        <div className="logo">

<svg width="46" height="46" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Watchlist app logo">
  <title>Watchlist App Logo</title>
  <desc>Rounded square with play triangle and checkmark to suggest a movie watchlist</desc>
  <defs>
    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect x="16" y="16" width="224" height="224" rx="44" fill="#4FC3F7" filter="url(#softShadow)"/>
  <path d="M108 88 L160 120 L108 152 Z" fill="white" opacity="0.95"/>
  <path d="M92 168 q10 10 20 20 q28 -28 52 -60" fill="none" stroke="white" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <h1>CineList</h1>
        </div>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search your watchlist..."
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              if (!q) {
                fetchMovies();
                return;
              }
              // client-side search
              setMovies((prev) =>
                prev.filter(
                  (m) =>
                    m.title.toLowerCase().includes(q) ||
                    (m.genre || "").toLowerCase().includes(q)
                )
              );
            }}
          />
        </div>
      </header>

      <div className="content">
        <section className="form-section">
          <h2 className="form-title">
            <i className="fas fa-plus-circle"></i> Add New Movie
          </h2>
          <form id="movie-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="title">Movie Title</label>
              <input
                type="text"
                id="title"
                placeholder="Enter movie title"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="poster">Poster URL</label>
              <input
                type="url"
                id="poster"
                placeholder="Enter poster image URL"
                required
                value={form.poster}
                onChange={(e) => setForm({ ...form, poster: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label htmlFor="genre">Genre</label>
              <select
                id="genre"
                required
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              >
                <option value="">Select genre</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Thriller">Thriller</option>
              </select>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="watched"
                checked={form.watched}
                onChange={(e) => setForm({ ...form, watched: e.target.checked })}
              />
              <label htmlFor="watched">Mark as watched</label>
            </div>
            <button type="submit">
              Add to Watchlist <i className="fas fa-plus"></i>
            </button>
          </form>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-value" id="total-movies">
                {movies.length}
              </div>
              <div className="stat-label">Total Movies</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" id="watched-movies">
                {watchedCount}
              </div>
              <div className="stat-label">Watched</div>
            </div>
          </div>
        </section>

        <section className="movies-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-film"></i> Your Movie Watchlist
            </h2>
            <div className="filters">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                data-filter="all"
                onClick={() => setFilter("all")}
              >
                <i className="fas fa-list"></i> All
              </button>
              <button
                className={`filter-btn ${filter === "watched" ? "active" : ""}`}
                data-filter="watched"
                onClick={() => setFilter("watched")}
              >
                <i className="fas fa-check-circle"></i> Watched
              </button>
              <button
                className={`filter-btn ${
                  filter === "unwatched" ? "active" : ""
                }`}
                data-filter="unwatched"
                onClick={() => setFilter("unwatched")}
              >
                <i className="fas fa-clock"></i> Unwatched
              </button>
            </div>
          </div>
          <div className="movies-grid" id="movies-container">
            {getFiltered().length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-film"></i>
                <p>No movies found. Add some movies!</p>
              </div>
            ) : (
              getFiltered().map((movie) => (
                <div className="movie-card" key={movie.id}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x600?text=No+Image";
                    }}
                  />
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-genre">
                      <i className="fas fa-tag"></i> {movie.genre}
                    </p>
                    <div className="movie-status">
                      <div className="status-badge">
                        <span
                          className={`status-indicator ${
                            movie.watched ? "watched" : "not-watched"
                          }`}
                        ></span>
                        {movie.watched ? "Watched" : "Not Watched"}
                      </div>
                      <div className="movie-actions">
                        <button
                          className="action-btn toggle-btn"
                          data-id={movie.id}
                          onClick={() => toggleWatched(movie.id)}
                        >
                          <i className={`fas ${movie.watched ? "fa-undo" : "fa-check"}`}></i>
                        </button>
                        <button
                          className="action-btn delete-btn"
                          data-id={movie.id}
                          onClick={() => deleteMovie(movie.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {notification && (
        <div className={`notification show`} id="notification">
          <i className="fas fa-check-circle"></i>
          <div>{notification}</div>
        </div>
      )}

      <div
        className="floating-btn"
        id="scroll-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-arrow-up"></i>
      </div>
    </div>
  );
}

export default App;
