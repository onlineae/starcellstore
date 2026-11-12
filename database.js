const path = require('path');
const fs = require('fs');

const defaultSettings = {
  admin_password: '6666', // 🔐 Senha solicitada pelo usuário
  whatsapp_number: '5516997655257',
  phone_landline: '5516997655257',
  address: 'Av. Sete de Setembro, 783 - Centro, Divinópolis - MG, 35500-011',
  cnpj: '04.014.240/0001-04',
  city: 'Divinópolis',
  state: 'MG',
  company_name: 'StarCell'
};

// Data e hora oficial de Brasília (America/Sao_Paulo, UTC-3)
function getBrasiliaTimestamp() {
  const d = new Date();
  return d.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' });
}

let isPostgres = false;
let isSqlite = false;
let isJson = false;

let pgPool = null;
let sqliteDb = null;
let jsonFilePath = null;

const databaseUrl = process.env.DATABASE_URL || '';

if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
  isPostgres = true;
  const { Pool } = require('pg');
  pgPool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  });
  console.log('📦 [Servidor] Conectado ao banco de dados PostgreSQL na nuvem (Render).');
} else {
  try {
    const Database = require('better-sqlite3');
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    sqliteDb = new Database(path.join(dataDir, 'logistica.db'));
    sqliteDb.pragma('journal_mode = WAL');
    isSqlite = true;
    console.log('📁 [Servidor] Utilizando banco de dados local SQLite (data/logistica.db).');
  } catch (err) {
    console.warn('⚠️ [Servidor] better-sqlite3 não disponível. Utilizando persistência JSON (data/orders.json).');
    isJson = true;
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    jsonFilePath = path.join(dataDir, 'orders.json');
    if (!fs.existsSync(jsonFilePath)) {
      fs.writeFileSync(jsonFilePath, JSON.stringify({ settings: defaultSettings, orders: [], checkpoints: [] }, null, 2));
    }
  }
}

// Helpers para JSON fallback
function readJsonDb() {
  try {
    const raw = fs.readFileSync(jsonFilePath, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { settings: defaultSettings, orders: [], checkpoints: [] };
  }
}

function writeJsonDb(data) {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Erro ao escrever no banco JSON:', e);
  }
}

// Inicialização das tabelas no servidor
async function initDb() {
  if (isPostgres) {
    try {
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key VARCHAR(255) PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          tracking_code VARCHAR(50) UNIQUE NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          address TEXT NOT NULL,
          number VARCHAR(50),
          complement VARCHAR(100),
          neighborhood VARCHAR(100),
          city VARCHAR(100) NOT NULL,
          state VARCHAR(10) NOT NULL,
          cep VARCHAR(20) NOT NULL,
          items_description TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'Objeto postado',
          created_at VARCHAR(50) NOT NULL,
          updated_at VARCHAR(50) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tracking_checkpoints (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          location VARCHAR(100) NOT NULL,
          timestamp VARCHAR(50) NOT NULL
        );
      `);

      for (const [key, value] of Object.entries(defaultSettings)) {
        await pgPool.query(
          'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
          [key, value]
        );
      }
      console.log('✅ [Servidor] Tabelas PostgreSQL inicializadas com sucesso.');
    } catch (err) {
      console.error('❌ [Servidor] Erro ao inicializar PostgreSQL:', err);
    }
  } else if (isSqlite) {
    try {
      sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tracking_code TEXT UNIQUE NOT NULL,
          customer_name TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          address TEXT NOT NULL,
          number TEXT,
          complement TEXT,
          neighborhood TEXT,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          cep TEXT NOT NULL,
          items_description TEXT,
          status TEXT NOT NULL DEFAULT 'Objeto postado',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tracking_checkpoints (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          status TEXT NOT NULL,
          description TEXT NOT NULL,
          location TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
        );
      `);

      const setStmt = sqliteDb.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      for (const [key, value] of Object.entries(defaultSettings)) {
        setStmt.run(key, value);
      }
      console.log('✅ [Servidor] Tabelas SQLite inicializadas.');
    } catch (err) {
      console.error('❌ [Servidor] Erro ao inicializar SQLite:', err);
    }
  }
}

initDb();

