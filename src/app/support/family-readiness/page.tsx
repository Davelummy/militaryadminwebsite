import { PageShell } from "@/components/ui/PageShell";

export default function FamilyReadinessPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Family Readiness Office</h1>
            <p className="usa-intro">
              Connect with your installation Family Readiness Office for official guidance and
              support.
            </p>
          </header>
          <section className="panel glass-card">
            <h2 className="usa-heading-md">How we can help</h2>
            <ul className="usa-list">
              <li>Assistance with verification and access questions.</li>
              <li>Guidance on required documentation.</li>
              <li>Updates on local support services.</li>
            </ul>
            <p className="muted-text">
              For direct contact details, refer to your installation directory or official base
              communications.
            </p>
            <div className="support-meta">
              <p>
                <strong>Hours:</strong> 0700-1900 local time, Monday-Friday
              </p>
              <p>
                <strong>Contact:</strong> Phone and email available via installation directory
              </p>
              <p>
                <strong>Related:</strong> <a href="/status">Check request status</a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
