import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "../../../components/marketing/arrow-up-right";
import styles from "../content-page.module.css";
import { FAQ_ITEMS } from "./faq-content";
import { FaqExplorer } from "./faq-explorer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Levli",
  description: "Answers about Levli evaluations, simulated trading, funded accounts, payouts, fair play, and billing.",
};

export default function FaqPage(): React.JSX.Element {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className={styles.page}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        type="application/ld+json"
      />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>FAQ</h1>
          <p className={styles.heroLead}>
            Straight answers about the evaluation, simulated trading, funded accounts,<br />
            rewards, and the rules that apply at every stage.
          </p>
        </div>
      </header>

      <FaqExplorer />

      <section className={styles.finalCta}>
        <div>
          <h2>Still have a question?</h2>
          <p>Review the complete rulebook or contact support for help with your account.</p>
          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/rules">View Rules <ArrowUpRight /></Link>
            <a className={styles.secondaryButton} href="mailto:support@riseprop.io">Contact Support <ArrowUpRight /></a>
          </div>
        </div>
      </section>
    </div>
  );
}
