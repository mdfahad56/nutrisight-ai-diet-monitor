# NutriSight — AI Diet Monitor

An end-to-end React + FastAPI food diary with JWT authentication, nutrition tracking, rule-based restriction alerts, and a model-aware image-recognition endpoint.

## Run locally

1. Backend: `cd backend`; create and activate a virtual environment; run `pip install -r requirements.txt`; then `uvicorn app.main:app --reload`.
2. Frontend: `cd frontend`; run `npm install`; then `npm run dev`.
3. Open the URL Vite reports, create an account, configure dietary limits, and log a confirmed meal.

The backend uses a local SQLite database by default. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` to a MySQL URL for MySQL. Never commit that file.

## AI model

Create labeled directories in `ai_model/dataset` for the supported food labels, install TensorFlow, and run `python ai_model/train.py`. Put the resulting model at the configured `MODEL_PATH`. Until then, recognition returns an explicit unavailable-model response—no predictions or accuracy are fabricated.

## Limitations

Nutrition and portions are estimates; a 2D photo cannot establish exact mass. This app does not diagnose conditions or prescribe medical diets. Review nutrition targets with an appropriate professional.
