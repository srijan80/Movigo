import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Nav from "./Nav";

export default function Music() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  const moods = [
    {
      name: "Happy",
      tag: "happy",
      icon: "😊",
      description: "Upbeat and cheerful tunes",
    },
    {
      name: "Melancholic",
      tag: "sad",
      icon: "😢",
      description: "Emotional and reflective songs",
    },
    {
      name: "Energetic",
      tag: "dance",
      icon: "🎉",
      description: "High-energy dance tracks",
    },
    {
      name: "Romantic",
      tag: "romantic",
      icon: "❤️",
      description: "Love songs and slow jams",
    },
    {
      name: "Focused",
      tag: "classical",
      icon: "🎯",
      description: "Concentration and study music",
    },
    {
      name: "Chill",
      tag: "chill",
      icon: "😌",
      description: "Relaxing and peaceful vibes",
    },
    {
      name: "Workout",
      tag: "workout",
      icon: "💪",
      description: "High-energy motivation tracks",
    },
    {
      name: "Party",
      tag: "party",
      icon: "🎸",
      description: "Party and celebration hits",
    },
  ];

  const API_KEY = " 28a715e32d06b1e98c105b802bafe2dc";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const fetchTracks = async (mood) => {
    setLoading(true);
    setError(null);
    setSelectedMood(mood);

    try {
      const response = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${mood.tag}&api_key=${API_KEY}&format=json`
      );

      const shuffledTracks = response.data.tracks.track
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      setTracks(shuffledTracks);
    } catch (error) {
      setError("Failed to fetch music. Please try again later.");
      console.error("Error fetching music:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white ">
        <Nav />

      <button
        onClick={() => navigate("/movie")}
        className="m-4 gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Back
      </button>
      <div className="flex justify-between items-center p-8 ">
        
        <h2 className="text-4xl font-bold">Music Mood {selectedMood?.icon}</h2>
      </div>
      <div className="grid p-8 grid-cols-2 md:grid-cols-4 gap-4 ">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => fetchTracks(mood)}
            className={`p-4 rounded-xl transition duration-300 transform hover:scale-105 
              ${
                selectedMood?.name === mood.name ? "bg-blue-600" : "bg-gray-800"
              }`}
          >
            <div className="text-2xl mb-2">{mood.icon}</div>
            <div className="font-semibold mb-1">{mood.name}</div>
            <div className="text-xs opacity-75">{mood.description}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500 p-4 rounded-lg text-center">{error}</div>
      )}

      {loading && <div className="text-center py-8">Loading...</div>}

      {tracks.length > 0 && !loading && (
        <div className="grid p-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <div key={track.name} className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-xl font-bold mb-2">{track.name}</h3>
              <p className="text-gray-400 text-sm">{track.artist.name}</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  track.name + " " + track.artist.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block px-4 py-2 bg-blue-600 rounded-lg text-white"
              >
                Play on YouTube
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
