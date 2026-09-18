import { getDb } from "./db";
import { Product, Address, Order, Review, AppNotification, CartItem } from "@/types";
import { uid } from "@/utils/currency";

// ---------- Products ----------
export async function fetchAllProducts(): Promise<Product[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ data: string }>("SELECT data FROM products");
  return rows.map((r) => JSON.parse(r.data));
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ data: string }>(
    "SELECT data FROM products WHERE id = ?",
    [id]
  );
  return row ? JSON.parse(row.data) : null;
}

// ---------- Recently viewed ----------
export async function recordRecentlyViewed(productId: string) {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO recently_viewed (productId, viewedAt) VALUES (?,?)",
    [productId, new Date().toISOString()]
  );
}

export async function fetchRecentlyViewed(limit = 10): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ productId: string }>(
    "SELECT productId FROM recently_viewed ORDER BY viewedAt DESC LIMIT ?",
    [limit]
  );
  return rows.map((r) => r.productId);
}

// ---------- Recent searches ----------
export async function recordRecentSearch(term: string) {
  if (!term.trim()) return;
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO recent_searches (term, searchedAt) VALUES (?,?)",
    [term.trim(), new Date().toISOString()]
  );
}

export async function fetchRecentSearches(limit = 8): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ term: string }>(
    "SELECT term FROM recent_searches ORDER BY searchedAt DESC LIMIT ?",
    [limit]
  );
  return rows.map((r) => r.term);
}

export async function clearRecentSearches() {
  const db = await getDb();
  await db.runAsync("DELETE FROM recent_searches");
}

// ---------- Cart ----------
export async function fetchCart(): Promise<CartItem[]> {
  const db = await getDb();
  return db.getAllAsync<CartItem>("SELECT * FROM cart_items");
}

export async function upsertCartItem(item: CartItem) {
  const db = await getDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO cart_items (id, productId, quantity, selectedColor, selectedSize) VALUES (?,?,?,?,?)",
    [item.id, item.productId, item.quantity, item.selectedColor ?? null, item.selectedSize ?? null]
  );
}

export async function removeCartItem(id: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM cart_items WHERE id = ?", [id]);
}

export async function clearCart() {
  const db = await getDb();
  await db.runAsync("DELETE FROM cart_items");
}

// ---------- Wishlist ----------
export async function fetchWishlist(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ productId: string }>("SELECT productId FROM wishlist_items");
  return rows.map((r) => r.productId);
}

export async function toggleWishlist(productId: string): Promise<boolean> {
  const db = await getDb();
  const existing = await db.getFirstAsync("SELECT productId FROM wishlist_items WHERE productId = ?", [productId]);
  if (existing) {
    await db.runAsync("DELETE FROM wishlist_items WHERE productId = ?", [productId]);
    return false;
  } else {
    await db.runAsync("INSERT INTO wishlist_items (productId) VALUES (?)", [productId]);
    return true;
  }
}

// ---------- Addresses ----------
export async function fetchAddresses(): Promise<Address[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>("SELECT * FROM addresses");
  return rows.map((r) => ({ ...r, isDefault: !!r.isDefault }));
}

export async function saveAddress(addr: Address) {
  const db = await getDb();
  if (addr.isDefault) {
    await db.runAsync("UPDATE addresses SET isDefault = 0");
  }
  await db.runAsync(
    `INSERT OR REPLACE INTO addresses (id, name, phone, street, city, state, country, label, isDefault)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [addr.id, addr.name, addr.phone, addr.street, addr.city, addr.state, addr.country, addr.label ?? "", addr.isDefault ? 1 : 0]
  );
}

export async function deleteAddress(id: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM addresses WHERE id = ?", [id]);
}

export async function setDefaultAddress(id: string) {
  const db = await getDb();
  await db.runAsync("UPDATE addresses SET isDefault = 0");
  await db.runAsync("UPDATE addresses SET isDefault = 1 WHERE id = ?", [id]);
}

// ---------- Orders ----------
export async function createOrder(order: Order) {
  const db = await getDb();
  await db.runAsync("INSERT INTO orders (id, data, createdAt) VALUES (?,?,?)", [
    order.id,
    JSON.stringify(order),
    order.createdAt
  ]);
}

export async function fetchOrders(): Promise<Order[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ data: string }>("SELECT data FROM orders ORDER BY createdAt DESC");
  return rows.map((r) => JSON.parse(r.data));
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ data: string }>("SELECT data FROM orders WHERE id = ?", [id]);
  return row ? JSON.parse(row.data) : null;
}

export async function updateOrder(order: Order) {
  const db = await getDb();
  await db.runAsync("UPDATE orders SET data = ? WHERE id = ?", [JSON.stringify(order), order.id]);
}

// ---------- Reviews ----------
export async function fetchReviewsForProduct(productId: string): Promise<Review[]> {
  const db = await getDb();
  return db.getAllAsync<Review>(
    "SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC",
    [productId]
  );
}

export async function addReview(review: Review) {
  const db = await getDb();
  await db.runAsync(
    "INSERT INTO reviews (id, productId, customerName, rating, comment, createdAt, isLocal) VALUES (?,?,?,?,?,?,1)",
    [review.id, review.productId, review.customerName, review.rating, review.comment, review.createdAt]
  );
}

// ---------- Notifications ----------
export async function fetchNotifications(): Promise<AppNotification[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>("SELECT * FROM notifications ORDER BY createdAt DESC");
  return rows.map((r) => ({ ...r, read: !!r.read }));
}

export async function markNotificationRead(id: string) {
  const db = await getDb();
  await db.runAsync("UPDATE notifications SET read = 1 WHERE id = ?", [id]);
}

export async function markAllNotificationsRead() {
  const db = await getDb();
  await db.runAsync("UPDATE notifications SET read = 1");
}

// ---------- Inventory (admin) ----------
export async function fetchInventory(): Promise<{ productId: string; stock: number; lowStockThreshold: number }[]> {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM inventory");
}

export async function updateStock(productId: string, stock: number) {
  const db = await getDb();
  await db.runAsync("UPDATE inventory SET stock = ? WHERE productId = ?", [stock, productId]);
  const row = await db.getFirstAsync<{ data: string }>("SELECT data FROM products WHERE id = ?", [productId]);
  if (row) {
    const p = JSON.parse(row.data);
    p.stock = stock;
    await db.runAsync("UPDATE products SET data = ? WHERE id = ?", [JSON.stringify(p), productId]);
  }
}

export async function deleteProduct(productId: string) {
  const db = await getDb();
  await db.runAsync("DELETE FROM products WHERE id = ?", [productId]);
  await db.runAsync("DELETE FROM inventory WHERE productId = ?", [productId]);
}

export async function upsertProduct(p: Product) {
  const db = await getDb();
  await db.runAsync("INSERT OR REPLACE INTO products (id, data) VALUES (?,?)", [p.id, JSON.stringify(p)]);
  await db.runAsync(
    "INSERT OR REPLACE INTO inventory (productId, stock, lowStockThreshold) VALUES (?,?, COALESCE((SELECT lowStockThreshold FROM inventory WHERE productId = ?), 5))",
    [p.id, p.stock, p.id]
  );
}
