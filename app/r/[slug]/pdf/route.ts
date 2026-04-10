import { NextRequest, NextResponse } from 'next/server'
import { getResume } from '@/lib/kv'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const record = await getResume(slug)

  if (!record) {
    return new NextResponse('Resume not found', { status: 404 })
  }

  try {
    const host = _req.headers.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const url = `${protocol}://${host}/r/${slug}`

    // Use puppeteer (bundled Chromium) for both local dev and VPS.
    // @sparticuz/chromium is only needed for Vercel serverless (50MB limit).
    const puppeteer = await import('puppeteer')
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    await browser.close()

    const name = record.data.name.replace(/\s+/g, '-')
    const date = new Date().toISOString().slice(0, 7)
    const filename = `${name}-Resume-${date}.pdf`

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('[/r/[slug]/pdf]', err)
    return new NextResponse('PDF generation failed', { status: 500 })
  }
}
