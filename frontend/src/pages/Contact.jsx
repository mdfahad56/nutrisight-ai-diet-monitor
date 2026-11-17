import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear your feedback, questions, or integration inquiries.</p>
      </div>

      <div className="panel contact-page-card">
        {submitted ? (
          <div className="contact-success" role="alert">
            <h2>Message Sent Successfully!</h2>
            <p>Thank you for getting in touch, {form.name}. Our team will review your message and reply promptly.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSubmitted(false);
                setForm({ name: "", email: "", subject: "", message: "" });
              }}
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <div className="contact-grid">
            <div className="contact-details">
              <h2>Reach Out Directly</h2>
              <p>Have an inquiry regarding food recognition accuracy, dietary limits, or API integrations?</p>
              <div className="detail-item">
                <strong>📧 Email:</strong> <span>rashid.23b0121204@abes.ac.in</span>
              </div>
              <div className="detail-item">
                <strong>🏢 Office:</strong> <span>ABES Engineering College, Ghaziabad</span>
              </div>
              <div className="detail-item">
                <strong>🕒 Support Hours:</strong> <span>Monday – Friday, 9:00 AM – 6:00 PM</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="contact-page-form">
              <label>
                Your Name
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label>
                Subject
                <input
                  type="text"
                  placeholder="e.g. Dietary restriction inquiry"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </label>

              <label>
                Message
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
