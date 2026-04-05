import './App.css';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 32 }}>
        Call Channel Page
      </div>
    </div>
  );
}

export default App;
