export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  selectedColor TEXT,
  selectedSize TEXT
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  productId TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  name TEXT, phone TEXT, street TEXT, city TEXT, state TEXT, country TEXT,
  label TEXT, isDefault INTEGER
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  orderId TEXT NOT NULL,
  data TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  customerName TEXT,
  rating INTEGER,
  comment TEXT,
  createdAt TEXT,
  isLocal INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT, body TEXT, createdAt TEXT, read INTEGER, type TEXT
);

CREATE TABLE IF NOT EXISTS recent_searches (
  term TEXT PRIMARY KEY,
  searchedAt TEXT
);

CREATE TABLE IF NOT EXISTS recently_viewed (
  productId TEXT PRIMARY KEY,
  viewedAt TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT, email TEXT, phone TEXT, avatar TEXT
);

CREATE TABLE IF NOT EXISTS inventory (
  productId TEXT PRIMARY KEY,
  stock INTEGER,
  lowStockThreshold INTEGER
);
`;
