import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { GIG_API } from "../services/apis";
import ConfirmationModal from "../components/ConfirmationModal";
import GigCard from "../components/GigCard";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyGigs = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);

  useEffect(() => {
    if (user && user.role !== "freelancer") {
      toast.error("Only freelancers can view this page.");
      navigate("/");
    } else {
      fetchMyGigs();
    }
  }, [user, navigate]);

  const fetchMyGigs = async () => {
    try {
      const result = await apiConnector("GET", GIG_API.GET_MY_GIGS);

      // 👇 No need to manually remap `userId`, backend already populates name
      setGigs(result);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch gigs.");
    }
  };

  const handleDelete = async () => {
    try {
      await apiConnector("DELETE", GIG_API.DELETE_GIG(selectedGig._id));
      toast.success("Gig deleted successfully!");
      setGigs((prev) => prev.filter((g) => g._id !== selectedGig._id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete gig.");
    } finally {
      setSelectedGig(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-extrabold text-green-700 mb-6">My Gigs</h1>

      {gigs.length === 0 ? (
        <p className="text-gray-600">You haven't posted any gigs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} onDelete={setSelectedGig} />
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={!!selectedGig}
        onClose={() => setSelectedGig(null)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete "${selectedGig?.title}"?`}
      />
    </div>
  );
};

export default MyGigs;
