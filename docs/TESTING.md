# Testing Guide

This document describes the testing strategy and practices for the PCF-JSONViewer project.

## Testing Framework

We use the following testing tools:

- **Jest**: Test runner and assertion library
- **React Testing Library**: For testing React components
- **ts-jest**: TypeScript support for Jest

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Structure

Tests are located in `__tests__` directories next to the code they test:

```
JSONViewer/
├── HelloWorld.tsx
└── __tests__/
    └── HelloWorld.test.tsx
```

## Writing Tests

### Basic Test Structure

```typescript
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />);
    expect(screen.getByText('value')).toBeInTheDocument();
  });
});
```

### Testing PCF Controls

When testing PCF controls, mock the PCF context:

```typescript
import { JSONViewer } from '../index';

describe('JSONViewer', () => {
  let mockContext: any;
  let mockNotifyOutputChanged: jest.Mock;

  beforeEach(() => {
    mockNotifyOutputChanged = jest.fn();
    mockContext = {
      parameters: {
        sampleProperty: {
          raw: 'test value'
        }
      }
    };
  });

  it('should initialize correctly', () => {
    const control = new JSONViewer();
    control.init(mockContext, mockNotifyOutputChanged, {});
    
    // Add assertions
  });
});
```

### Testing React Components

```typescript
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Interactive Component', () => {
  it('should handle click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad**: Testing internal state
```typescript
expect(component.state.count).toBe(1);
```

✅ **Good**: Testing user-visible behavior
```typescript
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 2. Use Descriptive Test Names

❌ **Bad**:
```typescript
it('test 1', () => { ... });
```

✅ **Good**:
```typescript
it('should display error message when JSON is invalid', () => { ... });
```

### 3. Arrange-Act-Assert Pattern

```typescript
it('should format JSON correctly', () => {
  // Arrange
  const input = '{"name":"John"}';
  
  // Act
  render(<JSONViewer json={input} />);
  
  // Assert
  expect(screen.getByText(/"name": "John"/)).toBeInTheDocument();
});
```

### 4. Use beforeEach for Setup

```typescript
describe('MyComponent', () => {
  let mockProps: any;

  beforeEach(() => {
    mockProps = {
      prop1: 'value1',
      prop2: 'value2'
    };
  });

  it('test case 1', () => {
    render(<MyComponent {...mockProps} />);
    // assertions
  });
});
```

### 5. Test Edge Cases

Always test:
- ✅ Null/undefined inputs
- ✅ Empty strings/arrays
- ✅ Maximum values
- ✅ Invalid inputs
- ✅ Error conditions

## Coverage Requirements

We aim for:
- **80% or higher** code coverage
- **100%** coverage of critical paths
- All exported functions tested

Check coverage:
```bash
npm run test:coverage
```

View detailed coverage report:
```bash
open coverage/lcov-report/index.html
```

## Mocking

### Mocking Modules

```typescript
jest.mock('../api', () => ({
  fetchData: jest.fn()
}));
```

### Mocking PCF Context

```typescript
const mockContext: ComponentFramework.Context<IInputs> = {
  parameters: {
    sampleProperty: {
      raw: 'value',
      formatted: 'value',
      type: 'SingleLine.Text'
    }
  },
  mode: {
    isControlDisabled: false,
    isVisible: true
  },
  // ... other required properties
} as any;
```

## Debugging Tests

### Run a single test file
```bash
npm test -- HelloWorld.test.tsx
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should render"
```

### Debug in VS Code

1. Set a breakpoint in your test
2. Press `F5` or use the Debug panel
3. Select "Jest: Current File"

## Continuous Integration

Tests run automatically on:
- Every push to any branch
- Every pull request
- Before building and packaging

All tests must pass before merging to main.

## Common Issues

### Issue: Tests timeout
**Solution**: Increase timeout in jest.config.js or use `jest.setTimeout()`

### Issue: Module not found
**Solution**: Check your imports and ensure paths are correct relative to test file

### Issue: React component not rendering
**Solution**: Ensure you're using the correct React Testing Library queries

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
