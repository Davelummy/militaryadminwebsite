import { PageShell } from "@/components/ui/PageShell";

export default function RecordsNoticePage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Records Notice</h1>
            <p className="usa-intro">
              This placeholder will be replaced with the official System of Records Notice (SORN)
              once issued by the sponsoring DoD program office.
            </p>
          </header>
          <section className="panel glass-card">
            <h2 className="usa-heading-md">Records categories</h2>
            <p>Identity verification records, access requests, and audit logs.</p>
            <h2 className="usa-heading-md">Retention</h2>
            <p>
              Records are retained only as required for verification and legal compliance, then
              disposed of securely.
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
