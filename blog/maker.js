// ===== Template file list =====
const TEMPLATE_BASE = 'template';

// Text files (may contain "chaoyouyu45" to replace)
const TEXT_FILES = [
  'pack.mcmeta',
  'assets/minecraft/models/item/totem_of_undying.json',
  'assets/minecraft/models/item/template_golden_apple_model.json',
  'assets/minecraft/models/item/golden_apple.json',
  'assets/minecraft/models/item/enchanted_golden_apple.json',
];

// Binary files (images)
const BINARY_FILES = [
  'pack.png',
  'assets/minecraft/textures/item/golden_apple.png',
  'assets/minecraft/textures/item/totem_of_undying.png',
];

const USER_PNG_PATH = 'assets/minecraft/textures/item/user.png';

// ===== DOM refs =====
const authorNameInput = document.getElementById('authorName');
const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const uploadPreview = document.getElementById('uploadPreview');
const previewImg = document.getElementById('previewImg');
const btnMake = document.getElementById('btnMake');
const makeStatus = document.getElementById('makeStatus');
const fileTree = document.getElementById('fileTree');

// ===== State =====
let uploadedFile = null;
let templateFiles = {};

// ===== File tree display =====
function buildFileTree(authorName) {
  const name = authorName || '你的名字';
  const folderName = name + '金苹果和图腾';
  const lines = [
    `<span class="folder">📁 ${escapeHtml(folderName)}/</span>`,
    `  <span class="file">├── pack.mcmeta</span> <span class="highlight">✎</span>`,
    `  <span class="file">├── pack.png</span>`,
    `  <span class="file">└── 📁 assets/</span>`,
    `      <span class="file">└── 📁 minecraft/</span>`,
    `          <span class="file">├── 📁 models/</span>`,
    `          <span class="file">│   └── 📁 item/</span>`,
    `          <span class="file">│       ├── enchanted_golden_apple.json</span>`,
    `          <span class="file">│       ├── golden_apple.json</span>`,
    `          <span class="file">│       ├── template_golden_apple_model.json</span> <span class="highlight">✎</span>`,
    `          <span class="file">│       └── totem_of_undying.json</span> <span class="highlight">✎</span>`,
    `          <span class="file">└── 📁 textures/</span>`,
    `              <span class="file">└── 📁 item/</span>`,
    `                  <span class="file">├── golden_apple.png</span>`,
    `                  <span class="file">├── totem_of_undying.png</span>`,
    `                  <span class="file">└── user.png</span> <span class="highlight">▲ 替换</span>`,
  ];
  return lines.join('\n');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== Load template files =====
async function loadTemplateFiles() {
  for (const path of TEXT_FILES) {
    try {
      const res = await fetch(`${TEMPLATE_BASE}/${path}`);
      templateFiles[path] = await res.text();
    } catch (err) {
      console.error(`Failed to load ${path}:`, err);
    }
  }

  for (const path of BINARY_FILES) {
    try {
      const res = await fetch(`${TEMPLATE_BASE}/${path}`);
      templateFiles[path] = await res.arrayBuffer();
    } catch (err) {
      console.error(`Failed to load ${path}:`, err);
    }
  }
}

// ===== Update UI =====
function updatePreview() {
  const name = authorNameInput.value.trim();
  fileTree.innerHTML = buildFileTree(name);
}

authorNameInput.addEventListener('input', updatePreview);

function updateButtonState() {
  const name = authorNameInput.value.trim();
  btnMake.disabled = !(name && uploadedFile);
}

authorNameInput.addEventListener('input', updateButtonState);

// ===== Upload handling =====
uploadArea.addEventListener('click', () => {
  imageInput.click();
});

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

// Drag & drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (file.type !== 'image/png') {
    showStatus('请上传 PNG 格式的图片', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 64, 64);

      canvas.toBlob((blob) => {
        uploadedFile = blob;
        previewImg.src = URL.createObjectURL(blob);
        uploadPlaceholder.style.display = 'none';
        uploadPreview.style.display = 'flex';
        updateButtonState();
        showStatus('', '');
      }, 'image/png');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ===== Make button =====
btnMake.addEventListener('click', async () => {
  const authorName = authorNameInput.value.trim();
  if (!authorName || !uploadedFile) return;

  const folderName = authorName + '金苹果和图腾';

  btnMake.classList.add('loading');
  btnMake.querySelector('.btn-make-text').style.display = 'none';
  btnMake.querySelector('.btn-make-loading').style.display = 'inline';
  showStatus('', '');

  try {
    const zip = new JSZip();
    const rootFolder = zip.folder(folderName);

    // Add text files (with name replacement)
    for (const path of TEXT_FILES) {
      let content = templateFiles[path];
      if (!content) continue;
      content = content.replace(/chaoyouyu45/g, authorName);
      rootFolder.file(path, content);
    }

    // Add binary files (unchanged)
    for (const path of BINARY_FILES) {
      const data = templateFiles[path];
      if (!data) continue;
      rootFolder.file(path, data, { binary: true });
    }

    // Add user.png from upload
    rootFolder.file(USER_PNG_PATH, uploadedFile, { binary: true });

    // Generate and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = folderName + '.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus('✓ 下载已开始！材质包已生成。', 'success');
  } catch (err) {
    console.error('打包失败:', err);
    showStatus('打包失败，请重试。', 'error');
  } finally {
    btnMake.classList.remove('loading');
    btnMake.querySelector('.btn-make-text').style.display = 'inline';
    btnMake.querySelector('.btn-make-loading').style.display = 'none';
  }
});

function showStatus(msg, type) {
  makeStatus.textContent = msg;
  makeStatus.className = 'make-status ' + type;
}

// ===== Init =====
async function init() {
  await loadTemplateFiles();
  updatePreview();
}

init();
