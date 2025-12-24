# Getting Started with PCF-JSONViewer

This guide will help you get started with developing the PCF-JSONViewer control.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v16 or higher (v20 recommended)
- **.NET SDK** 6.0 or higher
- **Visual Studio Code** (recommended)
- **Git**

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/megel/PCF-JSONViewer.git
cd PCF-JSONViewer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required npm packages including:
- React and React DOM
- TypeScript
- Jest and testing libraries
- ESLint and linting tools
- PCF build tools

### 3. Install Power Platform CLI

The Power Platform CLI is required to build and package PCF controls:

```bash
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
```

Verify installation:
```bash
pac --version
```

### 4. Build the Project

```bash
npm run build
```

This will:
- Validate the control manifest
- Generate TypeScript types
- Run ESLint
- Compile and bundle the control

### 5. Run Tests

```bash
npm test
```

To run tests with coverage:
```bash
npm run test:coverage
```

### 6. Start Development Server

```bash
npm start
```

This opens the PCF test harness in your browser at http://localhost:8181

For continuous development with auto-reload:
```bash
npm run start:watch
```

## Development Workflow

### Option A: Using DevContainer (Recommended)

1. Install Docker Desktop and VS Code Dev Containers extension
2. Open the project in VS Code
3. Click "Reopen in Container" when prompted
4. Everything is pre-configured and ready to use!

See [DevContainer Guide](docs/DEVCONTAINER.md) for details.

### Option B: Local Development

1. Make changes to files in `JSONViewer/` directory
2. Run `npm run build` to build
3. Run `npm test` to test
4. Run `npm start` to test in browser

## Project Structure Explained

```
PCF-JSONViewer/
│
├── .devcontainer/              # DevContainer configuration
│   └── devcontainer.json
│
├── .github/
│   ├── copilot-instructions.md # Development guidelines
│   └── workflows/              # CI/CD pipelines
│       ├── ci.yml              # Build and test workflow
│       └── package.yml         # Solution packaging workflow
│
├── docs/                       # Documentation
│   ├── DEVCONTAINER.md         # DevContainer setup guide
│   ├── TESTING.md              # Testing guide
│   └── WORKFLOWS.md            # CI/CD guide
│
├── JSONViewer/                 # PCF Control source code
│   ├── __tests__/              # Unit tests
│   │   └── HelloWorld.test.tsx
│   ├── ControlManifest.Input.xml  # Control manifest
│   ├── HelloWorld.tsx          # Sample React component
│   └── index.ts                # Control entry point
│
├── Solution/                   # Dataverse solution
│   ├── src/                    # Solution files
│   └── Solution.cdsproj        # Solution project
│
├── jest.config.js              # Jest test configuration
├── jest.setup.js               # Jest setup file
├── package.json                # npm dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Main documentation
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Build the control |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm start` | Start PCF test harness |
| `npm run start:watch` | Start test harness with auto-reload |
| `npm run clean` | Clean build outputs |
| `npm run rebuild` | Clean and rebuild |

## Making Your First Change

1. **Open the component**: `JSONViewer/HelloWorld.tsx`

2. **Modify the component**: Change the message text

3. **Write a test**: Add a test in `JSONViewer/__tests__/HelloWorld.test.tsx`

4. **Run the test**:
   ```bash
   npm test
   ```

5. **Build the control**:
   ```bash
   npm run build
   ```

6. **Test in browser**:
   ```bash
   npm start
   ```

## Building the Solution Package

To create a solution package for deployment to Dataverse:

1. Build the PCF control:
   ```bash
   npm run build
   ```

2. Navigate to Solution directory:
   ```bash
   cd Solution
   ```

3. Build the solution:
   ```bash
   dotnet build
   ```

4. For managed solution (production):
   ```bash
   dotnet build /p:configuration=Release
   ```

The solution packages will be in `Solution/bin/Release/`.

## Testing the Control

### In Test Harness

1. Run `npm start`
2. Browser opens with the test harness
3. Modify property values to test different scenarios
4. See real-time updates

### In Canvas App

1. Build and package the solution
2. Import into Power Apps environment
3. Create a new Canvas app
4. Add the JSONViewer control from Insert menu
5. Bind data to the control

### In Model-Driven App

1. Build and package the solution
2. Import into Dataverse environment
3. Open a form in Form Designer
4. Select a text field
5. Change control type to "JSONViewer"
6. Save and publish

## Troubleshooting

### Build fails with "pac command not found"

**Solution**: Install Power Platform CLI:
```bash
dotnet tool install --global Microsoft.PowerApps.CLI.Tool
```

Add to PATH (on macOS/Linux):
```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

### npm install fails

**Solution**: Clear cache and retry:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Tests fail with module errors

**Solution**: Ensure all dependencies are installed:
```bash
npm install
```

### Browser doesn't open on npm start

**Solution**: Manually open http://localhost:8181 in your browser

## Next Steps

- Read [Testing Guide](docs/TESTING.md) to learn about writing tests
- Check [Workflows Guide](docs/WORKFLOWS.md) to understand CI/CD
- Review [Copilot Instructions](.github/copilot-instructions.md) for coding standards
- Explore the [PCF Documentation](https://docs.microsoft.com/powerapps/developer/component-framework/overview)

## Getting Help

- Check existing documentation in `docs/` folder
- Review GitHub Issues
- Consult [PCF Community](https://powerusers.microsoft.com/t5/Power-Apps-Component-Framework/bd-p/pa_component_framework)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass: `npm test`
5. Ensure build succeeds: `npm run build`
6. Commit changes: `git commit -m "Description"`
7. Push branch: `git push origin feature/your-feature`
8. Create a Pull Request

Happy coding! 🚀
