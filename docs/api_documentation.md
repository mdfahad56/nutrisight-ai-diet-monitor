# API
Public: `POST /api/auth/register`, `POST /api/auth/login`, `GET /health`.

Bearer-authenticated: `GET /api/auth/me`; `GET|PUT /api/profile`; `GET|PUT /api/dietary-settings`; `POST /api/food/recognize`; `POST|GET /api/meals`; `GET|PUT|DELETE /api/meals/{meal_id}`; `GET /api/nutrition/daily`; `GET /api/nutrition/weekly`; `GET /api/alerts`; `PUT /api/alerts/{alert_id}/read`.

Interactive OpenAPI documentation is at `/docs` when the backend is running.
