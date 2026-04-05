import { useState, useRef, useEffect } from 'react';
import countries from '../data/countries';

function ActionMenu({ onEdit }) {
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
    <div ref={ref}>
      <span
        onClick={() => setOpen(!open)}
        style={{ color: 'var(--gray-400)', cursor: 'pointer', fontSize: 18 }}
      >⋮</span>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 28, background: '#fff',
          border: '1px solid var(--gray-200)', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 10,
          overflow: 'hidden', width: 140,
        }}>
          <div
            onClick={() => { onEdit(); setOpen(false); }}
            style={{ padding: '10px 16px', cursor: 'pointer', fontSize: 14 }}
          >
            Edit
          </div>
        </div>
      )}
    </div>
  );
}

export default function PhoneNumberTable({ numbers, onToggle, onEdit }) {
  return (
    <div style={{ border: '1px solid var(--gray-200)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr',
        padding: '10px 16px', background: 'var(--gray-50)',
        fontSize: 12, color: 'var(--gray-500)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        <div>Phone Number</div>
        <div>Connection ⓘ</div>
        <div>Status</div>
        <div>Actions</div>
      </div>

      {numbers.map(num => {
        const country = countries.find(c => c.code === num.countryCode);
        const statusStyles = num.status === 'verified'
          ? { bg: 'var(--green-light)', color: 'var(--green-text)', border: 'var(--green-border)', label: 'Verified' }
          : { bg: 'var(--yellow-light)', color: 'var(--yellow-text)', border: 'var(--yellow-border)', label: 'Pending Configuration' };

        return (
          <div key={num.id} style={{
            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr',
            padding: '14px 16px', alignItems: 'center', fontSize: 14,
            borderTop: '1px solid var(--gray-200)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {country && <span>{country.flag}</span>}
              {num.number}
            </div>
            <div>
              <div
                onClick={() => onToggle(num.id)}
                style={{
                  width: 36, height: 20, borderRadius: 10, cursor: 'pointer',
                  background: num.connected ? 'var(--green)' : 'var(--gray-300)',
                  position: 'relative', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 16, height: 16, background: '#fff', borderRadius: '50%',
                  position: 'absolute', top: 2,
                  left: num.connected ? undefined : 2,
                  right: num.connected ? 2 : undefined,
                  transition: 'all 0.2s',
                }} />
              </div>
            </div>
            <div>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: statusStyles.bg, color: statusStyles.color,
                border: `1px solid ${statusStyles.border}`,
              }}>
                {statusStyles.label}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <ActionMenu onEdit={() => onEdit(num)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
