# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Package Management
```bash
pnpm install      # Install dependencies
```

### Development
```bash
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build for production
pnpm preview      # Preview production build locally
```

### Code Quality
```bash
pnpm format       # Format code with Biome (includes linting and fixing)
```

### API Code Generation
```bash
pnpm openapi      # Generate TypeScript API client from OpenAPI spec
                  # Generates code in src/shared/api/@generated/
                  # Uses OpenAPI spec from https://api.gamegoo.co.kr/v3/api-docs
```

### UI Component Management
```bash
npx shadcn add [component-name]    # Add new shadcn/ui component
npx shadcn add button badge modal  # Add multiple components at once
```

## Project Architecture

### Tech Stack
- **Build Tool**: Rsbuild (modern bundler)
- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: 
  - TanStack Query for server state
  - Zustand for client state
- **Styling**: TailwindCSS 4.x
- **UI Components**: shadcn/ui (Radix UI + TailwindCSS)
- **API**: Auto-generated TypeScript client from OpenAPI spec
- **Real-time**: Socket.io client with custom React integration
- **Code Quality**: Biome for formatting and linting

### Directory Structure (Feature-Sliced Design)

This project follows **Feature-Sliced Design (FSD)** architecture for scalable and maintainable code organization:

```
src/
├── app/                    # Application layer - app initialization, providers, global settings
│   ├── routes/            # File-based routing (TanStack Router)
│   ├── styles/            # Global styles and fonts
│   ├── providers/         # Global providers (QueryClient, Socket, etc.)
│   └── App.tsx            # Root app component
├── pages/                 # Pages layer - route components, page-specific logic
│   ├── home/              # Home page components and logic
│   ├── profile/           # Profile page components and logic
│   ├── chat/              # Chat page components and logic
│   └── matching/          # Matching page components and logic
├── widgets/               # Widgets layer - complex UI blocks, page sections
│   ├── header/            # Header widget with navigation
│   ├── sidebar/           # Sidebar widget
│   ├── chat-room/         # Chat room widget
│   └── game-matching/     # Game matching widget
├── features/              # Features layer - user-facing functionality, business logic
│   ├── auth/              # Authentication feature
│   │   ├── model/         # Auth state, stores, hooks
│   │   ├── ui/            # Auth-specific UI components
│   │   └── api/           # Auth API calls
│   ├── user-profile/      # User profile management
│   ├── game-matching/     # Game matching functionality
│   ├── chat/              # Chat functionality
│   └── notifications/     # Notifications feature
├── entities/              # Entities layer - business entities, data models
│   ├── user/              # User entity (types, transformations, base API)
│   │   ├── model/         # User types, interfaces
│   │   ├── api/           # User-related API calls
│   │   └── lib/           # User utility functions
│   ├── game/              # Game entity
│   ├── chat/              # Chat entity
│   └── notification/      # Notification entity
├── shared/                # Shared layer - reusable code, utilities
│   ├── ui/                # Pure UI components (buttons, inputs, modals)
│   │   ├── button/        # Button component variants
│   │   ├── modal/         # Modal component
│   │   ├── input/         # Input component variants
│   │   └── index.ts       # Barrel exports
│   ├── lib/               # Utility functions, helpers
│   │   ├── utils/         # General utilities
│   │   ├── validation/    # Form validation schemas
│   │   ├── constants/     # App constants
│   │   └── hooks/         # Shared custom hooks
│   ├── api/               # API layer and generated client
│   │   ├── @generated/    # Auto-generated API client (DO NOT EDIT)
│   │   ├── base/          # Base API configuration
│   │   └── types/         # Shared API types
│   ├── socket/            # Real-time WebSocket system
│   └── config/            # App configuration, environment variables
└── index.tsx              # Application entry point
```

### FSD Layer Principles

