import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as ProductsDB from "./products_db.tsx";
import * as OrdersDB from "./orders_db.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Admin login endpoint
 */
app.post("/make-server-19737827/admin/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('Admin login error:', error.message);
      return c.json({ error: error.message }, 401);
    }
    
    return c.json({ 
      accessToken: data.session.access_token,
      user: data.user 
    });
  } catch (error) {
    console.log('Admin login exception:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * Verify admin middleware
 */
const verifyAdmin = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    console.log('Auth verification failed: No token provided');
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error) {
      console.log('Auth verification error:', error.message);
      console.log('Error details:', { status: error.status, name: error.name });
      return c.json({ error: `Unauthorized - ${error.message}` }, 401);
    }
    
    if (!user) {
      console.log('Auth verification failed: No user found');
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
    
    console.log('Auth verification successful for user:', user.id);
    c.set('userId', user.id);
    await next();
  } catch (error) {
    console.error('Auth verification exception:', error);
    return c.json({ error: 'Unauthorized - Token verification failed' }, 401);
  }
};

// ============================================
// PRODUCTS ENDPOINTS
// ============================================

/**
 * GET all products (Public)
 */
app.get("/make-server-19737827/products", async (c) => {
  try {
    const products = await ProductsDB.getAllProducts();
    return c.json({ products });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * POST create new product (Admin only)
 */
app.post("/make-server-19737827/products", verifyAdmin, async (c) => {
  try {
    const productData = await c.req.json();
    const product = await ProductsDB.createProduct(productData);
    
    console.log('Product created successfully:', product.id);
    return c.json({ product });
  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * PUT update product (Admin only)
 */
app.put("/make-server-19737827/products/:id", verifyAdmin, async (c) => {
  try {
    const productId = c.req.param('id');
    const updates = await c.req.json();
    
    const product = await ProductsDB.updateProduct(productId, updates);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    console.log('Product updated successfully:', productId);
    return c.json({ product });
  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * PATCH update product stock status (Admin only)
 */
app.patch("/make-server-19737827/products/:id/stock", verifyAdmin, async (c) => {
  try {
    const productId = c.req.param('id');
    const { inStock } = await c.req.json();
    
    const product = await ProductsDB.updateProductStock(productId, inStock);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    console.log('Product stock updated:', productId, 'inStock:', inStock);
    return c.json({ product });
  } catch (error) {
    console.log('Error updating product stock status:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * DELETE product (Admin only)
 */
app.delete("/make-server-19737827/products/:id", verifyAdmin, async (c) => {
  try {
    const productId = c.req.param('id');
    const success = await ProductsDB.deleteProduct(productId);
    
    if (!success) {
      return c.json({ error: 'Failed to delete product' }, 500);
    }
    
    console.log('Product deleted successfully:', productId);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================
// ORDERS ENDPOINTS
// ============================================

/**
 * POST create new order (Public)
 */
app.post("/make-server-19737827/orders", async (c) => {
  try {
    const orderData = await c.req.json();
    const order = await OrdersDB.createOrder(orderData);
    
    console.log('Order created successfully:', order.id);
    return c.json({ order });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * GET all orders (Admin only)
 */
app.get("/make-server-19737827/orders", verifyAdmin, async (c) => {
  try {
    console.log('Fetching all orders from database...');
    const orders = await OrdersDB.getAllOrders();
    console.log(`Successfully fetched ${orders.length} orders`);
    return c.json({ orders });
  } catch (error) {
    console.error('Error fetching orders - Full error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * GET orders report (Admin only)
 * IMPORTANT: Must be defined BEFORE /orders/:id to avoid route conflicts
 */
app.get("/make-server-19737827/orders/report", verifyAdmin, async (c) => {
  try {
    const { startDate, endDate } = c.req.query();
    
    console.log('Fetching report with params:', { startDate, endDate });
    
    let orders;
    if (startDate && endDate) {
      orders = await OrdersDB.getOrdersByDateRange(startDate, endDate);
    } else {
      orders = await OrdersDB.getAllOrders();
    }
    
    console.log(`Found ${orders.length} orders for report`);
    
    // Calculate statistics
    const completedOrders = orders.filter((o: any) => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    
    // Group orders by date
    const ordersByDate = orders.reduce((acc: any, order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString('id-ID');
      if (!acc[date]) {
        acc[date] = { count: 0, revenue: 0 };
      }
      acc[date].count++;
      acc[date].revenue += order.total || 0;
      return acc;
    }, {});
    
    return c.json({ 
      orders,
      totalOrders: orders.length,
      totalRevenue,
      ordersByDate
    });
  } catch (error) {
    console.log('Error fetching orders report:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * GET single order by ID (Admin only)
 */
app.get("/make-server-19737827/orders/:id", verifyAdmin, async (c) => {
  try {
    const orderId = c.req.param('id');
    const order = await OrdersDB.getOrderById(orderId);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    return c.json({ order });
  } catch (error) {
    console.log('Error fetching order:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * PUT update order status (Admin only)
 */
app.put("/make-server-19737827/orders/:id/status", verifyAdmin, async (c) => {
  try {
    const orderId = c.req.param('id');
    const { status } = await c.req.json();
    
    const order = await OrdersDB.updateOrderStatus(orderId, status);
    
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    console.log('Order status updated:', orderId, 'status:', status);
    return c.json({ order });
  } catch (error) {
    console.log('Error updating order status:', error);
    return c.json({ error: String(error) }, 500);
  }
});

/**
 * DELETE order (Admin only)
 */
app.delete("/make-server-19737827/orders/:id", verifyAdmin, async (c) => {
  try {
    const orderId = c.req.param('id');
    const success = await OrdersDB.deleteOrder(orderId);
    
    if (!success) {
      return c.json({ error: 'Failed to delete order' }, 500);
    }
    
    console.log('Order deleted successfully:', orderId);
    return c.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.log('Error deleting order:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Health check endpoint
 */
app.get("/make-server-19737827/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Acacia Water Server"
  });
});

// Start the server
Deno.serve(app.fetch);