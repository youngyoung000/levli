import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "../../../components/marketing/arrow-up-right";
import styles from "../content-page.module.css";

export const metadata: Metadata = {
  title: "Trading Rules | Levli",
  description: "The complete Levli evaluation, risk, funded-account, fair-play, and payout rules.",
};

const RULE_NAV = [
  ["01", "How Levli Works", "how-it-works"],
  ["02", "Account Sizes", "account-sizes"],
  ["03", "Key Terms", "key-terms"],
  ["04", "Profit Target", "profit-target"],
  ["05", "Max Drawdown", "max-drawdown"],
  ["06", "Daily Loss", "daily-loss"],
  ["07", "Consistency", "consistency"],
  ["08", "Passing", "passing"],
  ["09", "Leverage", "leverage"],
  ["10", "Fees & Orders", "fees-orders"],
  ["11", "Fair Play", "fair-play"],
  ["12", "Resets", "resets"],
  ["13", "Funded Rules", "funded-rules"],
  ["14", "Payouts", "payouts"],
  ["15", "Free Trial", "free-trial"],
  ["16", "Simulation", "simulation"],
  ["17", "Rule Priority", "rule-priority"],
  ["CL", "Changelog", "changelog"],
] as const;

function RuleSection({
  children,
  id,
  number,
  title,
}: {
  children: React.ReactNode;
  id: string;
  number: string;
  title: string;
}): React.JSX.Element {
  return (
    <section className={styles.ruleSection} id={id}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIndex}>{number}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
      </div>
      <div className={styles.prose}>{children}</div>
    </section>
  );
}

function RulesNav({ mobile = false }: { mobile?: boolean }): React.JSX.Element {
  return (
    <nav className={mobile ? styles.mobileToc : styles.toc} aria-label="Rules sections">
      {!mobile && <span className={styles.tocTitle}>On this page</span>}
      {RULE_NAV.map(([number, label, id]) => (
        <a href={`#${id}`} key={id}>
          {!mobile && <span>{number}</span>}
          {mobile ? number : label}
        </a>
      ))}
    </nav>
  );
}

