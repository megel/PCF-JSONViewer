# GitHub Copilot Instructions for PCF-JSONViewer

## Project Overview
PCF-JSONViewer is a PowerApps Component Framework (PCF) control for visualizing JSON as pretty-printed text in both canvas and model-driven apps.

## Technology Stack
- **Framework**: PowerApps Component Framework (PCF)
- **Language**: TypeScript
- **UI Library**: React
- **Testing**: Jest with React Testing Library
- **Build Tool**: npm/webpack (managed by PAC CLI)
- **Package Manager**: npm

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow React functional component patterns with hooks
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for public APIs and complex logic

### TypeScript Best Practices
- Always define explicit types for function parameters and return values
- Use interfaces for object shapes
- Avoid using `any` type - use `unknown` or proper types
- Leverage TypeScript utility types (Partial, Pick, Omit, etc.)

### React Best Practices
- Use functional components with hooks
- Keep components small and reusable
- Use React.memo() for performance optimization when needed
- Handle errors with error boundaries
- Use proper key props for lists

### PCF Control Guidelines
- Follow PCF manifest schema properly
- Implement all required lifecycle methods (init, updateView, destroy)
- Handle null/undefined input values gracefully
- Optimize for both canvas and model-driven apps
- Test control behavior in both modes

### Testing Standards
- Write unit tests for all business logic
- Aim for >80% code coverage
- Use React Testing Library for component tests
- Mock external dependencies and PCF context
- Test edge cases and error conditions

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits atomic and focused
- Reference issue numbers in commit messages
- Create feature branches from main
- Ensure all tests pass before committing

### Documentation
- Update README.md for user-facing changes
- Document new features and APIs
- Include setup instructions for new dependencies
- Add inline comments for complex algorithms

### Security
- Sanitize user input before rendering
- Avoid eval() and similar dynamic code execution
- Keep dependencies up to date
- Follow OWASP security guidelines for web applications

## Build and Test Commands
```bash
# Install dependencies
npm install

# Build the PCF control
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Create solution package
npm run package
```

## Common Tasks

### Creating a New Component
1. Create component file in `/JSONViewer/components/`
2. Write component tests in `__tests__` directory
3. Export from index file if needed
4. Document props and usage

### Adding a New Feature
1. Create feature branch
2. Implement feature with tests
3. Update documentation
4. Run full test suite
5. Create pull request

### Debugging
- Use browser DevTools for runtime debugging
- Test in both canvas and model-driven apps
- Check console for errors and warnings
- Use React DevTools for component inspection

## Resources
- [PCF Documentation](https://docs.microsoft.com/powerapps/developer/component-framework/overview)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
