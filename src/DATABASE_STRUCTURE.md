# Struktur Database Acacia Water

Dokumentasi struktur database dan helper functions untuk aplikasi Acacia Water.

## Overview

Database menggunakan Supabase Key-Value Store dengan dua koleksi utama:
- **Products** - Katalog produk (galon dan gas)
- **Orders** - Pesanan dari customer

## Struktur File

```
supabase/functions/server/
├── index.tsx       # API endpoints (menggunakan helper functions)
├── products_db.tsx # Helper functions untuk Products
├── orders_db.tsx   # Helper functions untuk Orders
└── kv_store.tsx    # Low-level KV operations (protected)

utils/supabase/
└── info.tsx        # Supabase credentials
```

---

## Products Database

### Schema

```typescript
interface Product {
  id: string;              // Format: "product:{uuid}"
  name: string;            // Nama produk
  description: string;     // Deskripsi produk
  price: number;           // Harga (IDR)
  image: string;           // URL gambar
  category: 'galon' | 'gas'; // Kategori produk
  inStock: boolean;        // Status ketersediaan
  popular: boolean;        // Produk populer (featured)
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

### Helper Functions (`/supabase/functions/server/products_db.tsx`)

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getAllProducts()` | Ambil semua produk (sorted by date) | - | `Product[]` |
| `getProductById(id)` | Ambil produk by ID | `id: string` | `Product \| null` |
| `createProduct(data)` | Buat produk baru | `productData` | `Product` |
| `updateProduct(id, updates)` | Update produk | `id`, `updates` | `Product \| null` |
| `updateProductStock(id, inStock)` | Update status stok | `id`, `inStock: boolean` | `Product \| null` |
| `deleteProduct(id)` | Hapus produk | `id` | `boolean` |
| `getProductsByStock(inStock)` | Filter by stok | `inStock: boolean` | `Product[]` |
| `getProductsByCategory(category)` | Filter by kategori | `'galon' \| 'gas'` | `Product[]` |
| `getPopularProducts()` | Ambil produk popular | - | `Product[]` |

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/products` | Public | Ambil semua produk |
| `POST` | `/products` | Admin | Buat produk baru |
| `PUT` | `/products/:id` | Admin | Update produk |
| `PATCH` | `/products/:id/stock` | Admin | Toggle status stok |
| `DELETE` | `/products/:id` | Admin | Hapus produk |

### Contoh Data

```json
{
  "id": "product:123e4567-e89b-12d3-a456-426614174000",
  "name": "Galon Air Aqua 19L",
  "description": "Galon air mineral Aqua 19 liter",
  "price": 30000,
  "image": "https://...",
  "category": "galon",
  "inStock": true,
  "popular": true,
  "createdAt": "2025-11-02T10:00:00.000Z",
  "updatedAt": "2025-11-02T10:00:00.000Z"
}
```

---

## Orders Database

### Schema

```typescript
interface OrderItem {
  id: string;              // Product ID
  name: string;            // Nama produk
  price: number;           // Harga satuan
  quantity: number;        // Jumlah item
}

interface Order {
  id: string;              // Format: "order:{uuid}"
  customerName: string;    // Nama customer
  customerPhone: string;   // No telepon
  customerAddress: string; // Alamat pengiriman
  items: OrderItem[];      // List produk yang dipesan
  subtotal: number;        // Total harga produk (tanpa ongkir)
  deliveryFee: number;     // Ongkos kirim
  total: number;           // Total bayar (subtotal + deliveryFee)
  paymentMethod: string;   // Metode pembayaran
  paymentProof?: string;   // URL bukti transfer (optional)
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;          // Catatan tambahan (optional)
  createdAt: string;       // ISO timestamp
  updatedAt?: string;      // ISO timestamp (optional)
}
```

### Helper Functions (`/supabase/functions/server/orders_db.tsx`)

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getAllOrders()` | Ambil semua order (sorted by date) | - | `Order[]` |
| `getOrderById(id)` | Ambil order by ID | `id: string` | `Order \| null` |
| `createOrder(data)` | Buat order baru | `orderData` | `Order` |
| `updateOrder(id, updates)` | Update order | `id`, `updates` | `Order \| null` |
| `updateOrderStatus(id, status)` | Update status order | `id`, `status` | `Order \| null` |
| `deleteOrder(id)` | Hapus order | `id` | `boolean` |
| `getOrdersByStatus(status)` | Filter by status | `status` | `Order[]` |
| `getOrdersByDateRange(start, end)` | Filter by date range | `startDate`, `endDate` | `Order[]` |
| `getPendingOrdersCount()` | Hitung pending orders | - | `number` |
| `calculateTotalRevenue(orders?)` | Total revenue | `orders?` | `number` |
| `calculateSubtotalRevenue(orders?)` | Revenue tanpa ongkir | `orders?` | `number` |
| `getSalesStatistics(start, end)` | Stats penjualan | `startDate`, `endDate` | `object` |

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/orders` | Public | Buat order baru |
| `GET` | `/orders` | Admin | Ambil semua orders |
| `GET` | `/orders/:id` | Admin | Ambil order by ID |
| `PUT` | `/orders/:id/status` | Admin | Update status order |
| `DELETE` | `/orders/:id` | Admin | Hapus order |
| `GET` | `/orders/report` | Admin | Laporan penjualan (dengan query params) |

### Order Status Flow

```
pending → processing → completed
   ↓
