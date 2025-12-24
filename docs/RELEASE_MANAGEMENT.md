# Release Management Guide

This guide explains how to manage versions and releases in the PCF-JSONViewer project.

## Overview

The project uses automated workflows to handle version management and releases:

- **Automatic patch releases** on every successful main branch build
- **Manual major/minor releases** via GitHub Actions workflow
- **Semantic versioning** (MAJOR.MINOR.PATCH)
- **Automated artifact building** and attachment to releases

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Breaking changes or significant new features (e.g., 1.0.0 → 2.0.0)
- **MINOR** version: New features, backward compatible (e.g., 1.0.0 → 1.1.0)
- **PATCH** version: Bug fixes and minor improvements (e.g., 1.0.0 → 1.0.1)

### Version Storage

Versions are stored in multiple locations and kept synchronized:

1. **package.json**: Full semantic version (X.Y.Z) - Primary source
2. **Solution.xml**: Major.Minor only (X.Y) - PowerApps requirement
3. **Git tags**: Format `vX.Y.Z` - Release markers

## Automatic Patch Releases

Every time code is merged to the `main` branch:

1. CI workflow runs tests and builds
2. If successful, auto-tag workflow:
   - Detects the latest version tag
   - Increments the patch version
   - Updates `package.json` and `Solution.xml`
   - Commits changes to main
   - Creates and pushes a new tag (e.g., `v1.0.1`)
3. Package workflow triggers on the new tag:
   - Builds solution packages
   - Creates GitHub Release with artifacts

### Example Flow

```
Developer merges PR #123 → main branch
├─ CI workflow runs ✓
├─ Auto-tag workflow:
│  ├─ Latest tag: v1.0.0
│  ├─ New version: v1.0.1
│  ├─ Updates files
│  ├─ Commits to main
│  └─ Creates tag v1.0.1
└─ Package workflow:
   ├─ Builds solution
   └─ Creates Release v1.0.1 with artifacts
```

### Disabling Auto-Tagging

If you need to make multiple commits without creating releases, you can:

1. Work on a feature branch
2. Merge all changes at once to main
3. Only the final merge triggers auto-tagging

## Manual Releases

Use manual releases for:
- Major version changes (breaking changes)
- Minor version changes (new features)
- Specific version numbers
- Hotfix releases

### Steps to Create a Manual Release

1. **Navigate to Actions Tab**
   - Go to your repository on GitHub
   - Click the "Actions" tab

2. **Select Create Release Workflow**
   - Find "Create Release" in the workflows list
   - Click on it

3. **Run Workflow**
   - Click "Run workflow" button
   - Select the branch (usually `main`)
   - Choose version bump type:
     - **patch**: Bug fixes (1.0.0 → 1.0.1)
     - **minor**: New features (1.0.0 → 1.1.0)
     - **major**: Breaking changes (1.0.0 → 2.0.0)
     - **custom**: Specific version (enter version like "2.5.0")

4. **Monitor Progress**
   - Watch the workflow execution
   - Check for any errors
   - Wait for completion (typically 3-5 minutes)

5. **Verify Release**
   - Go to the "Releases" page
   - Verify the new release is created
   - Check that artifacts are attached

### Custom Version Examples

When selecting "custom" version bump:

```bash
# Current version: v1.2.3

# Jump to v2.0.0
Custom version: 2.0.0

# Create a beta release
Custom version: 2.0.0-beta.1

# Hotfix version
Custom version: 1.2.4
```

**Note**: Enter the version without the 'v' prefix.

## Release Artifacts

Each release automatically includes:

### Solution Packages

- **Unmanaged Solution** (`mme2k_jsonviewer.zip`)
  - Use for development environments
  - Allows customization after import
  
- **Managed Solution** (`mme2k_jsonviewer_managed.zip`)
  - Use for production environments
  - Prevents modifications to the solution

### Downloading Artifacts

