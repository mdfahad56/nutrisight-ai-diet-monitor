import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Settings() {
  const [settings, setSettings] = useState();
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/dietary-settings").then((response) =>
      setSettings({
        ...response.data,
        restricted_foods: response.data.restricted_foods.join(", "),
      })
    );
  }, []);

  if (!settings) return <div className="panel"><p>Loading dietary settings…</p></div>;

  const change = (key, value) => setSettings({ ...settings, [key]: value });

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSaved("");
    try {
      const payload = {
        ...settings,
        restricted_foods: settings.restricted_foods
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };
      [
        "daily_calories",
        "protein_limit",
        "carbohydrate_limit",
        "fat_limit",
        "sugar_limit",
      ].forEach((key) => (payload[key] = +payload[key]));

      await api.put("/dietary-settings", payload);
      setSaved("Settings saved successfully.");
    } catch {
      setSaved("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Dietary Settings & Restrictions</h1>
      <p className="subtitle">
        Define maximum daily intake limits and blacklisted ingredients for automated alert evaluation.
      </p>

      <form onSubmit={save} className="panel settings">
        {[
          ["daily_calories", "Daily Calories (kcal)"],
          ["protein_limit", "Protein Target (g)"],
          ["carbohydrate_limit", "Carbohydrate Limit (g)"],
          ["fat_limit", "Fat Limit (g)"],
          ["sugar_limit", "Sugar Limit (g)"],
        ].map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <input
              type="number"
              min="0"
              value={settings[key]}
              onChange={(event) => change(key, event.target.value)}
            />
          </label>
        ))}

        <label>
          <span>Restricted Foods (comma-separated allergens/items)</span>
          <input
            type="text"
            placeholder="e.g. Peanuts, Shellfish, Gluten, Biryani"
            value={settings.restricted_foods}
            onChange={(event) => change("restricted_foods", event.target.value)}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Dietary Settings"}
        </button>
        {saved && <p className="status-message">{saved}</p>}
      </form>
    </div>
  );
}
