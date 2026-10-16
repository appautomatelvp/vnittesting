const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Starting VNIT Website & Admin Build...');

// 1. Prepare dist directory
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. Build Admin Portal (React / Vite)
console.log('📦 Building Admin CMS...');
try {
  const adminNodeModules = path.join(rootDir, 'admin', 'node_modules');
  if (!fs.existsSync(adminNodeModules)) {
    console.log('📥 Installing admin dependencies...');
    execSync('npm --prefix admin install', { stdio: 'inherit', cwd: rootDir });
  }
  execSync('npm --prefix admin run build', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Admin CMS built successfully into dist/admin/');
} catch (err) {
  console.error('❌ Failed to build admin CMS:', err);
  process.exit(1);
}

// 3. Copy root website HTML files to dist
const htmlFiles = [
  'index.html',
  'gioi-thieu.html',
  'nang-luc.html',
  'dich-vu.html',
  'du-an.html',
  'tin-tuc.html',
  'tuyen-dung.html',
  'lien-he.html'
];

console.log('📄 Copying website HTML pages to dist/...');
htmlFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// 4. Copy website static assets directory to dist/assets
console.log('🎨 Copying assets to dist/assets/...');
function copyDirRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const assetsSrc = path.join(rootDir, 'assets');
const assetsDest = path.join(distDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  copyDirRecursive(assetsSrc, assetsDest);
}

console.log('✨ Build completed! dist/ is ready for Vercel deployment.');
