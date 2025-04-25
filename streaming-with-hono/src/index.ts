import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { streamText } from 'hono/streaming'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Hono()

app.get('/', (c) => {
  const htmlPath = path.join(__dirname, '/public/index.html')
  return c.html(fs.readFileSync(htmlPath, 'utf-8'))
})

app.get('/stream', (c) => {
  c.header('Transfer-Encoding', 'chunked')
  c.header('Cache-Control', 'no-cache')
  c.header('Connection', 'keep-alive')

  const filePath = path.join(__dirname, "/content/text.txt")
  return streamText(c, async (stream) => {
    const fileStream = fs.createReadStream(filePath, {
      encoding: 'utf-8',
      highWaterMark: 1 // Read 1 byte at a time for character-by-character streaming
    })

    for await (const char of fileStream) {
      await stream.write(char);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
