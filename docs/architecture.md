# Architecture
React/Vite calls FastAPI through Axios. FastAPI authenticates requests with JWT, persists user-isolated records via SQLAlchemy, and invokes nutrition and restriction services after every meal mutation. SQLite is the local default; set `DATABASE_URL` to a MySQL SQLAlchemy URL in deployment. The recognition endpoint validates uploads then calls a TensorFlow model only when a locally trained model is present.

Portion estimation intentionally uses category defaults and labels every result as an estimate. A single 2D photo cannot measure food weight accurately.
