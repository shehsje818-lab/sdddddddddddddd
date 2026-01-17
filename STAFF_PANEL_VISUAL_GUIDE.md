# Staff Panel - Visual Guide

## Where Is The Staff Panel?

```
┌─────────────────────────────────────────────────────────┐
│                      Header                              │
│  Logo          Nav Items        Auth/Profile    Admin    │
└─────────────────────────────────────────────────────────┘
                                                      ┌──┐
                                                      │  │
┌─────────────────────────────────────────────────────┤  │
│                                                     │  │
│                    Main Content                    │  │
│                                                     │  │
│                                                     │  │
│                                                     │  │
├─────────────────────────────────────────────────────┤  │
│                                                     │  │
│                  Footer                            │  │
└─────────────────────────────────────────────────────└──┘
                                            ↑
                        Floating Users Button
                        (Bottom Right Corner)
                        Toggles Panel

                            Panel Open:
                            ┌──────────────────┐
                            │ Online Staff    X│
                            │ [Search Box  ]   │
                            │                  │
                            │ Owner            │
                            │  👤 founder      │
                            │                  │
                            │ Admin            │
                            │  👤 admin_user   │
                            │                  │
                            │ Moderator        │
                            │  👤 mod1         │
                            │  👤 mod2         │
                            │                  │
                            │ 4 staff members  │
                            └──────────────────┘
```

## Component Hierarchy

```
App
├── AuthProvider
├── BrowserRouter
└── AppRoutes
    └── (Various Pages)
        └── PageLayout ✨ (New integration)
            ├── Header
            ├── Main Content
            ├── Footer
            └── StaffPanel ✨ (New component)
                ├── Header Section
                │   ├── Title
                │   └── Close Button
                ├── Search Section
                │   └── Input Field
                └── Content Section
                    ├── Loading State
                    ├── Error State
                    ├── Role Groups
                    │   ├── Role Badge Header
                    │   └── Staff Items
                    │       ├── Avatar
                    │       ├── Username
                    │       └── Role Color
                    └── Footer (Count)
```

## File Location Map

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx          (Unchanged)
│   │   └── PageLayout.tsx       ✏️ MODIFIED - Added staff panel
│   │
│   ├── StaffPanel/             ✨ NEW FOLDER
│   │   ├── StaffPanel.tsx       ✨ Main component
│   │   ├── types.ts             ✨ Types & constants
│   │   └── index.ts             ✨ Barrel export
│   │
│   └── ui/                      (Unchanged - using existing components)
│
├── config/
│   └── api.ts                   (Unchanged - uses existing endpoint)
│
└── context/
    └── AuthContext.tsx          (Unchanged - using existing auth)

Documentation Files (Root):
├── STAFF_PANEL_DOCUMENTATION.md ✨ Full documentation
├── STAFF_PANEL_SUMMARY.md ✨ Quick summary
├── STAFF_PANEL_API_REFERENCE.md ✨ API format guide
├── STAFF_PANEL_QUICK_REFERENCE.md ✨ Developer quick reference
└── STAFF_PANEL_IMPLEMENTATION_CHECKLIST.md ✨ This checklist
```

## Code Flow Diagram

```
User Opens Page
    ↓
PageLayout component mounts
    ├─ Renders Header
    ├─ Renders Main Content
    ├─ Renders Footer
    ├─ Renders Floating Button ← Click to toggle!
    └─ Renders StaffPanel (hidden by default)
    
User Clicks Users Button
    ↓
staffPanelOpen state becomes true
    ↓
StaffPanel becomes visible
    ↓
StaffPanel useEffect triggers
    ↓
Checks if panel is open AND user exists
    ├─ Get auth token from localStorage
    ├─ Fetch from GET /api/admin/users
    ├─ Parse response
    ├─ Sort by ROLE_HIERARCHY
    └─ Group by role
    ↓
Staff data stored in state
    ↓
Component re-renders with data
    ↓
User can now:
    ├─ Type in search box → filters data in real-time
    ├─ Scroll through staff
    ├─ Click X button → panel closes
    └─ Click outside panel on mobile → closes
```

## UI Elements Breakdown

```
┌─────────────────────────────────────────────────┐
│ 👥 Online Staff                             [X] │ ← Header
├─────────────────────────────────────────────────┤
│  🔍 Search by name or role...                   │ ← Search
├─────────────────────────────────────────────────┤
│                                                 │
│ ┌─────────────────────────────────────────┐    │
│ │ [Owner]                                 │    │ ← Role Badge
│ │ 👤 founder                    [red dot] │    │ ← Staff Item
│ └─────────────────────────────────────────┘    │
│                                                 │ ← Content Area
│ ┌─────────────────────────────────────────┐    │
│ │ [Admin]                                 │    │
│ │ 👤 admin_user                [orange   │    │
│ │                               dot]     │    │
│ └─────────────────────────────────────────┘    │
│                                                 │
│ ┌─────────────────────────────────────────┐    │
│ │ [Moderator]                             │    │
│ │ 👤 mod1                       [blue dot]│    │
│ │ 👤 mod2                       [blue dot]│    │
│ └─────────────────────────────────────────┘    │
│                                                 │
├─────────────────────────────────────────────────┤
│ 4 staff members                                 │ ← Footer
└─────────────────────────────────────────────────┘
```

## State Management

```
PageLayout Component:
├─ staffPanelOpen: boolean (default: false)
│  └─ Controls visibility of StaffPanel
│
└─ setStaffPanelOpen: function
   ├─ Called by floating button (toggle)
   └─ Passed to StaffPanel as onClose prop