**Layer Hierarchy (top to bottom):**
1. **app** - Application initialization, global providers, routing setup
2. **pages** - Route-level components, page composition from widgets/features
3. **widgets** - Complex UI blocks that combine multiple features
4. **features** - Business logic, user-facing functionality
5. **entities** - Business data models, core domain logic
6. **shared** - Reusable utilities, pure UI components, configuration

**Key Rules:**
- **Unidirectional Dependencies**: Higher layers can import from lower layers, never the reverse
- **Feature Isolation**: Features should not directly depend on each other
- **Pure UI Separation**: Distinguish between domain-agnostic UI (`shared/ui`) and domain-specific components
- **Entity-Centric**: Organize around business entities (User, Game, Chat) rather than technical concerns

### FSD Implementation Guidelines

#### Slice Structure Within Layers
Each slice (feature/entity) should follow this internal structure:
```
feature/auth/
├── model/           # Business logic, state management
│   ├── store.ts     # Zustand store for auth state
│   ├── types.ts     # Auth-related TypeScript types
│   └── hooks.ts     # Auth-related custom hooks
├── ui/              # Feature-specific UI components
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── index.ts     # Barrel exports
├── api/             # Feature-specific API calls
│   ├── authApi.ts   # Auth API endpoints
│   └── types.ts     # API request/response types
└── index.ts         # Public API of the feature
```

#### Import Rules by Layer

**pages/** can import from:
- `widgets/*`, `features/*`, `entities/*`, `shared/*`

**widgets/** can import from:
- `features/*`, `entities/*`, `shared/*` (NOT from other widgets or pages)

**features/** can import from:
- `entities/*`, `shared/*` (NOT from other features directly)
- Cross-feature communication through `entities` layer only

**entities/** can import from:
- `shared/*` only

**shared/** should have no internal dependencies on upper layers

#### Practical Examples

**Creating a new feature:**
```typescript
// features/game-matching/model/store.ts
import { create } from 'zustand';
import { GameEntity } from '@/entities/game';

// features/game-matching/ui/MatchingButton.tsx  
import { useMatchingStore } from '../model/store';
import { Button } from '@/shared/ui/button';

// pages/matching/ui/MatchingPage.tsx
import { MatchingWidget } from '@/widgets/game-matching';
import { useAuth } from '@/features/auth';
```

**Cross-layer communication:**
```typescript
// ✅ Good: Feature uses entity
import { UserEntity } from '@/entities/user';

// ✅ Good: Page composes widgets and features  
import { Header } from '@/widgets/header';
import { useAuth } from '@/features/auth';

// ❌ Bad: Feature directly imports another feature
import { useChat } from '@/features/chat'; // Use entities layer instead

// ✅ Good: Cross-feature via entities
import { chatModel } from '@/entities/chat';
```

### Key Architectural Patterns

**Auto-generated API Layer**: The entire API layer is generated from OpenAPI specifications. Never edit files in `src/shared/api/@generated/` manually. Instead, update the API by running `pnpm openapi` after backend changes.

**File-based Routing**: Routes are automatically generated from files in `src/app/routes/`. The route tree is auto-generated in `src/routeTree.gen.ts`. Route files starting with `-` are ignored.

**Socket System**: A comprehensive WebSocket system built on Socket.io with:
- JWT token-based authentication
- Automatic reconnection with configurable retry limits
- Heartbeat monitoring (PING/PONG)
- React Provider/Hook pattern for easy integration
- Type-safe event handling
- Connection state management with enums

**Import Path Mapping**: Use `@/*` for imports from the `src/` directory (configured in tsconfig.json).

**FSD-Aligned State Management**:
- **Global state** (auth, theme): `app/providers/`
- **Feature state** (matching status): `features/*/model/`
- **Entity state** (user data): `entities/*/model/`
- **Page state** (local UI): `pages/*/model/` or local useState

**shadcn/ui Integration**:
- Components are added via CLI and placed in `/src/components/ui/`
- Move components to FSD structure: `src/shared/ui/[component]/`
- Update import paths to use `@/shared/lib/utils` instead of `@/lib/utils`
- Always use shadcn/ui components instead of creating custom UI components

### Configuration Files

- **rsbuild.config.ts**: Build configuration with React plugin and TanStack Router integration
- **biome.json**: Code formatting and linting rules (excludes generated API code)
- **openapitools.json**: OpenAPI generator configuration
- **tsconfig.json**: TypeScript configuration with strict mode and path mapping
- **postcss.config.ts**: PostCSS configuration for TailwindCSS

### Development Workflow

1. **API Changes**: Run `pnpm openapi` to regenerate the API client after backend updates
2. **Code Quality**: Use `pnpm format` to format and lint code (Biome handles both)
3. **Git Hooks**: Configured via postinstall script to use `.githooks/` directory
4. **Socket Integration**: Use the provided React hooks for WebSocket functionality instead of direct Socket.io usage

### FSD Development Guidelines

#### When Creating New Code

**1. Determine the appropriate layer:**
- **New page?** → `pages/` (compose from widgets/features)
- **New user feature?** → `features/` (business logic + UI)
- **New reusable UI?** → `shared/ui/` (pure components)
- **New business entity?** → `entities/` (data model + transformations)
- **New complex page section?** → `widgets/` (combine multiple features)

**2. Follow slice internal structure:**
- Always create `index.ts` for public API
- Separate `model/` (logic), `ui/` (components), `api/` (if needed)
- Use barrel exports to control what's exposed

**3. Respect import rules:**
- Higher layers import from lower layers only
- Features don't import from other features directly
- Use entities for cross-feature communication

#### Refactoring Existing Code to FSD

**Step 1: Identify current code purpose**
- Is it a page? Move to `pages/`
- Is it feature logic? Move to `features/`
- Is it a data model? Move to `entities/`
- Is it reusable UI? Move to `shared/ui/`

**Step 2: Create proper slice structure**
```bash
# Example: Moving auth logic to FSD
mkdir -p src/features/auth/{model,ui,api}
mkdir -p src/entities/user/{model,api,lib}
```

**Step 3: Update imports**
```typescript
// Before (old structure)
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

