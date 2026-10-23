import { chromium } from 'playwright';
import sharp from 'sharp';

const OUT = 'C:/Users/Webbirth/Desktop/Webbirth/public/projects/showcase';

const sites = [
  { slug: 'westvox', url: 'https://westvox.com/' },
  { slug: 'ashtalakshmi-temple', url: 'https://ashtalakshmi.org/' },
  { slug: 'aspen-capital', url: 'https://aspencptl.com/' },
  { slug: 'good-roll-golf', url: 'https://goodrollgolf.com/' },
  { slug: 'generation-purple', url: 'https://generationpurple.com/' },
  { slug: 'documintq', url: 'https://documintq.com/' },
  { slug: 'easymarg', url: 'https://easymarg.com/' },
  { slug: 'parinitha', url: 'https://parinitha.in/' },
  { slug: 'cadmaxx', url: 'https://cadmaxx.com/' },
  { slug: 'home-captain', url: 'https://homecaptain.in/' },
  { slug: 'first-wave-fries', url: 'https://firstwavefries.com/' },
  { slug: 'fit-muscle', url: 'https://fitmusclepremiumfitness.in/' },
  { slug: 'alai-rescues', url: 'https://alairescues.in/' },
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
    await page.goto(siteUrl, { waitUntil: 'load', timeout: 60000 });
  } catch {
    try {
      await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch {
      await page.close();
      return null;
    }
  }
  await page.waitForTimeout(5000);

  // Scroll down to trigger lazy images
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < totalHeight; y += 200) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(5000);

  // Scroll back up
  for (let y = totalHeight; y >= 0; y -= 400) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(150);
  }

  // Force lazy images
  await page.evaluate(async () => {
    document.querySelectorAll('img').forEach(img => {
      const lazySrc = img.dataset.src || img.dataset.lazySrc || img.dataset.originalSrc;
      if (lazySrc && !img.src.includes(lazySrc)) img.src = lazySrc;
      const lazySrcset = img.dataset.srcset || img.dataset.lazySrcset;
      if (lazySrcset) img.srcset = lazySrcset;
      img.loading = 'eager';
      img.classList.remove('lazyload', 'lazy');
      img.classList.add('lazyloaded');
    });
    document.querySelectorAll('[data-settings]').forEach(el => {
      try {
        const s = JSON.parse(el.dataset.settings);
        if (s.background_image?.url) el.style.backgroundImage = `url(${s.background_image.url})`;
      } catch {}
    });
    await Promise.allSettled(
      Array.from(document.querySelectorAll('img')).map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise(r => { img.onload = r; img.onerror = r; setTimeout(r, 15000); });
      })
    );
  });

  await page.waitForTimeout(5000);

  // Hide cookie banners
  await page.evaluate(() => {
    document.querySelectorAll('[class*="cookie"], [id*="cookie"], [class*="gdpr"], [id*="gdpr"]').forEach(el => el.style.display = 'none');
  });

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);

  const imgStatus = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    let loaded = 0, broken = 0;
    imgs.forEach(img => { if (img.complete && img.naturalWidth > 0) loaded++; else broken++; });
    return { total: imgs.length, loaded, broken };
  });

  const buf = await page.screenshot({ fullPage: true, type: 'png' });
  await page.close();
  return { buf, imgStatus };
}

const browser = await chromium.launch({ headless: true });
const results = {};

for (const site of sites) {
  console.log(`\n── ${site.slug} (${site.url}) ──`);

  // Desktop capture
  const desktop = await capturePage(browser, site.url, 1200, 800);
  if (!desktop) {
    console.log(`  FAILED to load`);
    results[site.slug] = { error: 'failed to load' };
    continue;
  }

  const dMeta = await sharp(desktop.buf).metadata();
  const dHeight = Math.round((dMeta.height / dMeta.width) * 1200);
  console.log(`  Desktop: ${dMeta.width}x${dMeta.height} → 1200x${dHeight}, images: ${desktop.imgStatus.loaded}/${desktop.imgStatus.total}`);

  await sharp(desktop.buf).resize({ width: 1200 }).webp({ quality: 82 }).toFile(`${OUT}/${site.slug}-desktop.webp`);
  await sharp(desktop.buf).resize({ width: 640 }).webp({ quality: 78 }).toFile(`${OUT}/${site.slug}-desktop-640.webp`);

  results[site.slug] = { desktopHeight: dHeight, images: desktop.imgStatus };

  // Mobile capture if needed
  if (site.mobile) {
    const mobile = await capturePage(browser, site.url, 420, 812);
    if (mobile) {
      const mMeta = await sharp(mobile.buf).metadata();
      const mHeight = Math.round((mMeta.height / mMeta.width) * 420);
      console.log(`  Mobile:  ${mMeta.width}x${mMeta.height} → 420x${mHeight}, images: ${mobile.imgStatus.loaded}/${mobile.imgStatus.total}`);

      await sharp(mobile.buf).resize({ width: 420 }).webp({ quality: 82 }).toFile(`${OUT}/${site.slug}-mobile.webp`);
      await sharp(mobile.buf).resize({ width: 420 }).webp({ quality: 78 }).toFile(`${OUT}/${site.slug}-mobile-640.webp`);

      results[site.slug].mobileHeight = mHeight;
    }
  }
}

await browser.close();

console.log('\n\n══ RESULTS ══');
for (const [slug, data] of Object.entries(results)) {
  if (data.error) {
    console.log(`${slug}: ERROR - ${data.error}`);
  } else {
    console.log(`${slug}: desktop h=${data.desktopHeight}${data.mobileHeight ? `, mobile h=${data.mobileHeight}` : ''}, imgs=${data.images.loaded}/${data.images.total}`);
  }
}
