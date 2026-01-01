# Copy Button Icon Examples

This document provides examples of icons you can use for the copy button in the PCF-JSONViewer control.

## Text/Emoji Icons (copyButtonIcon property)

You can use any emoji or text character:

- `📋` - Clipboard (default)
- `📄` - Document
- `📑` - Bookmark Tabs
- `📝` - Memo
- `📰` - Newspaper
- `🗐` - Pages
- `🗂️` - Card Index Dividers
- `📌` - Pushpin
- `📍` - Round Pushpin
- `🔖` - Bookmark

## SVG Icons (copyButtonSvg property)

You can use custom SVG markup for more control over the icon appearance.

### Simple Copy Icon (16x16)
```svg
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="9" height="11" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <path d="M5 2V1C5 0.447715 5.44772 0 6 0H14C14.5523 0 15 0.447715 15 1V12C15 12.5523 14.5523 13 14 13H13" stroke="currentColor" stroke-width="1.5" fill="none"/>
</svg>
```

### Document Copy Icon (20x20)
```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="5" width="10" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <path d="M7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V14C17 14.5523 16.5523 15 16 15H15" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <line x1="5.5" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="5.5" y1="12" x2="10.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Clipboard Icon (18x18)
```svg
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 2H5C3.89543 2 3 2.89543 3 4V15C3 16.1046 3.89543 17 5 17H13C14.1046 17 15 16.1046 15 15V4C15 2.89543 14.1046 2 13 2H12" stroke="currentColor" stroke-width="1.5"/>
  <rect x="6" y="1" width="6" height="3" rx="1" stroke="currentColor" stroke-width="1.5"/>
  <line x1="6" y1="7.5" x2="12" y2="7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="6" y1="10.5" x2="12" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="6" y1="13.5" x2="9" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Modern Copy Icon (24x24)
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
  <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" stroke-width="2"/>
</svg>
```

## How to Use

### Using Emoji Icons
Set the `copyButtonIcon` property in your PowerApps control configuration:
```
copyButtonIcon = "📄"
```

### Using SVG Icons
Set the `copyButtonSvg` property with the full SVG markup:
```
copyButtonSvg = "<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'><rect x='2' y='2' width='9' height='11' rx='1' stroke='currentColor' stroke-width='1.5' fill='none'/><path d='M5 2V1C5 0.447715 5.44772 0 6 0H14C14.5523 0 15 0.447715 15 1V12C15 12.5523 14.5523 13 14 13H13' stroke='currentColor' stroke-width='1.5' fill='none'/></svg>"
```

**Note:** When `copyButtonSvg` is provided, it takes precedence over `copyButtonIcon`.

## Tips for SVG Icons

1. **Use `currentColor`** for the stroke or fill to inherit the button's text color
2. **Keep dimensions small** (16x16 to 24x24 pixels work best)
3. **Use viewBox** for proper scaling
4. **Test in your app** to ensure the icon looks good with your theme

## Hiding the Copy Button

To hide the copy button completely, set:
```
showCopyButton = false
```

This will also adjust the padding automatically to use the full available space.
