"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import styles from "./page.module.css";

const TEMPLATE_BASE = "/template";

const TEXT_FILES = [
  "pack.mcmeta",
  "assets/minecraft/models/item/totem_of_undying.json",
  "assets/minecraft/models/item/template_golden_apple_model.json",
  "assets/minecraft/models/item/golden_apple.json",
  "assets/minecraft/models/item/enchanted_golden_apple.json",
];

const BINARY_FILES = [
  "pack.png",
  "assets/minecraft/textures/item/golden_apple.png",
  "assets/minecraft/textures/item/totem_of_undying.png",
];

const USER_PNG_PATH = "assets/minecraft/textures/item/user.png";

function getFolderName(name: string) {
  return name + "金苹果和图腾";
}

function createFileTree(authorName: string) {
  const name = authorName || "你的名字";
  const folderName = getFolderName(name);
  const esc = (s: string) => s;
  return [
    `<span class="${styles.folder}">📁 ${esc(folderName)}/</span>`,
    `  <span class="${styles.file}">├── pack.mcmeta</span> <span class="${styles.highlight}">✎</span>`,
    `  <span class="${styles.file}">├── pack.png</span>`,
    `  <span class="${styles.file}">└── 📁 assets/</span>`,
    `      <span class="${styles.file}">└── 📁 minecraft/</span>`,
    `          <span class="${styles.file}">├── 📁 models/</span>`,
    `          <span class="${styles.file}">│   └── 📁 item/</span>`,
    `          <span class="${styles.file}">│       ├── enchanted_golden_apple.json</span>`,
    `          <span class="${styles.file}">│       ├── golden_apple.json</span>`,
    `          <span class="${styles.file}">│       ├── template_golden_apple_model.json</span> <span class="${styles.highlight}">✎</span>`,
    `          <span class="${styles.file}">│       └── totem_of_undying.json</span> <span class="${styles.highlight}">✎</span>`,
    `          <span class="${styles.file}">└── 📁 textures/</span>`,
    `              <span class="${styles.file}">└── 📁 item/</span>`,
    `                  <span class="${styles.file}">├── golden_apple.png</span>`,
    `                  <span class="${styles.file}">├── totem_of_undying.png</span>`,
    `                  <span class="${styles.file}">└── user.png</span> <span class="${styles.highlight}">▲ 替换</span>`,
  ].join("\n");
}

export default function MakerPage() {
  const [authorName, setAuthorName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState<{ msg: string; type: string }>({ msg: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [templateFiles, setTemplateFiles] = useState<Record<string, string | ArrayBuffer>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load template files
  useEffect(() => {
    async function load() {
      const files: Record<string, string | ArrayBuffer> = {};
      for (const path of TEXT_FILES) {
        try {
          const res = await fetch(`${TEMPLATE_BASE}/${path}`);
          files[path] = await res.text();
        } catch (err) {
          console.error("Failed to load", path, err);
        }
      }
      for (const path of BINARY_FILES) {
        try {
          const res = await fetch(`${TEMPLATE_BASE}/${path}`);
          files[path] = await res.arrayBuffer();
        } catch (err) {
          console.error("Failed to load", path, err);
        }
      }
      setTemplateFiles(files);
    }
    load();
  }, []);

  const handleFile = (file: File) => {
    if (file.type !== "image/png") {
      setStatus({ msg: "请上传 PNG 格式的图片", type: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, 64, 64);

        canvas.toBlob((blob) => {
          if (!blob) return;
          setUploadedFile(blob);
          setPreviewUrl(URL.createObjectURL(blob));
          setStatus({ msg: "", type: "" });
        }, "image/png");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const canMake = authorName.trim() && uploadedFile;

  const makeZip = async () => {
    if (!canMake) return;
    setLoading(true);
    setStatus({ msg: "", type: "" });

    try {
      const zip = new JSZip();
      const folderName = getFolderName(authorName.trim());
      const rootFolder = zip.folder(folderName)!;

      for (const path of TEXT_FILES) {
        let content = templateFiles[path];
        if (typeof content === "string") {
          content = content.replace(/chaoyouyu45/g, authorName.trim());
          rootFolder.file(path, content);
        }
      }

      for (const path of BINARY_FILES) {
        const data = templateFiles[path];
        if (data) {
          rootFolder.file(path, data, { binary: true });
        }
      }

      rootFolder.file(USER_PNG_PATH, uploadedFile!, { binary: true });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = folderName + ".zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus({ msg: "✓ 下载已开始！材质包已生成。", type: "success" });
    } catch (err) {
      console.error("打包失败:", err);
      setStatus({ msg: "打包失败，请重试。", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.makerPage}>
      <div className="container">
        <div className={styles.makerHeader}>
          <h1 className={styles.makerTitle}>材质包制作器</h1>
          <p className={styles.makerSubtitle}>
            上传你的头像，一键生成专属 Minecraft 金苹果 & 图腾材质包
          </p>
        </div>

        <div className={styles.makerLayout}>
          {/* Left: Form */}
          <div className={styles.makerFormCard}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>作者名称</label>
              <div className={styles.nameInputWrap}>
                <input
                  type="text"
                  className={styles.formInput}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="输入你的名字"
                />
                <span className={styles.nameSuffix}>金苹果和图腾</span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>上传64×64的皮肤图片</label>

              <div
                className={`${styles.uploadArea}${dragOver ? ` ${styles.dragover}` : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />

                {!uploadedFile ? (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p className={styles.uploadText}>拖拽 PNG 图片到此处，或点击选择</p>
                    <p className={styles.uploadHint}>仅支持 PNG 格式，将自动缩放至 64×64</p>
                  </div>
                ) : (
                  <div className={styles.uploadPreview}>
                    <img src={previewUrl} alt="预览" />
                    <div className={styles.previewOverlay}>
                      <span>点击更换</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className={`${styles.btnMake}${loading ? ` ${styles.btnMakeLoading}` : ""}`}
              disabled={!canMake}
              onClick={makeZip}
            >
              {loading ? "正在打包..." : "制作并下载"}
            </button>

            {status.msg && (
              <div
                className={`${styles.makeStatus} ${
                  status.type === "success" ? styles.makeStatusSuccess : status.type === "error" ? styles.makeStatusError : ""
                }`}
              >
                {status.msg}
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className={styles.makerPreviewCard}>
            <h3 className={styles.previewTitle}>材质包结构预览</h3>
            <div
              className={styles.fileTree}
              dangerouslySetInnerHTML={{ __html: createFileTree(authorName) }}
            />
            <div className={styles.previewNote}>
              <p>上传皮肤图片并填写作者名称，点击"制作"后自动打包为 zip 文件下载。</p>
              <p>替换内容：</p>
              <ul>
                <li>user.png → 你上传的皮肤图片</li>
                <li>作者信息 → 你填写的名字</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
