import { createServer } from 'vite';
import monkey from 'vite-plugin-monkey';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

async function startDev() {
  if (!fs.existsSync(srcDir)) {
    console.error(`❌ Error: 'src' directory does not exist. Create a script directory under 'src/' first.`);
    process.exit(1);
  }

  const scriptName = process.argv[2];
  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  if (!scriptName) {
    console.log('❌ Error: Please specify the script folder to develop.');
    console.log('Usage: npm run dev <script-folder-name>');
    if (entries.length > 0) {
      console.log('Available scripts:', entries.map(e => `\n - ${e}`).join(''));
    }
    process.exit(1);
  }

  if (!entries.includes(scriptName)) {
    console.error(`❌ Error: Script folder '${scriptName}' not found in src/.`);
    if (entries.length > 0) {
      console.log('Available scripts:', entries.map(e => `\n - ${e}`).join(''));
    }
    process.exit(1);
  }

  const entryFolder = path.join(srcDir, scriptName);
  const entryFile = path.join(entryFolder, 'index.ts');
  const metaFile = path.join(entryFolder, 'meta.json');

  if (!fs.existsSync(entryFile)) {
    console.error(`❌ Error: index.ts not found in ${entryFolder}`);
    process.exit(1);
  }

  let meta = {
    name: scriptName,
    namespace: 'my-userscripts',
    version: '1.0.0',
    match: ['*://*/*'],
  };

  if (fs.existsSync(metaFile)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
    } catch (e) {
      console.error(`❌ Error parsing meta.json in ${scriptName}:`, e.message);
      process.exit(1);
    }
  }

  console.log(`🚀 Starting development server for ${meta.name || scriptName}...`);

  const server = await createServer({
    root: rootDir,
    configFile: false,
    plugins: [
      monkey({
        entry: entryFile,
        userscript: meta,
        build: {
          fileName: `${scriptName}.user.js`,
        },
      }),
    ],
  });

  await server.listen();
  server.printUrls();
}

startDev().catch(err => {
  console.error('❌ Dev server failed to start:', err);
  process.exit(1);
});
