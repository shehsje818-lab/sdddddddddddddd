# Staff Panel Feature Documentation

## Overview
The Staff Panel is a sliding right-side panel that displays all staff members with their roles, avatars, and role colors. It's toggled via a floating button in the bottom-right corner of the page.

## Features Implemented

### 1. ✅ Slide-out Panel (Right Side)
- Toggleable via floating button
- Responsive design (full width on mobile, fixed width on desktop)
- Smooth slide-in/slide-out animation
- Semi-transparent overlay on mobile

### 2. ✅ Title: "Online Staff"
- Branded header with icon
- Close button (X) for easy dismissal

### 3. ✅ Backend API Integration
- Endpoint: `GET /api/admin/users`
- Requires authentication token from localStorage
- Handles loading, error, and success states
- Proper error messages displayed to user

### 4. ✅ Staff Member Display
Each staff member shows:
- **Avatar**: Profile image with fallback initial
- **Username**: Truncated with ellipsis if too long
- **Role Color**: Visual indicator (dot + colored badge)
- **Role Name**: Displayed in grouped headers

### 5. ✅ Grouping by Role
Staff members are automatically grouped by role with:
- Clear role headers (e.g., "Owner", "Main Admin", "Admin", etc.)
- Members listed under their respective roles
- Badge styling for role headers

### 6. ✅ Avatar/Icon Support
- Displays user avatar from backend response
- Fallback to first letter of username if no avatar
- Uses existing Avatar component from shadcn

### 7. ✅ Role Hierarchy Sorting
Sorted by predefined hierarchy:
1. Owner
2. Main Admin
3. Admin
4. Deputy
5. Sr. Moderator
6. Moderator
7. Helper
8. Jr. Helper
9. Beta Tester

### 8. ✅ Close/Collapse Button
- X button in panel header
- Click outside panel on mobile to close
- Toggle button to open/close

### 9. ✅ Search/Filter
- Search by username (case-insensitive)
- Search by role (case-insensitive)
- Real-time filtering as you type
- Shows filtered count at bottom

### 10. ✅ Loading & Error States
- Loading spinner during data fetch
- Error alert if API call fails
- Empty state message if no results
- Staff count display at bottom

## Component Structure

```
src/components/StaffPanel/
├── StaffPanel.tsx      # Main component with UI logic
├── types.ts            # TypeScript interfaces and constants
└── index.ts            # Barrel export
```

## Types Defined

### StaffMember
```typescript
{
  _id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  color: string;        // Role color (hex code)
  joinedAt: string;
  updatedAt: string;
}
```

### StaffPanelResponse
```typescript
{
  users: StaffMember[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}
```

## Integration Points

### 1. PageLayout Component
- Added state for panel open/close
- Floating toggle button (bottom-right)
- Staff panel rendered with props
- Button with Users icon

### 2. API Configuration
- Uses existing `API_ENDPOINTS.ADMIN_USERS`
- Authentication handled via token in localStorage
- Bearer token included in headers

### 3. Authentication
- Checks for authToken in localStorage
- Shows error if token not available
- Uses existing useAuth hook for user context

## Styling & Design

- **Colors**: Uses Tailwind CSS theme colors (primary, secondary, background, etc.)
- **Icons**: lucide-react icons used throughout
- **Components**: Built with shadcn/ui components (Button, Avatar, Badge, Alert, Input)
- **Responsive**: Mobile-first design with proper breakpoints
- **Animations**: Smooth transitions for panel slide and hover effects

## Usage

The staff panel is automatically integrated into the page layout. Users see a floating "Users" button (bottom-right corner) that toggles the staff panel.

### For Developers

To add the staff panel to a new page:
```tsx
import { PageLayout } from '@/components/Layout/PageLayout';

export function MyPage() {
  return (
    <PageLayout>
      {/* Your content here */}
    </PageLayout>
  );
}
```

## API Requirements

The backend `/api/admin/users` endpoint should:
1. Require authentication (Bearer token)
2. Return array of staff members
3. Include all fields specified in StaffMember interface
4. Return color as hex code (e.g., "#FF0000")
5. Support optional pagination

## Future Enhancements

Potential improvements:
- Online status indicator
- Last seen timestamp
- Click to view profile
- Sort by join date or last active
- Filter by specific roles
- Export staff list
- Presence indicators (online/offline)
- Bulk actions

## Troubleshooting

### Panel won't open
- Check if authentication token exists in localStorage
- Verify backend API endpoint is accessible
- Check browser console for errors

### Staff not showing
- Verify backend returns data in correct format
- Check role values match ROLE_HIERARCHY keys
- Ensure color is valid hex code

### Search not working
- Verify search input is being updated
- Check console for JavaScript errors
- Ensure staff data was fetched successfully
