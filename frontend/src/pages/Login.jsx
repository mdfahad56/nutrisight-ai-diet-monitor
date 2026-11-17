import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function messageFor(error, registering) {
  const detail = error.response?.data?.detail;
  if (error.response?.status === 409) return "That email is already registered. Please sign in instead.";
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join("; ");
  if (error.response?.status === 401) return "Incorrect email or password.";
  if (!error.response) return "Unable to reach the service. Check that the backend is running.";
  return detail || (registering ? "Could not create your account." : "Could not sign in.");
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return <main className="page-loading">Restoring your session…</main>;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      if (registering) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (requestError) {
      setError(messageFor(requestError, registering));
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  return <main className="auth"><form onSubmit={submit} noValidate><h1>NutriSight</h1><p>Personalized diet monitoring</p>
    {registering && <input aria-label="Name" placeholder="Name" required minLength="2" value={form.name} onChange={update("name")} />}
    <input aria-label="Email" type="email" placeholder="Email" required value={form.email} onChange={update("email")} />
    <input aria-label="Password" type="password" minLength="8" maxLength="72" placeholder="Password" required value={form.password} onChange={update("password")} />
    {error && <em role="alert">{error}</em>}
    <button type="submit" disabled={submitting}>{submitting ? "Please wait…" : (registering ? "Create account" : "Sign in")}</button>
    <button className="text-button" type="button" disabled={submitting} onClick={() => { setRegistering((value) => !value); setError(""); }}>{registering ? "Already have an account? Sign in" : "New here? Create an account"}</button>
  </form></main>;
}
