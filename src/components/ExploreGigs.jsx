import { useEffect, useState } from "react";
import { GIG_API, ORDER_API } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GigCard from "./GigCard";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import { setOwnedGigs } from "../redux/authSlice"; // ✅ import action

const ExploreGigs = () => {
  const [allGigs, setAllGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, ownedGigs } = useSelector((state) => state.auth); // ✅ single source

  const categories = [
    "All",
    "Graphics & Design",
    "Writing",
    "Video & Animation",
    "Programming",
  ];

  // ✅ Fetch all gigs
  useEffect(() => {
    fetchAllGigs();
  }, []);

  // ✅ Fetch owned gigs once if client
 useEffect(() => {
  const fetchOwnedGigs = async () => {
    if (user?.role !== "client") return;

    try {
      const res = await apiConnector("GET", ORDER_API.GET_MY_ORDERS);
      dispatch(setOwnedGigs(res.ownedGigs)); // ✅ Redux
    } catch (err) {
      console.error("Failed to fetch owned gigs", err);
    }
  };

  fetchOwnedGigs();
}, [user]);


  // ✅ Filter gigs
  useEffect(() => {
    filterGigs();
  }, [searchQuery, selectedCategory, allGigs]);

  const fetchAllGigs = async () => {
    try {
      const res = await apiConnector("GET", GIG_API.GET_ALL_GIGS);
      setAllGigs(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gigs");
    }
  };

  const fetchOwnedGigs = async () => {
    try {
      const res = await apiConnector("GET", ORDER_API.GET_MY_ORDERS);
      const orders = res?.orders || [];

      const ownedIds = orders.map((order) =>
        typeof order.gigId === "string" ? order.gigId : order.gigId._id
      );

      dispatch(setOwnedGigs(ownedIds)); // ✅ store in Redux
    } catch (err) {
      console.error("Failed to fetch owned gigs", err);
    }
  };

  const filterGigs = () => {
    let gigs = [...allGigs];

    if (selectedCategory && selectedCategory !== "All") {
      gigs = gigs.filter((gig) => gig.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      gigs = gigs.filter((gig) =>
        gig.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGigs(gigs);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
        Explore Freelance Gigs
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search gigs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-green-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Gigs Grid */}
      {filteredGigs.length === 0 ? (
        <p className="text-center text-gray-600">No gigs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => (
            <GigCard
              key={gig._id}
              gig={gig}
              owned={ownedGigs?.includes(gig._id)} 
            />
          ))}
        </div>
      )}

      {/* Optional Login Prompt for Buy */}
      <ConfirmationModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onConfirm={() => navigate("/login")}
        message="You must be logged in to buy a gig. Would you like to login now?"
      />
    </div>
  );
};

export default ExploreGigs;
