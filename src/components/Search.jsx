import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, ArrowLeft } from 'lucide-react';
import Nav from './Nav';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  const API_KEY = '31546f9b0e671832ecdaa48be1889ed7';
  const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMTU0NmY5YjBlNjcxODMyZWNkYWE0OGJlMTg4OWVkNyIsInN1YiI6IjY3NTk5YzA2ZGEzYmQzOWI4Nzg2MGU4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gck1ZvDLYbZbLhSHC5XNChFBjs_MMhClS8wBDz-bbGo';

  useEffect(() => {
    const initializeSpeechRecognition = async () => {
      try {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
          await import('https://cdnjs.cloudflare.com/ajax/libs/speech-recognition-polyfill/0.5.0/speech-recognition-polyfill.min.js');
        }

        const SpeechRecognition = 
          window.SpeechRecognition || 
          window.webkitSpeechRecognition || 
          window.SpeechRecognitionPolyfill;

        if (SpeechRecognition) {
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false;
          recognitionInstance.lang = 'en-US';

          recognitionInstance.onstart = () => {
            console.log('Speech recognition started');
            setIsListening(true);
          };

          recognitionInstance.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);
            fetchMovies(transcript);
          };

          recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
              setError('Please allow microphone access to use voice search.');
            } else {
              setError('Speech recognition error. Please try again.');
            }
          };

          recognitionInstance.onend = () => {
            setIsListening(false);
          };

          setRecognition(recognitionInstance);
        }
      } catch (err) {
        console.error('Failed to initialize speech recognition:', err);
        setError('Speech recognition initialization failed. Please try again.');
      }
    };

    initializeSpeechRecognition();
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setError(null);
      try {
        recognition.start();
      } catch (err) {
        console.error('Speech recognition error:', err);
        setError('Error starting speech recognition. Please try again.');
      }
    }
  };

  const fetchMovies = async (searchQuery = query) => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1&with_original_language=en`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <Nav/>
       <button
        onClick={() => navigate("/movie")}
        className="m-4 gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Back
      </button>

      <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
        {/* Search Form */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isListening ? 'Listening...' : 'Search for a movie...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                className="px-4 py-2.5 sm:py-3 w-full rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none pr-12 text-sm sm:text-base"
              />
              <button
                type="button"
                onClick={toggleListening}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                title={isListening ? 'Stop listening' : 'Start voice search'}
              >
                {isListening ? (
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-pulse" />
                ) : (
                  <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors text-sm sm:text-base font-medium whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500 text-white p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12 sm:py-16 lg:py-20">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                  />
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  {movie.release_date && (
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                    {movie.overview}
                  </p>

                  <button
                    onClick={() =>
                      window.open(`https://vidsrc.cc/v2/embed/movie/${movie.id}?autoPlay=true`, "_blank")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 sm:py-2.5 px-4 rounded-lg text-sm sm:text-base font-medium transition-colors"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && query && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-6xl sm:text-7xl mb-4">🔍</div>
            <p className="text-gray-400 text-sm sm:text-base">
              No movies found for "{query}"
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && movies.length === 0 && !query && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-6xl sm:text-7xl mb-4">🎬</div>
            <p className="text-gray-400 text-sm sm:text-base">
              Search for your favorite movies
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;