cancelled
```

### Contoh Data

```json
{
  "id": "order:456e7890-e89b-12d3-a456-426614174001",
  "customerName": "John Doe",
  "customerPhone": "0812-3456-7890",
  "customerAddress": "Cluster Acacia Blok CA 23 NO 08",
  "items": [
    {
      "id": "product:123...",
      "name": "Galon Air Aqua 19L",
      "price": 30000,
      "quantity": 2
    }
  ],
  "subtotal": 60000,
  "deliveryFee": 5000,
  "total": 65000,
  "paymentMethod": "Transfer Bank",
  "paymentProof": "https://...",
  "status": "pending",
  "notes": "Kirim sore jam 3",
  "createdAt": "2025-11-02T14:30:00.000Z",
  "updatedAt": "2025-11-02T14:30:00.000Z"
}
```

---

## Authentication

### Admin Login

```typescript
POST /make-server-19737827/admin/login
{
  "email": "admin@acaciawater.com",
  "password": "password"
}

Response:
{
  "accessToken": "eyJ...",
  "user": { ... }
}
```

### Using Access Token

Untuk endpoint yang memerlukan autentikasi admin, kirim access token di header:

```
Authorization: Bearer {accessToken}
```

---

## Best Practices

### 1. **Gunakan Helper Functions**
Selalu gunakan helper functions dari `/supabase/functions/server/` untuk operasi database, jangan langsung menggunakan `kv_store`.

```typescript
// ✅ Good - Di dalam server
import * as ProductsDB from './products_db.tsx';
const products = await ProductsDB.getAllProducts();

// ❌ Bad
import * as kv from './kv_store.tsx';
const products = await kv.getByPrefix('product:');
```

### 2. **Error Handling**
Selalu handle error dengan proper logging:

```typescript
try {
  const product = await ProductsDB.getProductById(id);
  if (!product) {
    return { error: 'Product not found' };
  }
  return { product };
} catch (error) {
  console.error('Error fetching product:', error);
  return { error: String(error) };
}
```

### 3. **Type Safety**
Import dan gunakan interface yang sudah didefinisikan:

```typescript
// Di dalam server functions
import type { Product } from './products_db.tsx';
import type { Order, OrderItem } from './orders_db.tsx';
```

### 4. **Logging**
Server sudah menggunakan Hono logger. Semua request akan di-log otomatis. Tambahkan log untuk operasi penting:

```typescript
console.log('Product created:', product.id);
console.log('Order status updated:', orderId, 'to', status);
```

---

## Migrasi dari Versi Lama

Jika Anda memiliki kode yang menggunakan `kv` directly di server:

**Before:**
```typescript
const products = await kv.getByPrefix('product:');
```

**After:**
```typescript
import * as ProductsDB from './products_db.tsx';
const products = await ProductsDB.getAllProducts();
```

**Note:** Helper functions hanya bisa digunakan di dalam Edge Function (`/supabase/functions/server/`). Frontend harus menggunakan API endpoints.

---

## Testing

### Health Check
```bash
curl https://{projectId}.supabase.co/functions/v1/make-server-19737827/health
```

### Get Products (Public)
```bash
curl https://{projectId}.supabase.co/functions/v1/make-server-19737827/products
```

### Create Product (Admin)
```bash
curl -X POST https://{projectId}.supabase.co/functions/v1/make-server-19737827/products \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test",
    "price": 10000,
    "image": "https://...",
    "category": "galon",
    "inStock": true,
    "popular": false
  }'
```

---

## Support

Untuk pertanyaan atau issue terkait database, silakan check:
1. File dokumentasi ini
2. Comment di helper functions (`/utils/supabase/products.tsx` dan `orders.tsx`)
3. Server logs di Supabase dashboard
