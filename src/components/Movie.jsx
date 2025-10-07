import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Star } from "lucide-react";

export default function Movie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const moods = [
    { name: "Happy", genre: 35, icon: "😊", description: "Feel-good comedies and light-hearted films" },
    { name: "Adventurous", genre: 12, icon: "🌎", description: "Epic journeys and explorations" },
    { name: "Romantic", genre: 10749, icon: "💝", description: "Love stories and relationships" },
    { name: "Excited", genre: 28, icon: "🎬", description: "Action-packed and thrilling" },
    { name: "Thoughtful", genre: 18, icon: "🤔", description: "Drama and thought-provoking stories" },
    { name: "Mysterious", genre: 9648, icon: "🔍", description: "Intriguing mysteries and suspense" },
    { name: "Nostalgic", genre: 16, icon: "✨", description: "Classic and animated favorites" },
    { name: "Inspired", genre: 99, icon: "💫", description: "Documentaries and true stories" },
  ];

  const API_KEY = "31546f9b0e671832ecdaa48be1889ed7";
  const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTU0NmY5YjBlNjcxODMyZWNkYWE0OGJlMTg4OWVkNyIsInN1YiI6IjY3NTk5YzA2ZGEzYmQzOWI4Nzg2MGU4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gck1ZvDLYbZbLhSHC5XNChFBjs_MMhClS8wBDz-bbGo";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    setFavorites(new Set(storedFavorites.map((fav) => fav.id)));
  }, [navigate]);

  const fetchMovies = async (mood) => {
    setLoading(true);
    setError(null);
    setSelectedMood(mood);

    try {
      const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: {
          api_key: API_KEY,
          with_genres: mood.genre,
          language: "en-US",
          sort_by: "popularity.desc",
          "vote_average.gte": 6,
          page: Math.floor(Math.random() * 5) + 1,
          with_original_language: "en",
        },
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });

      const moviesWithDetails = await Promise.all(
        response.data.results
          .sort(() => Math.random() - 0.5)
          .slice(0, 8)
          .map(async (movie) => {
            try {
              const details = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                params: { api_key: API_KEY },
                headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
              });
              return { ...movie, details: details.data };
            } catch (error) {
              console.error(`Error fetching details for movie ${movie.id}:`, error);
              return movie;
            }
          })
      );

      setMovies(moviesWithDetails);
    } catch (error) {
      setError("Failed to fetch movies. Please try again later.");
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (movie) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const isFavorite = storedFavorites.some((fav) => fav.id === movie.id);
    let updatedFavorites = isFavorite
      ? storedFavorites.filter((fav) => fav.id !== movie.id)
      : [...storedFavorites, movie];

    localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
    setFavorites(new Set(updatedFavorites.map((fav) => fav.id)));
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleWatchNow = (movieId) => {
    const embedUrl = `https://vidsrc.cc/v2/embed/movie/${movieId}?autoPlay=true`;
    window.open(embedUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-900">
  <Nav />

  <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 container mx-auto max-w-full">
    {/* Navigation Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <button
        onClick={() => navigate("/Music")}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm sm:text-base"
      >
        Music
      </button>
      <button
        onClick={() => navigate("/Search")}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm sm:text-base"
      >
        Search
      </button>
    </div>

    {/* Mood Heading */}
    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
      What's Your Mood Today? {selectedMood?.icon}
    </h2>

    {/* Mood Buttons - horizontal scroll on mobile */}
<div className="flex flex-col sm:grid sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6 sm:mb-8">
  {moods.map((mood) => (
    <button
      key={mood.name}
      onClick={() => fetchMovies(mood)}
      className={`p-3 sm:p-4 rounded-lg transition-transform transform hover:scale-105 active:scale-95
        ${
          selectedMood?.name === mood.name
            ? "bg-blue-600 text-white shadow-lg"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
    >
      <div className="text-xl sm:text-2xl mb-1">{mood.icon}</div>
      <div className="font-semibold text-sm sm:text-base">{mood.name}</div>
      <div className="text-xs opacity-75 hidden sm:block">{mood.description}</div>
    </button>
  ))}
</div>


    {/* Movie Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-56 sm:h-64 md:h-72 object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/500x750?text=No+Image")}
          />
          <div className="p-3">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 line-clamp-2">{movie.title}</h3>
            <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              {movie.details?.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {formatRuntime(movie.details.runtime)}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                {movie.vote_average.toFixed(1)}
              </div>
            </div>

            <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">{movie.overview}</p>

            <div className="flex flex-wrap gap-1 mb-2">
              {movie.details?.genres?.slice(0, 3).map((genre) => (
                <span key={genre.id} className="px-2 py-0.5 text-xs rounded-full bg-blue-600/20 text-blue-400">
                  {genre.name}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleWatchNow(movie.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium"
            >
              Watch Now
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}