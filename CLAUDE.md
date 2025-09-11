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

## Project Architecture

### Tech Stack
- **Build Tool**: Rsbuild (modern bundler)
- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with file-based routing
- **State Management**: 
  - TanStack Query for server state
  - Zustand for client state
- **Styling**: TailwindCSS 4.x
- **API**: Auto-generated TypeScript client from OpenAPI spec
- **Real-time**: Socket.io client with custom React integration
- **Code Quality**: Biome for formatting and linting

### Directory Structure

```
src/
├── app/                    # Application layer
│   ├── routes/            # File-based routing (TanStack Router)
│   ├── styles/            # Global styles and fonts
│   └── App.tsx            # Root app component
├── shared/                # Shared utilities and modules
│   ├── api/               # API layer
│   │   └── @generated/    # Auto-generated API client (DO NOT EDIT)
│   └── socket/            # Real-time WebSocket system
└── index.tsx              # Application entry point
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