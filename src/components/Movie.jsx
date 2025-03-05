import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Star, Info, Heart, LogOut, UserX, Key } from "lucide-react";

export default function Movie() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const moods = [
    {
      name: "Happy",
      genre: 35,
      icon: "😊",
      description: "Feel-good comedies and light-hearted films",
    },
    {
      name: "Adventurous",
      genre: 12,
      icon: "🌎",
      description: "Epic journeys and explorations",
    },
    {
      name: "Romantic",
      genre: 10749,
      icon: "💝",
      description: "Love stories and relationships",
    },
    {
      name: "Excited",
      genre: 28,
      icon: "🎬",
      description: "Action-packed and thrilling",
    },
    {
      name: "Thoughtful",
      genre: 18,
      icon: "🤔",
      description: "Drama and thought-provoking stories",
    },
    {
      name: "Mysterious",
      genre: 9648,
      icon: "🔍",
      description: "Intriguing mysteries and suspense",
    },
    {
      name: "Nostalgic",
      genre: 16,
      icon: "✨",
      description: "Classic and animated favorites",
    },
    {
      name: "Inspired",
      genre: 99,
      icon: "💫",
      description: "Documentaries and true stories",
    },
  ];

  const API_KEY = "31546f9b0e671832ecdaa48be1889ed7";
  const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTU0NmY5YjBlNjcxODMyZWNkYWE0OGJlMTg4OWVkNyIsInN1YiI6IjY3NTk5YzA2ZGEzYmQzOWI4Nzg2MGU4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gck1ZvDLYbZbLhSHC5XNChFBjs_MMhClS8wBDz-bbGo";

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }


    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    setFavorites(new Set(storedFavorites.map(fav => fav.id)));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };



  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
  
      await axios.delete("http://localhost:5000/api/users", {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
  
      
      localStorage.clear();
      
     
      setShowDeleteConfirm(false);
      setError(null);
      
      
      navigate("/");
    } catch (error) {
      console.error('Failed to delete account:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(`Failed to delete account: ${errorMessage}`);
      setShowDeleteConfirm(false);
    }
  };


  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const fetchMovies = async (mood) => {
    setLoading(true);
    setError(null);
    setSelectedMood(mood);

    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
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
        }
      );

      const moviesWithDetails = await Promise.all(
        response.data.results
          .sort(() => Math.random() - 0.5)
          .slice(0, 8)
          .map(async (movie) => {
            try {
              const details = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}`,
                {
                  params: { api_key: API_KEY },
                  headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
                }
              );
              return { ...movie, details: details.data };
            } catch (error) {
              console.error(
                `Error fetching details for movie ${movie.id}:`,
                error
              );
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
    const storedFavorites =
      JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    const isFavorite = storedFavorites.some((fav) => fav.id === movie.id);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = storedFavorites.filter((fav) => fav.id !== movie.id);
    } else {
      updatedFavorites = [...storedFavorites, movie];  
    }

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
      
  
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-12 px-4">


      <div className="flex gap-4">
            <button
              onClick={() => navigate("/Music")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Music
            </button>

            <button
              onClick={() => navigate("/Search")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Search
            </button>

            {/* <button
              onClick={() => navigate("/Favorites")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Favorites
            </button> */}

        

            <button
              onClick={handleChangePassword}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <UserX className="w-4 h-4" />
              Delete Account
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>


        <div className="flex pt-4 justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">
            What's Your Mood Today? {selectedMood?.icon}
          </h2>

          
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => fetchMovies(mood)}
              className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 
                ${
                  selectedMood?.name === mood.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              <div className="text-2xl mb-2">{mood.icon}</div>
              <div className="font-semibold mb-1">{mood.name}</div>
              <div className="text-xs opacity-75">{mood.description}</div>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {movies.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-84 object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/450";
                    }}
                  />
                  <div className="absolute top-4 right-4 flex gap-2"></div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {movie.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                    {movie.details?.runtime && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatRuntime(movie.details.runtime)}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {movie.overview}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.details?.genres?.slice(0, 3).map((genre) => (
                      <span
                        key={genre.id}
                        className="px-2 py-1 text-xs rounded-full bg-blue-600/20 text-blue-400"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWatchNow(movie.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Watch Now
                      </div>
                    </button>
                    <div>
                      <button
                        onClick={() => toggleFavorite(movie)}
                        className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`w-5 h-5 ${
                            favorites.has(movie.id)
                              ? "text-blue-500"
                              : "text-gray-400"
                          } transition-colors`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}