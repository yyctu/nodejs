const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const app = express()

// 目标网站
const TARGET_URL = 'https://hz.jinyebu.top'

// 代理中间件配置
const proxyMiddleware = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  ws: true,
  followRedirects: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Host', 'hz.jinyebu.top')
    proxyReq.setHeader('X-Forwarded-Host', req.headers.host)
    proxyReq.setHeader('X-Forwarded-Proto', 'https')
  },
  onProxyRes: (proxyRes, req, res) => {
    delete proxyRes.headers['x-frame-options']
    delete proxyRes.headers['content-security-policy']
    
    proxyRes.headers['Access-Control-Allow-Origin'] = '*'
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    proxyRes.headers['Access-Control-Allow-Headers'] = '*'
  }
})

// 处理所有请求
app.use('/', proxyMiddleware)

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`)
  console.log(`🎯 Proxying requests to: ${TARGET_URL}`)
})
