import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🥗</span>
          <span className="brand-name">NutriSight</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links desktop-only" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            About
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            Features
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            Contact
          </NavLink>
        </nav>

        {/* Desktop Auth Actions */}
        <div className="nav-actions desktop-only">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-btn nav-btn-login">
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-signup">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-btn nav-btn-dashboard active" : "nav-btn nav-btn-dashboard"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-btn nav-btn-profile active" : "nav-btn nav-btn-profile"
                }
              >
                Profile
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="nav-btn nav-btn-logout"
                title={user?.email ? `Logged in as ${user.email}` : "Log out"}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-toggle"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`} />
          <span className={`hamburger-bar ${mobileMenuOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu" role="menu">
          <nav className="mobile-nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/features"
              className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              onClick={closeMenu}
            >
              Features
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
              onClick={closeMenu}
            >
              Contact
            </NavLink>

            {isAuthenticated && (
              <>
                <div className="mobile-nav-divider" />
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/meal-history"
                  className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  onClick={closeMenu}
                >
                  Meal History
                </NavLink>
                <NavLink
                  to="/dietary-settings"
                  className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  onClick={closeMenu}
                >
                  Dietary Settings
                </NavLink>
                <NavLink
                  to="/analytics"
                  className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  onClick={closeMenu}
                >
                  Analytics & Food Scan
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "mobile-nav-item active" : "mobile-nav-item")}
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
              </>
            )}
          </nav>

          <div className="mobile-nav-actions">
            {!isAuthenticated ? (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="nav-btn nav-btn-login full-width" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="nav-btn nav-btn-signup full-width" onClick={closeMenu}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-btn nav-btn-logout full-width"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
