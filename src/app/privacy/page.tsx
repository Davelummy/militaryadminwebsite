import { PageShell } from "@/components/ui/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Privacy Act Statement</h1>
            <p className="usa-intro">
              This placeholder statement will be replaced with the official Privacy Act notice
              issued by the sponsoring DoD program office.
            </p>
          </header>
          <section className="panel glass-card">
            <h2 className="usa-heading-md">Purpose and authority</h2>
            <p>
              This portal collects information solely to verify identity and authorize secure
              communication access for active-duty service members.
            </p>
            <h2 className="usa-heading-md">Routine uses</h2>
            <p>
              Data is used only for verification, auditing, and compliance reporting as required by
              federal standards.
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
