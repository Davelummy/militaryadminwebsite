import { PageShell } from "@/components/ui/PageShell";

export default function AccessibilityStatementPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">Accessibility statement</h1>
            <p className="usa-intro">
              MilitaryAdmin.org is committed to meeting Section 508 and WCAG 2.1 AA standards.
            </p>
          </header>
          <section className="panel glass-card">
            <h2 className="usa-heading-md">Accessibility support</h2>
            <p>
              If you encounter an accessibility barrier, contact your installation support desk for
              assistance.
            </p>
            <h2 className="usa-heading-md">Feedback</h2>
            <p>We review accessibility feedback and prioritize fixes in upcoming releases.</p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
