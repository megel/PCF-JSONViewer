import * as React from 'react';
import { render, screen } from '@testing-library/react';
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
});
