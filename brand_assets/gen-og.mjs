import puppeteer from 'file:///C:/Users/lejau/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const htmlPath = 'file:///' + join(__dirname, 'og-image.html').replace(/\\/g, '/');
const outputPath = join(__dirname, 'og-image.png');

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/lejau/.cache/puppeteer/chrome/win64-146.0.7680.31/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto(htmlPath, { waitUntil: 'networkidle2', timeout: 15000 });
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: outputPath });
await browser.close();
console.log('OG image saved:', outputPath);
