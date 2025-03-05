import React, { useEffect, useState } from "react";
import Navbar from "./Nav";
import { useNavigate } from "react-router-dom";

export default function Fav() {
  const navigate = useNavigate();
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    console.log("Stored Favorites in useEffect:", storedFavorites); 
    setFavoriteMovies(storedFavorites);
  }, []);


  
  const handleWatchNow = (movieId) => {
    window.open(`https://vidsrc.cc/v2/embed/movie/${movieId}?autoPlay=false`, "_blank");
  };

  const handleUnbookmark = (movieId) => {
    const updatedFavorites = favoriteMovies.filter((movie) => movie.id !== movieId);
    setFavoriteMovies(updatedFavorites);
    localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites)); 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <button
        onClick={() => navigate("/movie")}
        className="m-4 items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Back
      </button>
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-6">Favorite Movies</h2>

        {favoriteMovies.length === 0 ? (
          <p className="text-gray-400 text-lg">No favorite movies added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteMovies.map((movie) => (
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
                </div>

                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>

                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span>📅 {movie.release_date}</span>
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  </div>

                 
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {movie.overview.length > 100 ? movie.overview.substring(0, 100) + "..." : movie.overview}
                  </p>

                 
                  <div className="flex gap-2">
                   
                    <button
                      onClick={() => handleWatchNow(movie.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
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
                    </button>

                   
                    <button
                      onClick={() => handleUnbookmark(movie.id)}
                      className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500 transition-colors"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
