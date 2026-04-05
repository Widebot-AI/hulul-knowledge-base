import { useState } from 'react';

const initialNumbers = [
  {
    id: '1',
    number: '0248825562',
    countryCode: 'EG',
    trunkName: 'Existing trunk',
    type: 'inbound',
    status: 'verified',
    connected: true,
    welcomeFlow: 'Welcome Message',
    replyFlow: 'Default reply',
  },
];

export default function usePhoneNumbers() {
  const [numbers, setNumbers] = useState(initialNumbers);

  function addNumber(data) {
    const newNumber = {
      id: String(Date.now()),
      number: data.phoneNumber,
      countryCode: data.countryCode,
      trunkName: data.trunkName,
      type: data.type,
      status: 'pending',
      connected: false,
      welcomeFlow: '',
      replyFlow: '',
    };
    setNumbers(prev => [...prev, newNumber]);
    return newNumber;
  }

  function updateFlows(id, welcomeFlow, replyFlow) {
    setNumbers(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, welcomeFlow, replyFlow, status: 'verified', connected: true }
          : n
      )
    );
  }

  function toggleConnection(id) {
    setNumbers(prev =>
      prev.map(n => (n.id === id ? { ...n, connected: !n.connected } : n))
    );
  }

  return { numbers, addNumber, updateFlows, toggleConnection };
}
