import { useState, useRef, useEffect } from 'react';
import countries from '../data/countries';

export default function CountryCodePicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = countries.find(c => c.code === value) || countries[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => !disabled && setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 12px', background: 'var(--gray-50)',
          borderRight: '1px solid var(--gray-200)',
          cursor: disabled ? 'default' : 'pointer', minWidth: 90,
        }}
      >
        <span style={{ fontSize: 18 }}>{selected.flag}</span>
        <span style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 500 }}>{selected.dialCode}</span>
        {!disabled && <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>▾</span>}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, background: '#fff',
          border: '1px solid var(--gray-200)', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 20,
          width: 220, maxHeight: 200, overflowY: 'auto',
        }}>
          {countries.map(c => (
            <div
              key={c.code}
              onClick={() => { onChange(c.code); setOpen(false); }}
              style={{
                padding: '10px 14px', cursor: 'pointer', fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 10,
                background: c.code === value ? 'var(--primary-light)' : '#fff',
                borderBottom: '1px solid var(--gray-100)',
              }}
            >
              <span style={{ fontSize: 18 }}>{c.flag}</span>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
