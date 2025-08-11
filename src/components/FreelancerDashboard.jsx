import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle, FaBoxOpen, FaPlusCircle } from "react-icons/fa";

const FreelancerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top: User Info Centered */}
      <div className="text-center mb-10">
        <div className="flex flex-col items-center justify-center">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt="avatar"
            className="w-20 h-20 rounded-full mb-4 border-2 border-emerald-500 shadow"
          />
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserCircle className="text-emerald-600" />
            {user?.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Gigs */}
        <Link
          to="/my-gigs"
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:border-green-500 transition duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <FaBoxOpen className="text-2xl text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">My Gigs</h2>
          </div>
          <p className="text-gray-600">
            View, edit, or delete the gigs you’ve created so far.
          </p>
        </Link>

        {/* Create New Gig */}
        <Link
          to="/create-gig"
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:border-blue-500 transition duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <FaPlusCircle className="text-2xl text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Create New Gig</h2>
          </div>
          <p className="text-gray-600">
            Ready to earn more? Post a new gig and start offering your services.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
