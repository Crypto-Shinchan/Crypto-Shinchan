import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Crypto Shinchan Blog';
    const author = searchParams.get('author') || 'Unknown Author';
    const date = searchParams.get('date') || '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    const siteHost = (() => {
      try { return new URL(siteUrl).host } catch { return 'example.com' }
    })();
    const logoUrl = `${siteUrl}/logo.svg`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '72px',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
            color: '#0F1115',
            background: 'linear-gradient(135deg, #F7F7F8 0%, #E9EEF6 100%)',
          }}
        >
          {/* Accent bar */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: 'linear-gradient(180deg, #F7931A 0%, #FFC107 100%)' }} />

          {/* Logo */}
          <img
            src={logoUrl}
            width={96}
            height={96}
            alt="logo"
            style={{ position: 'absolute', right: 72, top: 56 }}
          />

          {/* Title */}
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15, marginRight: 220 }}>
            {title}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 28, gap: 24 }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: '#374151' }}>{author}</div>
            {date && <div style={{ fontSize: 28, color: '#6B7280' }}>{date}</div>}
          </div>

          {/* Host */}
          <div style={{ position: 'absolute', right: 72, bottom: 40, fontSize: 26, color: '#6B7280' }}>
            {siteHost}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`,
      {
        status: 500,
      },
    );
  }
}
