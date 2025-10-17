import React, { useState } from 'react';

export default function NFCWriter({ getUrlForTag }) {
  const [status, setStatus] = useState('');

  const writeTag = async () => {
    try {
      if (!('NDEFWriter' in window)) {
        setStatus('Web NFC not supported on this device/browser. Use Android Chrome.');
        return;
      }
      setStatus('Requesting NFC write permission...');
      const writer = new NDEFWriter();
      const url = await getUrlForTag();
      await writer.write({ records: [{ recordType: 'url', data: url }] });
      setStatus('✅ NFC tag written! Tap the tag with any phone to open the link.');
    } catch (e) {
      setStatus('❌ Failed to write: ' + (e?.message || e));
    }
  };

  return (
    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button onClick={writeTag}>NFC Writer (Android Chrome)</button>
      <small style={{ opacity: 0.7, textAlign: 'center', maxWidth: 500 }}>
        Programs an NFC tag with your short URL. Reading works on iPhone & Android.
        Writing is supported on Android Chrome only.
      </small>
      {status && <div style={{ fontSize: 14 }}>{status}</div>}
    </div>
  );
}
