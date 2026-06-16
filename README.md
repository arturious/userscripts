# Userscripts

My personal collection of Tampermonkey userscripts designed to enhance various websites.

## Project Structure

Each userscript is organized in its own folder under the `src/` directory.

- `src/` - Source code of the userscripts (written in TypeScript/ESNext).
  - Each script folder contains an `index.ts` (logic) and `meta.json` (metadata headers).
- `dist/` - Compiled `.user.js` files ready for installation in Tampermonkey.
- `scripts/` - Automation scripts for building and development.

## Development and Build

This project uses **Vite** + **TypeScript** + **vite-plugin-monkey** for bundling and live development.

### Installation

First, install the project dependencies:
```bash
npm install
```

### Start Development Server

To run a live development server for a specific script with Hot Module Replacement (HMR):
```bash
npm run dev <script-folder-name>
```
*Example:* `npm run dev example-script`

### Build Scripts

To build all userscripts into production-ready `.user.js` files:
```bash
npm run build
```
The compiled files will be generated in the `dist/` directory.

## Installing Scripts in Browser

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your web browser.
2. Navigate to the `dist/` directory in this repository on GitHub.
3. Open the compiled script (e.g., `example-script.user.js`), click the **Raw** button, and Tampermonkey will automatically prompt you to install it.
