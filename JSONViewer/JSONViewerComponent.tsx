import * as React from 'react';

// Constants
const COPY_BUTTON_HEIGHT = 32; // Height of copy button including padding
const CONTAINER_TOP_PADDING = 8; // Top padding of the container
const CONTENT_PADDING_TOP = COPY_BUTTON_HEIGHT + CONTAINER_TOP_PADDING; // Total padding for content
const DEFAULT_CONTAINER_HEIGHT = 400; // Default height when not specified by parent

export interface IJSONViewerProps {
  content: string;
  indentation: number;
  readOnly: boolean;
  allocatedHeight?: number;
  allocatedWidth?: number;
  onContentChange?: (content: string) => void;
  showCopyButton?: boolean;
  copyButtonIcon?: string;
  copyButtonSvg?: string;
}

/**
 * Sanitize SVG content to prevent XSS attacks
 * Removes script tags, event handlers, and dangerous elements
 */
const sanitizeSvg = (svg: string): string => {
  if (!svg) return '';
  
  // Remove script tags and their content
  let sanitized = svg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handler attributes (onclick, onload, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data URIs that could contain scripts
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // Only allow safe SVG elements - remove any other tags
  const allowedElements = ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g', 'defs', 'use'];
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, 'image/svg+xml');
  
  // Check for parsing errors
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    console.warn('SVG parsing error, rejecting content');
    return '';
  }
  
  // Validate that root element is SVG
  if (doc.documentElement.nodeName.toLowerCase() !== 'svg') {
    console.warn('Invalid SVG: root element must be <svg>');
    return '';
  }
  
  return sanitized;
};

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
  // Token regex pattern for JSON components:
  // - Strings (with escaped characters): "..."
  // - Property keys (strings followed by colon): "...":
  // - Booleans: true, false
  // - Null: null
  // - Numbers: integers, decimals, scientific notation
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
 * Supports editing when readOnly is false and includes copy to clipboard functionality
 */
export const JSONViewerComponent: React.FC<IJSONViewerProps> = ({ 
  content, 
  indentation, 
  readOnly,
  allocatedHeight = -1,
  allocatedWidth = -1,
  onContentChange,
  showCopyButton = true,
  copyButtonIcon = '📋',
  copyButtonSvg
}) => {
  const contentRef = React.useRef<HTMLPreElement>(null);
  const [editableContent, setEditableContent] = React.useState<string>(content);
  const [copySuccess, setCopySuccess] = React.useState<boolean>(false);
  const [isHovering, setIsHovering] = React.useState<boolean>(false);
  
  // Update editable content when prop changes
  React.useEffect(() => {
    setEditableContent(content);
  }, [content]);
  
  const formattedContent = React.useMemo(
    () => formatJSON(editableContent, indentation),
    [editableContent, indentation]
  );
  
  // Handle copy to clipboard
  const handleCopy = React.useCallback(async () => {
    try {
      // Try to copy the formatted JSON
      let textToCopy = editableContent;
      try {
        const parsed: unknown = JSON.parse(editableContent);
        textToCopy = indentation === 0 
          ? JSON.stringify(parsed) 
          : JSON.stringify(parsed, null, indentation);
      } catch {
        // If parsing fails, copy as-is
      }
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (clipboardError) {
        // Fallback: create a temporary text area for older browsers
        // Note: document.execCommand is deprecated but still widely supported for legacy browser compatibility
        console.warn('Clipboard API not available, using fallback method', clipboardError);
        try {
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          // Try to copy using the older document.execCommand (deprecated but widely supported)
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          
          if (successful) {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          } else {
            console.error('Fallback copy method failed');
          }
        } catch (fallbackError) {
          console.error('All copy methods failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [editableContent, indentation]);
  
  // Handle content edit
  const handleContentEdit = React.useCallback((e: React.FormEvent<HTMLPreElement>) => {
    const target = e.currentTarget as HTMLPreElement;
    const newContent = target.textContent || '';
    setEditableContent(newContent);
    if (onContentChange) {
      onContentChange(newContent);
    }
  }, [onContentChange]);
  
  // Calculate container dimensions
  const containerHeight = allocatedHeight > 0 ? allocatedHeight : DEFAULT_CONTAINER_HEIGHT;
  const containerWidth = allocatedWidth > 0 ? allocatedWidth : '100%';
  
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: typeof containerWidth === 'number' ? `${containerWidth}px` : containerWidth,
    height: `${containerHeight}px`,
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
    paddingTop: showCopyButton ? `${CONTENT_PADDING_TOP}px` : '12px',
    whiteSpace: 'pre',
    overflow: 'visible',
    userSelect: 'text',
    WebkitUserSelect: 'text',
    outline: 'none',
  };
  
  const buttonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${CONTAINER_TOP_PADDING}px`,
    right: '8px',
    zIndex: 10,
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    backgroundColor: copySuccess ? '#4caf50' : (isHovering ? '#1976d2' : '#2196f3'),
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };
  
  // Render button content based on state and icon type
  const renderButtonContent = () => {
    if (copySuccess) {
      return '✓ Copied!';
    }
    
    if (copyButtonSvg) {
      // Sanitize and render SVG icon with "Copy" text
      const sanitizedSvg = sanitizeSvg(copyButtonSvg);
      if (!sanitizedSvg) {
        // If SVG is invalid or unsafe, fall back to default icon
        console.warn('Invalid or unsafe SVG provided, using default icon');
        return `${copyButtonIcon} Copy`;
      }
      
      return (
        <>
          <span 
            dangerouslySetInnerHTML={{ __html: sanitizedSvg }} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              marginRight: '4px',
              verticalAlign: 'middle'
            }}
          />
          <span>Copy</span>
        </>
      );
    }
    
    return `${copyButtonIcon} Copy`;
  };
  
  return (
    <div style={containerStyle}>
      {showCopyButton && (
        <div style={buttonContainerStyle}>
          <button 
            style={buttonStyle}
            onClick={() => { void handleCopy(); }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            title="Copy to clipboard"
          >
            {renderButtonContent()}
          </button>
        </div>
      )}
      <pre 
        ref={contentRef} 
        style={preStyle}
        contentEditable={!readOnly}
        onInput={handleContentEdit}
        suppressContentEditableWarning={true}
      >
        {formattedContent}
      </pre>
    </div>
  );
};
