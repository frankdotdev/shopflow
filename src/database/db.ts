import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { REVIEWER_NAMES, REVIEW_COMMENTS } from "@/data/reviewSeed";
import { uid } from "@/utils/currency";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  dbInstance = await SQLite.openDatabaseAsync("shopflow.db");
  await dbInstance.execAsync(SCHEMA_SQL);
  await seedIfNeeded(dbInstance);
  return dbInstance;
}

async function seedIfNeeded(db: SQLite.SQLiteDatabase) {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM meta WHERE key = ?",
    ["seeded"]
  );
  if (row?.value === "true") return;

  await db.withTransactionAsync(async () => {
    for (const c of CATEGORIES) {
      await db.runAsync(
        "INSERT OR REPLACE INTO categories (id, name, image, description) VALUES (?,?,?,?)",
        [c.id, c.name, c.image, c.description]
      );
    }
    for (const p of PRODUCTS) {
      await db.runAsync("INSERT OR REPLACE INTO products (id, data) VALUES (?,?)", [
        p.id,
        JSON.stringify(p)
      ]);
      await db.runAsync(
        "INSERT OR REPLACE INTO inventory (productId, stock, lowStockThreshold) VALUES (?,?,?)",
        [p.id, p.stock, 5]
      );
      // seed 2-5 reviews per product
      const reviewCount = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < reviewCount; i++) {
        const name = REVIEWER_NAMES[Math.floor(Math.random() * REVIEWER_NAMES.length)];
        const comment = REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];
        const rating = Math.max(3, Math.min(5, Math.round(p.rating + (Math.random() - 0.5))));
        const daysAgo = Math.floor(Math.random() * 120);
        const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
        await db.runAsync(
          "INSERT OR REPLACE INTO reviews (id, productId, customerName, rating, comment, createdAt, isLocal) VALUES (?,?,?,?,?,?,0)",
          [uid("rev"), p.id, name, rating, comment, createdAt]
        );
      }
    }

    await db.runAsync(
      "INSERT OR REPLACE INTO addresses (id, name, phone, street, city, state, country, label, isDefault) VALUES (?,?,?,?,?,?,?,?,1)",
      [uid("addr"), "Frank Oge", "+234 802 123 4567", "14 Adeola Odeku Street", "Victoria Island", "Lagos", "Nigeria", "Home"]
    );

    await db.runAsync(
      "INSERT OR REPLACE INTO users (id, name, email, phone, avatar) VALUES (?,?,?,?,?)",
      ["me", "Frank Oge", "frank@shopflow.demo", "+234 802 123 4567", ""]
    );

    const notifications = [
      { title: "Order shipped", body: "Your order #SF-10482 has shipped.", type: "order" },
      { title: "Out for delivery", body: "Your order is out for delivery.", type: "order" },
      { title: "Electronics sale", body: "20% off selected electronics today.", type: "promo" },
      { title: "New arrivals", body: "New arrivals are now available.", type: "promo" },
      { title: "Welcome to ShopFlow", body: "Everything you want. One place.", type: "system" }
    ];
    for (const n of notifications) {
      await db.runAsync(
        "INSERT OR REPLACE INTO notifications (id, title, body, createdAt, read, type) VALUES (?,?,?,?,0,?)",
        [uid("notif"), n.title, n.body, new Date().toISOString(), n.type]
      );
    }

    await db.runAsync("INSERT OR REPLACE INTO meta (key, value) VALUES ('seeded','true')");
  });
}

export async function resetDatabase() {
  const db = await getDb();
  await db.execAsync(`
    DELETE FROM cart_items; DELETE FROM wishlist_items; DELETE FROM orders;
    DELETE FROM order_items; DELETE FROM recent_searches; DELETE FROM recently_viewed;
    DELETE FROM meta WHERE key='seeded';
  `);
  await seedIfNeeded(db);
}
