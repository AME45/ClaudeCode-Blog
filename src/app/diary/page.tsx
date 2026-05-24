"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  created_at: string;
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const fetchEntries = async () => {
    const res = await fetch("/api/diary");
    if (res.ok) {
      const data = await res.json();
      setEntries(data);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setPassword("");
      setLoading(true);
      await fetchEntries();
    } else {
      const data = await res.json();
      setLoginError(data.error || "登录失败");
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setLoggedIn(false);
    setEntries([]);
  };

  // Login view
  if (!loading && !loggedIn) {
    return (
      <main className={styles.diaryPage}>
        <div className="container">
          <div className={styles.diaryHeader}>
            <h1 className={styles.diaryTitle}>日记</h1>
            <p className={styles.diarySubtitle}>私密日记 · 需密码访问</p>
          </div>
          <div className={styles.diaryMaxWidth}>
            <form className={styles.loginForm} onSubmit={handleLogin}>
              <h2 className={styles.loginTitle}>输入密码以查看日记</h2>
              <input
                type="password"
                className={styles.loginInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="密码"
                autoFocus
              />
              {loginError && <p className={styles.loginError}>{loginError}</p>}
              <button type="submit" className={styles.loginBtn} disabled={loggingIn}>
                {loggingIn ? "验证中..." : "进入"}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.diaryPage}>
      <div className="container">
        <div className={styles.diaryHeader}>
          <h1 className={styles.diaryTitle}>日记</h1>
          <p className={styles.diarySubtitle}>记录生活中的点滴</p>
        </div>
        <div className={styles.diaryMaxWidth}>
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                退出
              </button>
              <span className="entryMeta">{entries.length} 篇日记</span>
            </div>
            <Link href="/diary/new" className={styles.addBtn}>
              + 写新日记
            </Link>
          </div>

          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : entries.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📝</div>
              <p className={styles.emptyStateText}>还没有日记</p>
              <p>点击"写新日记"开始记录吧</p>
            </div>
          ) : (
            <div className={styles.entryList}>
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/diary/${entry.id}`}
                  className={styles.entryCard}
                >
                  <div className={styles.entryMeta}>
                    {entry.mood && (
                      <span className={styles.entryMood}>{entry.mood}</span>
                    )}
                    <span>{entry.created_at}</span>
                  </div>
                  <h3 className={styles.entryCardTitle}>{entry.title}</h3>
                  <p className={styles.entryPreview}>
                    {entry.content.slice(0, 200)}
                    {entry.content.length > 200 && "..."}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
