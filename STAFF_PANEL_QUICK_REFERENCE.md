# Staff Panel - Quick Reference

## 📁 File Structure
```
src/components/StaffPanel/
  ├── StaffPanel.tsx       (Main component, ~230 lines)
  ├── types.ts             (Types & constants, ~45 lines)
  └── index.ts             (Barrel export)
```

## 🎯 What It Does
- Displays a sliding panel on the right side with all staff members
- Fetches data from `GET /api/admin/users` with authentication
- Groups staff by role with automatic sorting by hierarchy
- Includes search/filter, loading states, and error handling
- Toggleable via floating button (bottom-right corner)

## 🚀 How It Works

### 1. User Interaction
```
Click Users Button (bottom-right)
  ↓
StaffPanel component mounts
  ↓
useEffect triggers API fetch
  ↓
Staff data loaded, sorted, grouped
  ↓
User can search, scroll, or close
```

### 2. Component Props
```tsx
<StaffPanel
  isOpen: boolean;      // Panel visibility
  onClose: () => void;  // Close handler
/>
```

### 3. API Call
```javascript
GET /api/admin/users
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
```

## 🎨 UI Elements

| Component | Purpose |
|-----------|---------|
| Floating Button | Toggle panel (Users icon) |
| Panel Header | Title + close button |
| Search Input | Filter staff by name/role |
| Staff Groups | Grouped by role with badges |
| Staff Items | Avatar + username + role color |
| Loading Spinner | Shown while fetching |
| Error Alert | Shown if API fails |
| Staff Count | Footer with member count |

## 🔧 Customization Points

### Change Role Order
Edit `ROLE_HIERARCHY` in `types.ts`:
```typescript
export const ROLE_HIERARCHY: Record<string, number> = {
  'your_role': 0,  // Will sort first
  // ...
};
```

### Change Role Display Names
Edit `ROLE_LABELS` in `types.ts`:
```typescript
export const ROLE_LABELS: Record<string, string> = {
  'your_role': 'Your Display Name',
  // ...
};
```

### Adjust Panel Width
Edit the `w-96` class in `StaffPanel.tsx`:
```tsx
className={cn(
  'w-full sm:w-96',  // Change w-96 to w-80, w-[400px], etc.
  // ...
)}
```

## 📊 Data Flow

```
localStorage.authToken
  ↓
API: GET /api/admin/users
  ↓
Response: StaffPanelResponse
  ↓
Sort by ROLE_HIERARCHY
  ↓
Group by role
  ↓
Render with search filter
```

## 🔐 Authentication

- Reads token from `localStorage.getItem('authToken')`
- Sends as `Authorization: Bearer <token>`
- Shows "Authentication required" if no token
- Shows error if response is not 200-299

## 🎯 Key Features

✅ **Responsive** - Works on mobile and desktop
✅ **Searchable** - Filter by username or role
✅ **Grouped** - Organized by role with headers
✅ **Sorted** - 9-level role hierarchy
✅ **Async** - Loading and error states
✅ **Accessible** - ARIA labels, keyboard support
✅ **Themeable** - Uses Tailwind CSS theme colors
✅ **Zero Config** - Works out of the box

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Panel won't open | Check if isOpen prop is true |
| No staff showing | Verify backend returns data with correct role values |
| Can't authenticate | Ensure token is in localStorage |
| Search not working | Check console for JavaScript errors |
| Wrong role order | Update ROLE_HIERARCHY constant |

## 📝 Example Usage

Already integrated into all pages via `PageLayout`:

```tsx
import { PageLayout } from '@/components/Layout/PageLayout';

export function MyPage() {
  return (
    <PageLayout>
      <h1>My Page</h1>
      {/* Staff panel automatically available */}
    </PageLayout>
  );
}
```

## 🧪 Testing Checklist

- [ ] Click floating button opens/closes panel
- [ ] Search filters staff by username
- [ ] Search filters staff by role
- [ ] Staff are grouped correctly by role
- [ ] Staff are sorted by role hierarchy
- [ ] Avatars display correctly
- [ ] Role colors show as badges
- [ ] Loading spinner appears during fetch
- [ ] Error message shows if API fails
- [ ] Panel closes when X is clicked
- [ ] Panel closes when overlay clicked (mobile)
- [ ] Scrolling works on long staff lists

## 📚 Related Files

- `src/config/api.ts` - API endpoints
- `src/context/AuthContext.tsx` - Authentication context
- `src/components/Layout/PageLayout.tsx` - Panel integration
- UI Components in `src/components/ui/` - shadcn/ui components

## 🎓 Learning Resources

Inside the component:
- React hooks: `useState`, `useEffect`
- TypeScript interfaces and types
- API authentication patterns
- Data transformation and sorting
- Conditional rendering
- Search/filter logic
- Error handling best practices
