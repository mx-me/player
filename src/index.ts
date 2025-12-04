import { serve } from 'bun'
import { join } from 'path'
import index from './index.html'

const server = serve({
  routes: {
    '/': index,
    '/*': async ({ url }) => {
      const file = Bun.file(join('./static', new URL(url).pathname))

      if (!(await file.exists())) {
        return new Response('not found', { status: 404 })
      }

      return new Response(file)
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    hmr: true,
    console: true,
  },
})

console.log(`🚀 Server running at ${server.url}`)
