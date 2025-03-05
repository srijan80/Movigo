import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';
import Nav from './Nav'

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
      const response = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            api_key: API_KEY,
            query: searchQuery,
            language: 'en-US',
            page: 1,
            with_original_language: 'en',
          },
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );

      setMovies(response.data.results);
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
      <Nav />
      <button
        onClick={() => navigate("/movie")}
        className="m-4 gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Back
      </button>
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white">Search Movies</h2>
        </div>

        <form onSubmit={handleSearch} className="mb-8 flex items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={isListening ? 'Listening...' : 'Search for a movie...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 w-full rounded-lg bg-gray-700 text-white pr-12"
            />
            <button
              type="button"
              onClick={toggleListening}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
              title={isListening ? 'Stop listening' : 'Start voice search'}
            >
              {isListening ? (
                <Mic className="w-5 h-5 text-blue-500 animate-pulse" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="px-4 ml-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
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
                      e.target.src = '/api/placeholder/300/450';
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{movie.overview}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(`https://vidsrc.cc/v2/embed/movie/${movie.id}?autoPlay=true`, "_blank")
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      Watch Now
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
};

export default Search;

// 28a715e32d06b1e98c105b802bafe2dc