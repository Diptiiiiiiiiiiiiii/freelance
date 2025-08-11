import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Rating } from "react-simple-star-rating";
import { apiConnector } from "../services/apiConnector";
import { ORDER_API, PAYMENT_API } from "../services/apis";
import toast from "react-hot-toast";

const GigCard = ({ gig, onDelete, owned = false }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const menuRef = useRef();

  const imageUrl =
    typeof gig.cover === "string"
      ? gig.cover
      : gig.cover?.url || "/placeholder.jpg";

  const rating =
    gig.starNumber && gig.totalStars
      ? gig.totalStars / gig.starNumber
      : 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.savedGigs?.includes(gig._id)) {
      setIsSaved(true);
    }
  }, [user, gig._id]);

  const toggleSaveGig = async (e) => {
    e.stopPropagation();

    try {
      if (isSaved) {
        await apiConnector("DELETE", `/saved-gigs/${gig._id}`);
        toast.success("Gig removed from saved list");
      } else {
        await apiConnector("POST", `/saved-gigs/${gig._id}`);
        toast.success("Gig saved!");
      }
      setIsSaved(!isSaved);
    } catch (error) {
      toast.error("Failed to update saved state");
      console.error(error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (
        document.querySelector(
          "script[src='https://checkout.razorpay.com/v1/checkout.js']"
        )
      ) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyNow = async (e) => {
    e?.stopPropagation?.();

    if (!user) return toast.error("Please login to continue");
    if (user.role !== "client")
      return toast.error("Only clients can place orders");

    const loaded = await loadRazorpayScript();
    if (!loaded || typeof window.Razorpay !== "function") {
      toast.error("Failed to load Razorpay SDK");
      return;
    }

    const amount = gig?.price;
    const buyerId = user?.id;
    const gigId = gig?._id;

    if (!amount || !buyerId || !gigId) {
      toast.error("Missing required data to initiate payment");
      return;
    }

    try {
      setPaying(true);

      const order = await apiConnector("POST", PAYMENT_API.CREATE_ORDER, {
        amount,
        buyerId,
        gigId,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Freelance Hub",
        description: gig.title,
        image: "/logo.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            const payload = {
              gigId: gig._id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: gig.price,
            };

            await apiConnector("POST", ORDER_API.CREATE_ORDER, payload);

            toast.success("Order placed successfully!");
            navigate("/my-orders");
          } catch (err) {
            console.error("Order creation failed after payment", err);
            toast.error("Order creation failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#22c55e" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      toast.error("Payment initiation failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/gig/${gig._id}`)}
    >
      {/* 💖 Save Heart Icon - client only */}
      {user?.role === "client" && (
        <button
          onClick={toggleSaveGig}
          className="absolute top-3 left-3 z-10 bg-white p-2 rounded-full shadow hover:scale-105 transition"
        >
          {isSaved ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart className="text-gray-500" size={18} />
          )}
        </button>
      )}

      <img
        src={imageUrl}
        alt={gig.title}
        className="w-full h-52 object-cover"
        onError={(e) => (e.target.src = "/placeholder.jpg")}
      />

      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{gig.title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{gig.shortDescription}</p>

        <p className="text-sm text-gray-500 mt-3">
          By{" "}
          <span className="font-medium text-gray-700">
            {gig.userId?.name || "Unknown"}
          </span>
        </p>

        <p className="text-green-700 font-bold text-lg mt-2">${gig.price}</p>

        <div className="flex items-center gap-2 mt-3">
          <Rating
            readonly
            initialValue={rating}
            allowFraction
            size={18}
            SVGstyle={{ display: "inline" }}
            fillColor="#facc15"
            emptyColor="#e5e7eb"
          />
          <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>

        {/* ✅ Owned or Buy Now */}
        {user?.role === "client" && (
          owned ? (
            <div className="mt-4 w-full text-center text-green-700 font-semibold">
              ✅ Owned
            </div>
          ) : (
            <button
              onClick={handleBuyNow}
              disabled={paying}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 w-full text-sm font-semibold"
            >
              {paying ? "Processing..." : "Buy Now"}
            </button>
          )
        )}
      </div>

      {/* Dropdown for owners */}
      {user?.id === gig.userId?._id && (
        <div className="absolute top-3 right-3 z-20" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-white"
          >
            <FiMoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded overflow-hidden text-sm border">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-gig/${gig._id}`);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-gray-700"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(gig);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GigCard;
