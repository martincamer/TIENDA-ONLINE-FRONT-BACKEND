import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

const RutaProtegida = () => {
  const { auth, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1">
        {/* <Navbar toggleSidebar={toggleSidebar} /> */}
        <main className="">
          <Outlet />
        </main>
      </div>
    </div>
  );
  s;
};

export default RutaProtegida;
