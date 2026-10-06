import { useState } from "react";

// Read the Google Apps Script URL from the environment (see .env.example)
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export default function App() {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setSubmitting(true);
    setMessage("");

    try {
      // Content-Type "text/plain" keeps this a "simple" request, so the browser
      // skips the CORS preflight that Google Apps Script cannot answer.
      // The body is still JSON: {"data": "..."}
      // mode "no-cors" lets the request go through even though Apps Script
      // does not send CORS headers. The response is then opaque (unreadable),
      // so if the request was sent without a network error we treat it as success.
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ data: text }),
      });

      setMessage("Submitted successfully.");
      setText("");
    } catch (error) {
      setMessage("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container">
      <h1>Customer Data Submission</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter customer data here..."
        rows={12}
      />

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>

      {message && <p className="message">{message}</p>}
    </main>
  );
}
