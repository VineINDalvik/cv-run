import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0D1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Mesh gradient bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(61,92,53,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(124,60,43,0.08) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 80%, rgba(110,231,183,0.05) 0%, transparent 40%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', width: '100%', textAlign: 'center' }}>
        {/* Wordmark */}
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '32px' }}>
          cv.run
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 54px)',
          fontWeight: 300,
          color: '#F0F0EC',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '16px',
        }}>
          Turn your experience into<br />
          <span style={{ color: 'rgba(110,231,183,0.8)' }}>a resume worth sharing.</span>
        </h1>

        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)', marginBottom: '48px', lineHeight: 1.6 }}>
          Paste anything — AI structures it, polishes the language,<br />
          and generates a beautiful web resume in seconds.
        </p>

        {/* CTA */}
        <Link href="/build" style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: '#F0F0EC',
          color: '#0D1117',
          borderRadius: '100px',
          fontSize: '15px',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '-0.01em',
          marginBottom: '48px',
        }}>
          Generate resume →
        </Link>

        {/* Theme examples */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>See examples:</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          {[
            { label: 'Terminal', href: '/build', color: '#6EE7B7' },
            { label: 'Editorial', href: '/build', color: '#C4A882' },
            { label: 'Organic', href: '/build', color: '#3D5C35' },
          ].map(({ label, href, color }) => (
            <Link key={label} href={href} style={{
              fontSize: '12px',
              padding: '6px 16px',
              borderRadius: '100px',
              border: `1px solid ${color}30`,
              color: color,
              textDecoration: 'none',
              letterSpacing: '0.04em',
              background: `${color}08`,
            }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
