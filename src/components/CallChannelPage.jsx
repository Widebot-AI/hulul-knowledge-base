import { useState } from 'react';
import PhoneNumberTable from './PhoneNumberTable';
import AddPhoneDropdown from './AddPhoneDropdown';
import InboundModal from './InboundModal';
import OutboundModal from './OutboundModal';
import EditFlowModal from './EditFlowModal';
import usePhoneNumbers from '../hooks/usePhoneNumbers';

export default function CallChannelPage() {
  const { numbers, addNumber, updateFlows, toggleConnection } = usePhoneNumbers();
  const [modal, setModal] = useState(null);
  const [editingPhone, setEditingPhone] = useState(null);

  function handleAddSubmit(data) {
    addNumber(data);
    setModal(null);
  }

  function handleEditSave(id, welcomeFlow, replyFlow) {
    updateFlows(id, welcomeFlow, replyFlow);
    setEditingPhone(null);
  }

  return (
    <div style={{ flex: 1, padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Call Channel</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', maxWidth: 600 }}>
            Enables businesses to connect with customers via inbound and outbound calls, offering personalized support, building relationships, and driving engagement.
          </p>
        </div>
        <button style={{
          padding: '8px 20px', border: '1px solid var(--gray-200)',
          borderRadius: 8, background: '#fff', color: 'var(--primary)',
          fontSize: 13, cursor: 'pointer',
        }}>Contact Us</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '2px solid var(--gray-200)', marginBottom: 24 }}>
        <div style={{
          padding: '8px 4px', color: 'var(--primary)', fontWeight: 600, fontSize: 14,
          borderBottom: '2px solid var(--primary)', marginBottom: -2,
        }}>Calls</div>
        <div style={{ padding: '8px 4px', color: 'var(--gray-400)', fontSize: 14 }}>Logs</div>
      </div>

      {/* Enable Calls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Enable Calls</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', maxWidth: 550 }}>
            Calls initiated by customers for support, inquiries, or services, or by your team to provide assistance, updates, or outreach.
          </p>
        </div>
        <AddPhoneDropdown onSelect={setModal} />
      </div>

      {/* Table */}
      <PhoneNumberTable
        numbers={numbers}
        onToggle={toggleConnection}
        onEdit={setEditingPhone}
      />

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 20, padding: '12px 0',
      }}>
        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Learn more about Call channel</span>
        <a href="#" style={{ fontSize: 13, fontWeight: 500 }}>View setup guide</a>
      </div>

      {/* Modals */}
      {modal === 'inbound' && (
        <InboundModal onClose={() => setModal(null)} onSubmit={handleAddSubmit} />
      )}
      {modal === 'outbound' && (
        <OutboundModal onClose={() => setModal(null)} onSubmit={handleAddSubmit} />
      )}
      {editingPhone && (
        <EditFlowModal
          phoneNumber={editingPhone}
          onClose={() => setEditingPhone(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}
