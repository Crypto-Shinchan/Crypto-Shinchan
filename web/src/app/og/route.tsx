import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Crypto Shinchan Blog';
    const author = searchParams.get('author') || 'Unknown Author';
    const date = searchParams.get('date') || '';

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
            padding: '80px',
            fontFamily: 'sans-serif',
            color: '#1F2937',
            backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2, marginBottom: 40 }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Future: Add author avatar here */}
            <div style={{ fontSize: 36, fontWeight: 500, color: '#4B5563' }}>
              {author}
            </div>
          </div>
          {date && (
            <div style={{ fontSize: 28, color: '#6B7280', marginTop: 20 }}>
              {date}
            </div>
          )}
          <div style={{ position: 'absolute', right: 80, bottom: 40, fontSize: 24, color: '#9CA3AF' }}>
            crypto-shinchan.blog
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