const dbHelpers = {
  getDatabaseInfo() {
    return {
      type: isPostgres ? 'PostgreSQL (Nuvem Render)' : (isSqlite ? 'SQLite (Arquivo Local)' : 'JSON (Arquivo data/orders.json)'),
      isCloud: isPostgres
    };
  },

  async getSetting(key) {
    if (isPostgres) {
      const res = await pgPool.query('SELECT value FROM settings WHERE key = $1', [key]);
      return res.rows[0] ? res.rows[0].value : defaultSettings[key] || null;
    } else if (isSqlite) {
      const row = sqliteDb.prepare('SELECT value FROM settings WHERE key = ?').get(key);
      return row ? row.value : defaultSettings[key] || null;
    } else {
      const data = readJsonDb();
      return (data.settings && data.settings[key]) || defaultSettings[key] || null;
    }
  },

  async getAllSettings() {
    const config = { ...defaultSettings };
    if (isPostgres) {
      const res = await pgPool.query('SELECT key, value FROM settings');
      res.rows.forEach(r => { config[r.key] = r.value; });
    } else if (isSqlite) {
      const rows = sqliteDb.prepare('SELECT key, value FROM settings').all();
      rows.forEach(r => { config[r.key] = r.value; });
    } else {
      const data = readJsonDb();
      return { ...defaultSettings, ...(data.settings || {}) };
    }
    return config;
  },

  async setSetting(key, value) {
    if (isPostgres) {
      await pgPool.query(
        'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
        [key, value]
      );
    } else if (isSqlite) {
      sqliteDb.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
    } else {
      const data = readJsonDb();
      if (!data.settings) data.settings = {};
      data.settings[key] = value;
      writeJsonDb(data);
    }
    return true;
  },

  async generateTrackingCode() {
    let code;
    let exists = true;
    while (exists) {
      const num = Math.floor(100000000 + Math.random() * 900000000);
      code = `FL${num}BR`;
      if (isPostgres) {
        const res = await pgPool.query('SELECT id FROM orders WHERE tracking_code = $1', [code]);
        exists = res.rows.length > 0;
      } else if (isSqlite) {
        const row = sqliteDb.prepare('SELECT id FROM orders WHERE tracking_code = ?').get(code);
        exists = !!row;
      } else {
        const data = readJsonDb();
        exists = (data.orders || []).some(o => o.tracking_code === code);
      }
    }
    return code;
  },

  async getAllOrders() {
    if (isPostgres) {
      const res = await pgPool.query(`
        SELECT o.*,
          (SELECT COUNT(*) FROM tracking_checkpoints WHERE order_id = o.id)::int as checkpoint_count,
          (SELECT MAX(timestamp) FROM tracking_checkpoints WHERE order_id = o.id) as last_update
        FROM orders o
        ORDER BY o.id DESC
      `);
      return res.rows;
    } else if (isSqlite) {
      return sqliteDb.prepare(`
        SELECT o.*,
          (SELECT COUNT(*) FROM tracking_checkpoints WHERE order_id = o.id) as checkpoint_count,
          (SELECT MAX(timestamp) FROM tracking_checkpoints WHERE order_id = o.id) as last_update
        FROM orders o
        ORDER BY o.id DESC
      `).all();
    } else {
      const data = readJsonDb();
      return (data.orders || []).slice().reverse().map(o => {
        const cps = (data.checkpoints || []).filter(c => c.order_id === o.id);
        return {
          ...o,
          checkpoint_count: cps.length,
          last_update: cps.length ? cps[cps.length - 1].timestamp : o.updated_at
        };
      });
    }
  },

  async getOrderById(id) {
    if (isPostgres) {
      const orderRes = await pgPool.query('SELECT * FROM orders WHERE id = $1', [id]);
      if (orderRes.rows.length === 0) return null;
      const order = orderRes.rows[0];
      const cpRes = await pgPool.query('SELECT * FROM tracking_checkpoints WHERE order_id = $1 ORDER BY id ASC', [id]);
      order.checkpoints = cpRes.rows;
      return order;
    } else if (isSqlite) {
      const order = sqliteDb.prepare('SELECT * FROM orders WHERE id = ?').get(id);
      if (!order) return null;
      order.checkpoints = sqliteDb.prepare('SELECT * FROM tracking_checkpoints WHERE order_id = ? ORDER BY id ASC').all(id);
      return order;
    } else {
      const data = readJsonDb();
      const order = (data.orders || []).find(o => o.id == id);
      if (!order) return null;
      order.checkpoints = (data.checkpoints || []).filter(c => c.order_id == id);
      return order;
    }
  },

  async getOrderByTrackingCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (isPostgres) {
      const orderRes = await pgPool.query('SELECT * FROM orders WHERE UPPER(tracking_code) = $1', [cleanCode]);
      if (orderRes.rows.length === 0) return null;
      const order = orderRes.rows[0];
      const cpRes = await pgPool.query('SELECT * FROM tracking_checkpoints WHERE order_id = $1 ORDER BY id ASC', [order.id]);
      order.checkpoints = cpRes.rows;
      return order;
    } else if (isSqlite) {
      const order = sqliteDb.prepare('SELECT * FROM orders WHERE UPPER(tracking_code) = ?').get(cleanCode);
      if (!order) return null;
      order.checkpoints = sqliteDb.prepare('SELECT * FROM tracking_checkpoints WHERE order_id = ? ORDER BY id ASC').all(order.id);
      return order;
    } else {
      const data = readJsonDb();
      const order = (data.orders || []).find(o => (o.tracking_code || '').toUpperCase() === cleanCode);
      if (!order) return null;
      order.checkpoints = (data.checkpoints || []).filter(c => c.order_id == order.id);
      return order;
    }
  },

  async createOrder(orderData) {
    const now = getBrasiliaTimestamp();
    const tracking_code = orderData.tracking_code || await this.generateTrackingCode();
    const initialStatus = 'Objeto postado';

    let orderId = null;

    if (isPostgres) {
      const res = await pgPool.query(`
        INSERT INTO orders (
          tracking_code, customer_name, customer_phone, address, number, complement,
          neighborhood, city, state, cep, items_description, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `, [
        tracking_code, orderData.customer_name, orderData.customer_phone || '',
        orderData.address, orderData.number || '', orderData.complement || '',
        orderData.neighborhood || '', orderData.city, orderData.state,
        orderData.cep, orderData.items_description || '', initialStatus, now, now
      ]);
      orderId = res.rows[0].id;
    } else if (isSqlite) {
      const stmt = sqliteDb.prepare(`
        INSERT INTO orders (
          tracking_code, customer_name, customer_phone, address, number, complement,
          neighborhood, city, state, cep, items_description, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const res = stmt.run(
        tracking_code, orderData.customer_name, orderData.customer_phone || '',
        orderData.address, orderData.number || '', orderData.complement || '',
        orderData.neighborhood || '', orderData.city, orderData.state,
        orderData.cep, orderData.items_description || '', initialStatus, now, now
      );
      orderId = res.lastInsertRowid;
    } else {
      const data = readJsonDb();
      orderId = (data.orders && data.orders.length) ? Math.max(...data.orders.map(o => o.id)) + 1 : 1;
      const newOrder = {
        id: orderId,
        tracking_code,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone || '',
        address: orderData.address,
        number: orderData.number || '',
        complement: orderData.complement || '',
        neighborhood: orderData.neighborhood || '',
        city: orderData.city,
        state: orderData.state,
        cep: orderData.cep,
        items_description: orderData.items_description || '',
        status: initialStatus,
        created_at: now,
        updated_at: now
      };
      data.orders.push(newOrder);
      writeJsonDb(data);
    }

    // Cria primeiro checkpoint de postagem automaticamente
    await this.addCheckpoint(
      orderId,
      'Objeto postado',
      `Mercadoria lacrada recebida na agência de envios expressos.`,
      `Divinópolis / MG`,
      now
    );

    return await this.getOrderById(orderId);
  },

  async addCheckpoint(orderId, status, description, location, timestamp = null) {
    const time = timestamp || getBrasiliaTimestamp();

    if (isPostgres) {
      await pgPool.query(`
        INSERT INTO tracking_checkpoints (order_id, status, description, location, timestamp)
        VALUES ($1, $2, $3, $4, $5)
      `, [orderId, status, description, location, time]);

      await pgPool.query(`
        UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3
      `, [status, time, orderId]);
    } else if (isSqlite) {
      sqliteDb.prepare(`
        INSERT INTO tracking_checkpoints (order_id, status, description, location, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `).run(orderId, status, description, location, time);

      sqliteDb.prepare(`
        UPDATE orders SET status = ?, updated_at = ? WHERE id = ?
      `).run(status, time, orderId);
    } else {
      const data = readJsonDb();
      const cpId = (data.checkpoints && data.checkpoints.length) ? Math.max(...data.checkpoints.map(c => c.id)) + 1 : 1;
      data.checkpoints.push({
        id: cpId,
        order_id: Number(orderId),
        status,
        description,
        location,
        timestamp: time
      });
      const order = (data.orders || []).find(o => o.id == orderId);
      if (order) {
        order.status = status;
        order.updated_at = time;
      }
      writeJsonDb(data);
    }
    return true;
  },

  async deleteOrder(id) {
    if (isPostgres) {
      await pgPool.query('DELETE FROM orders WHERE id = $1', [id]);
    } else if (isSqlite) {
      sqliteDb.prepare('DELETE FROM tracking_checkpoints WHERE order_id = ?').run(id);
      sqliteDb.prepare('DELETE FROM orders WHERE id = ?').run(id);
    } else {
      const data = readJsonDb();
      data.orders = (data.orders || []).filter(o => o.id != id);
      data.checkpoints = (data.checkpoints || []).filter(c => c.order_id != id);
      writeJsonDb(data);
    }
    return true;
  }
};

module.exports = {
  dbHelpers,
  getBrasiliaTimestamp
};
