import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRModal({ open, url, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (canvas && url) {
      QRCode.toCanvas(canvas, url, { width: 256 }, (err) => {
        if (err) console.error(err);
      });
    }
  }, [open, url]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 12, width: 340, textAlign: 'center' }}>
        <h3>Scan to open</h3>
        <canvas ref={canvasRef} />
        <p style={{ wordBreak: 'break-all' }}>
          <a href={url} target="_blank" rel="noreferrer">{url}</a>
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
