# Auth-Gated App Testing Playbook

## Step 1: Create Test User & Session

```bash
mongosh --eval "
use('jobbmatchning');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  first_name: 'Test',
  last_name: 'User',
  user_type: 'jobseeker',
  token: sessionToken,
  created_at: new Date().toISOString()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API

```bash
# Get API URL
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

# Test email registration
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.se","password":"test123","first_name":"Test","last_name":"User","user_type":"jobseeker"}'

# Test email login
curl -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.se","password":"test123"}'

# Test BankID init
curl -X POST "$API_URL/api/auth/bankid/init" \
  -H "Content-Type: application/json" \
  -d '{}'

# Test BankID collect (replace ORDER_REF with actual value)
curl -X POST "$API_URL/api/auth/bankid/collect?order_ref=ORDER_REF"

# Test auth/me endpoint
curl -X GET "$API_URL/api/auth/me?token=YOUR_TOKEN"
```

## Step 3: Browser Testing

```javascript
// For BankID testing
await page.goto("http://localhost:3000/login");
await page.click('button:has-text("Logga in med BankID")');
await page.click('button:has-text("Öppna BankID")');
await page.waitForURL('**/app');

// For Email registration
await page.goto("http://localhost:3000/login");
await page.click('button:has-text("Skapa konto")');
await page.fill('input[placeholder="Anna"]', 'Test');
await page.fill('input[placeholder="Svensson"]', 'User');
await page.fill('input[placeholder="din@email.se"]', 'test@example.com');
await page.fill('input[placeholder="Minst 6 tecken"]', 'password123');
await page.click('button:has-text("Skapa konto")');
await page.waitForURL('**/app');
```

## Checklist

- [ ] User registration works with email/password
- [ ] User login works with email/password
- [ ] Google OAuth redirects to auth.emergentagent.com
- [ ] Google OAuth callback processes session_id
- [ ] BankID init returns order_ref
- [ ] BankID collect returns user data and token
- [ ] User is redirected to /app after successful auth
- [ ] User data is stored in localStorage

## Success Indicators

✅ /api/auth/register creates new user
✅ /api/auth/login returns user data and token
✅ /api/auth/bankid/init returns order_ref
✅ /api/auth/bankid/collect returns user data
✅ Dashboard (/app) loads after authentication
