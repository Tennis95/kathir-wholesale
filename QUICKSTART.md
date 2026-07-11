# KATHIR LTD - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Set Up MongoDB
```bash
# Option A: MongoDB Atlas (Free Cloud)
# Go to https://www.mongodb.com/cloud/atlas
# Create free account → Create cluster → Get connection string

# Option B: Local MongoDB
# Download from https://www.mongodb.com/try/download/community
# Run: mongod
```

### Step 2: Configure Environment
```bash
cd kathir-wholesale

# Create .env.local file
echo 'MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kathir' > .env.local
```

### Step 3: Install & Run
```bash
npm install
npm run dev
```

Visit: **http://localhost:3000** 🎉

---

## 📋 What You Get

### Homepage (`/`)
- Browse 6 sample products
- Filter by category (Rice, Spices, Flours, etc.)
- Search products
- Add to cart with one click
- Cart counts in header

### Checkout (`/checkout`)
- 2-column layout
- Left: Delivery form with validation
- Right: Order summary with item count
- Submit order → Saved to MongoDB

### Products Displayed
1. Basmati Rice Premium (50kg) - £25.99
2. Turmeric Powder (1kg) - £8.50
3. Chick Pea Flour (5kg) - £12.00
4. Coconut Oil (2L) - £18.75
5. Frozen Samosa (2kg) - £15.50
6. Ginger Biscuits (500g) - £6.99

---

## 🎨 KATHIR Brand Colors

**Primary Brown**: `#8B5A3C`
**Dark Brown**: `#6B3E24`
**Light Brown**: `#A67C52`
**Sky Blue**: `#87CEEB`
**Light Sky**: `#E0F6FF`

Used throughout buttons, headers, forms, and backgrounds.

---

## 📁 Project Files Overview

```
app/
├── page.tsx              → Home/Catalogue (Products Table)
├── checkout/page.tsx     → Checkout Form + Order Summary
├── api/orders/route.ts   → Order API (Save to MongoDB)
├── layout.tsx            → Header + Footer + Navigation
└── globals.css           → Tailwind Styles + KATHIR Colors

types/
└── index.ts              → TypeScript Interfaces

tailwind.config.ts        → KATHIR Color Configuration
.env.example              → Environment Variables Template
SETUP.md                  → Detailed Setup Instructions
QUICKSTART.md             → This File
```

---

## ✅ Workflow Test

1. **Go to Home** (http://localhost:3000)
2. **Add Products** - Click "🛒 Add" button
3. **Check Cart Badge** - Shows item count in header
4. **Go to Checkout** - Click "🛒 Cart" button
5. **Fill Form**:
   - Shop Name: "Test Grocers"
   - Contact: "John Doe"
   - Phone: "07700 123456"
   - Email: "test@email.com"
   - Address: "123 Main St, London"
   - Postcode: "SW1A 1AA"
   - Date: Pick any date
6. **Submit** - Order saved to MongoDB

---

## 🔧 Add Your Own Products

Edit `app/page.tsx` - Update `SAMPLE_PRODUCTS`:

```typescript
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Your Product Name',
    category: 'Your Category',
    size: '50kg',
    price: 25.99,
    stock: 100,
    inStock: true,
  },
  // Add more...
];
```

---

## 📧 Optional: Set Up Email Notifications

1. Get Gmail App Password (or use SendGrid)
2. Add to `.env.local`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=orders@kathir.co.uk
```

3. Uncomment email sending in `app/api/orders/route.ts`

---

## 🌐 Deploy to Production

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
# Follow prompts, set MONGODB_URI in dashboard
```

### DigitalOcean
1. Create App Platform
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### AWS / Self-Hosted
- Build: `npm run build`
- Start: `npm run start`
- Port: 3000

---

## 🐛 Troubleshooting

**MongoDB not connecting?**
- Check connection string in `.env.local`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Try local MongoDB: `mongodb://localhost:27017`

**Cart showing 0 items?**
- Clear localStorage: DevTools → Application → Storage → Clear
- Refresh page

**Styles look wrong?**
- Clear browser cache (Ctrl+Shift+Del)
- Restart dev server: `npm run dev`

---

## 📞 Support
- **Email**: support@kathir.co.uk
- **Reg No**: 16001575
- **Tagline**: Sowing * Reaping and Giving the Best

---

## Next Steps

✅ Database configured?
✅ Environment variables set?
✅ App running locally?
✅ Ready to add your products?
✅ Ready to deploy?

**Let's go! 🚀**
