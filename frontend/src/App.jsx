import CollaborativeForm from './components/CollaborativeForm';
import './App.css';

function App() {
  // Use a fixed room name for testing (or make it dynamic)
  const roomName = 'demo-form';
  const userId = 'user-' + Math.random().toString(36).substr(2, 9);

  return (
    <div className="App">
      <CollaborativeForm roomName={roomName} userId={userId} />
    </div>
  );
}

export default App;
