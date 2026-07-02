import { ImageResponse } from 'next/og';

export const alt = 'Chef at Home — AI Recipes from Your Ingredients';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Branded social-share card (used for Open Graph + Twitter).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background: '#131313',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: '-3px',
            color: '#ffffff',
          }}
        >
          <span>Chef</span>
          <span style={{ color: '#96B462' }}>at</span>
          <span>home</span>
        </div>
        <div
          style={{
            fontSize: 44,
            color: '#DBDEE1',
            marginTop: 28,
            maxWidth: 960,
            lineHeight: 1.3,
          }}
        >
          Turn your everyday ingredients into gourmet recipes with AI.
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: 48,
          }}
        >
          {['AI recipes', 'Free & unlimited', 'Responsive'].map(t => (
            <div
              key={t}
              style={{
                fontSize: 28,
                color: '#96B462',
                border: '2px solid #96B462',
                borderRadius: 9999,
                padding: '10px 26px',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
