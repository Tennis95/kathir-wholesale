# KATHIR LTD - MongoDB API Documentation

## Database Connection
- **MongoDB Atlas**: Connected ✅
- **Connection String**: `mongodb+srv://tennisvijayaram_db_user:***@kathir.menbnwd.mongodb.net/?appName=kathir`
- **Database**: `kathir_wholesale`
- **Health Check**: GET `/api/health`

---

## API Endpoints

### 🏥 Health Check
**GET** `/api/health`
- Check MongoDB connection status
- Response: `{ status: "healthy", message: "✅ MongoDB connected successfully" }`

---

## 📦 Products API

### Get All Products
**GET** `/api/products`
- Returns all products from MongoDB
- Response: `{ status: "success", count: 10, data: [...] }`

### Create Product
**POST** `/api/products`
```json
{
  "id": "prod-1",
  "name": "Kathir Toor Dhal",
  "category": "Lentils & Pulses",
  "price": 6.99,
  "size": "1 unit",
  "stock": 100,
  "inStock": true
}
```

### Get Product by ID
**GET** `/api/products/[id]`
- Returns specific product details

### Update Product
**PUT** `/api/products/[id]`
- Update product information
- Requires same JSON structure as POST

### Delete Product
**DELETE** `/api/products/[id]`
- Remove product from database

---

## 🛒 Orders API

### Get All Orders
**GET** `/api/orders`
- Returns all orders sorted by newest first
- Response: `{ success: true, count: 5, orders: [...] }`

### Create Order
**POST** `/api/orders`
```json
{
  "shopName": "Patel's Grocers",
  "contactPerson": "John Patel",
  "phoneNumber": "+44 1925 123456",
  "email": "john@patel.co.uk",
  "deliveryAddress": "123 Main St, Manchester",
  "postcode": "M1 1AD",
  "deliveryDate": "2026-07-15",
  "notes": "Please ring doorbell",
  "items": [
    {
      "product": { "id": "1", "name": "Product", "price": 6.99 },
      "quantity": 2,
      "price": 6.99
    }
  ]
}
```

### Get Order by ID
**GET** `/api/orders/[id]`
- Accepts order ID or MongoDB ObjectId
- Returns order details

### Update Order
**PUT** `/api/orders/[id]`
- Update order status or details
- Status options: "pending", "confirmed", "shipped", "delivered", "cancelled"

### Delete Order
**DELETE** `/api/orders/[id]`
- Remove order from database

---

## 👥 Users API

### Create User (Register)
**POST** `/api/users`
```json
{
  "email": "user@example.co.uk",
  "shopName": "Shop Name",
  "contactPerson": "John Doe",
  "phoneNumber": "+44 1925 123456",
  "deliveryAddress": "123 Main St",
  "postcode": "M1 1AD"
}
```

### Get All Users
**GET** `/api/users`
- Returns list of all registered users

---

## 📊 Admin Dashboard
**Access**: [http://localhost:3000/admin](http://localhost:3000/admin)

### Features:
- 📈 Real-time statistics (Products, Orders, Users, Revenue)
- 📦 Product management (view, delete)
- 🛒 Order management (view, delete, change status)
- 📊 Dashboard with key metrics

---

## Database Collections

### Products Collection
```typescript
{
  _id: ObjectId
  id: string
  name: string
  category: string
  price: number
  size: string
  stock: number
  inStock: boolean
  image?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

### Orders Collection
```typescript
{
  _id: ObjectId
  orderId: string
  shopName: string
  contactPerson: string
  phoneNumber: string
  email: string
  deliveryAddress: string
  postcode: string
  deliveryDate: string
  notes?: string
  items: OrderItem[]
  totalBoxes: number
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}
```

### Users Collection
```typescript
{
  _id: ObjectId
  email: string
  shopName: string
  contactPerson: string
  phoneNumber: string
  deliveryAddress: string
  postcode: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## Data Migration

### Migrate Products from JSON to MongoDB
```bash
npx ts-node scripts/migrate-products.ts
```

This script will:
1. Read products from `public/products.json`
2. Clear existing MongoDB products
3. Insert all products with timestamps

---

## Error Handling

All endpoints return standardized responses:

**Success (2xx)**:
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

**Error (4xx/5xx)**:
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## Environment Variables

```env
MONGODB_URI=mongodb+srv://tennisvijayaram_db_user:GuQfc1CG0TDn4GWh@kathir.menbnwd.mongodb.net/?appName=kathir
DB_NAME=kathir_wholesale
```

---

## Testing API Endpoints

### Using cURL

**Get all products**:
```bash
curl http://localhost:3000/api/products
```

**Create product**:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","category":"Test","price":9.99,"size":"1 unit","stock":50,"inStock":true}'
```

**Health check**:
```bash
curl http://localhost:3000/api/health
```

---

## Status ✅

- ✅ MongoDB Atlas Connected
- ✅ Database Collections Ready
- ✅ Product API Endpoints
- ✅ Order API Endpoints
- ✅ User API Endpoints
- ✅ Admin Dashboard
- ✅ Health Check Endpoint
- ⏳ Data Migration Script Ready
- ⏳ Authentication (Coming Soon)
- ⏳ Email Integration (Coming Soon)

---

Last Updated: July 5, 2026
