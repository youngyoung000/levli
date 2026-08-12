import styles from "../../app/(public)/home.module.css";

/* 개발 버전(levli-landing-two)의 "Inside the terminal" 목업 —
   DOM 구조·클래스·값을 배포본에서 그대로 옮겼다.
   값은 전부 예시이며 실제 계좌를 나타내지 않는다(하단 고지 필수). */
const RISK_CELLS = [
  { label: "Equity", value: "$10,412.30", note: "+$412.30" },
  { label: "Daily buffer", value: "$233.42", note: "58% left" },
  { label: "Max DD buffer", value: "$412.30", note: "69% left" },
  { label: "Target progress", value: "41.2%", note: "$587.70 to go" },
] as const;

const BOOK_ROWS = [
  { side: "ask", price: "116,842.1", size: "0.184" },
  { side: "ask", price: "116,838.4", size: "0.092" },
  { side: "ask", price: "116,831.8", size: "0.317" },
  { side: "bid", price: "116,824.7", size: "0.264" },
  { side: "bid", price: "116,818.2", size: "0.441" },
  { side: "bid", price: "116,812.9", size: "0.138" },
] as const;

const TICKET_META = [
  { label: "Est. auto-liq", value: "$109,847" },
  { label: "Trading fee", value: "$2.92" },
] as const;

const CHART_PATH =
  "M0 230 C42 218 54 191 94 199 S155 225 190 182 S244 134 285 151 S342 183 386 130 S449 67 492 92 S550 143 596 102 S666 54 760 26";

export function TerminalPreview(): React.JSX.Element {
  return (
    <div className={styles.terminalFrame}>
      <header className={styles.terminalTopbar}>
        <div>
          <span className={styles.windowDot} />
          <strong>The 10K</strong>
          <i>Evaluation</i>
        </div>
        <div className={styles.terminalStatus}>
          <span /> Preview · Live-data layout
        </div>
      </header>

      <div aria-label="Challenge risk overview" className={styles.riskStrip}>
        {RISK_CELLS.map((cell) => (
          <div key={cell.label}>
            <span>{cell.label}</span>
            <strong>{cell.value}</strong>
            <small>{cell.note}</small>
          </div>
        ))}
      </div>

      <div className={styles.terminalGrid}>
        <section aria-label="Simulated BTC price chart preview" className={styles.chartPanel}>
          <div className={styles.panelHeader}>
            <div>
              <strong>BTC-PERP</strong>
              <span>1m</span>
            </div>
            <div>
              <strong>$116,824.7</strong>
              <span className={styles.positive}>+1.84%</span>
            </div>
          </div>
          <div className={styles.chartCanvas}>
            <div aria-hidden="true" className={styles.chartGrid} />
            <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 760 270">
              <defs>
                <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#00edd5" stopOpacity="0.2" />
                  <stop offset="1" stopColor="#00edd5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className={styles.chartArea} d={`${CHART_PATH} L760 270 L0 270 Z`} />
              <path className={styles.chartLine} d={CHART_PATH} />
              <circle className={styles.chartPulse} cx="760" cy="26" r="4" />
            </svg>
            <span className={styles.chartPrice}>116,824.7</span>
          </div>
          <div className={styles.chartFooter}>
            <span>10:20</span><span>10:30</span><span>10:40</span><span>10:50</span><span>11:00</span>
          </div>
        </section>

        <section aria-label="Order book preview" className={styles.orderBookPanel}>
          <div className={styles.panelHeader}>
            <div>
              <strong>Order book</strong>
              <span>Read-only preview</span>
            </div>
          </div>
          <div className={styles.bookLabels}>
            <span>Price</span>
            <span>Size</span>
          </div>
          <div className={styles.bookRows}>
            {BOOK_ROWS.map((row) => (
              <div className={row.side === "ask" ? styles.ask : styles.bid} key={row.price}>
                <span>{row.price}</span>
                <span>{row.size}</span>
                <i />
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Order ticket preview" className={styles.ticketPanel}>
          <div className={styles.panelHeader}>
            <div>
              <strong>Order ticket</strong>
              <span>Market</span>
            </div>
          </div>
          <div className={styles.ticketToggle}>
            <span>Buy</span>
            <span>Sell</span>
          </div>
          <div className={styles.ticketField}>
            <span>Amount</span>
            <div>
              <strong>0.05</strong>
              <i>BTC</i>
            </div>
          </div>
          <div className={styles.ticketField}>
            <span>Estimated margin</span>
            <div>
              <strong>$584.12</strong>
              <i>USDC</i>
            </div>
          </div>
          <dl>
            {TICKET_META.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <button disabled type="button">Trading opens in the app</button>
        </section>
      </div>

      <p className={styles.terminalDisclosure}>
        Interface preview. Values are illustrative and do not represent a live account.
      </p>
    </div>
  );
}
