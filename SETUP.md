# KATHIR LTD - Wholesale Ordering Portal

## Project Overview
A modern wholesale ordering platform for KATHIR LTD - "Sowing * Reaping and Giving the Best"

### Features
- ✅ Product Catalogue with Categories & Search
- ✅ Shopping Cart System
- ✅ Checkout Form (Business Info, Contact, Delivery Details)
- ✅ Order Management (MongoDB Database)
- ✅ Automatic Email Notifications
- ✅ Responsive Design (KATHIR Brand Colors: Brown & Light Blue)

---

## Tech Stack

**Frontend**: Next.js 14+ with React 19
**Backend**: Next.js API Routes
**Database**: MongoDB
**Styling**: Tailwind CSS
**Hosting**: Vercel, AWS, DigitalOcean, or Self-Hosted

---

## Installation & Setup

### 1. Clone/Navigate to Project
```bash
cd kathir-wholesale
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Update `.env.local` with your MongoDB connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

### 4. Set Up MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Add it to `.env.local`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally and run
mongod
```

Then use: `MONGODB_URI=mongodb://localhost:27017`

---

## Running the Project

### Development Mode
```bash
npm run dev
```
Visit: http://localhost:3000

### Production Build
```bash
npm run build
npm run start
```

---

## Project Structure

```
kathir-wholesale/
├── app/
│   ├── page.tsx              # Home/Catalogue Page
│   ├── checkout/
│   │   └── page.tsx          # Checkout/Cart Page
│   ├── api/
│   │   └── orders/
│   │       └── route.ts      # Order API (POST/GET)
│   ├── layout.tsx            # Main Layout (Header/Footer)
│   └── globals.css           # Global Styles & KATHIR Colors
├── types/
│   └── index.ts              # TypeScript Types
├── tailwind.config.ts        # Tailwind Config with KATHIR Colors
├── package.json
└── .env.example              # Environment Variables Template
```

---

## Features Explained

### 1. **Catalogue Page** (`/`)
- Browse all products by category
- Search products
- Filter by stock status (In Stock, Limited)
- Add products to cart with one click
- Products stored in cart via localStorage

### 2. **Checkout Page** (`/checkout`)
- **Left Side**: Delivery Form
  - Business Info (Shop Name, Contact Person)
  - Contact Details (Phone, Email)
  - Delivery Info (Address, Postcode, Date)
  - Special Notes
  - Submit Order Button

- **Right Side**: Order Summary
  - List of cart items
  - Total boxes count
  - Sticky positioned for easy reference

### 3. **Order API** (`/api/orders`)
- `POST /api/orders` - Submit new order
  - Saves order to MongoDB
  - Can send email notification
  - Returns order ID
  
- `GET /api/orders` - Fetch all orders (for admin)
  - Retrieves all submitted orders
  - Returns orders as JSON

---

## Database Schema (MongoDB)

### Orders Collection
```json
{
  "_id": "ObjectId",
  "shopName": "string",
  "contactPerson": "string",
  "phoneNumber": "string",
  "email": "string",
  "deliveryAddress": "string",
  "postcode": "string",
  "deliveryDate": "string (YYYY-MM-DD)",
  "notes": "string (optional)",
  "items": [
    {
      "product": {
        "id": "string",
        "name": "string",
        "category": "string",
        "size": "string",
        "price": "number",
        "stock": "number",
        "inStock": "boolean"
      },
      "quantity": "number"
    }
  ],
  "totalBoxes": "number",
  "status": "pending|confirmed|shipped|delivered",
  "createdAt": "Date"
}
```

---

## Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  kathir: {
    brown: '#8B5A3C',      // Primary brown
    darkbrown: '#6B3E24',  // Dark brown
    // ... add/modify colors
  },
}
```

### Add More Products
Edit `app/page.tsx` - Update `SAMPLE_PRODUCTS` array

### Configure Email Notifications
Set up email service (Gmail, SendGrid, etc.) and update:
- `.env.local` with email credentials
- `app/api/orders/route.ts` - uncomment email sending

---

## Deployment

### Deploy to Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Deploy to AWS
1. Set up AWS EC2 or Lambda
2. Configure environment variables
3. Deploy Node.js app

### Deploy to DigitalOcean
1. Create App Platform
2. Connect GitHub repo
3. Set environment variables
4. Deploy

---

## Environment Variables Reference

```
MONGODB_URI                  # MongoDB connection string
EMAIL_HOST                  # SMTP server (e.g., smtp.gmail.com)
EMAIL_PORT                  # SMTP port (e.g., 587)
EMAIL_USER                  # Email address
EMAIL_PASSWORD              # Email password/app password
EMAIL_FROM                  # Sender email
EMAIL_TO                    # Recipient email (orders go here)
NEXT_PUBLIC_APP_URL         # Your app URL
```

---

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB service is running
- Verify connection string in `.env.local`
- Ensure IP whitelist includes your machine (MongoDB Atlas)

### CSS/Colors Not Showing
- Run `npm run dev` and clear browser cache
- Check if Tailwind CSS is properly configured
- Verify `globals.css` imports

### Cart Not Persisting
- Browser localStorage is disabled?
- Check browser developer tools > Application > Storage

---

## Support
- Email: support@kathir.co.uk
- Reg No: 16001575

---

## Next Steps

1. ✅ Set up MongoDB
2. ✅ Configure `.env.local`
3. ✅ Run `npm run dev`
4. ✅ Test the workflow (add products → checkout → submit)
5. ✅ Deploy to your hosting platform
6. ✅ Set up email notifications (optional)

---

**Tagline**: Sowing * Reaping and Giving the Best
