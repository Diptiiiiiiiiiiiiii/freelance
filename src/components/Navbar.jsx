import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    dispatch(logout());
    toast.success("You have been logged out.");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-emerald-800 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-extrabold text-gray-200">
            Freelance<span className="text-gray-300">Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="space-x-6 hidden md:flex">
            <Link to="/gigs" className="text-gray-200 hover:text-gray-300 font-medium">
              Explore Gigs
            </Link>

            {/* ✅ Only show if logged in (optional: restrict to freelancer) */}
            {user && (
              <Link to="/create-gig" className="text-gray-200 hover:text-gray-300 font-medium">
                Post a Gig
              </Link>
            )}

            <Link to="/about" className="text-gray-200 hover:text-gray-300 font-medium">
              About
            </Link>
          </div>

          {/* Auth Buttons or User Dropdown */}
          {!user ? (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-3 py-1 text-gray-200 rounded bg-emerald-600 hover:bg-gray-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 text-gray-200 rounded bg-emerald-600 hover:bg-gray-600 font-medium"
              >
                Join
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1"
              >
                <span className="font-medium text-gray-300">{user.name}</span>
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full hover:shadow-lg transition-shadow duration-200"
                />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg z-10 font-medium rounded overflow-hidden">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* 🔁 Reusable confirmation modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        message="Are you sure you want to logout?"
      />
    </>
  );
};

export default Navbar;
