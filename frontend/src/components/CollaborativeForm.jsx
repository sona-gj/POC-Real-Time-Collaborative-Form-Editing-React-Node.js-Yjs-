import { useYjsForm } from '../hooks/useYjsForm';

export default function CollaborativeForm({ roomName, userId }) {
  const { formData, updateField, isConnected, awareness } = useYjsForm(roomName, userId);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <span style={{ 
          padding: '5px 10px', 
          borderRadius: '4px',
          backgroundColor: isConnected ? '#4CAF50' : '#f44336',
          color: 'white',
          fontSize: '12px'
        }}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      <h2>Collaborative Form</h2>

      {/* Input Field 1 */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Name:
        </label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          placeholder="Enter your name"
        />
      </div>

      {/* Input Field 2 */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Email:
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          placeholder="Enter your email"
        />
      </div>

      {/* Dropdown 1 */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Department:
        </label>
        <select
          value={formData.department || ''}
          onChange={(e) => updateField('department', e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
        >
          <option value="">Select Department</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Product">Product</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* Dropdown 2 */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Priority:
        </label>
        <select
          value={formData.priority || ''}
          onChange={(e) => updateField('priority', e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
        >
          <option value="">Select Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={() => {
          console.log('Form submitted:', formData);
          alert('Form submitted! Check console for data.');
        }}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Submit Form
      </button>

      {/* Awareness Display */}
      {Object.keys(awareness).length > 0 && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <strong>Active Users:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {Object.entries(awareness).map(([clientId, state]) => (
              <li key={clientId}>
                {state.user?.name || clientId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

