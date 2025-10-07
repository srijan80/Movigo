import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import Nav from "./Nav";

export default function Music() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    { name: "Happy", tag: "happy", icon: "😊", description: "Upbeat tunes" },
    { name: "Sad", tag: "sad", icon: "😢", description: "Emotional songs" },
    { name: "Energetic", tag: "dance", icon: "🎉", description: "Dance tracks" },
    { name: "Romantic", tag: "romantic", icon: "❤️", description: "Love songs" },
    { name: "Focused", tag: "classical", icon: "🎯", description: "Study music" },
    { name: "Chill", tag: "chill", icon: "😌", description: "Relaxing vibes" },
    { name: "Workout", tag: "workout", icon: "💪", description: "Motivation tracks" },
    { name: "Party", tag: "party", icon: "🎸", description: "Party hits" },
  ];

  const API_KEY = "28a715e32d06b1e98c105b802bafe2dc";

  const fetchTracks = async (mood) => {
    setLoading(true);
    setError(null);
    setSelectedMood(mood);

    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood.tag}&api_key=${API_KEY}&format=json`
      );
      const data = await response.json();
      const shuffledTracks = data.tracks.track.sort(() => 0.5 - Math.random()).slice(0, 8);
      setTracks(shuffledTracks);
    } catch (err) {
      setError("Failed to fetch music. Please try again later.");
      console.error("Error fetching music:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Nav />

      {/* Back Button */}
      <button
        onClick={() => navigate("/movie")}
        className="m-2 sm:m-4 gap-2 px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
      </button>

      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full">
        {/* Mood Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
          What's Your Mood? {selectedMood?.icon}
        </h2>

        {/* Mood Buttons - stacked on mobile, grid on larger screens */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => fetchTracks(mood)}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-transform transform hover:scale-105 active:scale-95
                ${
                  selectedMood?.name === mood.name
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{mood.icon}</div>
              <div className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{mood.name}</div>
              <div className="text-xs opacity-75 hidden sm:block">{mood.description}</div>
            </button>
          ))}
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

        {/* Tracks Grid */}
        {tracks.length > 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {tracks.map((track, index) => (
              <div
                key={`${track.name}-${index}`}
                className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg transition-transform hover:scale-105"
              >
                {/* Track Info */}
                <div className="mb-2 sm:mb-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-lg flex-shrink-0">🎵</span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold leading-tight line-clamp-2">
                      {track.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm ml-7 line-clamp-1">{track.artist.name}</p>
                </div>

                {/* Play Button */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    track.name + " " + track.artist.name
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg text-white text-sm sm:text-base font-medium transition-colors"
                >
                  <Play className="w-4 h-4" /> Play on YouTube
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tracks.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="text-6xl sm:text-7xl mb-4">🎵</div>
            <p className="text-gray-400 text-sm sm:text-base">Select a mood to discover music!</p>
          </div>
        )}
      </div>
    </div>
  );
}
