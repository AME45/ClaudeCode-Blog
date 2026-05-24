"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css";

interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
}

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`/api/diary/${id}`).then(async (res) => {
      if (!res.ok) {
        if (res.status === 401) router.replace("/diary");
        return;
      }
      const data = await res.json();
      setEntry(data);
      setTitle(data.title);
      setContent(data.content);
      setMood(data.mood);
      setChecking(false);
    });
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError("");

    const res = await fetch(`/api/diary/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content, mood }),
    });

    if (res.ok) {
      const data = await res.json();
      setEntry(data);
      setEditing(false);
    } else {
      const data = await res.json();
      setError(data.error || "保存失败");
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这篇日记吗？此操作不可恢复。")) return;

    setDeleting(true);
    const res = await fetch(`/api/diary/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/diary");
    } else {
      setError("删除失败");
    }
    setDeleting(false);
  };

  if (checking) {
    return (
      <main className={styles.diaryPage}>
        <div className="container">
          <div className={styles.loading}>加载中...</div>
        </div>
      </main>
    );
  }

  if (!entry) {
    return (
      <main className={styles.diaryPage}>
        <div className="container">
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>日记不存在</p>
            <Link href="/diary">返回列表</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.diaryPage}>
      <div className="container">
        <div className={styles.diaryMaxWidth}>
          <div className={styles.toolbar}>
            <Link href="/diary" className={styles.logoutBtn}>
              ← 返回
            </Link>
            {!editing && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={styles.addBtn}
                  onClick={() => setEditing(true)}
                >
                  编辑
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <form className={styles.editorForm} onSubmit={handleSave}>
              <div className={styles.editorGroup}>
                <label className={styles.editorLabel}>标题</label>
                <input
                  type="text"
                  className={styles.editorInput}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                />
              </div>

              {error && <p className={styles.loginError}>{error}</p>}

              <div className={styles.editorActions}>
                <button
                  type="button"
                  className={styles.editorDelete}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "删除中..." : "删除"}
                </button>
                <button
                  type="button"
                  className={styles.editorCancel}
                  onClick={() => {
                    setEditing(false);
                    setTitle(entry.title);
                    setContent(entry.content);
                    setMood(entry.mood);
                    setError("");
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={styles.editorSubmit}
                  disabled={saving || !title.trim()}
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          ) : (
            <article>
              <div className={styles.entryMeta} style={{ marginBottom: "1rem" }}>
                {entry.mood && <span>{entry.mood}</span>}
                <time>{entry.created_at}</time>
                {entry.updated_at !== entry.created_at && (
                  <span>（更新于 {entry.updated_at}）</span>
                )}
              </div>
              <h1 className={styles.diaryTitle} style={{ textAlign: "left", fontSize: "2rem", marginBottom: "2rem" }}>
                {entry.title}
              </h1>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                lineHeight: "2",
                color: "var(--color-text)",
                whiteSpace: "pre-wrap",
              }}>
                {entry.content}
              </div>
            </article>
          )}
        </div>
      </div>
    </main>
  );
}
