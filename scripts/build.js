import { build } from 'vite';
import monkey from 'vite-plugin-monkey';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

async function buildAll() {
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ Error: 'src' directory does not exist. Create a script directory under 'src/' first.`);
    process.exit(1);
  }

  // Clear dist folder first
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir);

  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (entries.length === 0) {
    console.log('⚠️ No scripts found in src/ folder.');
    return;
  }

  console.log(`Found ${entries.length} script(s) to build...\n`);

  for (const entry of entries) {
    const entryFolder = path.join(srcDir, entry);
    const entryFile = path.join(entryFolder, 'index.ts');
    const metaFile = path.join(entryFolder, 'meta.json');

    if (!fs.existsSync(entryFile)) {
      console.warn(`⚠️ Warning: index.ts not found in ${entry}, skipping.`);
      continue;
    }

    let meta = {
      name: entry,
      namespace: 'my-userscripts',
      version: '1.0.0',
      match: ['*://*/*'],
    };

    if (fs.existsSync(metaFile)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      } catch (e) {
        console.error(`❌ Error parsing meta.json in ${entry}:`, e.message);
        continue;
      }
    }

    console.log(`📦 Building: ${meta.name || entry}...`);

    await build({
      root: rootDir,
      configFile: false,
      plugins: [
        monkey({
          entry: entryFile,
          userscript: meta,
          build: {
            fileName: `${entry}.user.js`,
          },
        }),
      ],
      build: {
        outDir: distDir,
        emptyOutDir: false,
      },
    });
    console.log(`✅ Finished: ${meta.name || entry}\n`);
  }

  console.log('✨ All scripts built successfully in dist/ folder!');
}

buildAll().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
