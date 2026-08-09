import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "../../components/marketing/arrow-up-right";
import { HeroConeGraphic } from "../../components/marketing/hero-cone-graphic";
import { ChallengeIcon, FundedIcon, TradingIcon } from "../../components/marketing/path-icons";
import styles from "./home.module.css";

export default function HomePage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <HeroConeGraphic className={styles.heroGraphic} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopyBlock}>
            <h1>
              <span>Prove your skill</span>
              <strong>Trade with size</strong>
            </h1>
            <p className={styles.heroCopy}>
              A simulated challenge with live prices. Real USDC payouts. Your risk stops at the fee.
            </p>
            <div className={styles.heroActions}>
              <Link href="/waitlist" className={styles.primaryButton}>Join Waitlist <ArrowUpRight /></Link>
              <button type="button" className={styles.secondaryButton}>View Payouts</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.facts} id="facts" aria-label="Levli key facts">
        <div><span>Start</span><strong>Free $10K trial</strong></div>
        <div><span>Fee</span><strong>From $29</strong></div>
        <div><span>Profit split</span><strong>Up to 90%</strong></div>
        <div><span>Settlement</span><strong>On-chain USDC</strong></div>
      </section>

      <section className={styles.pathSection}>
        <div className={styles.sectionIntro}>
          <h2>One clear path.</h2>
        </div>
        <ol className={styles.pathGrid}>
          {PATH_STEPS.map((item) => (
            <li key={item.number}>
              <div className={styles.stepTop}><span>{item.number}</span></div>
              <item.Icon />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.pricingSection} id="pricing">
        <div className={styles.pricingShell}>
          <div className={styles.pricingHeader}>
            <div className={styles.sectionIntro}>
              <h2>Choose your scale.</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
          <div className={styles.planGrid}>
            {PLANS.map((plan) => (
              <article key={plan.size}>
                <label className={styles.planSelect}>
                  <input
                    aria-label={`${plan.size} account size`}
                    className={styles.planRadio}
                    defaultChecked={plan.featured}
                    name="account-size"
                    type="radio"
                    value={plan.size}
                  />
                  <div className={styles.planTopline}>
                    <strong>{plan.short}</strong>
                  </div>
                  <p>{plan.size}<br />simulated buying power</p>
                  <div className={styles.planPrice}><strong>{plan.price}</strong></div>
                  <div className={styles.planLines} aria-hidden="true">
                    <i /><i /><i /><i /><i />
                  </div>
                </label>
              </article>
            ))}
          </div>
          <div className={styles.pricingFoot}>
            <button type="button" className={styles.sectionButton}>Get Started <ArrowUpRight /></button>
          </div>
        </div>
      </section>

      <section className={styles.rulesSection} id="rules">
        <div className={styles.rulesShell}>
          <div className={styles.rulesHeader}>
            <div className={styles.sectionIntro}>
              <h2>Rules, not surprises</h2>
              <p>Same rules at every size. Locked to your account at purchase.</p>
              <span className={styles.textLink}>View Full Rules <ArrowUpRight /></span>
            </div>
          </div>
          <div className={styles.ruleGrid}>
            {RULES.map((rule) => (
              <article key={rule.label}>
                <span className={styles.ruleLabel}>{rule.label}</span>
                <div className={styles.ruleValue}>
                  <strong>{rule.value}</strong>
                  <span>{rule.example}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.payoutSection} id="payouts">
        <div className={styles.payoutHeader}>
          <div className={styles.sectionIntro}>
            <h2>Recent Payouts</h2>
          </div>
        </div>
        <div className={styles.payoutMarquee}>
          <div className={styles.payoutTrack}>
            {[0, 1].map((group) => (
              <div key={group} className={styles.payoutGroup} aria-hidden={group === 1 ? "true" : undefined}>
                {PAYOUTS.map((payout, index) => (
                  <article key={`${group}-${payout.trader}-${index}`}>
                    <strong>{payout.amount}</strong>
                    <span>{payout.trader} · {payout.date}</span>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionIntro}>
          <h2>Straight<br />answers.</h2>
          <span className={styles.textLink}>View Full FAQ <ArrowUpRight /></span>
        </div>
        <div className={styles.faqList}>
          {FAQS.map((item) => (
            <details className={styles.faqRow} key={item.question}>
              <summary>
                <span>{item.question}</span>
                <i aria-hidden="true">+</i>
              </summary>
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.backersSection} aria-labelledby="backers-title">
        <h2 id="backers-title">Backed by</h2>
        <ul className={styles.backerLogos}>
          {BACKERS.map((backer) => (
            <li key={backer.name}>
              <Image
                alt={backer.name}
                height={backer.height}
                src={backer.src}
                width={backer.width}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalCtaGraphic} aria-hidden="true">
          <Image
            alt=""
            className={styles.finalCtaGraphicBase}
            height={457}
            src="/images/final-cta-cone.png"
            width={545}
          />
          <Image
            alt=""
            className={styles.finalCtaGraphicAccent}
            height={457}
            src="/images/final-cta-cone.png"
            width={545}
          />
        </div>
        <h2>Ready to prove it?</h2>
        <div className={styles.finalActions}>
          <Link href="/waitlist" className={styles.primaryButton}>Join Waitlist <ArrowUpRight /></Link>
          <button type="button" className={styles.secondaryButton}>View Payouts</button>
        </div>
      </section>
    </div>
  );
}

const PATH_STEPS = [
  { number: "01", title: "Choose your challenge", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", Icon: ChallengeIcon },
  { number: "02", title: "Trade and pass", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", Icon: TradingIcon },
  { number: "03", title: "Get funded. Get paid in USDC", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", Icon: FundedIcon },
] as const;

// 로고별 렌더 높이는 시각적 무게를 맞춘 실측값(디자인 1440px 기준), width는 원본 종횡비 유지
const BACKERS = [
  { name: "Aster", src: "/logos/aster-logo.png", width: 173, height: 46 },
  { name: "Hyperliquid", src: "/logos/hyperliquid-logo.png", width: 211, height: 33 },
  { name: "Nado", src: "/logos/nado-logo.png", width: 163, height: 36 },
] as const;

const PAYOUTS = Array.from({ length: 5 }, () => ({
  amount: "$X,XXX USDC",
  trader: "Trader x***x",
  date: "MMM DD",
}));

const PLANS = [
  { size: "$2,500", short: "2.5K", price: "$29", featured: false },
  { size: "$10,000", short: "10K", price: "$89", featured: true },
  { size: "$25,000", short: "25K", price: "$249", featured: false },
  { size: "$50,000", short: "50K", price: "$449", featured: false },
] as const;

const RULES = [
  { label: "PROFIT TARGET", value: "10%", example: "$1,000 on The 10K" },
  { label: "MAX DRAWDOWN", value: "6%", example: "static" },
  { label: "DAILY LOSS", value: "4%", example: "UTC reset" },
  { label: "CONSISTENCY", value: "≤35%", example: "Best day of total profit" },
] as const;

const FAQS = [
  {
    question: "Is this real-money trading?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae justo eget magna fermentum.",
  },
  {
    question: "Where do payouts come from?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
  },
  {
    question: "What happens if I breach a rule?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud.",
  },
  {
    question: "Is a payout guaranteed after I pass?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit.",
  },
] as const;
