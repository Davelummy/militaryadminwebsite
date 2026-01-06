import { PageShell } from "@/components/ui/PageShell";

export default function SecurityPage() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <div className="content-container security-page">
          <header className="section-header">
            <h1 className="usa-heading-xl">Security and privacy overview</h1>
            <p className="usa-intro">
              MilitaryAdmin.org is designed to protect highly sensitive personal data while
              verifying access requests for active-duty service members.
            </p>
          </header>

          <section className="wizard-shell security-shell" aria-label="Security safeguards">
            <div className="wizard-content">
              <div>
                <p className="usa-heading-sm">Security posture summary</p>
                <p className="muted-text margin-top-1">
                  Compliance alignment: NIST 800-53, FedRAMP High, DoD IL5 readiness.
                </p>
              </div>
              <div className="wizard-steps">
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Collection scope</div>
                  <div className="wizard-step-title">What we collect</div>
                  <div className="wizard-step-meta">
                    Contact information, relationship details, and service member identifiers.
                  </div>
                  <div className="wizard-step-meta">
                    Date of birth, SSN (or last four), and government-issued photo ID.
                  </div>
                  <div className="wizard-step-meta">
                    Address details used for identity verification only.
                  </div>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Protection model</div>
                  <div className="wizard-step-title">How we protect your data</div>
                  <div className="wizard-step-meta">
                    Encryption in transit between your browser and verification systems.
                  </div>
                  <div className="wizard-step-meta">
                    Strict access controls, auditing, and security monitoring aligned to federal
                    compliance standards.
                  </div>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Retention policy</div>
                  <div className="wizard-step-title">How long we retain your data</div>
                  <div className="wizard-step-meta">
                    Data is retained only as long as required for verification and legal
                    requirements, then scheduled for secure deletion.
                  </div>
                  <div className="wizard-step-meta">Standard retention window: 24 months.</div>
                </div>
                <div className="wizard-step">
                  <div className="wizard-step-kicker">Non-negotiables</div>
                  <div className="wizard-step-title">What we will never do</div>
                  <div className="wizard-step-meta">
                    Sell or market your data, or share SSN/DOB/ID images outside verification.
                  </div>
                  <div className="wizard-step-meta">
                    Request SSN or verification codes through email, phone, or SMS.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="wizard-shell security-shell" aria-labelledby="faq-heading">
            <h2 className="usa-heading-md" id="faq-heading">
              FAQ
            </h2>
            <div className="faq-grid">
              <article className="wizard-step">
                <h3 className="wizard-step-title">Why do you need my SSN and date of birth?</h3>
                <p className="wizard-step-meta">
                  These data points are required to accurately match your identity against official
                  records and prevent fraud.
                </p>
              </article>
              <article className="wizard-step">
                <h3 className="wizard-step-title">How is my photo ID stored?</h3>
                <p className="wizard-step-meta">
                  Photo IDs are stored in encrypted systems with limited access, used only for
                  verification.
                </p>
              </article>
              <article className="wizard-step">
                <h3 className="wizard-step-title">How do I know this is an official program?</h3>
                <p className="wizard-step-meta">
                  The portal is operated in partnership with the U.S. Department of Defense and
                  follows federal security standards.
                </p>
              </article>
              <article className="wizard-step">
                <h3 className="wizard-step-title">Can I request deletion or correction?</h3>
                <p className="wizard-step-meta">
                  Yes. You can request deletion or correction through your installation Family
                  Readiness Office once verification is complete.
                </p>
              </article>
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