export default function RulesPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Trading Rules</h1>
          <p className={styles.heroLead}>
            Clear thresholds, fixed to your account at creation.<br />
            Understand what moves you forward, what pauses trading,<br />
            and what ends an account before you begin.
          </p>
          <div className={styles.lockBadge}><span className={styles.lockDot} />Rules locked at account creation</div>
        </div>
      </header>

      <RulesNav mobile />

      <div className={styles.contentShell}>
        <RulesNav />

        <main className={styles.content}>
          <div className={styles.introBlock}>
            <h2>Know the verdict before you trade.</h2>
            <p>
              Every rule below is fixed to your account when it is created. Future updates apply only to
              accounts created after their effective date and are recorded in the changelog.
            </p>
          </div>

          <aside className={styles.simBox} aria-label="Simulation disclosure">
            <strong>Simulated trading environment</strong>
            <p>
              Levli Trial, Evaluation, and Funded accounts are simulated. Levli is the economic counterparty
              to simulated trades, and eligible payouts are discretionary performance-based rewards paid from
              company revenue. No customer order is routed to an external venue for execution.
            </p>
          </aside>

          <RuleSection id="how-it-works" number="01" title="How Levli Works">
            <div className={styles.steps}>
              <div><span>01</span><h3>Free Trial</h3><p>An optional $10K practice account with the same evaluation rules, free for 7 days.</p></div>
              <div><span>02</span><h3>Evaluation</h3><p>Reach the profit target while respecting the risk rules. One step, with no time limit.</p></div>
              <div><span>03</span><h3>Funded</h3><p>After passing and review, trade a simulated funded account and become eligible for USDC rewards.</p></div>
            </div>
            <p><strong>No time limit.</strong> There is no deadline on an Evaluation. Pass when all objectives are satisfied.</p>
          </RuleSection>

          <RuleSection id="account-sizes" number="02" title="Account Sizes & Pricing">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Account size</th><th>One-time fee</th><th>Reset fee</th></tr></thead>
                <tbody>
                  <tr><td data-value="true">$2,500</td><td data-value="true">$29</td><td data-value="true">$12</td></tr>
                  <tr><td data-value="true">$10,000</td><td data-value="true">$89</td><td data-value="true">$35</td></tr>
                  <tr><td data-value="true">$25,000</td><td data-value="true">$249</td><td data-value="true">$99</td></tr>
                  <tr><td data-value="true">$50,000</td><td data-value="true">$449</td><td data-value="true">$179</td></tr>
                </tbody>
              </table>
            </div>
            <ul>
              <li>One track: <strong>Standard 1-Step</strong>. No hidden tiers or recurring subscription.</li>
              <li>The evaluation fee is refunded with the first approved payout. Reset fees are not refunded.</li>
              <li>Maximum combined active funded allocation per trader: <strong>$200,000</strong>.</li>
            </ul>
          </RuleSection>

          <RuleSection id="key-terms" number="03" title="Key Terms">
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Term</th><th>Definition</th></tr></thead>
                <tbody>
                  <tr><td><strong>Balance</strong></td><td>Initial capital plus closed profits, minus closed losses and simulated fees.</td></tr>
                  <tr><td><strong>Equity</strong></td><td>Balance plus unrealized PnL from open positions, measured in real time.</td></tr>
                  <tr><td><strong>Realized PnL</strong></td><td>Profit or loss locked in by fully or partially closing a position, net of fees.</td></tr>
                  <tr><td><strong>Drawdown Floor</strong></td><td>The equity level the account must never touch: initial capital × 0.94.</td></tr>
                  <tr><td><strong>Trading Day</strong></td><td>A UTC calendar day on which a qualifying trade is opened.</td></tr>
                  <tr><td><strong>Profitable Day</strong></td><td>A UTC day whose total realized PnL by close date is positive.</td></tr>
                </tbody>
              </table>
            </div>
            <p>All daily calculations use <strong>UTC 00:00</strong> as the boundary.</p>
          </RuleSection>

          <RuleSection id="profit-target" number="04" title="Profit Target: 10%">
            <p>Reach <strong>+10% realized profit</strong> on the account&apos;s initial capital.</p>
            <div className={styles.formula}>Target = Initial Capital × 10%{"\n"}$10,000 account → $1,000 realized profit</div>
            <ul>
              <li>Only closed, realized PnL counts toward the target.</li>
              <li>Unrealized gains on open positions do not count.</li>
              <li>The Evaluation does not expire from time alone.</li>
            </ul>
          </RuleSection>

          <RuleSection id="max-drawdown" number="05" title="Max Drawdown: 6% Static">
            <p>Your <strong>equity</strong>, including unrealized PnL, must never touch the drawdown floor.</p>
            <div className={styles.formula}>Floor = Initial Capital × 0.94{"\n"}$10,000 account → floor at $9,400</div>
            <ul>
              <li>The floor is static. It never moves up when you make profit.</li>
              <li>Profits widen the buffer between current equity and the fixed floor.</li>
              <li>An open position&apos;s unrealized loss can cause a breach.</li>
            </ul>
            <div className={`${styles.notice} ${styles.noticeCritical}`}>
              <span>Breach result</span>
              <strong>Immediate account failure.</strong> Positions are closed and the Evaluation ends. An eligible reset starts a new account.
            </div>
          </RuleSection>

          <RuleSection id="daily-loss" number="06" title="Daily Loss Limit: 4%">
            <p>If equity falls 4% below the day&apos;s starting anchor, all positions are auto-liquidated and trading pauses for the rest of that UTC day.</p>
            <div className={styles.formula}>Daily Limit = Day-start Anchor × 4%{"\n"}$10,000 anchor → $400 daily limit</div>
            <ul>
              <li>This is a circuit breaker, not an account failure.</li>
              <li>Trading resumes at the next UTC 00:00 boundary.</li>
              <li>A daily-loss liquidation can still move equity close to the Max Drawdown floor.</li>
            </ul>
          </RuleSection>

          <RuleSection id="consistency" number="07" title="Consistency Rule: 35%">
            <p>No single UTC day may account for more than <strong>35% of total realized profit</strong> when you pass.</p>
            <div className={styles.formula}>Best Day&apos;s Realized Profit ≤ 35% × Total Realized Profit</div>
            <ul>
              <li>Profit is attributed to the UTC date on which each position or partial fill is closed.</li>
              <li>Exceeding 35% is not a violation. Your pass remains pending until total profit grows enough.</li>
            </ul>
            <div className={styles.example}>
              <span>Example / $10K account</span>
              If one day produces $800, total realized profit must reach at least $800 ÷ 0.35 ≈ $2,286. The remaining ≈$1,486 must be realized on other days.
            </div>
          </RuleSection>

          <RuleSection id="passing" number="08" title="Passing Your Evaluation">
            <p>You pass when all three conditions hold at the same time:</p>
            <ol>
              <li>Realized profit is at least <strong>10%</strong> of initial capital.</li>
              <li>Consistency is satisfied: best day is <strong>≤35%</strong> of total realized profit.</li>
              <li>There are <strong>zero open positions</strong>.</li>
            </ol>
            <p>There is no time limit. A passing result is recorded in the decision log before a funded upgrade is reviewed.</p>
          </RuleSection>

          <RuleSection id="leverage" number="09" title="Leverage">
            <p>Leverage is set per symbol and shown in the trading interface before an order is submitted.</p>
            <div className={styles.notice}>
              <span>Venue configuration</span>
              Exact symbol limits remain configuration-dependent. Orders over the displayed limit are rejected without an account penalty.
            </div>
          </RuleSection>

          <RuleSection id="fees-orders" number="10" title="Fees & Order Handling">
            <ul>
              <li>Indicative simulated fees: <strong>maker 0.02% / taker 0.05%</strong>. The live ticket displays the configured fee before submission.</li>
              <li>Funding payments are not currently applied in the simulation.</li>
              <li>Unfilled orders are automatically cancelled after <strong>72 hours</strong>.</li>
              <li>The rule-day boundary is <strong>UTC 00:00</strong>.</li>
            </ul>
          </RuleSection>

          <RuleSection id="fair-play" number="11" title="Fair Play: What Is Not Allowed">
            <p>These rules apply to Trial, Evaluation, and Funded accounts. Results must reflect your own manual trading.</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Not allowed</th><th>What it means</th><th>What happens</th></tr></thead>
                <tbody>
                  <tr><td><strong>News trading</strong></td><td>Opening or closing within ±2 minutes of published high-impact events.</td><td>Affected PnL is removed; repeated activity triggers review.</td></tr>
                  <tr><td><strong>Bots / API</strong></td><td>Orders not placed manually through the official interface.</td><td>Account closed; pending rewards cancelled.</td></tr>
                  <tr><td><strong>Cross-account hedging</strong></td><td>Opposite coordinated positions across accounts.</td><td>Accounts closed; pending rewards cancelled.</td></tr>
                  <tr><td><strong>Copy trading</strong></td><td>Mirroring trades across your own or another trader&apos;s accounts.</td><td>Accounts closed; pending rewards cancelled.</td></tr>
                  <tr><td><strong>Account sharing</strong></td><td>Anyone other than you trading, controlling, or buying the account.</td><td>Account closed; pending rewards cancelled.</td></tr>
                </tbody>
              </table>
            </div>
            <p>Automated flags may use cross-account correlation, device signals, and wallet-graph analysis. Borderline cases receive human review, and the decision log records evidence and reasons.</p>
          </RuleSection>

          <RuleSection id="resets" number="12" title="Resets">
            <p>A failed Evaluation can be reset <strong>once within 7 days</strong> of failure. A reset issues a new account at full initial capital.</p>
            <ul>
              <li>Resets apply to Evaluation accounts only.</li>
              <li>Funded accounts cannot be reset after a Max Drawdown breach.</li>
              <li>Reset fees are listed in Section 02 and are not refunded.</li>
            </ul>
          </RuleSection>

          <RuleSection id="funded-rules" number="13" title="Funded Account Rules">
            <p>Funded accounts remain simulated and retain the core risk rules, with additional exposure controls.</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Rule</th><th>Evaluation</th><th>Funded</th></tr></thead>
                <tbody>
                  <tr><td>Profit Target / Consistency</td><td>Required</td><td>No target</td></tr>
                  <tr><td>Max Drawdown 6% static</td><td>Required</td><td>Required; breach is permanent</td></tr>
                  <tr><td>Daily Loss 4%</td><td>Auto-liquidation</td><td>Auto-liquidation</td></tr>
                  <tr><td>Total margin exposure</td><td>N/A</td><td data-value="true">≤25% of balance</td></tr>
                  <tr><td>Single position notional</td><td>N/A</td><td data-value="true">≤2× balance</td></tr>
                  <tr><td>Payout eligibility</td><td>N/A</td><td>Available when requirements are met</td></tr>
                </tbody>
              </table>
            </div>
            <p>An account with no trades for <strong>30 days</strong> becomes inactive.</p>
          </RuleSection>

          <RuleSection id="payouts" number="14" title="Payouts">
            <p>Eligible rewards are paid in USDC from company revenue after automated checks and human approval.</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead><tr><th>Tier</th><th>Your share</th><th>Per-request cap</th><th>How to reach it</th></tr></thead>
                <tbody>
                  <tr><td data-value="true">1</td><td data-value="true">80%</td><td>5% of account capital</td><td>From the first approved payout</td></tr>
                  <tr><td data-value="true">2</td><td data-value="true">85%</td><td>10% of account capital</td><td>3 consecutive approvals</td></tr>
                  <tr><td data-value="true">3</td><td data-value="true">90%</td><td>No per-request cap</td><td>6 consecutive approvals</td></tr>
                </tbody>
              </table>
            </div>
            <ul>
              <li>First request: after <strong>7 trading days</strong> and <strong>3 profitable days</strong>.</li>
              <li>Minimum request: <strong>$50</strong>. Only realized profit is withdrawable.</li>
              <li>All positions must be closed. Another payout request cannot already be pending.</li>
              <li>Requests are processed in a daily 09:00 UTC batch. Approved payouts are targeted within 24 hours.</li>
              <li>The evaluation fee is refunded with the first approved payout.</li>
              <li>Identity, sanctions, and recipient-information checks may be required before payout approval.</li>
            </ul>
            <div className={styles.notice}>
              <span>Automatic checks</span>
              A request may be declined for open positions, amount below $50, tier-cap breach, insufficient realized balance, drawdown-floor protection, unmet first-payout eligibility, another pending request, or a closed/inactive account. The exact reason is shown.
            </div>
          </RuleSection>

          <RuleSection id="free-trial" number="15" title="Free Trial">
            <ul>
              <li><strong>$10,000 account, 7 days, free.</strong> One per person.</li>
              <li>The Evaluation rules are the same, so the Trial is a full rehearsal.</li>
              <li>Passing the Trial does not create a funded account.</li>
            </ul>
          </RuleSection>

          <RuleSection id="simulation" number="16" title="Simulated Environment Disclosure">
            <ul>
              <li>Trial, Evaluation, and Funded accounts are simulated. Prices reference real-time market data, while Levli&apos;s simulation engine determines fills. Orders are never submitted to an exchange or other venue for execution.</li>
              <li>Levli is the economic counterparty to simulated positions. Account balances are virtual and are not customer deposits.</li>
              <li>Payouts are discretionary performance-based rewards paid from company revenue, not returns generated by executing your orders in a live market.</li>
              <li>Levli is not a broker, exchange, or investment adviser and does not provide investment, legal, or tax advice.</li>
            </ul>
            <div className={styles.notice}>
              <span>Simulation limitation</span>
              Simulated results may differ materially from live trading because fills do not execute against real order-book liquidity, and funding payments are not currently applied.
            </div>
            <p><Link href="/legal/risk-disclosure"><strong>Read the full Risk Disclosure</strong></Link></p>
          </RuleSection>

          <RuleSection id="rule-priority" number="17" title="Rule Priority & Fine Print">
            <ul>
              <li>Simultaneous events are evaluated in this order: <strong>Max Drawdown → Daily Loss → Profit Target</strong>.</li>
              <li>Consistency uses each fill&apos;s close date in UTC. Trading Day uses the qualifying trade&apos;s open date.</li>
              <li>Drawdown and Daily Loss use real-time equity with a UTC 00:00 daily boundary.</li>
              <li>Pass/fail decisions record the price, timestamp, equity, and rule state that triggered the verdict.</li>
            </ul>
          </RuleSection>

          <RuleSection id="changelog" number="CL" title="Changelog">
            <div className={styles.example}>
              <span>Version 1.0 / 2026-08-03</span>
              Initial public rules. Future changes will include an effective date and apply only to accounts created after that date.
            </div>
          </RuleSection>
        </main>
      </div>

      <section className={styles.finalCta}>
        <div>
          <h2>Know the rules.<br />Then prove it.</h2>
          <p>Start with the free trial or choose an Evaluation when the rules fit how you trade.</p>
          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/login">Get Started <ArrowUpRight /></Link>
            <Link className={styles.secondaryButton} href="/faq">View FAQ <ArrowUpRight /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
