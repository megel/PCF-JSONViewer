# GitHub Workflows Guide

This document describes the CI/CD workflows configured for the PCF-JSONViewer project.

## Overview

The project uses GitHub Actions for continuous integration and deployment. There are two main workflows:

1. **CI - Build and Test** (`ci.yml`)
2. **Solution Packaging** (`package.yml`)

## CI Workflow

**File**: `.github/workflows/ci.yml`

### When it runs

- On push to `main`, `develop`, or any `copilot/**` branch
- On pull requests to `main` or `develop`

### What it does

1. **Checkout**: Gets the latest code
2. **Setup Environment**: Installs Node.js 20, .NET 6, and Power Platform CLI
3. **Install Dependencies**: Runs `npm ci` to install packages
4. **Linting**: Runs ESLint to check code quality
5. **Testing**: Runs unit tests and generates coverage reports
6. **Build**: Builds the PCF control
7. **Upload Coverage**: Sends coverage reports to Codecov (optional)
8. **Upload Artifacts**: Saves build outputs for 5 days

### Viewing Results

- Go to your repository on GitHub
- Click "Actions" tab
- Select a workflow run to see details
- View logs for each step
- Download artifacts if needed

## Package Workflow

**File**: `.github/workflows/package.yml`

### When it runs

- On push to `main` branch
- On version tags (e.g., `v1.0.0`)
- Manual trigger via workflow_dispatch

### What it does

1. **Checkout**: Gets the latest code
2. **Setup Environment**: Installs required tools
3. **Install Dependencies**: Installs npm packages
4. **Build PCF Control**: Builds the control
5. **Build Solution**: Builds both unmanaged and managed solutions
6. **Upload Artifacts**: Saves solution packages for 30 days
7. **Create Release**: If triggered by a tag, creates a GitHub release with the solution package

### Creating a Release

To create a release with the packaged solution:

1. Tag your commit:
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. The workflow will:
   - Build the solution
   - Create a GitHub release
   - Attach the solution package to the release

## Workflow Status Badges

Add status badges to your README:

```markdown
![CI](https://github.com/megel/PCF-JSONViewer/workflows/CI%20-%20Build%20and%20Test/badge.svg)
![Package](https://github.com/megel/PCF-JSONViewer/workflows/Solution%20Packaging/badge.svg)
```

## Local Testing

Before pushing, you can test locally:

```bash
# Run what CI runs
npm run lint
npm test
npm run test:coverage
npm run build
```

## Troubleshooting

### Workflow fails on npm ci

**Cause**: package-lock.json is out of sync

**Solution**:
```bash
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### Workflow fails on build

**Cause**: TypeScript errors or missing files

**Solution**: Run `npm run build` locally to see the error

### Tests pass locally but fail in CI

**Cause**: Environment differences

**Solution**:
- Check Node.js version matches (20.x)
- Ensure all dependencies are in package.json, not just installed globally
- Check for hardcoded paths

### Solution packaging fails

**Cause**: Missing .NET SDK or Power Platform CLI

**Solution**: The workflow should install these automatically. Check the workflow logs for errors.

## Customizing Workflows

### Change Node.js version

Edit the workflow file:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change this
```

### Add environment variables

```yaml
- name: Build
  env:
    MY_VAR: value
  run: npm run build
```

### Add secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Add a new repository secret
3. Reference in workflow:

```yaml
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
  run: ./deploy.sh
```

## Workflow Permissions

The workflows need these permissions (already configured):

- `contents: write` - For creating releases
- `actions: read` - For reading workflow data
- `checks: write` - For updating check status

## Best Practices

1. **Keep workflows fast**: Currently ~2-5 minutes is good
2. **Cache dependencies**: Uses `cache: 'npm'` to speed up installs
3. **Fail fast**: If linting fails, don't run tests
4. **Artifact retention**: Build artifacts: 5 days, Solution packages: 30 days
5. **Branch protection**: Require CI to pass before merging

## Setting up Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require status checks to pass
   - Require "build-and-test" job to succeed
   - Require branches to be up to date

## Monitoring

- Check the Actions tab regularly
- Enable email notifications for failed workflows
- Review coverage reports on Codecov

## Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Workflow syntax](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)
- [Power Platform Build Tools](https://github.com/microsoft/powerplatform-build-tools)
