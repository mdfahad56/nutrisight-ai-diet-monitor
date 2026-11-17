import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>About NutriSight</h1>
        <p>Empowering individuals with intelligent, automated dietary guidance and safety restrictions.</p>
      </div>

      <div className="panel about-detail-panel">
        <h2>Our Mission</h2>
        <p>
          At NutriSight, we believe healthy eating shouldn’t require tedious spreadsheet management.
          By combining deep learning vision technology with strict clinical nutrition parameters,
          we provide users with seamless portion tracking, allergy warnings, and real-time intake analytics.
        </p>

        <div className="about-grid">
          <div className="about-col">
            <h3>🔬 Computer Vision & AI</h3>
            <p>
              Our neural network models are specifically trained on multi-class food recognition datasets,
              allowing the application to estimate portions and identify nutritional density in real-time.
            </p>
          </div>
          <div className="about-col">
            <h3>🛡️ Food Restriction Alerts</h3>
            <p>
              Users can define hard limits on daily calories, saturated fats, carbohydrates, and sugars,
              alongside explicit ingredient allergies (e.g., peanuts, dairy, gluten). If a logged meal crosses a
              limit, instant high-priority alerts are issued.
            </p>
          </div>
          <div className="about-col">
            <h3>🔒 Robust Security</h3>
            <p>
              Built using secure JWT access tokens, password hashing with passlib/bcrypt, and granular
              user-isolated database schemas.
            </p>
          </div>
        </div>

        <div className="about-disclaimer">
          <strong>Important Health Disclaimer:</strong>
          <p>
            NutriSight is an informational and monitoring tool designed to assist with personal habit
            tracking. It does not replace professional medical advice, clinical diagnosis, or prescribed dietetics.
          </p>
        </div>

        <div className="page-cta">
          <Link to="/register" className="btn btn-primary">Start Monitoring Now</Link>
          <Link to="/contact" className="btn btn-outline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
