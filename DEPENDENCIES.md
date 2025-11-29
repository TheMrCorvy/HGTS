# HGTS Dependencies Architecture

## 📦 Dependency Strategy

HGTS uses a smart dependency strategy to keep the core library lightweight while providing optional React integration.

## Zero Runtime Dependencies

The core HGTS library (`src/index.ts`) has **ZERO runtime dependencies**. This means:

- ✅ Works in any JavaScript environment (Node.js, Browser, Deno, Bun, etc.)
- ✅ Minimal bundle size
- ✅ No security vulnerabilities from dependencies
- ✅ Fast installation

## React as Optional Peer Dependency

React is configured as an **optional peer dependency**:

```json
{
  "peerDependencies": {
    "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    }
  }
}
```

### What This Means:

1. **Without React:**

   ```bash
   npm install hgts
   # Works perfectly! No warnings about missing React
   ```

   ```javascript
   import { hgts } from "hgts";
   hgts.t("key"); // ✅ Works
   ```

2. **With React:**

   ```bash
   npm install hgts
   # React is already in your project
   ```

   ```javascript
   import { hgts } from "hgts";
   import { useTranslation } from "hgts/react";

   hgts.t("key"); // ✅ Works
   const { t } = useTranslation(); // ✅ Works
   ```

## Development Dependencies

These are only used during development and are NOT included in the published package:

- `typescript` - For building the library
- `@types/node` - TypeScript types for Node.js
- `@types/react` - TypeScript types for React (development only)
- `react` - For testing the React hook during development

## Package Exports

The package uses conditional exports to separate core and React functionality:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",
      "import": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "require": "./dist/react.js",
      "import": "./dist/react.js"
    }
  }
}
```

### Usage:

```javascript
// Core (no React needed)
import { hgts } from "hgts";

// React hook (requires React)
import { useTranslation } from "hgts/react";
```

## Bundle Size

- **Core library**: ~2KB (minified + gzipped)
- **React hook**: ~1KB additional (minified + gzipped)
- **Total**: ~3KB for full functionality

## Comparison with Other Libraries

| Library       | Dependencies | Bundle Size (min+gzip) |
| ------------- | ------------ | ---------------------- |
| **HGTS**      | 0            | ~2-3KB                 |
| i18next       | 0            | ~11KB                  |
| react-i18next | 2            | ~15KB (with i18next)   |
| react-intl    | 5            | ~45KB                  |

## Why This Approach?

1. **Flexibility**: Users can choose to use React or not
2. **Performance**: No unnecessary code in the bundle
3. **Compatibility**: Works with any React version (16.8+)
4. **Tree-shaking**: Bundlers can remove unused code
5. **No warnings**: Optional peer dependency doesn't warn when missing

## For Contributors

When adding new features:

1. **Core features** → Add to `src/index.ts` (keep zero dependencies)
2. **React features** → Add to `src/react.ts` (can use React hooks)
3. **Types** → Add to `src/types.ts` (shared by both)

Never add runtime dependencies to the core library unless absolutely necessary.
