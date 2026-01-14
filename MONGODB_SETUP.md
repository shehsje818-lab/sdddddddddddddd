# MongoDB Setup Guide

## Option 1: Local MongoDB Installation

### Windows

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" setup
4. Accept defaults
5. Install MongoDB Compass (optional, but recommended)
6. MongoDB runs as a service automatically

**Start MongoDB:**
```bash
mongod
```

**Or use Services:**
- Press `Win+R`, type `services.msc`
- Find "MongoDB Server"
- Right-click and select "Start"

### Mac

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start service
brew services start mongodb-community

# Stop service
brew services stop mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Linux (Ubuntu/Debian)

```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

### Verify Installation

```bash
# Connect to MongoDB
mongosh
# or for older versions
mongo

# Should see MongoDB shell prompt
>
```

## Option 2: MongoDB Atlas (Cloud - Recommended for Production)

### Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new project
4. Create new cluster (select FREE tier)
5. Choose region closest to you
6. Click "Create Cluster" (wait 5-10 minutes)

### Create Database User

1. Click "Database Access"
2. Click "Add New User"
3. Choose "Password" authentication
4. Set username and password
5. Set role to "Built-in Role: Atlas Admin"
6. Click "Add User"

### Get Connection String

1. Click "Databases"
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy connection string
5. Replace `<password>` with your password
6. Replace `<username>` with your username

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/fakepixel?retryWrites=true&w=majority
```

### Network Access

1. Click "Security" → "Network Access"
2. Click "Add IP Address"
3. For development: Select "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses

## Configuration

### Update Backend .env

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/fakepixel
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fakepixel?retryWrites=true&w=majority
```

## Create Database and Collections

Collections are created automatically when you:
1. Create first user record
2. Create first application
3. Create first audit log

Or manually create them:

```javascript
// Connect to MongoDB
mongosh
use fakepixel

// Create collections
db.createCollection("users")
db.createCollection("applications")
db.createCollection("auditlogs")

// Create indexes for better performance
db.users.createIndex({ discordId: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.applications.createIndex({ userId: 1 })
db.applications.createIndex({ status: 1 })
db.auditlogs.createIndex({ timestamp: 1 })
```

## Verify Connection

After starting MongoDB and your backend:

```bash
# Backend logs should show:
# Connected to MongoDB
```

Or test manually:

```javascript
// In mongosh
mongosh "mongodb://localhost:27017/fakepixel"
show collections
db.users.find()
```

## Setting Up First Admin User

Once someone logs in via Discord, they'll be in the `users` collection.

To make them a main_admin:

```javascript
mongosh
use fakepixel

// Find your user (check what your Discord ID is)
db.users.findOne({ username: "your_discord_username" })

// Update role to main_admin
db.users.updateOne(
  { username: "your_discord_username" },
  { $set: { role: "main_admin" } }
)

// Verify the update
db.users.findOne({ username: "your_discord_username" })
```

## Backup MongoDB Data

### Local MongoDB

```bash
# Backup
mongodump --out /path/to/backup/

# Restore
mongorestore /path/to/backup/
```

### MongoDB Atlas

1. Click "Database" → "Snapshots"
2. Click "Take Snapshot Now"
3. Click "Restore" when needed
4. Or use automated backups (MongoDB handles this)

## MongoDB Shell Commands

```javascript
// Show all databases
show dbs

// Switch to database
use fakepixel

// Show all collections
show collections

// View all users
db.users.find()

// View all applications
db.applications.find()

// Find specific user
db.users.findOne({ discordId: "123456789" })

// Count documents
db.applications.countDocuments()

// Delete a user
db.users.deleteOne({ discordId: "123456789" })

// Update a user
db.users.updateOne(
  { discordId: "123456789" },
  { $set: { role: "admin" } }
)
```

## Performance Tips

1. **Indexes**: Create indexes for frequently queried fields
2. **Connection Pool**: MongoDB automatically handles this
3. **Pagination**: Use `limit()` and `skip()` for large datasets
4. **Caching**: Consider caching user roles
5. **Monitoring**: MongoDB Atlas provides free monitoring

## Troubleshooting

### Connection Refused
- Is MongoDB running? Try `mongod` or `brew services start mongodb-community`
- Check port 27017 is available
- Check MONGODB_URI in `.env` is correct

### Authentication Failed
- Verify username and password in connection string
- Check network access in MongoDB Atlas
- Ensure user has correct database permissions

### Database Not Found
- MongoDB creates databases automatically on first write
- If using Atlas, ensure cluster is running
- Check database name in connection string

### Slow Queries
- Add indexes to frequently queried fields
- Check MongoDB Atlas monitoring tab
- Optimize query patterns

### Out of Memory
- Local: Increase available RAM
- Atlas: Upgrade to paid tier
- Optimize data structure

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Shell Documentation](https://docs.mongodb.com/mongodb-shell/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-checklist/)

## Next Steps

1. Choose local or cloud MongoDB
2. Install/create MongoDB instance
3. Get connection string
4. Update backend `.env` with MongoDB URI
5. Start backend server
6. Verify connection in logs
7. Create first user account
8. Promote user to main_admin
9. Access admin portal!
