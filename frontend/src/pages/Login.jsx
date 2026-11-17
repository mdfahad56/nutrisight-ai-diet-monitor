import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
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

  const isRegisterRoute = location.pathname === "/register";
  const [registering, setRegistering] = useState(isRegisterRoute);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRegistering(location.pathname === "/register");
    setError("");
  }, [location.pathname]);

  if (isLoading) return <main className="page-loading">Restoring your session…</main>;
  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={destination} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);
    try {
      if (registering) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(messageFor(requestError, registering));
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const toggleMode = () => {
    setError("");
    if (registering) {
      navigate("/login");
    } else {
      navigate("/register");
    }
  };

  return (
    <main className="auth">
      <form onSubmit={submit} noValidate>
        <div className="auth-header">
          <Link to="/" className="auth-brand-link">🥗 NutriSight</Link>
          <h2>{registering ? "Create your account" : "Welcome back"}</h2>
          <p>{registering ? "Start monitoring your diet with AI" : "Sign in to access your diet monitor"}</p>
        </div>

        {registering && (
          <input
            aria-label="Name"
            placeholder="Full Name"
            required
            minLength="2"
            value={form.name}
            onChange={update("name")}
          />
        )}
        <input
          aria-label="Email"
          type="email"
          placeholder="Email address"
          required
          value={form.email}
          onChange={update("email")}
        />
        <input
          aria-label="Password"
          type="password"
          minLength="8"
          maxLength="72"
          placeholder="Password (minimum 8 characters)"
          required
          value={form.password}
          onChange={update("password")}
        />

        {error && <em role="alert">{error}</em>}

        <button type="submit" disabled={submitting} className="auth-submit-btn">
          {submitting ? "Please wait…" : (registering ? "Create Account" : "Sign In")}
        </button>

        <button
          className="text-button"
          type="button"
          disabled={submitting}
          onClick={toggleMode}
        >
          {registering ? "Already have an account? Sign in" : "New to NutriSight? Create an account"}
        </button>
      </form>
    </main>
  );
}
