import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Meals from "./pages/Meals";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";

function RootLayout() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/meal-history" element={<Meals />} />
            <Route path="/dietary-settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Backward-compatible aliases */}
            <Route path="/meals" element={<Navigate to="/meal-history" replace />} />
            <Route path="/settings" element={<Navigate to="/dietary-settings" replace />} />
            <Route path="/recognize" element={<Navigate to="/analytics" replace />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
