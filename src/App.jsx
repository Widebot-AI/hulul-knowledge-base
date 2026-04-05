import './App.css';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: 220, borderRight: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
        Sidebar
      </div>
      <div style={{ flex: 1, padding: 32 }}>
        Call Channel Page
      </div>
    </div>
  );
}

export default App;
