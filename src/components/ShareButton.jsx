import React from 'react';

export default function ShareButton({ onNeedFallback }) {
  const shareNow = async () => {
    const shareData = {
      title: document.title || 'Phone‑Touch Share Demo',
      text: 'Check this out',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        console.log('Share cancelled/error, show QR fallback:', e);
      }
    }

    onNeedFallback?.();
  };

  return (
    <button onClick={shareNow}>
      Share (Web Share API)
    </button>
  );
}
