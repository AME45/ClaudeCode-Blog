import fs from "fs";
import path from "path";

const isProd = process.env.VERCEL === "1";
const DATA_DIR = isProd ? "/tmp" : path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "diary.json");

export interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
}

interface Database {
  nextId: number;
  entries: DiaryEntry[];
}

function readDb(): Database {
  if (!fs.existsSync(DB_FILE)) {
    return { nextId: 1, entries: [] };
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db: Database): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function now(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export function getEntries(): DiaryEntry[] {
  const db = readDb();
  return db.entries.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getEntry(id: number): DiaryEntry | undefined {
  const db = readDb();
  return db.entries.find((e) => e.id === id);
}

export function createEntry(data: {
  title: string;
  content: string;
  mood: string;
}): DiaryEntry {
  const db = readDb();
  const timestamp = now();
  const entry: DiaryEntry = {
    id: db.nextId++,
    title: data.title,
    content: data.content,
    mood: data.mood,
    created_at: timestamp,
    updated_at: timestamp,
  };
  db.entries.push(entry);
  writeDb(db);
  return entry;
}

export function updateEntry(
  id: number,
  data: { title: string; content: string; mood: string }
): DiaryEntry | undefined {
  const db = readDb();
  const entry = db.entries.find((e) => e.id === id);
  if (!entry) return undefined;

  entry.title = data.title;
  entry.content = data.content;
  entry.mood = data.mood;
  entry.updated_at = now();
  writeDb(db);
  return entry;
}

export function deleteEntry(id: number): boolean {
  const db = readDb();
  const idx = db.entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  db.entries.splice(idx, 1);
  writeDb(db);
  return true;
}
