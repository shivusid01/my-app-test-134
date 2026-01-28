# 🚀 Quick Start Guide - Recipe Book App

## ⚡ Get Started in 2 Minutes

### Step 1: Start Backend Server
```bash
cd recipe-book-backend
npm install
npm run seed    # Optional: Load sample data
npm run dev     # Server runs on http://localhost:5001
```

### Step 2: Start Frontend App
```bash
cd my-app
npm install
npm start
# Scan QR code or press 's' to open in emulator
```

### Step 3: Login
```
Email: emily.johnson@example.com
Password: password123
```

---

## 📱 App Navigation

### Bottom Navigation Bar (5 Tabs)

| Tab | Icon | Features |
|-----|------|----------|
| **Home** | 🏠 | Featured recipes, categories, quick access |
| **Recipes** | 🍳 | Browse all, filter by cuisine, search |
| **Meal Plans** | 📅 | Create, view, manage meal plans |
| **Favorites** | ❤️ | Saved recipes, quick access |
| **Profile** | 👤 | User info, edit profile, **LOGOUT** ✅ |

---

## ✨ Key Features at a Glance

### 🏠 Home Tab
- See featured & recent recipes
- Click any recipe to view details
- Filter by cuisine
- Personalized greeting

### 🍳 Recipes Tab
- Browse all available recipes
- Filter by cuisine type
- Search by recipe name
- Tap to view full recipe

### 📅 Meal Plans Tab
- View your meal plans
- + button to create new
- Edit plan details
- Delete plans (with confirmation)

### ❤️ Favorites Tab
- All your saved recipes
- Remove from favorites
- Click to view details
- Empty state helpful messaging

### 👤 Profile Tab
**NEW FEATURES:**
- View profile (name, email, bio, location)
- See user stats (recipes, saves, reviews)
- ✏️ Edit profile button
- 🚪 **LOGOUT button with confirmation**
- Menu links (My Recipes, Settings, Help)

---

## 🎯 Common Actions

### View a Recipe
```
1. Tap any recipe card (Home/Recipes/Favorites tab)
2. Recipe detail page opens
3. Scroll to see:
   - Ingredients
   - Instructions
   - Creator info
   - Rating & reviews
4. Tap heart ❤️ to add to favorites
5. Tap back to return
```

### Save a Recipe
```
1. Open any recipe
2. Tap heart ❤️ button
3. Added to Favorites! ✅
4. View in Favorites tab anytime
```

### Create Meal Plan
```
1. Go to Meal Plans tab
2. Tap + button
3. Fill meal plan details:
   - Name
   - Start date
   - End date
   - Add recipes
4. Tap Save
5. View in list
```

### Update Profile
```
1. Go to Profile tab
2. Tap pencil ✏️ icon
3. Edit modal opens
4. Update:
   - First name
   - Last name
   - Bio
   - Location
5. Tap Save Changes
6. Profile updated ✅
```

### **Logout**
```
1. Go to Profile tab
2. Scroll to bottom
3. Tap RED "Logout" button
4. Confirmation dialog
5. Tap "Logout" to confirm
6. Redirected to Login page
7. All data cleared 🔐
```

---

## 📊 Sample Data

### Default Test User
```
Email: emily.johnson@example.com
Password: password123
Username: emilycooks
```

### Available Cuisines
- Italian
- Indian
- Mexican
- Thai
- Japanese
- French
- Greek
- Korean
- Russian
- Vietnamese
- Middle Eastern
- British
- American

### Sample Recipes (20 total)
1. Classic Margherita Pizza
2. Chicken Tikka Masala
3. Beef Tacos
4. Pad Thai
5. Miso Soup
6. French Croissants
... and 14 more!

---

## 🐛 Troubleshooting

### "Can't connect to API"
→ Make sure backend is running: `npm run dev` in backend folder

### "Recipe won't load"
→ Check network connection
→ Verify API is responding
→ Check backend console for errors

### "Logout not working"
→ Restart app: `expo start -c`
→ Clear data: Clear app cache

### "Login fails"
→ Check email/password
→ Default: emily.johnson@example.com / password123
→ Backend server must be running

---

## 🎨 UI Features

### Colors
- 🔴 Red (#FF6B6B) - Primary actions
- 🩶 Gray (#8F9BB3) - Secondary text
- ⚪ White (#FFFFFF) - Backgrounds
- 🔵 Light blue (#F5F7FA) - Card backgrounds

### Interactions
- Pull to refresh ↻
- Smooth transitions
- Loading spinners
- Error messages
- Empty states

### Icons
- Ionicons from react-native-vector-icons
- Active/inactive variants
- Color-coded badges
- Animated interactions

---

## ✅ Verification Checklist

Before using, verify:
- [ ] Backend running on localhost:5001
- [ ] Frontend app starts without errors
- [ ] Can login with test user
- [ ] Home page shows recipes
- [ ] Can click and view recipe details
- [ ] Bottom navigation visible (5 tabs)
- [ ] Recipes tab filters work
- [ ] Can add/remove favorites
- [ ] Profile shows correct info
- [ ] **Logout button works and clears data**

---

## 🔧 API Configuration

If you need to change API URL, edit:
**`constants/config.js`**
```javascript
export const API_BASE_URL = 'http://localhost:5001/api';
```

---

## 📞 Need Help?

### For Backend Issues
- Check `recipe-book-backend/.env`
- MongoDB must be running
- Check port 5001 is available

### For Frontend Issues
- Check `app/_layout.jsx` for navigation
- Verify `constants/config.js` API URL
- Check console for errors: `expo start`

### For Login Issues
- Use: emily.johnson@example.com
- Password: password123
- Backend server must be running

---

## 🎉 You're Ready!

Your Recipe Book app is fully set up and ready to use!

**Enjoy cooking!** 🍳
