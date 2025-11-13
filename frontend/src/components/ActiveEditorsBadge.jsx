import { useState, useEffect } from 'react';

export default function ActiveEditorsBadge({ awareness, myClientId }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get all active editors (excluding self)
  const activeEditors = Object.values(awareness).filter(
    editor => !editor.isMe
  );
  
  const totalCount = activeEditors.length;
  const myInfo = Object.values(awareness).find(editor => editor.isMe);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.active-editors-badge')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  if (totalCount === 0 && !myInfo) return null;

  return (
    <div className="active-editors-badge" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          padding: '8px 12px',
          borderRadius: '20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {totalCount} {totalCount === 1 ? 'editor' : 'editors'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            right: '0',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            minWidth: '200px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px', color: '#666' }}>
            Active Editors
          </div>
          
          {/* Show current user */}
          {myInfo && (
            <div style={{ padding: '6px', fontSize: '14px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: myInfo.user?.color || '#999',
                  marginRight: '8px',
                  verticalAlign: 'middle'
                }}
              />
              {myInfo.user?.name || 'You'} <span style={{ color: '#999' }}>(You)</span>
            </div>
          )}

          {/* Show other editors */}
          {activeEditors.length > 0 ? (
            activeEditors.map((editor) => (
              <div key={editor.clientId} style={{ padding: '6px', fontSize: '14px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: editor.user?.color || '#999',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }}
                />
                {editor.user?.name || `User ${editor.clientId.slice(0, 6)}`}
                {editor.cursor && (
                  <span style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>
                    (editing {editor.cursor.field})
                  </span>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '6px', fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
              No other editors
            </div>
          )}
        </div>
      )}
    </div>
  );
}

