# Tixaro Event Ticketing System - Next.js

## 🚀 Quick Start

### **1. Install Dependencies:**
```bash
cd UI
npm install
```

### **2. Start Development Server:**
```bash
npm run dev
```

The app will run on `http://localhost:3000`

### **3. Build for Production:**
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
UI/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts (Auth)
│   ├── services/         # API service layer
│   └── landing/          # Landing page component
├── next.config.js        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

---

## 🔗 Routes

- `/` - Landing page
- `/login` - User/Admin login
- `/register` - User registration
- `/events` - Browse events
- `/events/[id]` - Event details
- `/events/[id]/purchase` - Purchase tickets
- `/events/[id]/payment` - Payment processing
- `/dashboard` - User dashboard (my tickets)
- `/admin/dashboard` - Admin dashboard
- `/admin/events/create` - Create event (admin)
- `/admin/venues` - Manage venues (admin)
- `/admin/categories` - Manage categories (admin)
- `/settings` - User/Admin settings

---

## 🔧 Configuration

### **API Base URL**
Update in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
```

### **CORS Setup**
Ensure Laravel backend allows requests from:
- `http://localhost:3000` (Next.js dev server)

---

## 📦 Key Dependencies

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Sonner** - Toast notifications
- **Recharts** - Charts and graphs
- **Lucide React** - Icons

---

## ✅ Features

- ✅ User authentication (login/register)
- ✅ Admin authentication
- ✅ Event browsing and search
- ✅ Ticket purchase flow
- ✅ Payment processing
- ✅ User ticket management
- ✅ Admin dashboard with statistics
- ✅ Event management (CRUD)
- ✅ Venue management (CRUD)
- ✅ Category management (CRUD)
- ✅ User/Admin settings

---

## 🎨 Design

- **Theme:** Dark mode with neon blue accents
- **Colors:** Primary #0ea5e9 (neon blue)
- **Background:** #0a0a0f (dark)
- **Responsive:** Mobile-first design

---

## 🔐 Authentication

- Uses Laravel Sanctum tokens
- Tokens stored in localStorage
- Auto-refresh on app load
- Protected routes with auth checks

---

## 📝 Notes

- All UI components preserved exactly as designed
- All backend API integrations working
- File-based routing (Next.js App Router)
- Client components marked with `'use client'`

---

## 🐛 Troubleshooting

### **Port Already in Use:**
```bash
# Use different port
npm run dev -- -p 3001
```

### **CORS Errors:**
- Ensure Laravel backend allows `http://localhost:3000`
- Check `config/cors.php` in Laravel

### **Module Not Found:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

---

## 📚 Documentation

- See `NEXTJS_MIGRATION_GUIDE.md` for migration details
- See `UI_BACKEND_MAPPING.md` for API mapping
- See `INTEGRATION_SUMMARY.md` for integration details

