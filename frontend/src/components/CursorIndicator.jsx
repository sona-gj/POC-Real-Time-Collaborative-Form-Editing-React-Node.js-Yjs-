export default function CursorIndicator({ awareness, fieldName, myClientId, inputRef }) {
  // Get cursors for this specific field (excluding self)
  const cursors = Object.values(awareness)
    .filter(editor => 
      !editor.isMe && 
      editor.cursor && 
      editor.cursor.field === fieldName
    );

  if (cursors.length === 0 || !inputRef?.current) return null;

  // Calculate approximate cursor position
  // This is a simplified calculation - in production, you'd want more accurate positioning
  const getCursorPosition = (cursorPosition, inputElement) => {
    if (!inputElement) return 0;
    
    // Create a temporary span to measure text width
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const style = window.getComputedStyle(inputElement);
    context.font = `${style.fontSize} ${style.fontFamily}`;
    
    const textBeforeCursor = inputElement.value.substring(0, cursorPosition);
    const width = context.measureText(textBeforeCursor).width;
    
    // Add padding for input padding
    const paddingLeft = parseInt(style.paddingLeft) || 0;
    
    return Math.max(0, width + paddingLeft);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 10 }}>
      {cursors.map((editor) => {
        const position = getCursorPosition(editor.cursor.position, inputRef.current);
        return (
          <div
            key={editor.clientId}
            title={editor.user?.name || `User ${editor.clientId.slice(0, 6)}`}
            style={{
              position: 'absolute',
              left: `${position}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '2px',
              height: '20px',
              backgroundColor: editor.user?.color || '#999',
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          />
        );
      })}
    </div>
  );
}

