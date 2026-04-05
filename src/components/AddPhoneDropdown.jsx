import { useState, useRef, useEffect } from 'react';

export default function AddPhoneDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '10px 22px', background: 'var(--primary)', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        + Add Phone Number
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, background: '#fff',
          border: '1px solid var(--gray-200)', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: 220, zIndex: 10,
          overflow: 'hidden',
        }}>
          <div
            onClick={() => { onSelect('inbound'); setOpen(false); }}
            style={{
              padding: '12px 16px', cursor: 'pointer', fontSize: 14,
              borderBottom: '1px solid var(--gray-100)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{ color: 'var(--green)' }}>↙</span> Inbound Phone Number
          </div>
          <div
            onClick={() => { onSelect('outbound'); setOpen(false); }}
            style={{
              padding: '12px 16px', cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{ color: 'var(--primary)' }}>↗</span> Outbound Phone Number
          </div>
        </div>
      )}
    </div>
  );
}
