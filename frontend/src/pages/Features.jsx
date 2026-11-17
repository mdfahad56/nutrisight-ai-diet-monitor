import React from "react";
import { Link } from "react-router-dom";

export default function Features() {
  const featuresList = [
    {
      title: "AI Meal Recognition",
      icon: "📸",
      description: "Upload an image of your plate and let our AI model identify dishes and estimate portion sizes in grams.",
      benefits: ["Automated food label detection", "Instant weight & portion estimation", "Model confidence scoring"]
    },
    {
      title: "Macro & Calorie Tracking",
      icon: "📊",
      description: "Automatically log carbohydrates, proteins, fats, calories, and sugars based on certified nutritional database values.",
      benefits: ["Daily remaining allowance calculations", "Accurate nutrient breakdown per dish", "Granular meal categorization (Breakfast, Lunch, Dinner, Snacks)"]
    },
    {
      title: "Allergen & Restriction Guardrails",
      icon: "⚠️",
      description: "Set personalized limits and blacklist ingredients. Instant warnings alert you before you exceed thresholds.",
      benefits: ["Custom dietary limits configuration", "Blacklisted food keyword detection", "Severity-coded alerts (Normal vs High)"]
    },
    {
      title: "Historical Trends & Analytics",
      icon: "📈",
      description: "Inspect rolling 7-day intake trends to identify eating patterns, caloric surpluses, and nutritional balance.",
      benefits: ["Interactive charts powered by Recharts", "Multi-day calorie comparison", "Meal logging audit trail"]
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Platform Features</h1>
        <p>Comprehensive tools designed for complete nutritional control and safe diet enforcement.</p>
      </div>

      <div className="features-container">
        {featuresList.map((f, i) => (
          <div key={i} className="panel feature-detail-card">
            <span className="feature-large-icon">{f.icon}</span>
            <div className="feature-detail-body">
              <h2>{f.title}</h2>
              <p>{f.description}</p>
              <ul className="benefit-list">
                {f.benefits.map((b, idx) => (
                  <li key={idx}>✓ {b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="page-cta centered">
        <Link to="/register" className="btn btn-primary">Try It Now</Link>
        <Link to="/about" className="btn btn-outline">Learn More About NutriSight</Link>
      </div>
    </div>
  );
}
