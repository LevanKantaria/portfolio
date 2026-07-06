import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { chatHandler } from './api/chat'

// In production Vercel serves api/chat.ts as an edge function; this plugin
// wires the same handler into the dev server so /api/chat works locally.
function apiDev(): Plugin {
  return {
    name: 'api-dev',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        const chunks: Buffer[] = []
        req.on('data', (c: Buffer) => chunks.push(c))
        req.on('end', async () => {
          try {
            const request = new Request(`http://localhost${req.url ?? ''}`, {
              method: req.method,
              headers: Object.entries(req.headers).flatMap(([k, v]) =>
                typeof v === 'string' ? [[k, v] as [string, string]] : [],
              ),
              body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
            })
            const response = await chatHandler(request)
            res.writeHead(response.status, Object.fromEntries(response.headers.entries()))
            if (response.body) {
              const reader = response.body.getReader()
              for (;;) {
                const { done, value } = await reader.read()
                if (done) break
                res.write(value)
              }
            }
            res.end()
          } catch (err) {
            res.writeHead(500, { 'content-type': 'application/json' })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
  }
  return {
    plugins: [react(), apiDev()],
  }
})
