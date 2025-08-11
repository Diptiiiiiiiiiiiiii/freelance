import { useSelector } from "react-redux";
import ClientDashboard from "../components/ClientDashboard";
import FreelancerDashboard from "../components/FreelancerDashboard";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="text-center p-8 text-red-500">
        User not logged in.
      </div>
    );
  }

  return user.role === "client" ? <ClientDashboard /> : <FreelancerDashboard />;
};

export default Dashboard;
