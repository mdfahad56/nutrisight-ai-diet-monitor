import React, { useEffect, useState } from "react";
import api from "../services/api";

export function ManualMeal({ onMealAdded }) {
  const [food, setFood] = useState("Rice");
  const [grams, setGrams] = useState(150);
  const [type, setType] = useState("lunch");
  const [done, setDone] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e?.preventDefault();
    if (saving) return;
    setSaving(true);
    setDone("");
    try {
      await api.post("/meals", {
        meal_type: type,
        meal_date: new Date().toISOString().slice(0, 10),
        items: [{ food_name: food, portion_grams: +grams }],
      });
      setDone("Meal logged and limits recalculated.");
      if (onMealAdded) onMealAdded();
    } catch (err) {
      setDone(err.response?.data?.detail || "Failed to log meal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel manual-meal-panel">
      <h3>Confirm / Add Meal</h3>
      <div className="form-row">
        <label>
          Meal Type:
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {["breakfast", "lunch", "dinner", "snacks"].map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Food Item:
          <select value={food} onChange={(event) => setFood(event.target.value)}>
            {[
              "Roti",
              "Rice",
              "Dal",
              "Paneer",
              "Chicken",
              "Biryani",
              "Salad",
              "Idli",
              "Dosa",
              "Fruits",
              "Vegetables",
              "Eggs",
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Portion (grams):
          <input
            type="number"
            min="10"
            max="2000"
            value={grams}
            onChange={(event) => setGrams(event.target.value)}
          />
        </label>

        <button type="button" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Log Confirmed Meal"}
        </button>
      </div>
      {done && <p className="status-message">{done}</p>}
    </div>
  );
}

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/meals")
      .then((response) => setMeals(response.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    try {
      await api.delete(`/meals/${id}`);
      load();
    } catch {
      alert("Failed to delete meal record.");
    }
  };

  return (
    <div className="meals-page">
      <h1>Meal History</h1>
      <ManualMeal onMealAdded={load} />

      <div className="panel meals-list-panel">
        <h3>Logged Meals</h3>
        {loading ? (
          <p>Loading meal history…</p>
        ) : meals.length ? (
          meals.map((meal) => (
            <article className="meal" key={meal.id}>
              <div>
                <strong>{meal.meal_type.toUpperCase()}</strong> · <span>{meal.meal_date}</span>
                <div className="meal-items-chips">
                  {meal.items.map((item) => (
                    <span key={item.id} className="meal-chip">
                      {item.food_name}: {item.portion_grams}g ({item.calories} kcal)
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => remove(meal.id)}
              >
                Delete
              </button>
            </article>
          ))
        ) : (
          <p>No meals recorded yet.</p>
        )}
      </div>
    </div>
  );
}
