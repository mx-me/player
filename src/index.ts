import { serve } from 'bun'
import { join } from 'path'
import index from './index.html'

const server = serve({
  routes: {
    '/': index,
    '/*': async ({ url, headers }) => {
      const file = Bun.file(join('./static', new URL(url).pathname))

      if (!(await file.exists())) {
        return new Response('not found', { status: 404 })
      }

      const rangeHeader = headers.get('range')
      if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-')
        let start = parseInt(parts[0], 10)
        let end = parts[1] ? parseInt(parts[1], 10) : file.size - 1

        if (isNaN(start) || start < 0) start = 0
        if (isNaN(end) || end >= file.size) end = file.size - 1

        if (start > end || start >= file.size) {
          return new Response('not satisfiable', {
            status: 416, headers: {
              'Content-Range': `bytes */${file.size}`
            }
          })
        }

        const chunkSize = end - start + 1

        const sliced = file.slice(start, end + 1)

        return new Response(sliced, {
          status: 206, headers: {
            'Content-Range': `bytes ${start}-${end}/${file.size}`,
            'Content-Length': chunkSize.toString(),
            'Content-Type': file.type,
            'Accept-Ranges': 'bytes'
          }
        })
      }

      return new Response(file, {
        headers: {
          'Accept-Ranges': 'bytes'
        }
      })
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
})

console.log(`🚀 Server running at ${server.url}`)
