import httpProxy from 'http-proxy'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
    bodyParser: false
  }
}

export default async function handle(req, res) {
  const headers = {}
  console.log('req.url:', req.url)

  if (req.url.indexOf('/api/noauth') === -1) {
    try {
      const session = await getServerSession(req, res, authOptions)
      if (session?.user?.token) {
        headers.Authorization = 'Bearer ' + session.user.token
      } else {
        res.status(401).json({ error: 'Session Expired' })
      }
    } catch (e) {
      res.status(401).json({ error: 'Session Expired' })
    }
  }

  const proxy = httpProxy.createProxy()
  proxy.web(req, res, {
    headers,
    changeOrigin: true,
    target: process.env.API_SERVER_HOST
  })
}
