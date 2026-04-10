#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// Load .env.local before starting Next.js
const envPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^['"]|['"]$/g, '')
      if (key) {
        process.env[key] = value
      }
    }
  })
}

// Now start the Next.js server (deployed to root via rsync from .next/standalone/)
require('./server.js')
