# GitHub Workflows Guide

This document describes the CI/CD workflows configured for the PCF-JSONViewer project.

## Overview

The project uses GitHub Actions for continuous integration and deployment. There are four main workflows:

1. **CI - Build and Test** (`ci.yml`)
2. **Auto Tag on Main** (`auto-tag.yml`)
3. **Create Release** (`release.yml`)
4. **Solution Packaging** (`package.yml`)

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

## Auto Tag Workflow

**File**: `.github/workflows/auto-tag.yml`

### When it runs

- Automatically triggered after successful CI builds on the `main` branch

### What it does

1. **Detect Latest Version**: Finds the latest semantic version tag (vX.Y.Z)
2. **Increment Patch**: Automatically increments the patch version (e.g., v1.0.0 → v1.0.1)
3. **Update Version Files**: Updates `package.json` and `Solution.xml` with the new version
4. **Commit Changes**: Commits version updates to main branch
5. **Create Tag**: Creates and pushes an annotated Git tag with the new version

### Version Management

- **Tag Format**: `vX.Y.Z` (semantic versioning)
- **Canonical Source**: `package.json` version field
- **Solution Version**: Synced to `Solution.xml` (uses X.Y format for PowerApps compatibility)
- **Concurrency**: Prevents duplicate tags with concurrency controls

### First Release

If no tags exist, the workflow starts with v1.0.0 as the first version.

## Create Release Workflow

**File**: `.github/workflows/release.yml`

### When it runs

- Manual trigger via workflow_dispatch (Actions tab → Create Release → Run workflow)

### What it does

1. **Version Selection**: Choose version bump type (major, minor, patch, or custom)
2. **Update Versions**: Updates `package.json` and `Solution.xml`
3. **Commit and Tag**: Commits changes and creates a new tag
4. **Build Solution**: Builds both unmanaged and managed solution packages
5. **Create GitHub Release**: Creates a release with generated notes and attached artifacts

### Manual Release Process

1. Go to the "Actions" tab in GitHub
2. Select "Create Release" workflow
3. Click "Run workflow"
4. Choose version bump type:
   - **patch**: Increment patch version (v1.0.0 → v1.0.1)
   - **minor**: Increment minor version (v1.0.0 → v1.1.0)
   - **major**: Increment major version (v1.0.0 → v2.0.0)
   - **custom**: Specify exact version (enter version without 'v' prefix, e.g., "2.5.0")
5. Click "Run workflow"

The workflow will:
- Update version numbers
- Create and push the tag
- Build solution packages
- Create a GitHub release with artifacts attached

### Version Bump Examples

```bash
# Current version: v1.2.3

# Patch bump → v1.2.4 (bug fixes)
# Minor bump → v1.3.0 (new features, backward compatible)
# Major bump → v2.0.0 (breaking changes)
# Custom → v2.5.0 (specific version)

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
7. **Attach to Release**: If triggered by a tag, attaches artifacts to the matching GitHub release

### Release Artifacts

When a tag is pushed, this workflow automatically:
- Builds the solution packages
- Attaches them to the corresponding GitHub Release

The release will contain:
- Unmanaged solution package (.zip)
- Managed solution package (.zip)

## Release Workflow Overview

The complete release process involves three workflows working together:

### Automatic Releases (Patch Versions)

1. Developer merges PR to `main` branch
2. **CI workflow** runs and validates the code
3. **Auto-tag workflow** detects successful CI, increments patch version, and creates tag
4. **Package workflow** triggers on the new tag and attaches artifacts

Result: Automatic patch release (e.g., v1.0.0 → v1.0.1)

### Manual Releases (Major/Minor/Custom Versions)

1. Maintainer triggers **Create Release workflow** manually
2. Chooses version bump type (major/minor/patch/custom)
3. Workflow updates versions, creates tag, builds solution, and creates release with artifacts

Result: Controlled major/minor release (e.g., v1.0.0 → v2.0.0)

## Workflow Status Badges

Add status badges to your README:

```markdown
![CI](https://github.com/megel/PCF-JSONViewer/workflows/CI%20-%20Build%20and%20Test/badge.svg)
![Package](https://github.com/megel/PCF-JSONViewer/workflows/Solution%20Packaging/badge.svg)
```

## Version Management

### Version Sources

- **Primary Source**: `package.json` - stores the full semantic version (X.Y.Z)
- **Solution Version**: `Solution/src/Other/Solution.xml` - stores major.minor (X.Y) for PowerApps compatibility
- **Git Tags**: Annotated tags in format `vX.Y.Z` mark each release

### Version Synchronization

All workflows automatically keep versions synchronized:
- When a new version is created, both `package.json` and `Solution.xml` are updated
- Changes are committed to the main branch before tagging
- Tags are always created on commits with matching version numbers

### Checking Current Version

```bash
# Check package.json version
cat package.json | grep version

# Check Solution.xml version
grep "<Version>" Solution/src/Other/Solution.xml

# List all tags
git tag -l "v*.*.*"

# Get latest tag
git describe --tags --abbrev=0
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

### Auto-tag workflow creates duplicate tags

**Cause**: Race condition or concurrent builds

**Solution**: The workflow includes concurrency controls to prevent this. If it happens:
```bash
# Delete the duplicate tag locally and remotely
git tag -d v1.0.1
git push origin :refs/tags/v1.0.1
```

### Release workflow fails with "tag already exists"

**Cause**: Trying to create a release for a version that already exists

**Solution**: Choose a different version or delete the existing tag first (not recommended)

### Artifacts not attached to release

**Cause**: Release was created before package workflow completed

**Solution**: 
- The release.yml workflow now includes building and attaching artifacts
- For auto-tagged releases, the package.yml workflow handles attachment
- Check workflow logs for build failures

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
