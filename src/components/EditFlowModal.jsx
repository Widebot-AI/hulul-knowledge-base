import { useState } from 'react';
import CountryCodePicker from './CountryCodePicker';

const FLOWS = ['Welcome Message', 'List Clinics', 'List Doctors'];
const REPLY_FLOWS = ['Default reply'];

export default function EditFlowModal({ phoneNumber, onClose, onSave }) {
  const [welcomeFlow, setWelcomeFlow] = useState(phoneNumber.welcomeFlow || FLOWS[0]);
  const [replyFlow, setReplyFlow] = useState(phoneNumber.replyFlow || REPLY_FLOWS[0]);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  function handleSave() {
    onSave(phoneNumber.id, welcomeFlow, replyFlow);
  }

  function Dropdown({ label, value, options, open, setOpen, onChange }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
          {label}
        </label>
        <div
          onClick={() => setOpen(!open)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid var(--gray-300)', borderRadius: 8,
            padding: '10px 14px', cursor: 'pointer', background: '#fff',
          }}
        >
          <span style={{ fontSize: 14 }}>{value}</span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{open ? '▴' : '▾'}</span>
        </div>
        {open && (
          <div style={{
            border: '1px solid var(--gray-200)', borderRadius: 8,
            marginTop: 4, overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            {options.map(opt => (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: 14,
                  background: opt === value ? 'var(--primary-light)' : '#fff',
                  color: opt === value ? 'var(--primary)' : 'var(--gray-700)',
                  borderTop: '1px solid var(--gray-100)',
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: '1px solid var(--gray-200)',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Edit Flow</h3>
          <div onClick={onClose} style={{
            width: 28, height: 28, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-400)',
            fontSize: 20, borderRadius: 6, background: 'var(--gray-50)',
          }}>✕</div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Phone Number (read-only) */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6,
            }}>
              Phone Number / LandLine
              <span style={{
                width: 16, height: 16, border: '1px solid var(--gray-300)',
                borderRadius: '50%', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10, color: 'var(--gray-400)', cursor: 'help',
              }}>i</span>
            </label>
            <div style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid var(--gray-200)', borderRadius: 8,
              overflow: 'hidden', background: 'var(--gray-50)',
            }}>
              <CountryCodePicker value={phoneNumber.countryCode} onChange={() => {}} disabled />
              <div style={{ flex: 1, padding: '10px 14px', fontSize: 14, color: 'var(--gray-500)' }}>
                {phoneNumber.number}
              </div>
            </div>
          </div>

          <Dropdown label="Welcome Message Flow" value={welcomeFlow} options={FLOWS}
            open={welcomeOpen} setOpen={setWelcomeOpen} onChange={setWelcomeFlow} />

          <Dropdown label="Default Reply Flow" value={replyFlow} options={REPLY_FLOWS}
            open={replyOpen} setOpen={setReplyOpen} onChange={setReplyFlow} />

          {/* Add New Flow */}
          <div style={{ paddingTop: 10, borderTop: '1px solid var(--gray-200)' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'pointer', color: 'var(--primary)', fontSize: 14, fontWeight: 500,
            }}>
              <span>+</span> Add New Flow
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 12,
          padding: '16px 28px', borderTop: '1px solid var(--gray-200)',
          background: 'var(--gray-50)', borderRadius: '0 0 12px 12px',
        }}>
          <button onClick={onClose} style={{
            padding: '10px 24px', border: '1px solid var(--gray-300)',
            borderRadius: 8, background: '#fff', color: 'var(--gray-700)',
            fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            padding: '10px 24px', border: 'none', borderRadius: 8,
            background: 'var(--primary)', color: '#fff', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}>Save</button>
        </div>
      </div>
    </div>
  );
}
