import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <PageShell>
      <main className="page-main" id="main-content">
        <section className="hero">
          <div className="content-container hero-grid">
            <div className="hero-card">
              <div className="hero-eyebrow">MilitaryAdmin.org access portal</div>
              <h1 className="usa-heading-xl">Secure communication access for military families</h1>
              <p className="usa-intro">
                MilitaryAdmin.org is a secure portal that verifies family and trusted contact
                identities to request communication access for active-duty service members.
              </p>
              <p className="hero-authority">
                Program authority: Operational workflows align with U.S. military family access
                requirements.
              </p>
              <div className="hero-divider" />
              <div className="hero-actions">
                <Link href="/register">
                  <Button className="cta-primary">Get started - Request access</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="cta-secondary">
                    How verification works
                  </Button>
                </Link>
              </div>
              <div className="hero-metrics">
                <div className="hero-metric">
                  <span>Verification window</span>
                  <strong>24-72 hours</strong>
                </div>
                <div className="hero-metric">
                  <span>Data handling</span>
                  <strong>Encrypted + audited</strong>
                </div>
                <div className="hero-metric">
                  <span>Access scope</span>
                  <strong>Verified family contacts</strong>
                </div>
              </div>
              <div className="trust-row">
                <span className="trust-pill">Identity verified</span>
                <span className="trust-pill">Federal standards</span>
                <span className="trust-pill">Privacy-first</span>
              </div>
            </div>
            <div className="hero-card hero-card--secondary">
              <h2 className="usa-heading-md">Trusted, official, and secure</h2>
              <p className="muted-text">
                Every request is reviewed using official military records and identity verification
                partners to protect service members and their families.
              </p>
              <dl className="hero-facts">
                <div>
                  <dt>Verification</dt>
                  <dd>Aligned with DoD security expectations</dd>
                </div>
                <div>
                  <dt>Access controls</dt>
                  <dd>Restricted and audited</dd>
                </div>
                <div>
                  <dt>Status updates</dt>
                  <dd>Transparent within 24-72 hours</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="content-container">
          <div className="eligibility-strip">
            <h2 className="usa-heading-md">Eligibility snapshot</h2>
            <ul className="usa-list">
              <li>Immediate family members and verified trusted contacts.</li>
              <li>Valid government-issued photo identification required.</li>
              <li>Verification against official military records.</li>
            </ul>
          </div>
          <div className="section-header">
            <h2 className="usa-heading-lg">Why identity verification is required</h2>
            <p className="muted-text">
              Verification protects service members, their families, and trusted contacts while
              meeting DoD security requirements.
            </p>
          </div>
          <div className="cards-grid">
            <Card title="Protect against impersonation" containerClassName="glass-card">
              Protect service members from fraud and impersonation attempts that can compromise
              missions and family safety.
            </Card>
            <Card title="Prioritize legitimate contacts" containerClassName="glass-card">
              Ensure only verified family members and trusted contacts can request communication
              access.
            </Card>
            <Card title="Comply with federal standards" containerClassName="glass-card">
              Align with U.S. government privacy, security, and identity verification requirements.
            </Card>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
