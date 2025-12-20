// =============================================================================
// FAVICON DINAMICA CON BORDI ARROTONDATI
// Next.js genera automaticamente la favicon da questo file
// =============================================================================

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'white',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://main.d1hid7kq21kdxm.amplifyapp.com/favicon.png"
          alt="G"
          width={32}
          height={32}
          style={{
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
