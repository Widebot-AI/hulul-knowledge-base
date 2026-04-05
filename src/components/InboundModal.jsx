import { useState } from 'react';
import CountryCodePicker from './CountryCodePicker';

const SIP_ENDPOINT = 'sip:vjnxecm0tjk.sip.livekit.cloud;transport=tcp';

export default function InboundModal({ onClose, onSubmit }) {
  const [trunkName, setTrunkName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('EG');
  const [trunkSid, setTrunkSid] = useState('');
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(SIP_ENDPOINT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function validate() {
    const errs = {};
    if (!trunkName.trim()) errs.trunkName = 'This field is required';
    if (!phoneNumber.trim()) errs.phoneNumber = 'This field is required';
    if (!trunkSid.trim()) errs.trunkSid = 'This field is required';
    else if (!trunkSid.startsWith('TK')) errs.trunkSid = 'Trunk SID must start with TK';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ trunkName, phoneNumber, countryCode, trunkSid, type: 'inbound' });
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 640,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 28px', borderBottom: '1px solid var(--gray-200)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--green)', fontSize: 18 }}>↙</span>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Inbound Phone Number</h3>
          </div>
          <div
            onClick={onClose}
            style={{
              width: 28, height: 28, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-400)',
              fontSize: 20, borderRadius: 6, background: 'var(--gray-50)',
            }}
          >✕</div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>

          {/* SIP Endpoint */}
          <div style={{
            background: 'var(--purple-light)', border: '1px solid var(--purple-border)',
            borderRadius: 8, padding: '16px 20px', marginBottom: 20,
          }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--purple)',
              textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
            }}>Your LiveKit SIP Endpoint</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                flex: 1, background: '#fff', border: '1px solid var(--purple-border)',
                borderRadius: 6, padding: '10px 14px', fontFamily: 'monospace',
                fontSize: 13, wordBreak: 'break-all',
              }}>
                {SIP_ENDPOINT}
              </div>
              <button
                onClick={handleCopy}
                style={{
                  padding: '8px 14px', background: 'var(--purple)', color: '#fff',
                  border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--purple)' }}>
              You'll need this in Step 3 below
            </p>
          </div>

          {/* Prerequisites */}
          <div style={{
            background: 'var(--blue-info)', border: '1px solid var(--blue-info-border)',
            borderRadius: 8, padding: '18px 20px', marginBottom: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue-info-text)' }}>
                Setup Steps in Twilio
              </h4>
            </div>
            <p style={{ marginBottom: 12, fontSize: 13, color: 'var(--gray-500)' }}>
              Complete these steps in your Twilio account, then fill in the fields below:
            </p>
            <ol style={{ paddingLeft: 20, fontSize: 13, color: 'var(--gray-700)', lineHeight: 2.2 }}>
              <li>
                <a href="https://help.twilio.com/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console" target="_blank" rel="noopener">
                  Purchase a Twilio phone number
                </a>
                <span style={{ color: 'var(--gray-500)' }}> — if you don't have one already</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-1-Create-a-SIP-trunk" target="_blank" rel="noopener">
                  Create a SIP trunk
                </a>
                <span style={{ color: 'var(--gray-500)' }}> — Elastic SIP Trunking → Manage → Trunks → Create new trunk</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Configure-a-SIP-trunk-using-the-Twilio-UI" target="_blank" rel="noopener">
                  Add origination URI
                </a>
                <span style={{ color: 'var(--gray-500)' }}> — In your trunk settings, go to Origination → Add new URI → paste the SIP endpoint copied above</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-3-Associate-phone-number-and-trunk" target="_blank" rel="noopener">
                  Associate your phone number with the trunk
                </a>
                <span style={{ color: 'var(--gray-500)' }}> — In your trunk settings, go to Phone Numbers → Add a number</span>
              </li>
            </ol>
          </div>

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Trunk Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                Trunk Name <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                type="text"
                value={trunkName}
                onChange={e => { setTrunkName(e.target.value); setErrors(prev => ({ ...prev, trunkName: '' })); }}
                placeholder='e.g. "My inbound trunk"'
                style={{
                  width: '100%', padding: '10px 14px',
                  border: `1px solid ${errors.trunkName ? 'var(--red)' : 'var(--gray-300)'}`,
                  borderRadius: 8, fontSize: 14, outline: 'none',
                }}
              />
              {errors.trunkName
                ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--red)' }}>{errors.trunkName}</p>
                : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--gray-400)' }}>
                    Must match the trunk name you created in Twilio —{' '}
                    <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-1-Create-a-SIP-trunk" target="_blank" rel="noopener">See trunk creation guide</a>
                  </p>
              }
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                Phone Number <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <div style={{
                display: 'flex', alignItems: 'center',
                border: `1px solid ${errors.phoneNumber ? 'var(--red)' : 'var(--gray-300)'}`,
                borderRadius: 8, overflow: 'hidden',
              }}>
                <CountryCodePicker value={countryCode} onChange={setCountryCode} />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={e => { setPhoneNumber(e.target.value); setErrors(prev => ({ ...prev, phoneNumber: '' })); }}
                  placeholder="01001234567"
                  style={{
                    flex: 1, padding: '10px 14px', border: 'none',
                    fontSize: 14, outline: 'none', background: 'transparent',
                  }}
                />
              </div>
              {errors.phoneNumber
                ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--red)' }}>{errors.phoneNumber}</p>
                : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--gray-400)' }}>
                    The number you purchased and associated with your trunk —{' '}
                    <a href="https://help.twilio.com/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console" target="_blank" rel="noopener">Find your Twilio phone numbers</a>
                  </p>
              }
            </div>

            {/* Trunk SID */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                Twilio Trunk SID <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                type="text"
                value={trunkSid}
                onChange={e => { setTrunkSid(e.target.value); setErrors(prev => ({ ...prev, trunkSid: '' })); }}
                placeholder="e.g. TKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: `1px solid ${errors.trunkSid ? 'var(--red)' : 'var(--gray-300)'}`,
                  borderRadius: 8, fontSize: 14, outline: 'none',
                }}
              />
              {errors.trunkSid
                ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--red)' }}>{errors.trunkSid}</p>
                : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--gray-400)' }}>
                    Starts with TK — displayed after{' '}
                    <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-1-Create-a-SIP-trunk" target="_blank" rel="noopener">creating your SIP trunk</a>
                  </p>
              }
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
          <button onClick={handleSubmit} style={{
            padding: '10px 24px', border: 'none', borderRadius: 8,
            background: 'var(--primary)', color: '#fff', fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}>Connect Number</button>
        </div>
      </div>
    </div>
  );
}
