import { useEffect, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { ORDER_API } from "../services/apis";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/unauthorized");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await apiConnector("GET", ORDER_API.GET_MY_ORDERS);
        setOrders(res);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading orders...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🛒 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't placed any orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => {
            const gig = order.gigId;
            const imageUrl =
              gig?.cover?.url ||
              gig?.cover ||
              "https://via.placeholder.com/150?text=Gig+Image";

            return (
              <div
                key={order._id}
                className="bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="flex items-center gap-4 p-4">
                  <img
                    src={imageUrl}
                    alt={gig?.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                      {gig?.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Seller:{" "}
                      <span className="text-gray-800 font-medium">
                        {order.sellerId?.name || "Unknown"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">₹{order.amount}</span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