// After (FSD structure)  
import { useAuth } from '@/features/auth';
import { LoginForm } from '@/features/auth/ui';
```

#### UI Component Guidelines

**Always use shadcn/ui components:**
```bash
# Add new components via CLI
npx shadcn add button badge modal dialog

# Move to FSD structure after adding
mv src/components/ui/button.tsx src/shared/ui/button/
```

**Component Integration Pattern:**
```typescript
// ❌ Don't create custom UI from scratch
const CustomButton = () => <button className="...">...</button>;

// ✅ Use shadcn/ui components
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

// ✅ Extend shadcn/ui for specific needs
const FloatingButton = ({ children, ...props }) => (
  <Button 
    className="fixed bottom-6 right-6 rounded-full shadow-lg" 
    {...props}
  >
    {children}
  </Button>
);
```

### Important Notes

- Generated API code in `@generated` folder should never be edited manually
- Biome is configured to ignore the generated API code during linting/formatting  
- Socket system includes comprehensive authentication and reconnection logic
- TanStack Router automatically generates route tree - don't edit `routeTree.gen.ts`
- Project uses ESM modules throughout (type: "module" in package.json)

## Code Conventions

### Boolean Variables and Functions
- Use **`has`** or **`is`** prefix for boolean variables and functions that return boolean
```typescript
// bad
let tablet = false;
function student() { return false; }

// good
let isTablet = false;
function isStudent() { return false; }
```

### Objects
- Use computed property names for dynamic property names
```typescript
// bad
const obj = { id: 5, name: 'San Francisco' };
obj[getKey('enabled')] = true;

// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
};
```

### Strings
- Use template strings instead of concatenation
```typescript
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

