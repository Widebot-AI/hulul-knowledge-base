import { useState } from 'react';
import CountryCodePicker from './CountryCodePicker';

export default function OutboundModal({ onClose, onSubmit }) {
  const [trunkName, setTrunkName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('EG');
  const [trunkAddress, setTrunkAddress] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!trunkName.trim()) errs.trunkName = 'This field is required';
    if (!phoneNumber.trim()) errs.phoneNumber = 'This field is required';
    if (!trunkAddress.trim()) errs.trunkAddress = 'This field is required';
    else if (!trunkAddress.endsWith('.pstn.twilio.com')) errs.trunkAddress = 'Trunk address must end in .pstn.twilio.com';
    if (!authUsername.trim()) errs.authUsername = 'This field is required';
    if (!authPassword.trim()) errs.authPassword = 'This field is required';
    return errs;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ trunkName, phoneNumber, countryCode, trunkAddress, authUsername, authPassword, type: 'outbound' });
  }

  function clearError(field) { setErrors(prev => ({ ...prev, [field]: '' })); }

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
            <span style={{ color: 'var(--primary)', fontSize: 18 }}>↗</span>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add Outbound Phone Number</h3>
          </div>
          <div onClick={onClose} style={{
            width: 28, height: 28, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--gray-400)',
            fontSize: 20, borderRadius: 6, background: 'var(--gray-50)',
          }}>✕</div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>

          {/* Prerequisites */}
          <div style={{
            background: 'var(--blue-info)', border: '1px solid var(--blue-info-border)',
            borderRadius: 8, padding: '18px 20px', marginBottom: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue-info-text)' }}>Setup Steps in Twilio</h4>
            </div>
            <p style={{ marginBottom: 12, fontSize: 13, color: 'var(--gray-500)' }}>
              Complete these steps in your Twilio account, then fill in the fields below:
            </p>
            <ol style={{ paddingLeft: 20, fontSize: 13, color: 'var(--gray-700)', lineHeight: 2.2 }}>
              <li>
                <a href="https://help.twilio.com/articles/223135247-How-to-Search-for-and-Buy-a-Twilio-Phone-Number-from-Console" target="_blank" rel="noopener">Purchase a Twilio phone number</a>
                <span style={{ color: 'var(--gray-500)' }}> — if you don't have one already</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-1-Create-a-SIP-trunk" target="_blank" rel="noopener">Create a SIP trunk</a>
                <span style={{ color: 'var(--gray-500)' }}> — Elastic SIP Trunking → Manage → Trunks → Create new trunk</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-2-Configure-your-trunk" target="_blank" rel="noopener">Create a credential list</a>
                <span style={{ color: 'var(--gray-500)' }}> — Elastic SIP Trunking → Manage → Credential lists → Create new</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-2-Configure-your-trunk" target="_blank" rel="noopener">Associate credentials with trunk</a>
                <span style={{ color: 'var(--gray-500)' }}> — Termination → Authentication → Credential Lists → select your list</span>
              </li>
              <li>
                <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-3-Associate-phone-number-and-trunk" target="_blank" rel="noopener">Associate your phone number with the trunk</a>
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
              <input type="text" value={trunkName}
                onChange={e => { setTrunkName(e.target.value); clearError('trunkName'); }}
                placeholder='e.g. "My outbound trunk"'
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${errors.trunkName ? 'var(--red)' : 'var(--gray-300)'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
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
                <input type="text" value={phoneNumber}
                  onChange={e => { setPhoneNumber(e.target.value); clearError('phoneNumber'); }}
                  placeholder="01001234567"
                  style={{ flex: 1, padding: '10px 14px', border: 'none', fontSize: 14, outline: 'none', background: 'transparent' }}
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

            {/* Trunk Address */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                Trunk Address (Termination SIP URI) <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input type="text" value={trunkAddress}
                onChange={e => { setTrunkAddress(e.target.value); clearError('trunkAddress'); }}
                placeholder="e.g. my-outbound-trunk.pstn.twilio.com"
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${errors.trunkAddress ? 'var(--red)' : 'var(--gray-300)'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
              />
              {errors.trunkAddress
                ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--red)' }}>{errors.trunkAddress}</p>
                : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--gray-400)' }}>
                    Must end in <code style={{ background: 'var(--gray-100)', padding: '1px 4px', borderRadius: 3, fontSize: 11 }}>.pstn.twilio.com</code> —{' '}
                    <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Configure-a-SIP-trunk-using-the-Twilio-UI" target="_blank" rel="noopener">Copy from your trunk's Termination settings</a>
                  </p>
              }
            </div>

            {/* Auth Username */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                Auth Username <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input type="text" value={authUsername}
                onChange={e => { setAuthUsername(e.target.value); clearError('authUsername'); }}
                placeholder="Username from your credential list"
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${errors.authUsername ? 'var(--red)' : 'var(--gray-300)'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
              />
              {errors.authUsername
                ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--red)' }}>{errors.authUsername}</p>
                : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--gray-400)' }}>
                    The username you set when creating your credential list —{' '}
                    <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-2-Configure-your-trunk" target="_blank" rel="noopener">See credential setup guide</a>
                  </p>
              }
            </div>

            {/* Auth Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 6 }}>
                Auth Password <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} value={authPassword}
                  onChange={e => { setAuthPassword(e.target.value); clearError('authPassword'); }}
                  placeholder="Password from your credential list"
                  style={{ width: '100%', padding: '10px 14px', paddingRight: 44, border: `1px solid ${errors.authPassword ? 'var(--red)' : 'var(--gray-300)'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
                <span onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 14 }}>
                  👁
                </span>
              </div>
              {errors.authPassword
                ? <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--red)' }}>{errors.authPassword}</p>
                : <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--gray-400)' }}>
                    The password you set when creating your credential list —{' '}
                    <a href="https://docs.livekit.io/telephony/start/providers/twilio/#Step-2-Configure-your-trunk" target="_blank" rel="noopener">See credential setup guide</a>
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
