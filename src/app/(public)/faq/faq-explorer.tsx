"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "../../../components/marketing/arrow-up-right";
import styles from "../content-page.module.css";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "./faq-content";

const ALL_CATEGORIES = "All questions";

export function FaqExplorer(): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === ALL_CATEGORIES || item.category === activeCategory;
      const matchesQuery = !normalizedQuery
        || `${item.question} ${item.answer} ${item.category}`.toLocaleLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const heading = query.trim() ? "Search results" : activeCategory;

  return (
    <section className={styles.faqStage} aria-label="Frequently asked questions">
      <div className={styles.searchPanel}>
        <div className={styles.searchField}>
          <label className="sr-only" htmlFor="faq-search">Search frequently asked questions</label>
          <input
            className={styles.searchInput}
            id="faq-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search rules, payouts, trading..."
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear search"
              className={styles.clearButton}
              onClick={() => setQuery("")}
              type="button"
            >
              ×
            </button>
          )}
        </div>
        <span aria-live="polite" className={styles.resultCount}>
          {filteredItems.length} {filteredItems.length === 1 ? "answer" : "answers"}
        </span>
      </div>

      <div className={styles.faqLayout}>
        <nav className={styles.categoryNav} aria-label="FAQ categories">
          <span className={styles.categoryLabel}>Browse by topic</span>
          {[ALL_CATEGORIES, ...FAQ_CATEGORIES].map((category) => {
            const count = category === ALL_CATEGORIES
              ? FAQ_ITEMS.length
              : FAQ_ITEMS.filter((item) => item.category === category).length;
            const active = activeCategory === category;

            return (
              <button
                aria-pressed={active}
                className={`${styles.categoryButton} ${active ? styles.categoryButtonActive : ""}`}
                key={category}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                <span>{category}</span>
                <span>{count.toString().padStart(2, "0")}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.faqContent}>
          <div className={styles.faqCategoryHeader}>
            <h2>{heading}</h2>
            <span className={styles.resultCount}>{filteredItems.length.toString().padStart(2, "0")} entries</span>
          </div>

          {filteredItems.length > 0 ? (
            <div className={styles.faqList}>
              {filteredItems.map((item) => (
                <details className={styles.faqItem} id={item.id} key={item.id}>
                  <summary>
                    <span>{item.question}</span>
                    <span aria-hidden="true" className={styles.faqPlus}>+</span>
                  </summary>
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                    <Link className={styles.relatedLink} href={`/rules#${item.rulesId}`}>
                      Read the related rule <ArrowUpRight />
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div>
                <h2>No matching answers</h2>
                <p>Try a shorter search or choose another topic.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
