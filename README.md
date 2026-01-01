# PCF-JSONViewer

PCF Control for PowerApps (canvas and model-driven apps) that visualizes JSON as pretty-printed text with syntax highlighting.

## Features

- 📊 Pretty-print JSON data with customizable indentation
- 🎨 Syntax highlighting for improved readability
- 📐 Respects parent container size boundaries
- ✏️ Optional edit mode for JSON content
- 📋 Copy to clipboard button with customizable icons
- 🎯 Text selection enabled
- 🔒 Read-only mode support
- 📱 Works in both Canvas and Model-Driven apps
- ⚡ Built with React and TypeScript
- ✅ Comprehensive unit tests

## Control Properties

The JSONViewer control exposes the following configurable properties:

### Content (Required)
- **Type**: String (Multiple lines)
- **Description**: The JSON text to display in the viewer
- **Usage**: Bound property - typically bound to a field containing JSON data
- **Example**: `{"name": "John", "age": 30, "city": "New York"}`

### Indentation (Optional)
- **Type**: Whole Number
- **Description**: Set the indentation size for pretty printing the JSON
- **Default**: 2
- **Values**:
  - `0`: Minimized output (no formatting, single line)
  - `> 0`: Number of spaces to use for indentation
- **Usage**: Input property
- **Example**: 
  - `2` → Standard 2-space indentation
  - `4` → 4-space indentation
  - `0` → Minimized: `{"name":"John","age":30}`

### ReadOnly (Optional)
- **Type**: Boolean (TwoOptions)
- **Description**: Enable/disable editing mode
- **Default**: True (read-only)
- **Usage**: Input property
- **Note**: When set to `false`, users can directly edit the JSON content in the viewer. Changes are automatically synced back to the bound property.

### ShowCopyButton (Optional)
- **Type**: Boolean (TwoOptions)
- **Description**: Show or hide the copy to clipboard button
- **Default**: True (button visible)
- **Usage**: Input property
- **Example**: Set to `false` to hide the copy button

### CopyButtonIcon (Optional)
- **Type**: String (Single line)
- **Description**: Icon or emoji to display on the copy button
- **Default**: "📋" (clipboard emoji)
- **Usage**: Input property
- **Examples**: "📄", "📑", "📝", "🗐"
- **Note**: This is used when `CopyButtonSvg` is not provided

### CopyButtonSvg (Optional)
- **Type**: String (Multiple lines)
- **Description**: Custom SVG markup for the copy button icon
- **Default**: None
- **Usage**: Input property
- **Note**: When provided, this takes precedence over `CopyButtonIcon`. See [Copy Button Icons Guide](docs/copy-button-icons.md) for examples.
- **Example**: 
  ```svg
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="9" height="11" rx="1" stroke="currentColor"/>
  </svg>
  ```

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
│   ├── JSONViewerComponent.tsx  # Main React component
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

#### In Model-Driven Apps

1. Open your Model-Driven app in the app designer
2. Add a field to your form that contains JSON data (or create a new text field)
3. Select the field and click "Change control" or "Components"
4. Choose "JSONViewer" from the list of available controls
5. Configure the control properties:
   - **Content**: Bind to the field containing JSON data
   - **Indentation**: Set the desired indentation (default: 2)
   - **ReadOnly**: Set to false to enable editing
   - **ShowCopyButton**: Toggle copy button visibility (default: true)
   - **CopyButtonIcon**: Set a custom emoji icon (e.g., "📄")
   - **CopyButtonSvg**: Provide custom SVG markup for the icon
6. Save and publish your form

#### In Canvas Apps

1. Open your Canvas app in the Power Apps Studio
2. Insert a new component and search for "JSONViewer"
3. Configure the control properties in the properties panel:
   - **Content**: Set to a variable or field containing JSON (e.g., `MyVariable` or `Gallery1.Selected.JSONData`)
   - **Indentation**: Enter a number for indentation spacing (default: 2)
   - **ReadOnly**: Toggle for read-only/edit mode
   - **ShowCopyButton**: Toggle copy button visibility (default: true)
   - **CopyButtonIcon**: Enter emoji or text for button icon (e.g., "📄")
   - **CopyButtonSvg**: Paste SVG markup for custom icon
4. Save and publish your app

#### Example Usage Scenarios

**Display API Response:**
```javascript
// In Canvas App, set Content property to the JSON response
// Note: The exact property name depends on your specific API connector
YourAPIConnector.GetData().JSONResponse
```

**Show formatted configuration:**
```javascript
// Set Content property to a JSON string:
"{""settings"": {""theme"": ""dark"", ""fontSize"": 14}}"
```

**Different indentation styles:**
- Standard: `Indentation = 2`
- Compact: `Indentation = 0` (single line)
- Wide: `Indentation = 4`

**Enable editing:**
```javascript
// Set ReadOnly property to false
ReadOnly = false
```

**Customize copy button:**
```javascript
// Use a different emoji
CopyButtonIcon = "📄"

// Or hide the copy button
ShowCopyButton = false

// Or use a custom SVG icon (see docs/copy-button-icons.md for examples)
CopyButtonSvg = "<svg width='16' height='16'><path d='...' /></svg>"
```

## Development Guidelines

Please refer to [Copilot Instructions](.github/copilot-instructions.md) for detailed development guidelines and best practices.

## Technical Notes

### FluentUI Version Compatibility

This control uses FluentUI v9.68.0 for its React components. Due to Power Platform limitations, the `ControlManifest.Input.xml` file declares FluentUI version `9.46.2` while `package.json` specifies `@fluentui/react-components` version `9.68.0`.

**Why this approach?**
- Power Platform's supported library list doesn't include FluentUI 9.68.0 directly
- The platform will load FluentUI 9.68.0 at runtime despite the manifest declaring 9.46.2
- This is the [recommended workaround](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/react-controls-platform-libraries#supported-platform-libraries-list) from Microsoft

**Important:** When updating FluentUI versions:
1. Update `@fluentui/react-components` in `package.json` to the desired version
2. Keep the `platform-library` version in `ControlManifest.Input.xml` at `9.46.2` (or latest officially supported version)
3. Test thoroughly in both Canvas and Model-Driven apps

## CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **CI Workflow**: Runs on every push and PR, executes linting, testing, and building
- **Auto-Tag Workflow**: Automatically creates patch version tags on successful main branch builds
- **Create Release Workflow**: Manual workflow for creating major, minor, or custom version releases
- **Package Workflow**: Builds solution packages and attaches them to GitHub releases

### Automated Releases

Every successful merge to `main` automatically:
1. Increments the patch version (e.g., v1.0.0 → v1.0.1)
2. Updates version in `package.json` and `Solution.xml`
3. Creates a new Git tag
4. Builds and packages the solution
5. Creates a GitHub Release with artifacts

### Manual Releases

For major or minor version bumps:
1. Go to **Actions** → **Create Release**
2. Click **Run workflow**
3. Select version bump type (major/minor/patch/custom)
4. The workflow handles version updates, tagging, building, and release creation

### Release Artifacts

Each release includes:
- Unmanaged solution package (`.zip`)
- Managed solution package (`.zip`)

Download from the [Releases page](https://github.com/megel/PCF-JSONViewer/releases).

For detailed workflow documentation, see [docs/WORKFLOWS.md](docs/WORKFLOWS.md).

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
