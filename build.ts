import { Glob, file, write, build } from 'bun'
import { mkdir } from 'fs'

const outDir = './dist'
const staticDir = './static'

await build({
  entrypoints: ['./src/index.html'],
  outdir: outDir,
  minify: true,
  define: { 'NODE_ENV': 'production' },
  env: 'BUN_PUBLIC_*',
  target: 'browser'
})

const staticFiles = new Glob(`${staticDir}/**/*`)

for await (const path of staticFiles.scan({ onlyFiles: true })) {
  const destPath = path.replace(staticDir, outDir)
  const destDir = destPath.substring(0, destPath.lastIndexOf('/'))
  mkdir(destDir, { recursive: true }, () => { })
  await write(destPath, file(path))
}