# Staff Panel - API Response Example

## Backend API Endpoint
**GET** `/api/admin/users`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Example Response

```json
{
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "founder",
      "email": "founder@fakepixel.com",
      "avatar": "https://cdn.discordapp.com/avatars/123456789/avatar_hash.png",
      "role": "owner",
      "color": "#FF0000",
      "joinedAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2025-01-17T14:22:33Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "username": "admin_user",
      "email": "admin@fakepixel.com",
      "avatar": "https://cdn.discordapp.com/avatars/234567890/avatar_hash.png",
      "role": "main_admin",
      "color": "#FFA500",
      "joinedAt": "2024-02-10T08:15:00Z",
      "updatedAt": "2025-01-16T09:45:22Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "username": "moderator1",
      "email": "mod1@fakepixel.com",
      "avatar": "https://cdn.discordapp.com/avatars/345678901/avatar_hash.png",
      "role": "moderator",
      "color": "#00FF00",
      "joinedAt": "2024-03-20T12:00:00Z",
      "updatedAt": "2025-01-17T11:20:15Z"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "username": "helper_team",
      "email": "helper@fakepixel.com",
      "avatar": "https://cdn.discordapp.com/avatars/456789012/avatar_hash.png",
      "role": "helper",
      "color": "#0000FF",
      "joinedAt": "2024-05-05T14:30:00Z",
      "updatedAt": "2025-01-15T16:45:30Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "username": "beta_tester",
      "email": "beta@fakepixel.com",
      "avatar": "https://cdn.discordapp.com/avatars/567890123/avatar_hash.png",
      "role": "beta_tester",
      "color": "#9900FF",
      "joinedAt": "2024-06-12T09:20:00Z",
      "updatedAt": "2025-01-14T13:15:45Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 50
  }
}
```

## Role Values (Expected by Component)

These are the role values the component supports. Use these exact strings in the backend:

- `owner` → "Owner"
- `main_admin` → "Main Admin"
- `admin` → "Admin"
- `deputy` → "Deputy"
- `sr_moderator` → "Sr. Moderator"
- `moderator` → "Moderator"
- `helper` → "Helper"
- `jr_helper` → "Jr. Helper"
- `beta_tester` → "Beta Tester"

## Field Requirements

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | string | ✅ | Unique identifier from MongoDB |
| `username` | string | ✅ | Staff member's username |
| `email` | string | ❌ | Email (not displayed in panel) |
| `avatar` | string | ✅ | Full URL to avatar image |
| `role` | string | ✅ | One of the role values above |
| `color` | string | ✅ | Hex color code (e.g., "#FF0000") |
| `joinedAt` | string | ❌ | ISO date string |
| `updatedAt` | string | ❌ | ISO date string |

## Color Code Examples

Common role colors used in Discord:
- **Owner**: `#FF0000` (Red)
- **Main Admin**: `#FFA500` (Orange)
- **Admin**: `#FFFF00` (Yellow)
- **Deputy**: `#00FF00` (Green)
- **Sr. Moderator**: `#00FFFF` (Cyan)
- **Moderator**: `#0000FF` (Blue)
- **Helper**: `#FF00FF` (Magenta)
- **Jr. Helper**: `#808080` (Gray)
- **Beta Tester**: `#9900FF` (Purple)

## Sorting/Grouping Behavior

The component automatically:
1. **Sorts** staff members by role hierarchy
2. **Groups** them by role
3. **Displays** each group with a header badge

Display order will be:
```
Owner
  - founder

Main Admin
  - admin_user

Moderator
  - moderator1

Helper
  - helper_team

Beta Tester
  - beta_tester
```

## Search/Filter Functionality

Users can search by:
- **Username** (e.g., "admin" matches "admin_user")
- **Role name** (e.g., "owner" matches the Owner group)

Search is case-insensitive and real-time.

## Error Handling

The component handles:
- ❌ Missing authentication token → Shows "Authentication required"
- ❌ Failed API request → Shows error message with status
- ❌ No staff members → Shows "No staff members found"
- ⏳ Loading state → Shows spinner with "Loading staff..."

## Authentication

The backend must:
1. Accept `Authorization: Bearer <token>` header
2. Validate the token
3. Return 401 if token is invalid/expired
4. Return 200 with staff array if valid