1. Go to [Releases page](https://github.com/megel/PCF-JSONViewer/releases)
2. Find the desired version
3. Download the appropriate .zip file
4. Import into your Power Platform environment

## Version Management Best Practices

### When to Use Each Version Bump

**Patch (Automatic)**
- Bug fixes
- Performance improvements
- Documentation updates
- Minor UI tweaks
- Security patches

**Minor (Manual)**
- New features
- New control properties
- Enhanced functionality
- Backward-compatible API changes

**Major (Manual)**
- Breaking changes
- Removed features
- Significant architecture changes
- Non-backward-compatible updates

### Pre-Release Process

Before creating a major or minor release:

1. **Update Documentation**
   - Update README.md with new features
   - Update any relevant docs
   - Add migration guides for breaking changes

2. **Test Thoroughly**
   - Run full test suite locally
   - Test in both Canvas and Model-driven apps
   - Verify in multiple environments

3. **Create Release Notes**
   - Document new features
   - List bug fixes
   - Note breaking changes
   - Add upgrade instructions

4. **Create the Release**
   - Use the manual release workflow
   - Verify artifacts are attached
   - Edit release notes if needed

## Hotfix Process

For urgent fixes to production:

1. **Identify the Issue**
   - Confirm the bug in production version
   - Determine severity

2. **Create Fix**
   - Create a feature branch from main
   - Implement the fix
   - Add/update tests
   - Create PR

3. **Merge and Release**
   - Merge PR to main
   - Auto-tag will create patch release
   - Or use manual release for immediate version

4. **Verify**
   - Test the new release
   - Deploy to production
   - Monitor for issues

## Rollback Process

If a release has critical issues:

### Option 1: Quick Fix (Recommended)

1. Create a new PR with the fix
2. Merge to main
3. New patch version is created automatically

### Option 2: Revert Release

1. Revert the problematic commits
2. Push to main
3. New patch version is created

### Option 3: Delete Tag (Not Recommended)

```bash
# Delete local tag
git tag -d v1.0.1

# Delete remote tag
git push origin :refs/tags/v1.0.1

# Delete the GitHub release manually
```

**Warning**: Deleting tags and releases can cause confusion. Prefer creating a new fix version instead.

## Monitoring Releases

### Check Latest Version

```bash
# Get latest Git tag
git fetch --tags
git describe --tags --abbrev=0

# Check package.json
cat package.json | grep version

# Check Solution.xml
grep "<Version>" Solution/src/Other/Solution.xml
```

### View All Releases

```bash
# List all tags
git tag -l "v*.*.*"

# View tag details
git show v1.0.0

# GitHub CLI
gh release list
```

### Workflow Status

Monitor workflow runs:
1. Go to Actions tab
2. Check recent workflow runs
3. Review logs for failures
4. Download artifacts if needed

## Troubleshooting

### Release Not Created

**Problem**: Workflow completed but no release appears

**Solutions**:
- Check workflow logs for errors
- Verify tag was created: `git fetch --tags && git tag -l`
- Check GitHub releases page
- Manually create release if needed

### Version Conflict

**Problem**: "Tag already exists" error

**Solutions**:
- Check current tags: `git tag -l`
- Choose a different version bump
- Delete existing tag if it was created in error

### Artifacts Missing

**Problem**: Release created but no .zip files attached

**Solutions**:
- Check package workflow logs
- Verify build completed successfully
- Re-run package workflow manually
- Check Solution/bin/Release/ directory in workflow logs

### Auto-Tag Not Triggering

**Problem**: Merged to main but no new tag created

**Solutions**:
- Check CI workflow status (must pass)
- Check auto-tag workflow logs
- Verify no concurrency conflicts
- Wait a few minutes (workflow chain takes time)

## Advanced Topics

### Skipping Auto-Tag

To merge without triggering auto-tag:

Add `[skip-release]` to commit message:
```bash
git commit -m "chore: update docs [skip-release]"
```

**Note**: This feature is not currently implemented but can be added if needed.

### Pre-release Versions

For beta/alpha releases:

Use custom version with pre-release identifier:
```
2.0.0-beta.1
2.0.0-alpha.1
2.0.0-rc.1
```

### Maintenance Branches

For maintaining older versions (not currently implemented):

1. Create branch from old tag: `git checkout -b v1.x v1.2.3`
2. Apply fixes to branch
3. Manually create releases from branch

## Resources

- [Semantic Versioning](https://semver.org/)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [PCF Versioning Best Practices](https://docs.microsoft.com/powerapps/developer/component-framework/version-overview)
- [Workflow Documentation](WORKFLOWS.md)
