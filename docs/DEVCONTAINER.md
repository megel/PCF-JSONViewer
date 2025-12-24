# DevContainer Setup Guide

This project includes a DevContainer configuration for a consistent development environment.

## What is DevContainer?

DevContainers provide a fully configured development environment using Docker containers. This ensures all team members have the same tools, dependencies, and settings.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

### Option 1: Open in DevContainer (Recommended)

1. Open the project in VS Code
2. When prompted, click "Reopen in Container"
   - Or press `F1` and select "Dev Containers: Reopen in Container"
3. Wait for the container to build (first time may take 5-10 minutes)
4. Once ready, your terminal will be inside the container

### Option 2: Build Manually

```bash
# From VS Code command palette (F1)
Dev Containers: Rebuild Container
```

## What's Included

The DevContainer includes:

- **Node.js 20**: JavaScript runtime
- **.NET 6.0 SDK**: Required for Power Platform CLI
- **PowerShell**: For scripts and automation
- **GitHub CLI**: For GitHub operations
- **Power Platform CLI**: Pre-installed and ready to use

### VS Code Extensions

The following extensions are automatically installed:

- ESLint: Code linting
- Prettier: Code formatting
- TypeScript: Enhanced TypeScript support
- Jest Runner: Run tests from the editor
- Jest: Test integration
- PowerShell: PowerShell support
- GitHub Copilot: AI pair programming
- GitHub Copilot Chat: AI chat assistant

## Configuration

The DevContainer is configured with:

- **Auto-formatting on save**: Code is automatically formatted when you save
- **ESLint auto-fix**: ESLint issues are fixed automatically on save
- **Consistent TypeScript version**: Uses workspace TypeScript
- **Port forwarding**:
  - Port 8080: PCF Test Harness
  - Port 3000: Development Server

## Post-Creation Setup

When the container is created, it automatically:

1. Installs Power Platform CLI globally
2. Runs `npm install` to install all dependencies

## Working with the DevContainer

### Running Commands

All npm commands work as normal:

```bash
npm run build
npm test
npm start
```

### Power Platform CLI

The `pac` command is available globally:

```bash
pac pcf version
pac solution list
```

### Customizing

To customize the DevContainer:

1. Edit `.devcontainer/devcontainer.json`
2. Rebuild the container:
   - Press `F1`
   - Select "Dev Containers: Rebuild Container"

## Troubleshooting

### Container won't start

- Ensure Docker Desktop is running
- Check Docker has enough resources (4GB RAM minimum)
- Try rebuilding: `Dev Containers: Rebuild Container Without Cache`

### Extensions not working

- Rebuild the container
- Check extension compatibility with the container

### npm install fails

- Check your internet connection
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and try again

## Benefits

- ✅ Consistent environment across all developers
- ✅ No local installation of tools required
- ✅ Works on Windows, macOS, and Linux
- ✅ Easy onboarding for new team members
- ✅ Isolated from host system

## Additional Resources

- [VS Code DevContainers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [DevContainer Specification](https://containers.dev/)
