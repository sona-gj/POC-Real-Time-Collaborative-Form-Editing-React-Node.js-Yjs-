import { useRef } from 'react';
import { useYjsForm } from '../hooks/useYjsForm';
import ActiveEditorsBadge from './ActiveEditorsBadge';
import CursorIndicator from './CursorIndicator';

export default function CollaborativeForm({ roomName, userId }) {
  const { 
    formData, 
    updateField, 
    updateCursorPosition,
    clearCursorPosition,
    isConnected, 
    awareness,
    myClientId
  } = useYjsForm(roomName, userId);

  // Refs for input fields to calculate cursor position
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  // Unified handler: updates field value and cursor position
  const handleInput = (fieldName) => (e) => {
    updateField(fieldName, e.target.value);
    updateCursorPosition(fieldName, e.target.selectionStart || 0);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      {/* Active Editors Badge */}
      <ActiveEditorsBadge awareness={awareness} myClientId={myClientId} />

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

      {/* Input Field 1 with cursor tracking */}
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Name:
        </label>
        <div style={{ position: 'relative' }}>
          <input
            ref={nameInputRef}
            type="text"
            value={formData.name || ''}
            onInput={handleInput('name')}
            onFocus={handleInput('name')}
            onBlur={clearCursorPosition}
            style={{ width: '100%', padding: '8px', fontSize: '14px', position: 'relative' }}
            placeholder="Enter your name"
          />
          <CursorIndicator 
            awareness={awareness} 
            fieldName="name" 
            myClientId={myClientId}
            inputRef={nameInputRef}
          />
        </div>
      </div>

      {/* Input Field 2 with cursor tracking */}
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Email:
        </label>
        <div style={{ position: 'relative' }}>
          <input
            ref={emailInputRef}
            type="email"
            value={formData.email || ''}
            onInput={handleInput('email')}
            onFocus={handleInput('email')}
            onBlur={clearCursorPosition}
            style={{ width: '100%', padding: '8px', fontSize: '14px', position: 'relative' }}
            placeholder="Enter your email"
          />
          <CursorIndicator 
            awareness={awareness} 
            fieldName="email" 
            myClientId={myClientId}
            inputRef={emailInputRef}
          />
        </div>
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
    </div>
  );
}
