import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../services/api";

const Card = ({ label, value, sub }) => (
  <div className="card">
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{sub}</small>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState();
  const [week, setWeek] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/nutrition/daily"),
      api.get("/nutrition/weekly"),
      api.get("/alerts"),
      api.get("/meals"),
    ])
      .then(([daily, weekly, currentAlerts, recentMeals]) => {
        if (active) {
          setData(daily.data);
          setWeek(weekly.data);
          setAlerts(currentAlerts.data);
          setMeals(recentMeals.data);
        }
      })
      .catch(() => active && setError("Unable to load dashboard data."));
    return () => {
      active = false;
    };
  }, []);

  if (error) return <div className="panel error-panel" role="alert">{error}</div>;
  if (!data) return <div className="panel"><p>Loading dashboard…</p></div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header-row">
        <div>
          <h1>Today’s nutrition</h1>
          <p className="subtitle">Real-time daily macro totals and remaining budget</p>
        </div>
        <div className="quick-actions">
          <Link to="/meal-history" className="btn btn-outline btn-sm">+ Log Meal</Link>
          <Link to="/analytics" className="btn btn-primary btn-sm">Scan Food</Link>
        </div>
      </div>

      <div className="cards">
        {Object.entries(data.totals).map(([key, value]) => (
          <Card
            key={key}
            label={key}
            value={value}
            sub={`${data.remaining[key]} remaining`}
          />
        ))}
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Weekly calories</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={week}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#2f9e6e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <h3>Alerts</h3>
          {alerts.length ? (
            alerts.map((alert) => (
              <p className={`alert ${alert.severity}`} key={alert.id}>
                {alert.message}
              </p>
            ))
          ) : (
            <p>No current alerts.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header-flex">
          <h3>Recent meals</h3>
          <Link to="/meal-history" className="text-link">View all →</Link>
        </div>
        {meals.length ? (
          meals.slice(0, 5).map((meal) => (
            <p key={meal.id} className="meal-summary-line">
              <b>{meal.meal_type}</b> · {meal.meal_date} ·{" "}
              {meal.items.map((item) => `${item.food_name} (${item.portion_grams}g)`).join(", ")}
            </p>
          ))
        ) : (
          <p>No meals recorded yet. Use the Log Meal button to add your first meal.</p>
        )}
      </div>
    </div>
  );
}
