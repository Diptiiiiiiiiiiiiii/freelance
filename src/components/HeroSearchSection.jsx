import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { GIG_API } from "../services/apis";
import bgVideo from "../assets/bgVideo.mp4";

const suggested = [
  "web development",
  "architecture & interior design",
  "Writing",
  "video editing",
  "vibe coding",
];

const HeroSearchSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await apiConnector("GET", `${GIG_API.SEARCH_BY_CATEGORY}?q=${query}`);
      navigate("/gigs", { state: { searchResults: res } });
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed");
    }
  };

  return (
    <section className="relative h-[80vh] w-full overflow-hidden text-white">
      {/* 🎥 Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src={bgVideo}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl mb-6">
          Our freelancers <br />
          <span className="text-green-400">will take it from here</span>
        </h1>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl flex bg-white rounded-full overflow-hidden shadow-md"
        >
          <input
            type="text"
            placeholder="Search for any service..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-5 py-3 text-black placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 flex items-center justify-center"
          >
            <Search size={20} className="text-white" />
          </button>
        </form>

        {/* 🔥 Suggested Keywords */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {suggested.map((tag, idx) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="flex items-center gap-1 border border-white/30 px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition text-sm"
            >
              {tag}
              {idx === suggested.length - 1 && (
                <span className="text-yellow-300 text-xs bg-white/10 px-2 py-0.5 rounded-full ml-1">
                  NEW
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSearchSection;
