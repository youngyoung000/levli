import Link from "next/link";
import { LevliCombinationLogo } from "../../components/brand/levli-logo";
import { ArrowUpRight } from "../../components/marketing/arrow-up-right";
import styles from "./public-layout.module.css";

export default function PublicLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className={`${styles.shell} levli-landing`}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.logoLink} href="/" aria-label="Levli home">
            <LevliCombinationLogo />
          </Link>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link href="/rules">Rules</Link>
            <Link href="/#payouts">Proof</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/waitlist">Waitlist</Link>
          </nav>
          <div className={styles.headerActions}>
            <Link className={styles.loginLink} href="/login">Log In</Link>
            <Link className={styles.startLink} href="/login">Get Started <ArrowUpRight /></Link>
          </div>
          <details className={styles.mobileMenu}>
            <summary aria-label="Open navigation"><span /><span /></summary>
            <nav>
              <Link href="/rules">Rules</Link>
              <Link href="/#payouts">Proof</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/waitlist">Waitlist</Link>
              <Link href="/login">Log In</Link>
              <Link href="/login">Get Started ↗</Link>
            </nav>
          </details>
        </div>
      </header>

      <main>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <LevliCombinationLogo />
          </div>
          <div className={styles.linkGroup}>
            <span>Product</span>
            <Link href="/rules">Rules</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/waitlist">Waitlist</Link>
          </div>
          <div className={styles.linkGroup}>
            <span>Resources</span>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <a href="mailto:support@riseprop.io">Support</a>
          </div>
          <div className={styles.linkGroup}>
            <span>Legal</span>
            <Link href="/legal/terms">Terms of Use</Link>
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/risk-disclosure">Risk Disclosure</Link>
          </div>
        </div>
        <div className={styles.disclosure}>
          <p>Levli · Closed beta. Simulated trading environments.</p>
        </div>
      </footer>
    </div>
  );
}
