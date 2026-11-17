import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Smart Dietary Intelligence</span>
          <h1 className="hero-title">
            AI-Based Personalized Diet Monitoring & Restriction System
          </h1>
          <p className="hero-subtitle">
            NutriSight combines intelligent food recognition with personalized nutritional
            guardrails. Automatically calculate macros, prevent restricted ingredients, and maintain
            a healthy lifestyle with confidence.
          </p>

          <div className="hero-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary hero-btn">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline hero-btn">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary hero-btn">
                Open Dashboard →
              </Link>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card preview-card">
            <div className="preview-header">
              <span className="preview-indicator" />
              <strong>Daily Intake Overview</strong>
            </div>
            <div className="preview-stats">
              <div className="stat-box">
                <span className="stat-label">Calories</span>
                <span className="stat-val">1,850 kcal</span>
                <small className="stat-sub">150 kcal remaining</small>
              </div>
              <div className="stat-box">
                <span className="stat-label">Protein</span>
                <span className="stat-val">78g</span>
                <small className="stat-sub">Target met</small>
              </div>
            </div>
            <div className="preview-alert">
              ⚠️ <span>Alert: Sugar limit approached (90% reached)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Features for Healthier Living</h2>
          <p>Everything you need to effortlessly manage your diet, track nutrients, and enforce restrictions.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>AI Food Recognition</h3>
            <p>
              Snap or upload photos of your meals. The deep learning model identifies food items and
              estimates portion weights automatically.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Comprehensive Nutrition Tracking</h3>
            <p>
              Keep tabs on daily calories, protein, carbohydrates, fats, and sugars. Real-time calculations
              keep you informed after every meal.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Custom Restrictions & Alerts</h3>
            <p>
              Configure allergen restrictions and strict ingredient blacklists. Receive immediate warnings
              before you exceed your custom limits.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Weekly Caloric Analytics</h3>
            <p>
              Analyze your eating patterns and caloric compliance over 7-day rolling periods with clean,
              interactive visual charts.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-card">
          <div className="about-text">
            <h2>About NutriSight</h2>
            <p>
              NutriSight was engineered to bridge modern computer vision technology with precision
              nutritional monitoring. Whether managing diabetes, monitoring macro balances, or adhering
              to allergen constraints, our platform empowers you with reliable dietary guardrails.
            </p>
            <div className="about-highlights">
              <div className="highlight-item">
                <strong>Model-Aware Intelligence</strong>
                <p>Transparent predictions that clearly state model readiness and portion estimates.</p>
              </div>
              <div className="highlight-item">
                <strong>Privacy & Safety First</strong>
                <p>Your dietary preferences and health records are secured with industry-standard JWT authentication.</p>
              </div>
            </div>
            <small className="disclaimer-note">
              * Note: Portion estimations and nutrient calculations are advisory. Always verify food items and review personalized nutrition targets with a qualified healthcare specialist.
            </small>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>Have questions, feedback, or need support? Our team is here to assist you.</p>
        </div>

        <div className="contact-wrapper">
          <div className="contact-info">
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>NutriSight Technologies & Health Labs</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Email Support</strong>
                <p>support@nutrisight.app</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏱️</span>
              <div>
                <strong>Hours</strong>
                <p>Monday – Friday, 9:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            {contactSubmitted ? (
              <div className="contact-success" role="alert">
                <h3>Thank you for reaching out!</h3>
                <p>We received your message and will respond within 24 hours.</p>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactForm({ name: "", email: "", message: "" });
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
                <textarea
                  placeholder="How can we help you?"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
                <button type="submit" className="btn btn-primary full-width">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>🥗 NutriSight</strong>
            <p>AI-Based Diet Monitoring & Food Restriction Platform.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} NutriSight. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}
