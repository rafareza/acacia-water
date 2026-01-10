import * as kv from "./kv_store.tsx";

const ORDER_PREFIX = 'order:';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentProof?: string;
  status: 'pending' | 'processing' | 'on_delivery' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Get all orders from the database
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    console.log('getAllOrders: Calling kv.getByPrefix with prefix:', ORDER_PREFIX);
    const orders = await kv.getByPrefix(ORDER_PREFIX);
    console.log('getAllOrders: Retrieved raw data, count:', orders?.length || 0);
    
    if (!orders || orders.length === 0) {
      console.log('getAllOrders: No orders found, returning empty array');
      return [];
    }
    
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    console.log('getAllOrders: Successfully sorted orders');
    return sortedOrders;
  } catch (error) {
    console.error('getAllOrders: Error occurred:', error);
    console.error('getAllOrders: Error details:', {
      message: error?.message,
      stack: error?.stack,
      type: typeof error
    });
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  const order = await kv.get(id);
  return order;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
  const orderId = `${ORDER_PREFIX}${crypto.randomUUID()}`;
  
  const order: Order = {
    id: orderId,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  await kv.set(orderId, order);
  return order;
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
  const existing = await kv.get(id);
  
  if (!existing) {
    return null;
  }
  
  const order: Order = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(id, order);
  return order;
}

/**
 * Update an existing order (full update)
 */
export async function updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<Order | null> {
  const existing = await kv.get(id);
  
  if (!existing) {
    return null;
  }
  
  const order: Order = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(id, order);
  return order;
}

/**
 * Delete an order
 */
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await kv.del(id);
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  const allOrders = await getAllOrders();
  return allOrders.filter(o => o.status === status);
}

/**
 * Get orders by date range
 */
export async function getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
  const allOrders = await getAllOrders();
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include the entire end date
  
  return allOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= start && orderDate <= end;
  });
}

/**
 * Get pending orders count
 */
export async function getPendingOrdersCount(): Promise<number> {
  const pendingOrders = await getOrdersByStatus('pending');
  return pendingOrders.length;
}

/**
 * Calculate total revenue from orders
 */
export async function calculateTotalRevenue(orders?: Order[]): Promise<number> {
  const ordersToCalculate = orders || await getAllOrders();
  return ordersToCalculate
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);
}

/**
 * Calculate subtotal revenue (excluding delivery fees)
 */
export async function calculateSubtotalRevenue(orders?: Order[]): Promise<number> {
  const ordersToCalculate = orders || await getAllOrders();
  return ordersToCalculate
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.subtotal, 0);
}

/**
 * Get sales statistics for a date range
 */
export async function getSalesStatistics(startDate: string, endDate: string) {
  const orders = await getOrdersByDateRange(startDate, endDate);
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  return {
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: await calculateTotalRevenue(completedOrders),
    subtotalRevenue: await calculateSubtotalRevenue(completedOrders),
  };
}