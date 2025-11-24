// frontend/src/App.jsx
import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

// Lazy-loaded components for code splitting
const Home = lazy(() => import("./components/Home"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const ManagerDashboard = lazy(() => import("./components/ManagerDashboard"));
const MemberProjects = lazy(() => import("./components/MemberProject"));
const ManagerProjects = lazy(() => import("./components/ManagerProject"));

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
  };

  const isAuthenticated = Boolean(token);

  const getDashboardRoute = () => {
    if (role === "Admin") return "/AdminDashboard";
    if (role === "Team Lead") return "/ManagerDashboard";
    if (role === "Member") return "/Home";
    return "/";
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} logout={logout} role={role} />
      
      <div className="container mt-4">
        <Suspense fallback={<div className="text-center mt-5">⏳ Loading page...</div>}>
          <Routes>
            {/* Default route */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Login login={login} />
              }
            />

            {/* Signup */}
            <Route path="/signup" element={<Signup />} />

            {/* Member Routes */}
            <Route
              path="/Home"
              element={isAuthenticated && role === "Member" ? <Home /> : <Navigate to="/" />}
            />
            <Route
              path="/MemberProject"
              element={
                isAuthenticated && role === "Member" ? <MemberProjects /> : <Navigate to="/" />
              }
            />

            {/* Manager Routes */}
            <Route
              path="/ManagerDashboard"
              element={
                isAuthenticated && role === "Team Lead" ? <ManagerDashboard /> : <Navigate to="/" />
              }
            />
            <Route
              path="/Managerproject"
              element={
                isAuthenticated && role === "Team Lead" ? <ManagerProjects /> : <Navigate to="/" />
              }
            />

            {/* Admin Route */}
            <Route
              path="/AdminDashboard"
              element={isAuthenticated && role === "Admin" ? <AdminDashboard /> : <Navigate to="/" />}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default App;

