import * as React from 'react';

export interface IJSONViewerProps {
  content: string;
  indentation: number;
  readOnly: boolean;
}

/**
 * Format JSON with syntax highlighting
 */
const formatJSON = (jsonString: string, indent: number): React.ReactElement | string => {
  if (!jsonString || jsonString.trim() === '') {
    return <span style={{ color: '#999' }}>No JSON content provided</span>;
  }

  try {
    const parsed: unknown = JSON.parse(jsonString);
    const formatted = indent === 0 
      ? JSON.stringify(parsed) 
      : JSON.stringify(parsed, null, indent);
    
    return highlightJSON(formatted);
  } catch (error) {
    return <span style={{ color: '#d32f2f' }}>Invalid JSON: {(error as Error).message}</span>;
  }
};

/**
 * Apply syntax highlighting to JSON string
 */
const highlightJSON = (json: string): React.ReactElement => {
  // Token regex pattern for JSON components
  const jsonPattern = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  
  while ((match = jsonPattern.exec(json)) !== null) {
    // Add any text before the match
    if (match.index > lastIndex) {
      parts.push(json.substring(lastIndex, match.index));
    }
    
    const value = match[0];
    let style: React.CSSProperties = {};
    
    // Determine token type and apply color
    if (value.startsWith('"')) {
      if (value.endsWith(':')) {
        // Property key
        style = { color: '#881391', fontWeight: 'bold' };
      } else {
        // String value
        style = { color: '#1a1aa6' };
      }
    } else if (value === 'true' || value === 'false') {
      // Boolean
      style = { color: '#0000ff' };
    } else if (value === 'null') {
      // Null
      style = { color: '#808080' };
    } else {
      // Number
      style = { color: '#098658' };
    }
    
    parts.push(<span key={`token-${match.index}`} style={style}>{value}</span>);
    lastIndex = match.index + value.length;
  }
  
  // Add any remaining text
  if (lastIndex < json.length) {
    parts.push(json.substring(lastIndex));
  }
  
  return <>{parts}</>;
};

/**
 * JSONViewer component for displaying formatted JSON with syntax highlighting
 */
export const JSONViewerComponent: React.FC<IJSONViewerProps> = ({ content, indentation, readOnly }) => {
  const [height, setHeight] = React.useState<number>(200);
  const contentRef = React.useRef<HTMLPreElement>(null);
  
  // Calculate and update height based on content
  React.useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      // Add some padding for better visibility
      const newHeight = Math.max(100, Math.min(scrollHeight + 20, 800));
      setHeight(newHeight);
    }
  }, [content, indentation]);
  
  const formattedContent = React.useMemo(
    () => formatJSON(content, indentation),
    [content, indentation]
  );
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: `${height}px`,
    border: '1px solid #d1d1d1',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
    overflow: 'auto',
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: '13px',
    lineHeight: '1.5',
  };
  
  const preStyle: React.CSSProperties = {
    margin: 0,
    padding: '12px',
    whiteSpace: 'pre',
    overflow: 'visible',
  };
  
  return (
    <div style={containerStyle}>
      <pre ref={contentRef} style={preStyle}>
        {formattedContent}
      </pre>
    </div>
  );
};
