import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateGig from "./pages/CreateGig";
import MyGigs from "./pages/MyGigs";
import Dashboard from "./pages/Dashboard";
import EditGig from "./pages/EditGig";
import ViewGig from "./pages/ViewGig";
import MyOrders from "./pages/MyOrders"; // ✅ new
import About from "./pages/About";
import ExploreGigs from "./components/ExploreGigs";
import SavedGigs from "./pages/SavedGigs";
import ChatPage from "./pages/ChatPage"; // ✅ new


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gigs" element={<ExploreGigs />} />


        {/* ✅ Client-only route */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute type="private" allowedRoles={["client"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* ✅ Freelancer-only routes */}
        <Route
          path="/create-gig"
          element={
            <ProtectedRoute type="private" allowedRoles={["freelancer"]}>
              <CreateGig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-gigs"
          element={
            <ProtectedRoute type="private" allowedRoles={["freelancer"]}>
              <MyGigs />
            </ProtectedRoute>
          }
        />
        <Route path="/saved-gigs" element={<SavedGigs />} />
        <Route
          path="/edit-gig/:gigId"
          element={
            <ProtectedRoute type="private" allowedRoles={["freelancer"]}>
              <EditGig />
            </ProtectedRoute>
          }
        />

        {/* ✅ Shared dashboard (can be split inside) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute type="private">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public routes */}
        <Route path="/gig/:gigId" element={<ViewGig />} />
        <Route path="/about" element={<About />} />
       <Route path="/chat" element={<ChatPage />} />

      </Routes>
    </Router>
  );
};

export default App;
