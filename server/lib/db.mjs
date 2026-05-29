import fs from "node:fs";
import path from "node:path";
import { config } from "./config.mjs";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function filePath(name) {
  return path.join(config.dataDir, name);
}

function readJson(name, fallback) {
  const fp = filePath(name);
  try {
    if (!fs.existsSync(fp)) return structuredClone(fallback);
    return JSON.parse(fs.readFileSync(fp, "utf8"));
  } catch {
    return structuredClone(fallback);
  }
}

function writeJson(name, data) {
  ensureDir(config.dataDir);
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2) + "\n");
}

export const db = {
  init() {
    ensureDir(config.dataDir);
    if (!fs.existsSync(filePath("orders.json"))) writeJson("orders.json", []);
    if (!fs.existsSync(filePath("reminders.json"))) writeJson("reminders.json", []);
    if (!fs.existsSync(filePath("users.json"))) writeJson("users.json", {});
    if (!fs.existsSync(filePath("magic_tokens.json"))) writeJson("magic_tokens.json", {});
    if (!fs.existsSync(filePath("stock.json"))) writeJson("stock.json", {});
  },

  getOrders() {
    return readJson("orders.json", []);
  },

  saveOrders(orders) {
    writeJson("orders.json", orders);
  },

  getOrder(id) {
    return db.getOrders().find((o) => o.id === id);
  },

  upsertOrder(order) {
    const orders = db.getOrders();
    const idx = orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) orders[idx] = order;
    else orders.unshift(order);
    db.saveOrders(orders);
    return order;
  },

  getReminders() {
    return readJson("reminders.json", []);
  },

  saveReminders(list) {
    writeJson("reminders.json", list);
  },

  getUsers() {
    return readJson("users.json", {});
  },

  saveUsers(users) {
    writeJson("users.json", users);
  },

  getMagicTokens() {
    return readJson("magic_tokens.json", {});
  },

  saveMagicTokens(tokens) {
    writeJson("magic_tokens.json", tokens);
  },

  /** Per-product stock overrides (CMS / admin) */
  getStockOverrides() {
    return readJson("stock.json", {});
  },

  saveStockOverrides(stock) {
    writeJson("stock.json", stock);
  },
};
