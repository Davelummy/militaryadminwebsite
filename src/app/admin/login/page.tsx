"use client";

import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!response.ok) {
        throw new Error("Unauthorized");
      }
      window.location.href = "/admin";
    } catch {
      setError("Access denied. Check the admin key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell variant="admin" showNav={false}>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Admin access</h1>
            <p className="usa-intro">
              Enter the admin access key to review and approve requests.
            </p>
          </header>
          <section className="panel glass-card">
            <form className="usa-form" onSubmit={handleSubmit}>
              <TextField
                id="admin-key"
                label="Admin access key"
                type="password"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                error={error}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Authenticating..." : "Enter admin console"}
              </Button>
            </form>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
