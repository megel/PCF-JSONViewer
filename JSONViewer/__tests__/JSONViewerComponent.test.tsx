import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JSONViewerComponent } from '../JSONViewerComponent';

describe('JSONViewerComponent', () => {
  it('renders valid JSON with default indentation', () => {
    const jsonContent = '{"name":"John","age":30}';
    render(<JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />);
    
    // Check that the component renders
    expect(screen.getByText(/"name"/i)).toBeInTheDocument();
  });

  it('renders empty content message when no JSON provided', () => {
    render(<JSONViewerComponent content="" indentation={2} readOnly={true} />);
    expect(screen.getByText(/No JSON content provided/i)).toBeInTheDocument();
  });

  it('renders error message for invalid JSON', () => {
    const invalidJson = '{invalid json}';
    render(<JSONViewerComponent content={invalidJson} indentation={2} readOnly={true} />);
    expect(screen.getByText(/Invalid JSON/i)).toBeInTheDocument();
  });

  it('renders minimized JSON when indentation is 0', () => {
    const jsonContent = '{"name":"John","age":30}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={0} readOnly={true} />
    );
    
    const preElement = container.querySelector('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.textContent).toContain('"name"');
  });

  it('renders formatted JSON with custom indentation', () => {
    const jsonContent = '{"name":"John","age":30}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={4} readOnly={true} />
    );
    
    const preElement = container.querySelector('pre');
    expect(preElement).toBeInTheDocument();
  });

  it('handles complex nested JSON objects', () => {
    const complexJson = JSON.stringify({
      user: {
        name: 'John Doe',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York'
        },
        hobbies: ['reading', 'coding']
      }
    });
    
    render(<JSONViewerComponent content={complexJson} indentation={2} readOnly={true} />);
    expect(screen.getByText(/"user"/i)).toBeInTheDocument();
  });

  it('handles JSON with various data types', () => {
    const jsonWithTypes = JSON.stringify({
      string: 'text',
      number: 42,
      boolean: true,
      nullValue: null,
      array: [1, 2, 3]
    });
    
    render(<JSONViewerComponent content={jsonWithTypes} indentation={2} readOnly={true} />);
    expect(screen.getByText(/"string"/i)).toBeInTheDocument();
  });

  it('applies proper styling to the container', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />
    );
    
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveStyle({
      border: '1px solid #d1d1d1',
      backgroundColor: '#f5f5f5'
    });
  });

  it('respects allocated height from parent container', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        allocatedHeight={300}
      />
    );
    
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveStyle({ height: '300px' });
  });

  it('respects allocated width from parent container', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        allocatedWidth={500}
      />
    );
    
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveStyle({ width: '500px' });
  });

  it('allows text selection when userSelect is set', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />
    );
    
    const preElement = container.querySelector('pre') as HTMLElement;
    expect(preElement).toHaveStyle({ userSelect: 'text' });
  });

  it('renders copy button', () => {
    const jsonContent = '{"test":"value"}';
    render(<JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    expect(copyButton).toBeInTheDocument();
    expect(copyButton).toHaveTextContent(/Copy/i);
  });

  it('shows success message after copying', async () => {
    const jsonContent = '{"test":"value"}';
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
    
    render(<JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    fireEvent.click(copyButton);
    
    // Wait for the success message
    await screen.findByText(/Copied!/i);
    expect(copyButton).toHaveTextContent(/Copied!/i);
  });

  it('allows editing when readOnly is false', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={2} readOnly={false} />
    );
    
    const preElement = container.querySelector('pre') as HTMLElement;
    expect(preElement).toHaveAttribute('contentEditable', 'true');
  });

  it('disables editing when readOnly is true', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />
    );
    
    const preElement = container.querySelector('pre') as HTMLElement;
    expect(preElement).toHaveAttribute('contentEditable', 'false');
  });

  it('calls onContentChange when content is edited', () => {
    const jsonContent = '{"test":"value"}';
    const onContentChange = jest.fn();
    const { container } = render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={false}
        onContentChange={onContentChange}
      />
    );
    
    const preElement = container.querySelector('pre') as HTMLElement;
    
    // Simulate content edit
    fireEvent.input(preElement, { target: { textContent: '{"test":"newvalue"}' } });
    
    expect(onContentChange).toHaveBeenCalled();
  });

  it('uses default dimensions when allocatedHeight is not provided', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent content={jsonContent} indentation={2} readOnly={true} />
    );
    
    const divElement = container.firstChild as HTMLElement;
    expect(divElement).toHaveStyle({ height: '400px' });
  });

  it('hides copy button when showCopyButton is false', () => {
    const jsonContent = '{"test":"value"}';
    render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        showCopyButton={false}
      />
    );
    
    const copyButton = screen.queryByTitle('Copy to clipboard');
    expect(copyButton).not.toBeInTheDocument();
  });

  it('shows copy button when showCopyButton is true', () => {
    const jsonContent = '{"test":"value"}';
    render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        showCopyButton={true}
      />
    );
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    expect(copyButton).toBeInTheDocument();
  });

  it('uses custom icon when copyButtonIcon is provided', () => {
    const jsonContent = '{"test":"value"}';
    render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        copyButtonIcon="📄"
      />
    );
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    expect(copyButton).toHaveTextContent('📄 Copy');
  });

  it('renders SVG icon when copyButtonSvg is provided', () => {
    const jsonContent = '{"test":"value"}';
    const svgIcon = '<svg width="16" height="16"><rect width="16" height="16" fill="blue"/></svg>';
    const { container } = render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        copyButtonSvg={svgIcon}
      />
    );
    
    const copyButton = screen.getByTitle('Copy to clipboard');
    expect(copyButton).toBeInTheDocument();
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('adjusts padding when copy button is hidden', () => {
    const jsonContent = '{"test":"value"}';
    const { container } = render(
      <JSONViewerComponent 
        content={jsonContent} 
        indentation={2} 
        readOnly={true}
        showCopyButton={false}
      />
    );
    
    const preElement = container.querySelector('pre') as HTMLElement;
    expect(preElement).toHaveStyle({ paddingTop: '12px' });
  });
});
