import { PageShell } from "@/components/ui/PageShell";

export default function AccessibilitySupportPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Accessibility assistance</h1>
            <p className="usa-intro">
              We provide accessible experiences for all users. Get help with accommodations or
              alternative formats.
            </p>
          </header>
          <section className="panel glass-card">
            <h2 className="usa-heading-md">Available accommodations</h2>
            <ul className="usa-list">
              <li>Alternative document submission guidance.</li>
              <li>Assistive technology support and navigation tips.</li>
              <li>Feedback channel for accessibility improvements.</li>
            </ul>
            <p className="muted-text">
              Requests are routed through official support channels for timely response.
            </p>
            <div className="support-meta">
              <p>
                <strong>Hours:</strong> 0700-1900 local time, Monday-Friday
              </p>
              <p>
                <strong>Contact:</strong> Accessibility desk via installation directory
              </p>
              <p>
                <strong>Related:</strong> <a href="/accessibility-statement">Accessibility statement</a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
