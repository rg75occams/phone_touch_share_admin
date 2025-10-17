import React, { useMemo, useState } from 'react';
import ShareButton from './components/ShareButton.jsx';
import QRModal from './components/QRModal.jsx';
import NFCWriter from './components/NFCWriter.jsx';

export default function App() {
  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE || 'https://phone-touch-share-backend.vercel.app/', []);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const createShortLink = async (url) => {
    try {
      const res = await fetch(`${apiBase}/api/create-shortlink`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, ttlSec: 24 * 60 * 60 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      return data.shortUrl;
    } catch (e) {
      console.warn('Shortlink error, falling back to original URL:', e);
      return url; // fallback to original URL
    }
  };

  const handleShareFallbackToQR = async () => {
    const shortUrl = await createShortLink(window.location.href);
    setQrUrl(shortUrl);
    setQrOpen(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
    }}>
      <h1>Phone‑Touch Share Demo</h1>
      <p style={{ maxWidth: 560, textAlign: 'center' }}>
        Try <b>Share</b> on iPhone/Android (opens native share). If unavailable/cancelled, it will show a <b>QR</b>.
        Use <b>NFC Writer</b> (Android Chrome) to program a tag with your short URL.
      </p>

      <ShareButton onNeedFallback={handleShareFallbackToQR} />

      <button onClick={handleShareFallbackToQR}>
        Show QR now
      </button>

      <NFCWriter getUrlForTag={() => createShortLink(window.location.href)} />

      <QRModal open={qrOpen} url={qrUrl} onClose={() => setQrOpen(false)} />

      <footer style={{ marginTop: 24, opacity: 0.7 }}>
        Backend: <code>{apiBase}</code>
      </footer>
    </div>
  );
}
