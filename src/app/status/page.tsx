"use client";

import { useState, type FormEvent } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

type StatusResponse = {
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
};

export default function StatusPage() {
  const [requestId, setRequestId] = useState("");
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!requestId.trim()) {
      setError("Enter your request ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/identity/status?requestId=${encodeURIComponent(requestId)}`);
      const data = (await response.json()) as StatusResponse;
      setResult(data);
    } catch {
      setError("Unable to retrieve status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Request status</h1>
            <p className="usa-intro">
              Enter your request ID to see the latest status.
            </p>
          </header>

          <section className="panel">
            <form className="usa-form" onSubmit={handleSubmit}>
              <TextField
                id="status-request-id"
                label="Request ID"
                hint="Example: SCF-39201"
                value={requestId}
                onChange={(event) => setRequestId(event.target.value)}
                error={error}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Checking status..." : "Check status"}
              </Button>
            </form>

            <div className="status-stages">
              <h2 className="usa-heading-sm">Status stages</h2>
              <ul className="usa-list">
                <li>Pending: verification in progress.</li>
                <li>Approved: access granted to secure communications.</li>
                <li>Rejected: additional verification required.</li>
              </ul>
              <p className="muted-text">
                Missing your request ID? Contact the installation support desk for assistance.
              </p>
              <Button variant="outline" onClick={() => (window.location.href = "/support/installation")}>
                Contact support
              </Button>
            </div>

            {result ? (
              <div
                className={`usa-alert margin-top-3 ${
                  result.status === "APPROVED"
                    ? "usa-alert--success"
                    : result.status === "REJECTED"
                      ? "usa-alert--error"
                      : "usa-alert--info"
                }`}
              >
                <div className="usa-alert__body">
                  <h2 className="usa-alert__heading">Status: {result.status}</h2>
                  <p className="usa-alert__text">{result.message}</p>
                  {result.status === "APPROVED" ? (
                    <p className="usa-alert__text">
                      You may now proceed to secure communication access. Keep your request ID for
                      reference.
                    </p>
                  ) : null}
                  {result.status === "REJECTED" ? (
                    <p className="usa-alert__text">
                      Additional verification is required. Contact the installation support desk to
                      continue.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>
    </PageShell>
  );
}
