import * as kv from "./kv_store.tsx";

const PRODUCT_PREFIX = 'product:';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'galon' | 'gas';
  inStock: boolean;
  popular: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all products from the database
 */
export async function getAllProducts(): Promise<Product[]> {
  const products = await kv.getByPrefix(PRODUCT_PREFIX);
  return products.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const product = await kv.get(id);
  return product;
}

/**
 * Create a new product
 */
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const productId = `${PRODUCT_PREFIX}${crypto.randomUUID()}`;
  
  const product: Product = {
    id: productId,
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(productId, product);
  return product;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
  const existing = await kv.get(id);
  
  if (!existing) {
    return null;
  }
  
  const product: Product = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(id, product);
  return product;
}

/**
 * Update product stock status
 */
export async function updateProductStock(id: string, inStock: boolean): Promise<Product | null> {
  return updateProduct(id, { inStock });
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await kv.del(id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

/**
 * Get products by stock status
 */
export async function getProductsByStock(inStock: boolean): Promise<Product[]> {
  const allProducts = await getAllProducts();
  return allProducts.filter(p => p.inStock === inStock);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: 'galon' | 'gas'): Promise<Product[]> {
  const allProducts = await getAllProducts();
  return allProducts.filter(p => p.category === category);
}

/**
 * Get popular products
 */
export async function getPopularProducts(): Promise<Product[]> {
  const allProducts = await getAllProducts();
  return allProducts.filter(p => p.popular === true);
}
