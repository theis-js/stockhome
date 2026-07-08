// scripts/copy-assets.cjs
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const sqlFiles = fs
  .readdirSync(rootDir)
  .filter((f) => f.endsWith(".scheme.sql"));

for (const file of sqlFiles) {
  const srcPath = path.join(rootDir, file);
  const distPath = path.join(distDir, file);
  fs.copyFileSync(srcPath, distPath);
  console.log(`Copied ${srcPath} -> ${distPath}`);
}
