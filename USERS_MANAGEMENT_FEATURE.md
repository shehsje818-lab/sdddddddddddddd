# Users Management Feature

## Overview
Added a comprehensive web-based user management interface to the Admin Portal that allows administrators to view all users in a database-like table format and manage their roles.

## Features

### 1. **Users Database View**
- Displays all users in a clean table format
- Shows user avatar/initials, username, email, role, and join date
- Responsive design that works on mobile and desktop

### 2. **Role Management**
- Click "Manage" button on any user row to open the role assignment dialog
- Available roles:
  - `User (Normal)` - default role for newly joined users
  - `Admin` - admin access
  - `Main Admin` - main administrator
  - `Owner` - owner role

### 3. **Filtering**
- Filter users by role using the role dropdown filter
- Pagination support with Previous/Next buttons (20 users per page)

### 4. **User Avatar Display**
- Shows Discord user avatar if available
- Falls back to user's first letter in a badge if no avatar

## Technical Implementation

### Frontend Changes
**File: `src/pages/AdminPortal.tsx`**

New imports added:
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow` - for table display
- `Dialog`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogTitle`, `DialogTrigger` - for role assignment dialog
- `UserCog` icon from lucide-react

New state variables:
- `users` - stores fetched users
- `usersLoading` - loading state for users
- `roleFilter` - filter users by role
- `selectedUser` - currently selected user for role management
- `selectedRole` - role being assigned
- `roleDialogOpen` - controls role dialog visibility
- `userPage` - current page for pagination
- `updatingRoleId` - tracks which user is being updated

New functions:
- `fetchUsers(page)` - fetches users from the API with pagination
- `handleUpdateUserRole()` - updates a user's role via API

### Backend Integration
Uses existing API endpoints:
- `GET /api/admin/users` - fetches users with optional filtering and pagination
- `PUT /api/admin/users/:id/role` - updates a user's role

These endpoints already exist in `server/src/routes/admin.ts` and handle role validation and audit logging.

## Usage

1. **Access Users Tab**: Navigate to the Admin Portal and click the "Users" tab
2. **View Users**: See all users displayed in the database table
3. **Filter by Role**: Use the role filter dropdown to show only users with a specific role
4. **Manage User Role**: Click the "Manage" button on any user row
5. **Assign New Role**: Select a new role from the dropdown and click "Update Role"
6. **Pagination**: Use Previous/Next buttons to navigate through pages

## Security
- Only accessible to users with `main_admin` or `owner` roles
- Backend validates user permissions before allowing role updates
- Changes are logged in the AuditLog model for compliance

## Response Format

When updating a user role, the API returns:
```json
{
  "id": "user_id",
  "username": "username",
  "role": "new_role"
}
```

## Future Enhancements
- Search functionality by username or email
- Bulk role assignment
- Role change history
- Delete/deactivate users
- Custom role creation
