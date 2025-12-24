# PCF-JSONViewer

PCF Control for PowerApps (canvas and model-driven apps) that visualizes JSON as pretty-printed text.

## Features

- 📊 Pretty-print JSON data
- 🎨 Syntax highlighting
- 📱 Works in both Canvas and Model-Driven apps
- ⚡ Built with React and TypeScript
- ✅ Comprehensive unit tests

## Prerequisites

- Node.js (v16 or higher)
- .NET 6.0 SDK
- Power Platform CLI
- npm or yarn

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/megel/PCF-JSONViewer.git
cd PCF-JSONViewer
```

2. Install dependencies:
```bash
npm install
```

3. Build the control:
```bash
npm run build
```

### Development

Start the test harness:
```bash
npm start
```

Enable watch mode for continuous development:
```bash
npm run start:watch
```

### Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

## Project Structure

```
PCF-JSONViewer/
├── .devcontainer/          # DevContainer configuration
├── .github/
│   ├── copilot-instructions.md  # Copilot development guidelines
│   └── workflows/          # GitHub Actions CI/CD
├── JSONViewer/             # PCF control source code
│   ├── __tests__/          # Unit tests
│   ├── components/         # React components
│   ├── index.ts            # Control entry point
│   └── ControlManifest.Input.xml
├── Solution/               # Dataverse solution
├── jest.config.js          # Jest configuration
├── package.json            # npm dependencies
└── tsconfig.json           # TypeScript configuration
```

## Building the Solution

Build the Dataverse solution package:
```bash
cd Solution
dotnet build
```

Create a managed solution:
```bash
cd Solution
dotnet build /p:configuration=Release
```

The solution packages will be available in `Solution/bin/Release/`.

## Deployment

### To a Dataverse Environment

1. Build the solution package (see above)
2. Navigate to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com/)
3. Select your environment
4. Go to Solutions
5. Import the solution package from `Solution/bin/Release/`

### Using the Control

1. Open your Canvas or Model-Driven app
2. Add a new field to your form
3. Change the control to "JSONViewer"
4. Configure the JSON input property
5. Save and publish

## Development Guidelines

Please refer to [Copilot Instructions](.github/copilot-instructions.md) for detailed development guidelines and best practices.

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **CI Workflow**: Runs on every push and PR, executes linting, testing, and building
- **Package Workflow**: Creates solution packages on main branch and tags

## Contributing

1. Create a feature branch
2. Make your changes
3. Write or update tests
4. Ensure all tests pass
5. Submit a pull request

## License

See [LICENSE](LICENSE) file for details.

## Resources

- [PCF Documentation](https://docs.microsoft.com/powerapps/developer/component-framework/overview)
- [Power Platform CLI](https://docs.microsoft.com/power-platform/developer/cli/introduction)
- [React Documentation](https://react.dev/)
