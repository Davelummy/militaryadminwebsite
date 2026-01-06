import { PageShell } from "@/components/ui/PageShell";

export default function InstallationSupportPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Installation support desk</h1>
            <p className="usa-intro">
              The installation support desk provides technical assistance with secure portal access.
            </p>
          </header>
          <section className="panel glass-card">
            <h2 className="usa-heading-md">Support coverage</h2>
            <ul className="usa-list">
              <li>Portal login and registration troubleshooting.</li>
              <li>Status tracking guidance.</li>
              <li>Escalation to verification teams when needed.</li>
            </ul>
            <p className="muted-text">
              Contact information is available through official installation communications.
            </p>
            <div className="support-meta">
              <p>
                <strong>Hours:</strong> 0600-2000 local time, Monday-Saturday
              </p>
              <p>
                <strong>Contact:</strong> Support line and secure email via installation directory
              </p>
              <p>
                <strong>Related:</strong> <a href="/security">Security & privacy</a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
