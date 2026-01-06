import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  variant?: "applicant" | "admin";
  showNav?: boolean;
};

export function PageShell({
  children,
  variant = "applicant",
  showNav = true,
}: PageShellProps) {
  return (
    <div className={`page-shell focus-outline ${variant === "admin" ? "admin-shell" : ""}`}>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <section className="usa-banner" aria-label="Official government partnership notice">
        <div className="usa-accordion">
          <header className="usa-banner__header">
            <div className="usa-banner__inner">
              <div className="usa-banner__header-text">
                An official portal in partnership with the U.S. Department of Defense.
              </div>
            </div>
          </header>
        </div>
      </section>

      <header className={`usa-header usa-header--basic ${variant === "admin" ? "admin-header" : ""}`}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo logo-left">
              <div className="usa-logo__text">
                <Link
                  href={variant === "admin" ? "/admin" : "/"}
                  className="display-flex flex-align-center grid-gap-1"
                >
                  <Image
                    src="/dod-logo.jpeg"
                    alt="Department of Defense seal"
                    width={36}
                    height={36}
                    className="logo-mark"
                  />
                  <span className="usa-heading-sm margin-0">
                    {variant === "admin" ? "MilitaryAdmin.org Admin" : "MilitaryAdmin.org"}
                  </span>
                </Link>
              </div>
              <div className="usa-tagline muted-text">
                {variant === "admin"
                  ? "Internal review console"
                  : "Military family access and identity verification portal"}
              </div>
            </div>
          </div>
          {showNav ? (
            variant === "admin" ? (
              <nav className="usa-nav" aria-label="Admin navigation">
                <ul className="usa-nav__primary usa-accordion">
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href="/admin">
                      Review console
                    </Link>
                  </li>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href="/admin/login">
                      Admin login
                    </Link>
                  </li>
                </ul>
              </nav>
            ) : (
              <nav className="usa-nav" aria-label="Primary navigation">
                <ul className="usa-nav__primary usa-accordion">
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href="/how-it-works">
                      How it works
                    </Link>
                  </li>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href="/register">
                      Register
                    </Link>
                  </li>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href="/security">
                      Security & privacy
                    </Link>
                  </li>
                  <li className="usa-nav__primary-item">
                    <Link className="usa-nav__link" href="/status">
                      Status
                    </Link>
                  </li>
                </ul>
              </nav>
            )
          ) : null}
        </div>
      </header>
      <div className="brand-bar" aria-hidden="true" />

      {children}

      <footer
        className={`usa-footer footer-shell ${variant === "admin" ? "admin-footer" : ""}`}
        role="contentinfo"
      >
        <div className="content-container footer-grid">
          <div className="footer-brand">
            <div className="display-flex flex-align-center grid-gap-1">
              <Image
                src="/dod-logo.jpeg"
                alt="Department of Defense seal"
                width={42}
                height={42}
                className="logo-mark"
              />
              <div>
                <div className="footer-title">
                  {variant === "admin" ? "MilitaryAdmin.org Admin" : "MilitaryAdmin.org"}
                </div>
                <div className="footer-subtitle">
                  {variant === "admin"
                    ? "Internal review system"
                    : "Official program workflow portal"}
                </div>
              </div>
            </div>
            <p className="footer-copy">
              {variant === "admin"
                ? "Administrative review and status management for access requests."
                : "MilitaryAdmin.org supports verified communication access for active-duty service members and trusted contacts."}
            </p>
          </div>
          {variant !== "admin" || showNav ? (
            <div className="footer-links">
              <div className="footer-section-title">Explore</div>
              <ul className="usa-list usa-list--unstyled">
                {variant === "admin" ? (
                  <>
                    <li>
                      <Link href="/admin">Review console</Link>
                    </li>
                    <li>
                      <Link href="/admin/login">Admin login</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/how-it-works">How it works</Link>
                    </li>
                    <li>
                      <Link href="/register">Register</Link>
                    </li>
                    <li>
                      <Link href="/security">Security & privacy</Link>
                    </li>
                    <li>
                      <Link href="/status">Status</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          ) : null}
          {variant !== "admin" || showNav ? (
            <div className="footer-links">
              <div className="footer-section-title">Support</div>
              <ul className="usa-list usa-list--unstyled">
                {variant === "admin" ? (
                  <>
                    <li>Internal help desk</li>
                    <li>Audit and compliance team</li>
                    <li>Security operations center</li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/support/family-readiness">Family Readiness Office</Link>
                    </li>
                    <li>
                      <Link href="/support/installation">Installation support desk</Link>
                    </li>
                    <li>
                      <Link href="/support/accessibility">Accessibility assistance</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="content-container footer-base">
          <div className="footer-base-grid">
            <p className="muted-text">
              {variant === "admin"
                ? "For internal issues, contact the Security Operations Center."
                : "For official assistance, contact your installation Family Readiness Office."}
            </p>
            <nav aria-label="Compliance links">
              <ul className="usa-list usa-list--unstyled display-flex flex-wrap grid-gap">
                <li>
                  <Link href="/privacy">Privacy Act Statement</Link>
                </li>
                <li>
                  <Link href="/records-notice">Records Notice</Link>
                </li>
                <li>
                  <Link href="/accessibility-statement">Accessibility statement</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
