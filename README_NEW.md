# Fakepixel Admin Portal & Application System

A complete admin portal system with Discord OAuth authentication, role-based access control, and application management workflow - similar to Xenforo but tailored for gaming communities.

## Features

### 🔐 Authentication & Authorization
- **Discord OAuth2 Login** - One-click authentication via Discord
- **7-Level Role System**
  - Owner
  - Main Admin (only role that can access admin portal)
  - Admin
  - SR Moderator
  - Moderator
  - Helper
  - Junior Helper
  - Default (regular users)
- **JWT Token-Based** - Secure API authentication
- **Audit Logging** - Track all admin actions

### 👤 User Features
- **Discord Profile Integration** - Automatic profile with avatar and email
- **Application Submission** - Apply for staff and carrier positions
- **Application Tracking** - View status of submitted applications
- **Profile Dashboard** - See all applications and statistics

### 🛡️ Admin Features (Main Admin/Owner Only)
- **Protected Admin Portal** - Restricted to authorized roles
- **Application Management** - Review and manage all submissions
- **Advanced Filtering** - Filter by status and position
- **Approval/Decline System** - With optional review notes
- **User Management** - View and manage user roles
- **Dashboard Analytics** - View user statistics
- **Audit Logs** - Complete action history

### 📋 Application Positions
- Junior Helper (Staff)
- Dungeon Carrier
- Slayer Carrier

## Application Workflow

```
User →  Login with Discord  →  Fill Application  →  Submit  →  MongoDB
                                                                    ↓
Admin Portal ← Main Admin Reviews ← Approve/Decline ← Application Queue
```

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Lightning fast build tool
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Beautiful React components
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching

### Backend
- **Node.js** with Express.js
- **MongoDB** - NoSQL database
- **Passport.js** - Authentication middleware
- **JWT** - Token-based auth
- **TypeScript** - Type safety

## Quick Start

### Prerequisites
- Node.js 16+
- Bun or npm/yarn
- MongoDB (local or Atlas cloud)
- Discord Developer account

### 1. Discord Setup (5 minutes)

Follow [DISCORD_SETUP.md](./DISCORD_SETUP.md) to:
- Create Discord application
- Get Client ID and Secret
- Set redirect URLs

### 2. Database Setup (5 minutes)

Follow [MONGODB_SETUP.md](./MONGODB_SETUP.md) to:
- Install MongoDB locally OR create Atlas account
- Get connection string
- Verify connection

### 3. Frontend Setup (5 minutes)

```bash
# Install dependencies
bun install
# or npm install

# Create environment file
cp .env.example .env

# Add your Discord Client ID
echo "VITE_DISCORD_CLIENT_ID=your_client_id_here" >> .env
echo "VITE_API_BASE_URL=http://localhost:3000" >> .env

# Start development server
bun run dev
# or npm run dev
```

**Frontend running at:** http://localhost:8080

### 4. Backend Setup (5 minutes)

```bash
# Navigate to server directory
cd server

# Install dependencies
bun install
# or npm install

# Create environment file
cp .env.example .env

# Update .env with your credentials:
# MONGODB_URI, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, JWT_SECRET

# Start development server
bun run dev
# or npm run dev
```

**Backend running at:** http://localhost:3000

### 5. Set First Admin User

After logging in with Discord:

```bash
# Connect to MongoDB
mongosh

# Use the database
use fakepixel

# Find your user
db.users.findOne({ username: "your_discord_username" })

# Promote to main_admin
db.users.updateOne(
  { username: "your_discord_username" },
  { $set: { role: "main_admin" } }
)
```

Now visit http://localhost:8080/admin to access the admin portal!

## Project Structure

```
/home/ehtan/fakepixel-apply-portal/
├── src/                          # Frontend React app
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication state
│   ├── pages/
│   │   ├── Index.tsx             # Home with Discord login
│   │   ├── Profile.tsx           # User profile
│   │   ├── AdminPortal.tsx       # Admin dashboard
│   │   └── Apply.tsx             # Application forms
│   ├── components/
│   │   ├── Layout/Header.tsx     # Navigation with auth
│   │   └── ApplicationForm/      # Form components
│   └── App.tsx                   # Main app routing
│
├── server/                       # Backend Express app
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.ts           # User schema
│   │   │   ├── Application.ts    # Application schema
│   │   │   └── AuditLog.ts       # Audit logging
│   │   ├── config/
│   │   │   ├── passport.ts       # Discord OAuth
│   │   │   └── config.ts         # Env config
│   │   ├── middleware/auth.ts    # JWT & role checks
│   │   ├── routes/
│   │   │   ├── auth.ts           # Auth endpoints
│   │   │   ├── applications.ts   # Application endpoints
│   │   │   └── admin.ts          # Admin endpoints
│   │   └── server.ts             # Express setup
│   └── package.json
│
├── SETUP.md                      # Detailed setup guide
├── IMPLEMENTATION.md             # Architecture documentation
├── DISCORD_SETUP.md              # Discord OAuth guide
├── MONGODB_SETUP.md              # Database guide
└── README.md                     # This file
```

## API Endpoints

### Authentication
```
POST   /api/auth/discord/callback   Discord OAuth redirect
GET    /api/auth/me                 Get current user
POST   /api/auth/logout             Logout user
```

