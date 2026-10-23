import { chromium } from 'playwright';
import sharp from 'sharp';

const OUT = 'C:/Users/Webbirth/Desktop/Webbirth/public/projects/showcase';

const sites = [
  { slug: 'enrich-global-academy', url: 'https://enrichglobalacademy.com/' },
  { slug: 'doczee', url: 'https://doczee.in/', mobile: true },
  { slug: 'sanchara-mitra', url: 'https://sancharamitra.co.in/', mobile: true },
  { slug: 'bussguru', url: 'https://bussguru.in/', mobile: true },
  { slug: 'girani', url: 'https://girani.in/', mobile: true },
  { slug: 'ramanuja-kuteera', url: 'https://ramanujakuteera.com/', mobile: true },
  { slug: 'swa-adhyay', url: 'https://swaadhyay.com/', mobile: true },
  { slug: 'superior-solar', url: 'https://superiorsolar.co.in/', mobile: true },
];

async function capturePage(browser, siteUrl, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = '[class*="cookie"], [id*="cookie"], [class*="gdpr"], [id*="gdpr"], .moove-gdpr-modal-content { display: none !important; }';
    document.head?.appendChild(style) || document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  });

  try {
    await page.goto(siteUrl, { waitUntil: 'networkidle', timeout: 60000 });
  } catch {
    try { await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }); } catch { await page.close(); return null; }
  }
  await page.waitForTimeout(5000);

  try {
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < totalHeight; y += 300) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(4000);
    for (let y = totalHeight; y >= 0; y -= 500) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(150);
    }

    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(img => {
        const lazySrc = img.dataset.src || img.dataset.lazySrc || img.dataset.originalSrc;
        if (lazySrc) img.src = lazySrc;
        const lazySrcset = img.dataset.srcset || img.dataset.lazySrcset;
        if (lazySrcset) img.srcset = lazySrcset;
        img.loading = 'eager';
      });
      document.querySelectorAll('[data-settings]').forEach(el => {
        try { const s = JSON.parse(el.dataset.settings); if (s.background_image?.url) el.style.backgroundImage = `url(${s.background_image.url})`; } catch {}
      });
      await Promise.allSettled(Array.from(document.querySelectorAll('img')).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 12000); });
      }));
    });
    await page.waitForTimeout(5000);

    await page.evaluate(() => {
      document.querySelectorAll('[class*="cookie"], [id*="cookie"], [class*="gdpr"]').forEach(el => el.style.display = 'none');
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log(`  Warning during scroll/lazy: ${e.message.slice(0, 80)}`);
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
    await page.waitForTimeout(2000);
  }

  const imgStatus = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    let loaded = 0, broken = 0;
    imgs.forEach(img => { if (img.complete && img.naturalWidth > 0) loaded++; else broken++; });
    return { total: imgs.length, loaded, broken };
  }).catch(() => ({ total: 0, loaded: 0, broken: 0 }));

  const buf = await page.screenshot({ fullPage: true, type: 'png' });
  await page.close();
  return { buf, imgStatus };
}

const browser = await chromium.launch({ headless: true });

for (const site of sites) {
  console.log(`\n── ${site.slug} (${site.url}) ──`);
  try {
    const desktop = await capturePage(browser, site.url, 1200, 800);
    if (!desktop) { console.log('  FAILED'); continue; }
    const dMeta = await sharp(desktop.buf).metadata();
    const dH = Math.round((dMeta.height / dMeta.width) * 1200);
    console.log(`  Desktop: ${dMeta.width}x${dMeta.height} → 1200x${dH}, imgs: ${desktop.imgStatus.loaded}/${desktop.imgStatus.total}`);
    await sharp(desktop.buf).resize({ width: 1200 }).webp({ quality: 82 }).toFile(`${OUT}/${site.slug}-desktop.webp`);
    await sharp(desktop.buf).resize({ width: 640 }).webp({ quality: 78 }).toFile(`${OUT}/${site.slug}-desktop-640.webp`);

    if (site.mobile) {
      const mobile = await capturePage(browser, site.url, 420, 812);
      if (mobile) {
        const mMeta = await sharp(mobile.buf).metadata();
        const mH = Math.round((mMeta.height / mMeta.width) * 420);
        console.log(`  Mobile:  ${mMeta.width}x${mMeta.height} → 420x${mH}, imgs: ${mobile.imgStatus.loaded}/${mobile.imgStatus.total}`);
        await sharp(mobile.buf).resize({ width: 420 }).webp({ quality: 82 }).toFile(`${OUT}/${site.slug}-mobile.webp`);
        await sharp(mobile.buf).resize({ width: 420 }).webp({ quality: 78 }).toFile(`${OUT}/${site.slug}-mobile-640.webp`);
      }
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message.slice(0, 100)}`);
  }
}
await browser.close();
console.log('\nDone!');
