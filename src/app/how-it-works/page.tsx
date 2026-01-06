import { PageShell } from "@/components/ui/PageShell";
export default function HowItWorksPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container">
          <header className="section-header">
            <h1 className="usa-heading-xl">How verification works</h1>
            <p className="usa-intro">
              This portal verifies identities to protect service members and their families. The
              process is straightforward and follows federal security standards.
            </p>
          </header>

          <section className="wizard-shell" aria-label="Verification wizard">
            <div className="wizard-content">
              <div>
                <p className="usa-heading-sm">Secure verification sequence</p>
                <p className="muted-text margin-top-1">
                  Estimated completion: 24-72 hours, subject to manual review when required.
                </p>
              </div>
              <div className="wizard-steps wizard-steps--arrows">
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Step 1</div>
                  <div className="wizard-step-title">Create a secure account</div>
                  <div className="wizard-step-meta">
                    Provide verified contact details, set a strong password, and accept security
                    terms.
                  </div>
                </div>
                <div className="wizard-step wizard-arrow">
                  <span aria-hidden="true">➜</span>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Step 2</div>
                  <div className="wizard-step-title">Confirm relationship data</div>
                  <div className="wizard-step-meta">
                    Share your relationship, service branch, and unit information to locate
                    official records.
                  </div>
                </div>
                <div className="wizard-step wizard-arrow">
                  <span aria-hidden="true">➜</span>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Step 3</div>
                  <div className="wizard-step-title">Submit identity verification</div>
                  <div className="wizard-step-meta">
                    Provide DOB, SSN (or last four), and government-issued ID for secure checks.
                  </div>
                </div>
                <div className="wizard-step wizard-arrow">
                  <span aria-hidden="true">➜</span>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Step 4</div>
                  <div className="wizard-step-title">Authorized record validation</div>
                  <div className="wizard-step-meta">
                    Verification systems cross-check with official military records.
                  </div>
                </div>
                <div className="wizard-step wizard-arrow">
                  <span aria-hidden="true">➜</span>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Step 5</div>
                  <div className="wizard-step-title">Approval + secure access</div>
                  <div className="wizard-step-meta">
                    Receive status notification and access secure communication tools.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel glass-card">
            <h2 className="usa-heading-md">Data use boundaries</h2>
            <ul className="usa-list">
              <li>Verification only. No marketing or unrelated use.</li>
              <li>Restricted access with audit trails for every review.</li>
              <li>Manual review triggered when automated checks are inconclusive.</li>
            </ul>
          </section>

          <section className="callout" aria-labelledby="security-callout">
            <h2 className="usa-heading-md" id="security-callout">
              Security and privacy safeguards
            </h2>
            <ul className="usa-list">
              <li>Data is encrypted in transit and protected by restricted access controls.</li>
              <li>Only authorized personnel can access verification submissions.</li>
              <li>Your data is used only for identity verification and access authorization.</li>
            </ul>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