### Applications
```
POST   /api/applications/submit            Submit application
GET    /api/applications/my-applications   Get user's applications
GET    /api/applications/all               Get all applications (admin)
PUT    /api/applications/:id/review        Review application (admin)
GET    /api/applications/:id               Get application details
```

### Admin
```
GET    /api/admin/users                    List all users (admin)
PUT    /api/admin/users/:id/role           Update user role (admin)
GET    /api/admin/dashboard/stats          Get statistics (admin)
GET    /api/admin/audit-logs               View audit logs (admin)
```

## Database Schema

### Users Collection
```javascript
{
  discordId: String,              // Discord user ID
  username: String,               // Discord username
  email: String,                  // Discord email
  avatar: String,                 // Discord avatar URL
  role: String,                   // User role
  joinedAt: Date,                 // Account creation date
  updatedAt: Date                 // Last update date
}
```

### Applications Collection
```javascript
{
  userId: ObjectId,               // Reference to user
  position: String,               // Position applied for
  status: String,                 // pending | approved | declined
  formData: Object,               // Form responses
  submittedAt: Date,              // Submission date
  reviewedAt: Date,               // Review date (if reviewed)
  reviewedBy: ObjectId,           // Admin who reviewed (if reviewed)
  reviewNotes: String             // Admin notes (if reviewed)
}
```

### Audit Logs Collection
```javascript
{
  action: String,                 // Action performed
  userId: ObjectId,               // User who performed action
  targetId: ObjectId,             // Target of action
  targetType: String,             // Type of target
  details: Object,                // Action details
  timestamp: Date,                // When action occurred
  ipAddress: String               // User's IP address
}
```

## Role Permissions

| Feature | Owner | Main Admin | Admin | Other Roles |
|---------|-------|-----------|-------|------------|
| Access Admin Portal | ✓ | ✓ | ✗ | ✗ |
| Review Applications | ✓ | ✓ | View Only | ✗ |
| Manage Users | ✓ | ✓ | ✗ | ✗ |
| View Audit Logs | ✓ | ✓ | ✗ | ✗ |
| Submit Applications | ✓ | ✓ | ✓ | ✓ |
| View Profile | ✓ | ✓ | ✓ | ✓ |

## Configuration

### Frontend Environment Variables
```env
VITE_DISCORD_CLIENT_ID=your_discord_app_id
VITE_API_BASE_URL=http://localhost:3000
```

### Backend Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/fakepixel
DISCORD_CLIENT_ID=your_discord_app_id
DISCORD_CLIENT_SECRET=your_discord_app_secret
DISCORD_CALLBACK_URL=http://localhost:8080/api/auth/discord/callback
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:8080
SERVER_PORT=3000
```

## Authentication Flow

1. **User clicks "Join with Discord"**
   - Frontend redirects to Discord OAuth URL

2. **User logs in with Discord**
   - Grants permissions (identify, email)

3. **Discord redirects back**
   - Backend receives authorization code

4. **Backend exchanges code for token**
   - Gets user profile from Discord API

5. **User created/updated in MongoDB**
   - Default role: `default`

6. **JWT token generated**
   - 7-day expiration

7. **User redirected to app**
   - Token stored in localStorage

8. **API requests include JWT**
   - Authorization: Bearer {token}

## Common Tasks

### Make Someone a Main Admin
```javascript
mongosh
use fakepixel
db.users.updateOne(
  { username: "their_discord_username" },
  { $set: { role: "main_admin" } }
)
```

### View All Applications Submitted
```javascript
db.applications.find()
```

### See Pending Applications
```javascript
db.applications.find({ status: "pending" })
```

### Check Audit Logs
```javascript
db.auditlogs.find().sort({ timestamp: -1 }).limit(10)
```

## Troubleshooting

**Discord login not working?**
- Check Client ID matches in Discord portal
- Verify redirect URL is exactly: `http://localhost:8080/api/auth/discord/callback`
- Clear browser cache and cookies

**Can't connect to MongoDB?**
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection
- Verify MONGODB_URI in backend `.env`
- Check network access if using Atlas

**Admin portal not accessible?**
- Verify your role is `main_admin` or `owner` in database
- Log out and log back in
- Check browser console for errors

**Applications not submitting?**
- Check backend is running on port 3000
- Verify JWT token is valid
- Check form validation errors

See [SETUP.md](./SETUP.md) for more detailed troubleshooting.

## Deployment

### Frontend (Vercel/Netlify)
```bash
bun run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables
# Push code to hosting platform
```

## Security Checklist

- [ ] Use strong JWT_SECRET (at least 32 characters)
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Use environment variables for secrets
- [ ] Never commit .env files
- [ ] Enable MongoDB authentication
- [ ] Set strong database passwords
- [ ] Rate limit API endpoints
- [ ] Validate all inputs
- [ ] Keep dependencies updated

## Performance Considerations

- JWT tokens cached in localStorage
- MongoDB indexes on userId and status
- Pagination on large datasets
- CORS enabled for frontend domain
- Efficient query patterns

## Support & Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Architecture details
- [DISCORD_SETUP.md](./DISCORD_SETUP.md) - Discord OAuth setup
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - Database setup

## Next Steps

1. ✓ Read this README
2. → Follow [DISCORD_SETUP.md](./DISCORD_SETUP.md)
3. → Follow [MONGODB_SETUP.md](./MONGODB_SETUP.md)
4. → Follow [SETUP.md](./SETUP.md)
5. → Test the application
6. → Customize for your needs
7. → Deploy to production

Happy coding! 🚀
