# Quick Reference Commands

## Initial Setup (First Time Only)

### 1. Discord Setup
```bash
# Go to https://discord.com/developers/applications
# Create new app
# Copy Client ID and Client Secret
```

### 2. Create Environment Files

**Frontend:**
```bash
cd /home/ehtan/fakepixel-apply-portal
cp .env.example .env
# Edit .env and add:
# VITE_DISCORD_CLIENT_ID=your_client_id
# VITE_API_BASE_URL=http://localhost:3000
```

**Backend:**
```bash
cd /home/ehtan/fakepixel-apply-portal/server
cp .env.example .env
# Edit .env and add all required variables
```

### 3. Install Dependencies

```bash
# Frontend
cd /home/ehtan/fakepixel-apply-portal
bun install

# Backend
cd /home/ehtan/fakepixel-apply-portal/server
bun install
```

### 4. Start MongoDB
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

## Daily Development Commands

### Terminal 1 - Frontend
```bash
cd /home/ehtan/fakepixel-apply-portal
bun run dev
# Runs on http://localhost:8080
```

### Terminal 2 - Backend
```bash
cd /home/ehtan/fakepixel-apply-portal/server
bun run dev
# Runs on http://localhost:3000
```

### Terminal 3 - MongoDB (if local)
```bash
mongod
# Runs on localhost:27017
```

## First User Setup

### Promote First User to Main Admin

```bash
# Open MongoDB shell
mongosh

# Connect to database
use fakepixel

# Find your user (after you log in with Discord)
db.users.findOne({ username: "your_discord_username" })

# Promote to main_admin
db.users.updateOne(
  { username: "your_discord_username" },
  { $set: { role: "main_admin" } }
)

# Verify
db.users.findOne({ username: "your_discord_username" })
```

## Common MongoDB Commands

### View Users
```bash
mongosh
use fakepixel
db.users.find().pretty()
```

### View Applications
```bash
db.applications.find().pretty()
```

### View Pending Applications
```bash
db.applications.find({ status: "pending" }).pretty()
```

### View Audit Logs
```bash
db.auditlogs.find().sort({ timestamp: -1 }).pretty()
```

### Change User Role
```bash
db.users.updateOne(
  { username: "username" },
  { $set: { role: "admin" } }
)
```

### Delete User
```bash
db.users.deleteOne({ username: "username" })
```

### Count Documents
```bash
db.users.countDocuments()
db.applications.countDocuments()
db.auditlogs.countDocuments()
```

## Testing the Application

### Test User Flow
1. Visit http://localhost:8080
2. Click "Join with Discord"
3. Login with Discord
4. You'll be auto-created as `default` role
5. Go to http://localhost:8080/apply
6. Fill and submit application
7. Go to http://localhost:8080/profile
8. See your application status

### Test Admin Flow
1. Promote yourself to main_admin (see above)
2. Logout and login again
3. Click "Admin" button in header
4. Go to http://localhost:8080/admin
5. See all pending applications
6. Click "Review" on an application
7. Approve or decline with notes

## Build & Deployment Commands

### Build Frontend
```bash
cd /home/ehtan/fakepixel-apply-portal
bun run build
# Creates dist/ folder for deployment
```

### Build Backend
```bash
cd /home/ehtan/fakepixel-apply-portal/server
bun run build
# Creates dist/ folder for deployment
```

## Environment Variables Reference

### Frontend (.env)
```env
VITE_DISCORD_CLIENT_ID=your_discord_app_id
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/fakepixel
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_CALLBACK_URL=http://localhost:8080/api/auth/discord/callback
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:8080
SERVER_PORT=3000
```

## API Endpoints Reference

### Auth
```
GET  /api/auth/discord/callback
GET  /api/auth/me
POST /api/auth/logout
```

### Applications
```
POST /api/applications/submit
GET  /api/applications/my-applications
GET  /api/applications/all
PUT  /api/applications/:id/review
GET  /api/applications/:id
```

### Admin
```
GET /api/admin/users
PUT /api/admin/users/:id/role
GET /api/admin/dashboard/stats
GET /api/admin/audit-logs
```

## Troubleshooting Quick Fixes

### Clear Auth Token
```bash
# In browser console
localStorage.removeItem('authToken')
localStorage.removeItem('user')
```

### Check MongoDB Connection
```bash
mongosh "mongodb://localhost:27017/fakepixel"
# Should connect without errors
```

### Test Discord OAuth
```bash
# Visit this URL (replace with your Client ID)
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email
```

### Check Backend Health
```bash
curl http://localhost:3000/api/health
# Should return {"status":"ok"}
```

## Role Types Reference

```
OWNER              - Full access
MAIN_ADMIN         - Can manage applications and users
ADMIN              - Can view applications
SR_MODERATOR       - Moderation access
MODERATOR          - Moderation access
HELPER             - Helper role
JUNIOR_HELPER      - Staff role
DEFAULT            - Regular users (no admin access)
```

## File Locations Quick Reference

```
Frontend Source:          /home/ehtan/fakepixel-apply-portal/src
Backend Source:           /home/ehtan/fakepixel-apply-portal/server/src
Frontend Package:         /home/ehtan/fakepixel-apply-portal/package.json
Backend Package:          /home/ehtan/fakepixel-apply-portal/server/package.json
Frontend Config:          /home/ehtan/fakepixel-apply-portal/.env
Backend Config:           /home/ehtan/fakepixel-apply-portal/server/.env
```

## Links & Portals

- Frontend:           http://localhost:8080
- Admin Portal:       http://localhost:8080/admin
- User Profile:       http://localhost:8080/profile
- Backend API:        http://localhost:3000
- Backend Health:     http://localhost:3000/api/health
- Discord Dev Portal: https://discord.com/developers/applications
- MongoDB Compass:    mongodb://localhost:27017

## Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push origin main
```

## Performance Tips

1. **Clear Browser Cache**: If styles aren't updating
2. **Restart Backend**: If APIs aren't responding
3. **Check MongoDB**: `mongosh` to verify connection
4. **Check Ports**: Ensure 8080, 3000, 27017 are available

## Getting Help

Check documentation in order:
1. COMPLETED_SUMMARY.md - Overview
2. README_NEW.md - General info
3. SETUP.md - Setup guide
4. DISCORD_SETUP.md - Discord OAuth
5. MONGODB_SETUP.md - Database
6. IMPLEMENTATION.md - Architecture

## Final Checklist Before First Run

- [ ] Discord app created and credentials saved
- [ ] MongoDB installed or Atlas account created
- [ ] Frontend .env configured
- [ ] Backend .env configured
- [ ] Dependencies installed (`bun install`)
- [ ] MongoDB running
- [ ] Frontend running (`bun run dev`)
- [ ] Backend running (`cd server && bun run dev`)
- [ ] Can access http://localhost:8080
- [ ] Can login with Discord
- [ ] User created in MongoDB
- [ ] User promoted to main_admin
- [ ] Can access /admin portal

Ready to go! 🚀
