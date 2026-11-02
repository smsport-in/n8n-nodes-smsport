const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    const ext = path.extname(src).toLowerCase();
    if (ext === '.svg' || ext === '.png' || ext === '.json') {
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`Copied asset: ${src} -> ${dest}`);
    }
  }
}

copyRecursive(path.resolve(__dirname, '../nodes'), path.resolve(__dirname, '../dist/nodes'));
