# Style Guide

This document outlines the coding standards and best practices for the Lite Paper Documentation Template project.

## Table of Contents

- [TypeScript Guidelines](#typescript-guidelines)
- [React Guidelines](#react-guidelines)
- [CSS and Styling](#css-and-styling)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Component Patterns](#component-patterns)
- [Performance Best Practices](#performance-best-practices)

## TypeScript Guidelines

### General Rules

- **Use TypeScript** for all new code
- **Enable strict mode** in tsconfig.json
- **Avoid `any`** type - use `unknown` or proper types instead
- **Use type inference** where possible, but be explicit for public APIs

### Type Definitions

```typescript
// ✅ Good - Use interfaces for objects
interface UserProps {
  name: string;
  age: number;
  email?: string; // Optional properties
}

// ✅ Good - Use type for unions and primitives
type Status = 'idle' | 'loading' | 'success' | 'error';
type ID = string | number;

// ❌ Avoid - Don't use any
function processData(data: any) {} // Bad

// ✅ Good - Use generics for reusable code
function processData<T>(data: T): T {}
```

### Function Types

```typescript
// ✅ Good - Named function with explicit return type for public APIs
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - Arrow functions for callbacks
const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault();
};

// ✅ Good - Type function parameters
type ClickHandler = (event: MouseEvent<HTMLButtonElement>) => void;
```

## React Guidelines

### Component Structure

```typescript
// ✅ Good - Functional component with typed props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Hooks Usage

```typescript
// ✅ Good - Custom hooks start with 'use'
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // ... rest of implementation
}

// ✅ Good - Proper dependencies in useEffect
useEffect(() => {
  const handler = () => console.log('resize');
  window.addEventListener('resize', handler);

  return () => window.removeEventListener('resize', handler);
}, []); // Empty deps for mount/unmount only
```

### Component Best Practices

- **Use React.memo** for expensive components
- **Use useCallback** for functions passed to memoized children
- **Use useMemo** for expensive computations
- **Avoid inline functions** in render when passing to memoized components

```typescript
// ✅ Good - Memoized component
const ExpensiveList = React.memo(({ items, onItemClick }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
});

// ✅ Good - Parent component
function ParentComponent() {
  const [items, setItems] = useState<Item[]>([]);

  const handleItemClick = useCallback((item: Item) => {
    console.log('Clicked:', item);
  }, []);

  return <ExpensiveList items={items} onItemClick={handleItemClick} />;
}
```

## CSS and Styling

### Tailwind CSS

- **Use Tailwind utilities** as the primary styling method
- **Create custom utilities** in globals.css for repeated patterns
- **Use CSS Modules** for complex component-specific styles

```tsx
// ✅ Good - Tailwind utilities
<div className="flex items-center justify-between p-4 bg-background-color rounded-lg">

// ✅ Good - Conditional classes
<button className={cn(
  "px-4 py-2 rounded transition-colors",
  variant === 'primary' && "bg-primary text-white",
  variant === 'secondary' && "bg-secondary text-black",
  disabled && "opacity-50 cursor-not-allowed"
)}>

// ✅ Good - Extract repeated patterns
// globals.css
.card {
  @apply p-4 rounded-lg border border-border-color bg-card-background;
}
```

### CSS Variables

```css
/* ✅ Good - Use CSS variables for theming */
:root {
  --primary-color: #ff85a1;
  --background-color: #ffffff;
  --text-color: #1a1a1a;
}

.dark {
  --primary-color: #ffc4dd;
  --background-color: #1e1e2e;
  --text-color: #ffffff;
}
```

## File Organization

### Directory Structure

```
app/
├── components/           # Reusable components
│   ├── common/          # Generic components (Button, Input, etc.)
│   ├── features/        # Feature-specific components
│   └── layouts/         # Layout components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── styles/              # Global styles and CSS modules
└── public/              # Static assets
```

### Component Files

```
components/Button/
├── Button.tsx          # Component implementation
├── Button.module.css   # Component styles (if needed)
├── Button.test.tsx     # Component tests
└── index.ts           # Export file
```

## Naming Conventions

### Files and Folders

- **Components**: PascalCase (`Button.tsx`, `NavigationBar.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Hooks**: camelCase with 'use' prefix (`useLocalStorage.ts`)
- **Types**: PascalCase with descriptive names (`UserProfile.ts`)
- **Constants**: UPPER_SNAKE_CASE in files (`API_ENDPOINTS.ts`)

### Variables and Functions

```typescript
// ✅ Good - Descriptive names
const userProfile = { name: 'John', age: 30 };
const isAuthenticated = true;
const hasPermission = checkUserPermission(user, 'admin');

// ✅ Good - Function names describe action
function fetchUserData(userId: string) {}
function calculateTotalPrice(items: Item[]) {}

// ✅ Good - Boolean names
const isLoading = true;
const hasError = false;
const canEdit = true;

// ❌ Avoid - Single letter or unclear names
const d = new Date(); // Bad
const u = user; // Bad
```

### React Components

```typescript
// ✅ Good - Props interface naming
interface ButtonProps {}
interface UserCardProps {}

// ✅ Good - Event handler naming
const handleClick = () => {};
const handleSubmit = () => {};
const onUserSelect = () => {};

// ✅ Good - State variable naming
const [isOpen, setIsOpen] = useState(false);
const [userData, setUserData] = useState<User | null>(null);
```

## Component Patterns

### Container/Presentational Pattern

```typescript
// ✅ Good - Container component (handles logic)
function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  return <UserList users={users} loading={loading} />;
}

// ✅ Good - Presentational component (handles display)
interface UserListProps {
  users: User[];
  loading: boolean;
}

function UserList({ users, loading }: UserListProps) {
  if (loading) return <Spinner />;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Compound Components

```typescript
// ✅ Good - Compound component pattern
interface CardComponents {
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
}

export const Card: React.FC<{ children: React.ReactNode }> & CardComponents = ({ children }) => {
  return <div className="card">{children}</div>;
};

Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

## Performance Best Practices

### Code Splitting

```typescript
// ✅ Good - Lazy load heavy components
const ChatBot = lazy(() => import('./components/ChatBot'));

// ✅ Good - Route-based code splitting
const DocumentationPage = lazy(() => import('./pages/Documentation'));
```

### Optimization Techniques

1. **Use React.memo** for components that receive stable props
2. **Use useMemo** for expensive computations
3. **Use useCallback** for stable function references
4. **Debounce** user inputs and scroll handlers
5. **Virtualize** long lists
6. **Lazy load** images and heavy components

### Three.js Performance

```typescript
// ✅ Good - Dispose of Three.js resources
useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial();

  return () => {
    geometry.dispose();
    material.dispose();
  };
}, []);

// ✅ Good - Reuse geometries and materials
const starGeometry = useMemo(() => new THREE.SphereGeometry(0.1), []);
```

## Error Handling

```typescript
// ✅ Good - Proper error boundaries
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}

// ✅ Good - Try-catch in async functions
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

## Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper color contrast

```tsx
// ✅ Good - Accessible button
<button
  aria-label="Close dialog"
  onClick={handleClose}
  onKeyDown={(e) => e.key === 'Enter' && handleClose()}
>
  <CloseIcon aria-hidden="true" />
</button>
```

## Comments and Documentation

```typescript
/**
 * Calculates the total price of items including tax
 * @param items - Array of items to calculate
 * @param taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns Total price including tax
 */
export function calculateTotalWithTax(items: Item[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return subtotal * (1 + taxRate);
}

// Use single-line comments for clarification
const RETRY_DELAY = 1000; // 1 second in milliseconds
```

Remember: **Consistency is key!** When in doubt, follow the existing patterns in the codebase.
