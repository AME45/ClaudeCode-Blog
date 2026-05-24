import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import ScrollReveal from "@/components/ScrollReveal";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>✦ 精选文章</span>
          <h1 className={styles.heroTitle}>
            设计是一门<br />关于关系的学问
          </h1>
          <p className={styles.heroDesc}>
            好的设计不是让事物变漂亮，而是让事物之间的关系变清晰。探索设计与生活的边界，从细微处发现秩序之美。
          </p>
          <div className={styles.heroMeta}>
            <span className={styles.heroAuthor}>AME</span>
            <span className={styles.heroDivider}>·</span>
            <time dateTime="2026-05-18">2026 年 5 月 18 日</time>
            <span className={styles.heroDivider}>·</span>
            <span>8 分钟阅读</span>
          </div>
          <Link href="#" className={styles.heroCta}>
            阅读全文 →
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        <div className="container">
          {/* Featured Posts */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">最近更新</h2>
              <Link href="#" className="section-more">
                查看全部 →
              </Link>
            </div>
            <div className={styles.grid3}>
              <ScrollReveal>
                <article className={styles.card}>
                  <div className={styles.cardImage} style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
                    <div className={styles.cardImageIcon}>🌊</div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>技术</span>
                    <h3 className={styles.cardTitle}>深入理解 CSS 层叠上下文与渲染性能</h3>
                    <p className={styles.cardDesc}>探索浏览器渲染引擎如何处理层叠上下文，以及如何优化页面性能。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-05-20">5 月 20 日</time>
                      <span>12 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal>
                <article className={styles.card}>
                  <div className={styles.cardImage} style={{ background: "linear-gradient(135deg, #2d3436 0%, #636e72 100%)" }}>
                    <div className={styles.cardImageIcon}>🏔️</div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>设计</span>
                    <h3 className={styles.cardTitle}>排版即呼吸：文字节奏的视觉韵律</h3>
                    <p className={styles.cardDesc}>字号、行高、字间距——这些看不见的规则构成了阅读的节奏与呼吸。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-05-16">5 月 16 日</time>
                      <span>6 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal>
                <article className={styles.card}>
                  <div className={styles.cardImage} style={{ background: "linear-gradient(135deg, #3c1f0a 0%, #6b3a2a 50%, #a0522d 100%)" }}>
                    <div className={styles.cardImageIcon}>🍂</div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>随笔</span>
                    <h3 className={styles.cardTitle}>在京都的秋天里寻找时间的形状</h3>
                    <p className={styles.cardDesc}>古老的庙宇、红色的枫叶、缓慢的时间——京都教会我什么是慢下来。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-05-12">5 月 12 日</time>
                      <span>15 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            </div>
          </section>

          {/* Two Column Layout */}
          <div className={styles.layout2col}>
            {/* Article List */}
            <section className="section">
              <div className="section-header">
                <h2 className="section-title">往期文章</h2>
              </div>

              <ScrollReveal>
                <article className={`${styles.card} ${styles.cardHorizontal}`}>
                  <div className={styles.cardHImage} style={{ background: "linear-gradient(135deg, #1b4332, #40916c)" }}>
                    <span className={styles.cardHIcon}>🌿</span>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>生活</span>
                    <h3 className={styles.cardTitle}>如何用一平米打造治愈系阳台花园</h3>
                    <p className={styles.cardDesc}>即使是城市里的小阳台，也能成为属于自己的绿色避难所。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-05-08">5 月 8 日</time>
                      <span>10 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal>
                <article className={`${styles.card} ${styles.cardHorizontal}`}>
                  <div className={styles.cardHImage} style={{ background: "linear-gradient(135deg, #1a1a2e, #4a4e69)" }}>
                    <span className={styles.cardHIcon}>🌙</span>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>思考</span>
                    <h3 className={styles.cardTitle}>数字极简主义：在信息洪流中保持清醒</h3>
                    <p className={styles.cardDesc}>我们消费的信息越多，真正吸收的越少。一场关于数字生活的反思。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-05-03">5 月 3 日</time>
                      <span>8 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal>
                <article className={`${styles.card} ${styles.cardHorizontal}`}>
                  <div className={styles.cardHImage} style={{ background: "linear-gradient(135deg, #3c096c, #7b2cbf)" }}>
                    <span className={styles.cardHIcon}>✨</span>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>教程</span>
                    <h3 className={styles.cardTitle}>从零搭建个人博客：现代工具链完全指南</h3>
                    <p className={styles.cardDesc}>Next.js、MDX、Vercel——新一代博客技术栈的选型与搭建详解。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-04-28">4 月 28 日</time>
                      <span>20 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>

              <ScrollReveal>
                <article className={`${styles.card} ${styles.cardHorizontal}`}>
                  <div className={styles.cardHImage} style={{ background: "linear-gradient(135deg, #5c4d7d, #9b8ec4)" }}>
                    <span className={styles.cardHIcon}>📚</span>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>书评</span>
                    <h3 className={styles.cardTitle}>《设计中的设计》——原研哉的留白哲学</h3>
                    <p className={styles.cardDesc}>留白不是无，而是有的另一种存在方式。重新理解设计与日常的关系。</p>
                    <div className={styles.cardFooter}>
                      <time dateTime="2026-04-22">4 月 22 日</time>
                      <span>7 分钟</span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>

              <button className={styles.loadMore}>加载更多文章</button>
            </section>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              {/* About */}
              <div className={`${styles.sidebarCard} ${styles.aboutCard}`}>
                <div className={styles.aboutAvatar}>A</div>
                <h3 className={styles.aboutName}>AME</h3>
                <p className={styles.aboutBio}>
                  设计师 & 写作者。专注于界面设计、交互体验与文字排版。相信好的设计能让世界变得更好一点点。
                </p>
                <div className={styles.aboutLinks}>
                  <a href="#" className={styles.aboutLink}>Twitter</a>
                  <a href="#" className={styles.aboutLink}>GitHub</a>
                  <a href="#" className={styles.aboutLink}>Email</a>
                </div>
              </div>

              {/* Categories */}
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>文章分类</h3>
                <ul className={styles.categoryList}>
                  {[
                    { name: "设计", count: 12 },
                    { name: "技术", count: 9 },
                    { name: "随笔", count: 7 },
                    { name: "教程", count: 5 },
                    { name: "书评", count: 4 },
                    { name: "生活", count: 3 },
                  ].map((cat) => (
                    <li key={cat.name}>
                      <Link href="#">
                        {cat.name} <span>{cat.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarTitle}>标签</h3>
                <div className={styles.tagCloud}>
                  {["CSS", "设计哲学", "排版", "JavaScript", "生活美学", "极简主义", "摄影", "读书笔记", "UX"].map(
                    (tag) => (
                      <Link href="#" key={tag} className={styles.tag}>
                        {tag}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Newsletter */}
              <div className={`${styles.sidebarCard} ${styles.newsletterCard}`}>
                <h3 className={styles.sidebarTitle}>订阅通讯</h3>
                <p className={styles.newsletterDesc}>每周一篇精选文章，直达你的邮箱。</p>
                <NewsletterForm />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