### Functions
- Use default parameter syntax
```typescript
// bad
function handleThings(opts) {
  opts = opts || {};
}

// good
function handleThings(opts = {}) {
  // ...
}
```

### Comparisons
- Use shortcuts for booleans, explicit comparisons for strings and numbers
```typescript
// bad
if (isValid === true) { }
if (name) { }
if (collection.length) { }

// good
if (isValid) { }
if (name !== '') { }
if (collection.length > 0) { }
```

- Avoid nested ternaries, prefer single line expressions
```typescript
// bad
const foo = maybe1 > maybe2 ? "bar" : value1 > value2 ? "baz" : null;

// good
const maybeNull = value1 > value2 ? 'baz' : null;
const foo = maybe1 > maybe2 ? 'bar' : maybeNull;
```

### Imports and Exports
- Import from root enum objects instead of direct imports
```typescript
// bad
import { UserRole } from 'root/types/es/enums';
import { UserRole2 } from 'root/types/es/enums2';

// good
import { UserRole, UserRole2 } from 'root/types';
```

- Use same name for default export and import target
```typescript
// bad
export default Login;
import LoginPage from './Login';

// good
export default Login;
import Login from './Login';
```

- Use `as` keyword for unclear import names
```typescript
import { v4 as uuidv4 } from 'uuid';
```

- Use inline exports
```typescript
// bad
function foo() { }
function bar() { }
export { foo, bar };

// good
export function foo() { }
export function bar() { }
```

### Control Flow
- Avoid `else` when `if` always returns
```typescript
// bad
function foo() {
  if (x) {
    return x;
  } else {
    return y;
  }
}

// good
function foo() {
  if (x) {
    return x;
  }
  return y;
}
```

- Use line breaks after conditional statements and always use braces
```typescript
// bad
if (test) return false;
if (test)
  return false;

// good
if (test) {
  return false;
}
```

### Destructuring
- Use object destructuring for multiple properties
```typescript
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;
  return `${firstName} ${lastName}`;
}

// good
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

### TypeScript
- Use `as const` for readonly variables
```typescript
const Palette = {
  gray,
  black
} as const;
```

- Use `React.FC` type with arrow functions for components
```typescript
// bad
function Component({a, b}: ComponentProps) { }

// good
const Component: FC<ComponentProps> = ({a, b}) => { };
```

### Naming
- Avoid single letter names, be descriptive
```typescript
// bad
function qr() { }

// good
function query() { }
```

### Comments
- Use JSDoc format for multiline comments
```typescript
// bad
// @param {String} tag
// @return {Element} element
function make(tag) { }

// good
/**
 * @param {String} tag
 * @return {Element} element
 */
function make(tag) { }
```

### Event Handlers

#### Props
- Use `on*` prefix for component handler props
```typescript
// bad
<Modal handleModalClose={...} />

// good
<Modal onClose={...} />
```

#### Functions  
- Use `handle*` prefix for handler functions: `handle{NameSpace}{EventType}`
```typescript
// good
const handleModalClose = () => { };
<Modal onClose={handleModalClose} />
```

#### Component Splitting
- Split components with many event handlers of the same type
```typescript
// bad
<Form
  onRegistrationSubmit={this.handleRegistrationSubmit}
  onLoginSubmit={this.handleLoginSubmit}
/>

// good
<RegistrationForm onSubmit={this.handleRegistrationSubmit} />
<LoginForm onSubmit={this.handleLoginSubmit} />
```

### React Props
- Use camelCase, PascalCase for React Component props
```typescript
// bad
<Foo UserName="hello" phone_number={12345678} />

// good
<Foo userName="hello" phoneNumber={12345678} Component={SomeComponent} />
```

- Place `on*` handler props at bottom, boolean props at top
```typescript
// good
<Text
  bold
  block
  size="big"
  textAlign="center"
  onChange={(v) => console.log(v)}
/>
```