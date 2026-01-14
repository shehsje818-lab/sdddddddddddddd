# Admin Portal Implementation Summary

## What Was Built

A complete admin portal system for the Fakepixel Giveaways application with Discord authentication, role-based access control, and application management workflow.

## Key Features

### 1. **Discord Authentication**
- Users login with Discord via OAuth2
- One-click authentication button on homepage
- User profile stored with avatar and email
- Automatic user creation on first login

### 2. **Role-Based Access Control**
Seven role levels:
- **Owner** - Full system access
- **Main Admin** - Can manage applications
- **Admin** - Can view applications
- **SR Moderator** - Moderation access
- **Moderator** - Moderation access
- **Helper** - Helper role
- **Junior Helper** - Staff role
- **Default** - Regular users (no admin access)

### 3. **User Profile Page**
- Discord-like profile design
- Shows user avatar, username, email
- Displays all applications submitted
- Shows application statuses (Pending, Approved, Declined)
- Statistics: total apps, approved, pending

### 4. **Admin Portal (Main Admin/Owner Only)**
- Protected route - only main_admin or owner can access
- Application management interface
- Filter applications by status and position
- Review applications with approval/decline
- Add optional review notes
- Dashboard with user statistics

### 5. **Application Workflow**
```
User fills form → Submits → Database → Admin reviews → Approved/Declined
```

### 6. **Application Forms**
- Junior Helper application
- Dungeon Carrier application
- Slayer Carrier application
- Form validation and error handling

## Project Structure

### Frontend (`/src`)
```
src/
├── context/
│   └── AuthContext.tsx           # Authentication state management
├── pages/
│   ├── Index.tsx                 # Home page with Discord login CTA
│   ├── Profile.tsx               # User profile with applications
│   ├── AdminPortal.tsx           # Admin dashboard (protected)
│   ├── Apply.tsx                 # Application form selector
│   └── ... other pages
├── components/
│   ├── Layout/
│   │   └── Header.tsx            # Updated with auth buttons
│   └── ApplicationForm/
│       ├── JuniorHelperForm.tsx  # Updated with backend integration
│       ├── SlayerCarrierForm.tsx # Updated with backend integration
│       └── DungeonCarrierForm.tsx # Updated with backend integration
└── App.tsx                       # Updated with new routes and auth context
```

### Backend (`/server/src`)
```
server/src/
├── models/
│   ├── User.ts                   # User schema with roles
│   ├── Application.ts            # Application schema
│   └── AuditLog.ts              # Audit logging for admin actions
├── config/
│   ├── passport.ts               # Discord OAuth strategy
│   └── config.ts                 # Environment config
├── middleware/
│   └── auth.ts                   # JWT validation and role checks
├── routes/
│   ├── auth.ts                   # Authentication endpoints
│   ├── applications.ts           # Application CRUD endpoints
│   └── admin.ts                  # Admin panel endpoints
└── server.ts                     # Express app setup
```

## API Endpoints

### Auth Endpoints
- `GET /api/auth/discord/callback` - Discord OAuth redirect
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Application Endpoints
- `POST /api/applications/submit` - Submit new application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/all` - Get all applications (admin)
- `PUT /api/applications/:id/review` - Review application (admin)
- `GET /api/applications/:id` - Get application details

### Admin Endpoints
- `GET /api/admin/users` - List all users (admin)
- `PUT /api/admin/users/:id/role` - Update user role (admin)
- `GET /api/admin/dashboard/stats` - Get statistics (admin)
- `GET /api/admin/audit-logs` - View audit logs (admin)

## Database Collections

### Users
```
{
  discordId: String (unique),
  username: String,
  email: String,
  avatar: String (Discord avatar URL),
  role: String (enum),
  joinedAt: Date,
  updatedAt: Date
}
```

### Applications
```
{
  userId: ObjectId (ref User),
  position: String,
  status: String (pending|approved|declined),
  formData: Object (form responses),
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId (ref User),
  reviewNotes: String
}
```

### Audit Logs
```
{
  action: String,
  userId: ObjectId,
  targetId: ObjectId,
  targetType: String,
  details: Object,
  timestamp: Date,
  ipAddress: String
}
```

## Setup Instructions

See `SETUP.md` for detailed setup instructions.

### Quick Start
```bash
# 1. Set up Discord OAuth in Discord Developer Portal
# 2. Frontend setup
cd /home/ehtan/fakepixel-apply-portal
bun install
cp .env.example .env
# Edit .env with Discord Client ID

# 3. Backend setup
cd server
bun install
cp .env.example .env
# Edit .env with database and Discord credentials

# 4. Run both in separate terminals
# Frontend
bun run dev

# Backend (in another terminal)
cd server
bun run dev
```

## Environment Variables

### Frontend (.env)
```
VITE_DISCORD_CLIENT_ID=your_client_id
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/fakepixel
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://localhost:8080/api/auth/discord/callback
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:8080
SERVER_PORT=3000
```

## Authentication Flow

1. User clicks "Login with Discord" button
2. Frontend redirects to Discord OAuth authorization URL
3. User grants permissions
4. Discord redirects to `/api/auth/discord/callback`
5. Backend validates code and creates/updates user in MongoDB
6. Backend generates JWT token
7. User is redirected to frontend with token and user data
8. Frontend stores token and user info in localStorage
9. Token is included in all API requests via Authorization header

## Role Assignment

Roles are assigned via:
1. Direct MongoDB update (admin/owner setup)
2. API endpoint (for admins to promote/demote users)

Default role for new users: `default`

To set a user as main_admin:
```javascript
db.users.updateOne(
  { discordId: "user_id" },
  { $set: { role: "main_admin" } }
)
```

## Security Features

- JWT token-based authentication
- Role-based middleware validation
- Audit logging for all admin actions
- Password-less authentication via Discord
- HttpOnly cookies recommended for production
- CORS configured for frontend domain

## Next Steps

1. Configure Discord Developer Portal
2. Set up MongoDB (local or Atlas)
3. Create .env files for both frontend and backend
4. Run `bun install` in both directories
5. Run dev servers
6. Set first user as main_admin
7. Start managing applications!

## File Changes Summary

### New Files Created
- `/server/` directory with complete backend
- `/src/context/AuthContext.tsx` - Auth state management
- `/src/pages/Profile.tsx` - User profile page
- `/src/pages/AdminPortal.tsx` - Admin dashboard
- `SETUP.md` - Detailed setup guide
- `.env.example` - Environment variable template

### Modified Files
- `src/App.tsx` - Added auth context and new routes
- `src/pages/Index.tsx` - Added Discord login button
- `src/pages/Apply.tsx` - Integrated backend submission
- `src/components/Layout/Header.tsx` - Added auth UI
- `src/components/ApplicationForm/*.tsx` - Added onSubmit callbacks

## Important Notes

- The application is protected: only main_admin and owner can access `/admin`
- Users default to `default` role on first login
- All admin actions are logged to AuditLog collection
- Application submissions validate required fields
- JWT tokens expire in 7 days (configurable)

## Support & Troubleshooting

See SETUP.md for detailed troubleshooting guide.

Common issues:
- Discord OAuth not working: Check redirect URL matches in Discord portal
- MongoDB connection failed: Ensure MongoDB is running
- Admin portal not accessible: Check role is main_admin/owner in database
