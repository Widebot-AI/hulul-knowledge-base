import './App.css';
import Sidebar from './components/Sidebar';
import CallChannelPage from './components/CallChannelPage';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <CallChannelPage />
    </div>
  );
}

export default App;
