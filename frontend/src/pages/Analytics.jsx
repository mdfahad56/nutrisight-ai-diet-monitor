import React, { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import api from "../services/api";

export default function Analytics() {
  const [weekly, setWeekly] = useState([]);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    api.get("/nutrition/weekly")
      .then((res) => setWeekly(res.data))
      .catch(() => {});
  }, []);

  const upload = async () => {
    if (!file) return;
    setUploadError("");
    setResult(null);
    setAnalyzing(true);
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await api.post("/food/recognize", form);
      setResult(res.data);
    } catch (requestError) {
      setUploadError(requestError.response?.data?.detail || "Upload failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="analytics-page">
      <h1>Dietary Analytics & AI Food Scan</h1>
<div className="panel food-scan-panel">
        <h3>AI Food Recognition Scanner</h3>
        <p>Upload a food photo (.png, .jpg, .webp) to classify items and estimate portion weights.</p>

        <div className="upload-controls">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="button" onClick={upload} disabled={!file || analyzing}>
            {analyzing ? "Analyzing Image…" : "Analyze Image"}
          </button>
        </div>

        {uploadError && <p className="alert alert-error">{uploadError}</p>}

        {result && (
          <div className="recognition-results">
            <p className="recognition-message"><strong>Status:</strong> {result.message}</p>
            {result.predictions?.length > 0 ? (
              <div className="prediction-cards">
                {result.predictions.map((p) => (
                  <div key={p.food_name} className="prediction-chip">
                    <strong>{p.food_name}</strong>
                    <span>Confidence: {Math.round(p.confidence * 100)}%</span>
                    <span>Est. Portion: {p.estimated_portion_grams}g</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>

      
      <p className="subtitle">
        Visual breakdown of weekly macro metrics and deep-learning food classification.
      </p>

      <div className="panel">
        <h3>7-Day Caloric & Macronutrient Trends</h3>
        <p className="chart-sub">Daily totals calculated across recorded meal items</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weekly}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="calories" name="Calories (kcal)" fill="#2f9e6e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="protein" name="Protein (g)" fill="#3182ce" radius={[4, 4, 0, 0]} />
            <Bar dataKey="carbohydrates" name="Carbs (g)" fill="#dd6b20" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
    </div>
  );
}
