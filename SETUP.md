# Fakepixel Admin Portal - Setup Guide

This is a complete admin portal system with Discord authentication, role-based access control, and application management.

## Architecture Overview

```
Website → Application Submission → Admin Panel (Main Admin/Owner Only)
    ↓                                ↓
Users Login via Discord         Review & Approve/Decline
    ↓
View Profile + Applications
```

## Roles Hierarchy

1. **Owner** - Full system access
2. **Main Admin** - Can access admin panel, manage applications
3. **Admin** - Can view applications (cannot approve/decline)
4. **SR Moderator** - Can moderate but no access to applications
5. **Moderator** - Can moderate
6. **Helper** - Can help users
7. **Junior Helper** - New staff members
8. **Default** - Regular users (cannot access admin panel)

## Prerequisites

- Node.js v16+
- MongoDB (local or cloud)
- Discord Developer Portal account
- Bun or npm/yarn

## Setup Instructions

### 1. Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 → General
4. Add Redirect URL: `http://localhost:8080/api/auth/discord/callback`
5. Copy your **Client ID** and **Client Secret**

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd /home/ehtan/fakepixel-apply-portal

# Install dependencies
bun install
# or
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Discord Client ID
VITE_DISCORD_CLIENT_ID=your_client_id_from_discord
VITE_API_BASE_URL=http://localhost:3000

# Start frontend dev server
bun run dev
# or
npm run dev
```

Frontend will be available at: **http://localhost:8080**

### 3. Backend Setup

```bash
# Navigate to server directory
cd /home/ehtan/fakepixel-apply-portal/server

# Install dependencies
bun install
# or
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your configuration
MONGODB_URI=mongodb://localhost:27017/fakepixel
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://localhost:8080/api/auth/discord/callback
JWT_SECRET=generate_a_random_secret_key_here
FRONTEND_URL=http://localhost:8080
SERVER_PORT=3000

# Start backend server
bun run dev
# or
npm run dev
```

Server will be available at: **http://localhost:3000**

### 4. MongoDB Setup

#### Option A: Local MongoDB

```bash
# On Windows
mongod

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Update MONGODB_URI in `.env`

Example: `mongodb+srv://username:password@cluster.mongodb.net/fakepixel?retryWrites=true&w=majority`

## Features

### For Users

- **Discord Login** - One-click authentication via Discord
- **User Profile** - View your profile with Discord avatar
- **Applications** - Submit applications for different positions
  - Junior Helper (Staff)
  - Dungeon Carrier
  - Slayer Carrier
- **Application Status** - Track your applications in real-time
- **Dashboard** - See statistics about your submissions

### For Admins (Main Admin & Owner Only)

- **Admin Portal** - Secure access for admins only
- **Application Management** - View and review all submissions
- **Filtering** - Filter applications by status and position
- **Review System** - Approve or decline with notes
- **Dashboard** - View user statistics
- **Audit Logs** - Track all admin actions

## Workflow

1. User visits website
2. User clicks "Join with Discord"
3. User logs in via Discord
4. User fills out application form
5. Application is sent to MongoDB
6. Main Admin logs in to admin portal
7. Main Admin reviews application
8. Main Admin approves or declines with optional notes
9. User sees status in their profile

## Database Collections

### Users
```javascript
{
  discordId: String,
  username: String,
  email: String,
  avatar: String,
  role: String, // enum: default, junior_helper, helper, moderator, sr_moderator, admin, main_admin, owner
  joinedAt: Date,
  updatedAt: Date
}
```

### Applications
```javascript
{
  userId: ObjectId,
  position: String, // enum: junior-helper, dungeon-carrier, slayer-carrier
  status: String, // enum: pending, approved, declined
  formData: Object, // form responses
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId,
  reviewNotes: String
}
```

### Audit Logs
```javascript
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

## API Endpoints

### Authentication
- `GET /api/auth/discord/callback` - Discord OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Applications
- `POST /api/applications/submit` - Submit application
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/all` - Get all applications (admin only)
- `PUT /api/applications/:id/review` - Review application (admin only)
- `GET /api/applications/:id` - Get application details

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `GET /api/admin/dashboard/stats` - Get dashboard stats (admin only)
- `GET /api/admin/audit-logs` - Get audit logs (admin only)

## Setting Admin Roles

To set a user as Main Admin or Owner, you'll need to update their role in MongoDB:

```javascript
// Connect to MongoDB
use fakepixel
db.users.updateOne(
  { discordId: "user_discord_id" },
  { $set: { role: "main_admin" } }
)
```

Or use the API (requires authentication as admin):

```bash
curl -X PUT http://localhost:3000/api/admin/users/user_id/role \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"role": "main_admin"}'
```

## Troubleshooting

### Discord OAuth Not Working
- Check if redirect URL matches in Discord Developer Portal
- Verify Client ID and Client Secret are correct
- Clear browser cookies and try again

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access if using MongoDB Atlas

### Admin Panel Not Accessible
- Check if your role is `main_admin` or `owner` in MongoDB
- Clear browser storage and re-login
- Check browser console for errors

### Forms Not Submitting
- Check if JWT token is valid
- Verify API endpoint URLs are correct
- Check Network tab in browser DevTools

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
bun run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables
# Push code to deployment platform
```

## Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Set CORS properly for production domain
- [ ] Rate limit API endpoints
- [ ] Validate all form inputs
- [ ] Use environment variables for secrets
- [ ] Enable audit logging

## Support

For issues or questions, check the project structure and API documentation above.
