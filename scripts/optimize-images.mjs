// Generates responsive variants for portfolio images: <name>-640.webp next to the original (1080px).
// Usage: npm run images
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const dir = path.resolve('public/projects/showcase')
const files = (await readdir(dir)).filter((f) => f.endsWith('-desktop.webp'))

for (const file of files) {
  const out = path.join(dir, file.replace(/-desktop\.webp$/, '-desktop-640.webp'))
  await sharp(path.join(dir, file)).resize(640).webp({ quality: 78 }).toFile(out)
  console.log('→', path.basename(out))
}