StaffPanel Component:
├─ staff: StaffMember[] (default: [])
│  └─ Raw data from API
│
├─ loading: boolean (default: false)
│  └─ Fetch in progress
│
├─ error: string | null (default: null)
│  └─ Error message if fetch fails
│
├─ searchQuery: string (default: "")
│  └─ User's search input
│
└─ filteredStaff: StaffMember[] (default: [])
   └─ Staff after filtering by search
```

## Data Transformation

```
API Response (Raw)
{
  users: [
    { _id, username, avatar, role: "owner", color: "#FF0000", ... },
    { _id, username, avatar, role: "admin", color: "#FFA500", ... },
    { _id, username, avatar, role: "owner", color: "#FF0000", ... },
    ...
  ]
}
    ↓
Step 1: Sort by ROLE_HIERARCHY
{
  users: [
    { _id, username, avatar, role: "owner", color: "#FF0000", ... }, ← First (0)
    { _id, username, avatar, role: "owner", color: "#FF0000", ... }, ← First (0)
    { _id, username, avatar, role: "admin", color: "#FFA500", ... }, ← Second (2)
    ...
  ]
}
    ↓
Step 2: Group by role
{
  "owner": [
    { _id, username, avatar, role: "owner", color: "#FF0000", ... },
    { _id, username, avatar, role: "owner", color: "#FF0000", ... },
  ],
  "admin": [
    { _id, username, avatar, role: "admin", color: "#FFA500", ... },
  ],
  ...
}
    ↓
Step 3: Display with groupings
[Owner]
  👤 username1
  👤 username2
[Admin]
  👤 username3
```

## Integration Points

### 1. PageLayout (Parent)
```tsx
<PageLayout>
  <YourContent/>
  <Button onClick={toggle}>Users</Button>  ← Floating button
  <StaffPanel isOpen={open} onClose={close}/>  ← Panel
</PageLayout>
```

### 2. AuthContext (Auth)
```tsx
const { user } = useAuth();  ← Check if user exists
// Uses user to verify panel should load
```

### 3. API Config (Endpoints)
```tsx
import { API_ENDPOINTS } from '@/config/api';
// Uses existing ADMIN_USERS endpoint
```

### 4. localStorage (Tokens)
```tsx
const token = localStorage.getItem('authToken');
// Reads token that's set by AuthContext after login
```

## What's New vs. What's Reused

```
✨ NEW:
├── StaffPanel component (245 lines)
├── StaffPanel types (45 lines)
├── Floating button in PageLayout
└── Documentation files (5 files)

♻️ REUSED (Existing):
├── useAuth hook
├── API_ENDPOINTS config
├── UI Components: Button, Avatar, Badge, Alert, Input
├── Icons: Users, Search, X, Loader2, AlertCircle
├── Tailwind CSS classes
├── TypeScript infrastructure
└── Build tools (Vite, React)

⚠️ UNCHANGED:
├── Header component
├── Footer component
├── Auth flow
├── API base configuration
├── All other pages and components
```

## Mobile vs. Desktop Layout

```
MOBILE (< 640px):
┌──────────────────────┐
│  Header              │
│  ┌────────────────┐  │
│  │                │  │
│  │  Main Content  │  │
│  │                │  │
│  └────────────────┘  │
│         [👥] ← Button│
│  Footer              │
│                      │ (Full-width panel overlay)
└──────────────────────┘
    [Panel: full width]

DESKTOP (≥ 640px):
┌────────────────────────────┐
│  Header                    │
│  ┌──────────────┐          │
│  │              │[Panel]   │ ← Fixed width (384px)
│  │Main Content  │          │
│  │              │          │
│  └──────────────┘[👥] ← Button
│  Footer        │          │
└────────────────────────────┘
```

---

**Key Files to Know:**
- Main Component: [src/components/StaffPanel/StaffPanel.tsx](src/components/StaffPanel/StaffPanel.tsx)
- Types: [src/components/StaffPanel/types.ts](src/components/StaffPanel/types.ts)
- Integration: [src/components/Layout/PageLayout.tsx](src/components/Layout/PageLayout.tsx)
