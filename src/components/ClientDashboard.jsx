import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle, FaShoppingCart, FaBookmark, FaComments } from "react-icons/fa";

const ClientDashboard = () => {
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

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Orders */}
        <Link
          to="/my-orders"
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:border-green-500 transition duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <FaShoppingCart className="text-2xl text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
          </div>
          <p className="text-gray-600">View and manage all your orders in one place.</p>
        </Link>

        {/* Saved Gigs */}
        <Link
          to="/saved-gigs"
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:border-blue-500 transition duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <FaBookmark className="text-2xl text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Saved Gigs</h2>
          </div>
          <p className="text-gray-600">Gigs you’ve bookmarked for later.</p>
        </Link>

        {/* Chat / Messages */}
        <Link
          to="/chat"
          className="p-6 bg-white rounded-2xl border border-gray-200 shadow hover:shadow-lg hover:border-purple-500 transition duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <FaComments className="text-2xl text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          </div>
          <p className="text-gray-600">Chat with freelancers you've ordered from.</p>
        </Link>
      </div>
    </div>
  );
};

export default ClientDashboard;
