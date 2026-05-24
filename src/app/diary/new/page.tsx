"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";

export default function NewDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/diary").then((res) => {
      if (!res.ok) router.replace("/diary");
      else setChecking(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content, mood }),
    });

    if (res.ok) {
      const entry = await res.json();
      router.push(`/diary/${entry.id}`);
    } else {
      const data = await res.json();
      setError(data.error || "保存失败");
    }

    setSaving(false);
  };

  if (checking) return null;

  return (
    <main className={styles.diaryPage}>
      <div className="container">
        <div className={styles.diaryHeader}>
          <h1 className={styles.diaryTitle}>写新日记</h1>
        </div>
        <div className={styles.editor}>
          <form className={styles.editorForm} onSubmit={handleSubmit}>
            <div className={styles.editorGroup}>
              <label className={styles.editorLabel}>标题</label>
              <input
                type="text"
                className={styles.editorInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="今天想记录什么？"
                autoFocus
              />
            </div>

            <div className={styles.editorGroup}>
              <label className={styles.editorLabel}>心情</label>
              <select
                className={styles.editorInput}
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="">选择心情...</option>
                <option value="😊">😊 开心</option>
                <option value="😌">😌 平静</option>
                <option value="😢">😢 难过</option>
                <option value="😤">😤 生气</option>
                <option value="🤔">🤔 思考</option>
                <option value="😴">😴 疲惫</option>
                <option value="🥳">🥳 兴奋</option>
              </select>
            </div>

            <div className={styles.editorGroup}>
              <label className={styles.editorLabel}>内容</label>
              <textarea
                className={styles.editorTextarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你想记录的事情..."
              />
            </div>

            {error && <p className={styles.loginError}>{error}</p>}

            <div className={styles.editorActions}>
              <Link href="/diary" className={styles.editorCancel}>
                取消
              </Link>
              <button
                type="submit"
                className={styles.editorSubmit}
                disabled={saving || !title.trim()}
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
