# Discord Developer Portal Setup

## Step-by-Step Guide to Configure Discord OAuth

### 1. Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it: "Fakepixel Admin Portal"
4. Accept Terms of Service
5. Click "Create"

### 2. Get Your Credentials

1. Go to "OAuth2" → "General"
2. Copy **Client ID** - you'll need this for frontend `.env`
3. Copy **Client Secret** - you'll need this for backend `.env`
4. Keep these secret! Never commit to Git

### 3. Set Redirect URLs

1. In OAuth2 → General → Redirects
2. Click "Add Redirect"
3. Add: `http://localhost:8080/api/auth/discord/callback`
4. Click Save
5. For production, add your production URL too

### 4. Set Permissions/Scopes

1. In OAuth2 → URL Generator
2. Select Scopes:
   - ✓ identify
   - ✓ email
3. No special permissions needed for this app
4. Copy the generated URL to test (optional)

### 5. Update Environment Files

**Frontend** (`.env`):
```
VITE_DISCORD_CLIENT_ID=<your_client_id_here>
VITE_API_BASE_URL=http://localhost:3000
```

**Backend** (`.env`):
```
DISCORD_CLIENT_ID=<your_client_id_here>
DISCORD_CLIENT_SECRET=<your_client_secret_here>
DISCORD_CALLBACK_URL=http://localhost:8080/api/auth/discord/callback
```

## How OAuth Flow Works

```
1. User clicks "Join with Discord"
         ↓
2. Frontend sends to Discord authorization URL
         ↓
3. User logs in & grants permissions on Discord
         ↓
4. Discord redirects to callback URL with authorization code
         ↓
5. Backend exchanges code for access token
         ↓
6. Backend gets user profile from Discord
         ↓
7. Backend creates/updates user in MongoDB
         ↓
8. Backend creates JWT token
         ↓
9. User is logged in to the application
```

## Scopes Explained

- **identify** - Get user ID, username, avatar, discriminator
- **email** - Get user's email address
- **guilds** - Get list of servers user is in (not required for basic auth)

## Testing OAuth Locally

1. Start backend: `cd server && bun run dev`
2. Start frontend: `bun run dev`
3. Visit `http://localhost:8080`
4. Click "Join with Discord"
5. You should be redirected to Discord login
6. After login, you'll be redirected back to the app
7. Check if you can see your profile

## Troubleshooting

### "Invalid OAuth2 redirect_uri"
- Check the Redirect URL matches exactly in Discord portal
- Make sure you're using correct Client ID
- Clear browser cache and try again

### "Unauthorized" Error
- Verify Client Secret is correct in backend `.env`
- Check DISCORD_CALLBACK_URL matches in Discord portal
- Ensure backend is running

### User Not Getting Created
- Check MongoDB connection is working
- Look at backend console for errors
- Verify MONGODB_URI in backend `.env`

### "Missing Scope" Error
- Make sure `identify` and `email` scopes are selected
- Update the authorization request if you changed scopes
- Users may need to re-authorize

## Important Notes

- Never expose your Client Secret publicly
- Don't commit `.env` files to Git
- Use `.env.example` as template
- For production, use HTTPS URLs
- Update redirect URLs for production domain

## Example Discord Auth URL (Frontend)

```javascript
const clientID = "YOUR_CLIENT_ID";
const redirectURL = encodeURIComponent("http://localhost:8080/api/auth/discord/callback");
const scope = encodeURIComponent("identify email");
const authURL = `https://discord.com/api/oauth2/authorize?client_id=${clientID}&redirect_uri=${redirectURL}&response_type=code&scope=${scope}`;
```

This is the URL that users are redirected to when clicking "Join with Discord"

## Discord API Documentation

- [OAuth2 Documentation](https://discord.com/developers/docs/topics/oauth2)
- [User Object](https://discord.com/developers/docs/resources/user#user-object)
- [Rate Limiting](https://discord.com/developers/docs/topics/rate-limits)

## Next Steps

1. ✓ Create application in Developer Portal
2. ✓ Copy Client ID and Secret
3. ✓ Set redirect URL
4. ✓ Update `.env` files
5. Start both frontend and backend
6. Test the login flow
7. Go to `/admin` (if you're set as main_admin in MongoDB)
