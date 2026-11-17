import React, { useEffect, useState } from "react";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    age: "",
    height: "",
    weight: "",
    activity_level: "moderate",
    dietary_preference: "none",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api.get("/profile")
      .then((res) => {
        if (res.data) {
          setProfile({
            age: res.data.age ?? "",
            height: res.data.height ?? "",
            weight: res.data.weight ?? "",
            activity_level: res.data.activity_level || "moderate",
            dietary_preference: res.data.dietary_preference || "none",
          });
        }
      })
      .catch(() => setErrorMsg("Could not load profile details."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");
    setErrorMsg("");

    const payload = {
      age: profile.age ? parseInt(profile.age, 10) : null,
      height: profile.height ? parseFloat(profile.height) : null,
      weight: profile.weight ? parseFloat(profile.weight) : null,
      activity_level: profile.activity_level || null,
      dietary_preference: profile.dietary_preference || null,
    };

    try {
      await api.put("/profile", payload);
      setStatusMsg("Profile updated successfully.");
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="panel"><p>Loading profile…</p></div>;

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <p className="subtitle">Manage your personal metrics and dietary lifestyle preferences.</p>

      <div className="profile-grid">
        <div className="panel user-account-panel">
          <h3>Account Information</h3>
          <div className="account-info-row">
            <span className="info-label">Name:</span>
            <strong>{user?.name || "Member"}</strong>
          </div>
          <div className="account-info-row">
            <span className="info-label">Email:</span>
            <strong>{user?.email || "—"}</strong>
          </div>
          <div className="account-info-row">
            <span className="info-label">Account Status:</span>
            <span className="badge-active">Active</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="panel profile-form">
          <h3>Physical Metrics & Preferences</h3>

          <div className="form-group">
            <label htmlFor="age">Age (years)</label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              placeholder="e.g. 28"
              value={profile.age}
              onChange={handleChange("age")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              id="height"
              type="number"
              step="0.1"
              min="30"
              max="300"
              placeholder="e.g. 175"
              value={profile.height}
              onChange={handleChange("height")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              id="weight"
              type="number"
              step="0.1"
              min="2"
              max="500"
              placeholder="e.g. 72.5"
              value={profile.weight}
              onChange={handleChange("weight")}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity">Activity Level</label>
            <select
              id="activity"
              value={profile.activity_level}
              onChange={handleChange("activity_level")}
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="light">Lightly Active (1-3 days/week)</option>
              <option value="moderate">Moderately Active (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
              <option value="very_active">Very Active (Physical work/intense training)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="preference">Dietary Preference</label>
            <select
              id="preference"
              value={profile.dietary_preference}
              onChange={handleChange("dietary_preference")}
            >
              <option value="none">No Specific Preference (Omnivore)</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="keto">Ketogenic</option>
              <option value="low_carb">Low Carbohydrate</option>
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : "Save Changes"}
          </button>

          {statusMsg && <p className="status-message">{statusMsg}</p>}
          {errorMsg && <p className="alert alert-error">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}
