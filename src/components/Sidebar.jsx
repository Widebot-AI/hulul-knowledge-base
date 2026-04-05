const channels = [
  { name: 'WebChat', status: 'Connected' },
  { name: 'Facebook', status: null },
  { name: 'Whatsapp', status: null },
  { name: 'Instagram', status: null },
  { name: 'Twitter', status: null },
  { name: 'SMS', status: null },
  { name: 'Email', status: null },
  { name: 'Call', status: 'Connected', active: true },
  { name: 'AI Voice Agent', status: 'Connected' },
];

export default function Sidebar() {
  return (
    <div style={{
      width: 220, borderRight: '1px solid var(--gray-200)',
      padding: '16px 0', background: 'var(--gray-50)', fontSize: 13,
      flexShrink: 0,
    }}>
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)' }}>Workspace Information</div>
      <div style={{ padding: '8px 20px', color: 'var(--primary)', fontWeight: 600 }}>▾ Channel</div>
      {channels.map(ch => (
        <div
          key={ch.name}
          style={{
            padding: '6px 20px 6px 36px',
            color: ch.active ? 'var(--primary)' : 'var(--gray-500)',
            fontWeight: ch.active ? 600 : 400,
            background: ch.active ? 'var(--primary-light)' : 'transparent',
            borderRight: ch.active ? '3px solid var(--primary)' : 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span>{ch.name}</span>
          {ch.status && (
            <span style={{ color: 'var(--green)', fontSize: 11 }}>{ch.status}</span>
          )}
        </div>
      ))}
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)', marginTop: 8 }}>Subscription ▸</div>
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)' }}>Team Management ▸</div>
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)' }}>Attributes ▸</div>
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)' }}>Integrations ▸</div>
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)' }}>AI Settings ▸</div>
      <div style={{ padding: '8px 20px', color: 'var(--gray-500)' }}>API</div>
    </div>
  );
}
