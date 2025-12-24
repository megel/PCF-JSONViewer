import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { HelloWorld } from '../HelloWorld';

describe('HelloWorld Component', () => {
  it('renders with a name', () => {
    render(<HelloWorld name="Test User" />);
    expect(screen.getByText(/Hello Test User!/i)).toBeInTheDocument();
  });

  it('renders without a name', () => {
    render(<HelloWorld />);
    expect(screen.getByText(/Hello !/i)).toBeInTheDocument();
  });
});
