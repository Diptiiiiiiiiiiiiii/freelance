// src/pages/SavedGigs.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { SAVED_GIGS_API } from "../services/apis";
import toast from "react-hot-toast";
import GigCard from "../components/GigCard";

const SavedGigs = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [savedGigs, setSavedGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/unauthorized");
      return;
    }

    const fetchSavedGigs = async () => {
      try {
        const res = await apiConnector("GET", SAVED_GIGS_API.GET_SAVED_GIGS);
        setSavedGigs(res);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch saved gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedGigs();
  }, [user, navigate]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading your saved gigs...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        💾 Your Saved Gigs
      </h1>

      {savedGigs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven't saved any gigs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedGigs;
