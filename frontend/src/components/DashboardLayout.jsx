import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navItems = [
    ["/dashboard", "Dashboard"],
    ["/meal-history", "Meal History"],
    ["/dietary-settings", "Dietary Settings"],
    ["/analytics", "Analytics & Scan"],
    ["/profile", "Profile"],
  ];

  return (
    <div className="shell">
      <aside className="dashboard-sidebar">
        <h2>App Menu</h2>
        {navItems.map(([path, label]) => (
          <NavLink key={path} to={path} end>
            {label}
          </NavLink>
        ))}
        <button type="button" className="link sidebar-logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <section className="dashboard-main-section">
        <header className="dashboard-section-header">
          <span>AI Diet Monitoring & Food Restriction</span>
          <span className="header-disclaimer">Estimates — verify portions</span>
        </header>
        <Outlet />
      </section>
    </div>
  );
}
