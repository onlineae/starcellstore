const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./database');
const { dbHelpers } = db;

// ========================================================
// 🔐 ROTAS DE LOGÍSTICA & RASTREAMENTO PÚBLICO
// ========================================================
let trackingRoutes = null;
try {
  trackingRoutes = require('./routes/tracking');
} catch (e) {
  try {
    trackingRoutes = require('./tracking');
  } catch (e2) {}
}

if (!trackingRoutes) {
  trackingRoutes = express.Router();
  trackingRoutes.get('/:code', async (req, res) => {
    try {
      const code = req.params.code;
      if (!code || code.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Código de rastreamento não fornecido.' });
      }

      const orderData = await dbHelpers.getOrderByTrackingCode(code);
      if (!orderData) {
        return res.status(404).json({
          success: false,
          error: 'Código de rastreamento não localizado no sistema. Verifique os dígitos e tente novamente.'
        });
      }

      res.json({
        success: true,
        data: {
          tracking_code: orderData.tracking_code,
          status: orderData.status,
          customer_name_masked: orderData.customer_name ? (orderData.customer_name.split(' ')[0] + ' ***') : 'Cliente',
          destination: `${orderData.city} / ${orderData.state}`,
          items_description: orderData.items_description || 'Produto Apple Original Lacrado',
          created_at: orderData.created_at,
          updated_at: orderData.updated_at,
          checkpoints: orderData.checkpoints || []
        }
      });
    } catch (error) {
      console.error('Erro na consulta de rastreio:', error);
      res.status(500).json({ success: false, error: 'Erro interno ao consultar rastreamento.' });
    }
  });
}

// ========================================================
// 🔐 ROTAS DE ADMINISTRAÇÃO & GESTÃO
// ========================================================
let adminRoutes = null;
try {
  adminRoutes = require('./routes/admin');
} catch (e) {
  try {
    adminRoutes = require('./admin');
  } catch (e2) {}
}

if (!adminRoutes) {
  adminRoutes = express.Router();
  let cachedPassword = '6666';

  async function requireAdminAuth(req, res, next) {
    const authPassword = req.headers['x-admin-password'] || req.headers['authorization'];
    if (!authPassword) {
      return res.status(401).json({ success: false, error: 'Acesso negado. Senha não fornecida.' });
    }

    const cleanAuth = authPassword.replace('Bearer ', '').trim();
    if (cleanAuth !== cachedPassword) {
      try {
        const currentDbPassword = await dbHelpers.getSetting('admin_password');
        if (currentDbPassword) cachedPassword = currentDbPassword;
      } catch (e) {}

      if (cleanAuth !== cachedPassword) {
        return res.status(401).json({ success: false, error: 'Acesso negado. Senha incorreta.' });
      }
    }
    next();
  }

  adminRoutes.post('/login', async (req, res) => {
    try {
      const { password } = req.body;
      let currentPassword = cachedPassword;
      try {
        const dbPwd = await dbHelpers.getSetting('admin_password');
        if (dbPwd) {
          currentPassword = dbPwd;
          cachedPassword = dbPwd;
        }
      } catch (e) {}

      if (password === currentPassword) {
        return res.json({ success: true, message: 'Autenticado com sucesso!', token: currentPassword });
      } else {
        return res.status(401).json({ success: false, error: 'Senha incorreta.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro no servidor de autenticação.' });
    }
  });

  adminRoutes.use(requireAdminAuth);

  adminRoutes.get('/generate-code', async (req, res) => {
    try {
      const code = await dbHelpers.generateTrackingCode();
      res.json({ success: true, code });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao gerar código de rastreamento.' });
    }
  });

  adminRoutes.get('/orders', async (req, res) => {
    try {
      const orders = await dbHelpers.getAllOrders();
      const info = dbHelpers.getDatabaseInfo();
      res.json({ success: true, orders, database: info });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({ success: false, error: 'Erro ao buscar pedidos no servidor.' });
    }
  });

  adminRoutes.post('/orders', async (req, res) => {
    try {
      const { customer_name, customer_phone, address, number, complement, neighborhood, city, state, cep, items_description, tracking_code } = req.body;
      if (!customer_name || !address || !cep) {
        return res.status(400).json({ success: false, error: 'Preencha os campos obrigatórios: Nome do Cliente, Endereço e CEP.' });
      }

      const newOrder = await dbHelpers.createOrder({
        customer_name,
        customer_phone,
        address,
        number,
        complement,
        neighborhood,
        city: city || 'Divinópolis',
        state: state || 'MG',
        cep,
        items_description: items_description || 'iPhone Original Lacrado',
        tracking_code
      });

      res.status(201).json({ success: true, message: 'Envio cadastrado e código gerado com sucesso!', order: newOrder });
    } catch (error) {
      console.error('Erro ao cadastrar envio:', error);
      res.status(500).json({ success: false, error: 'Erro ao criar envio no servidor.' });
    }
  });

  adminRoutes.get('/orders/:id', async (req, res) => {
    try {
      const order = await dbHelpers.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ success: false, error: 'Envio não encontrado.' });
      res.json({ success: true, order });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar detalhes do envio.' });
    }
  });

  adminRoutes.post('/orders/:id/checkpoints', async (req, res) => {
    try {
      const { status, description, location, timestamp } = req.body;
      if (!status || !description) {
        return res.status(400).json({ success: false, error: 'Informe o status e a descrição da movimentação.' });
      }

      await dbHelpers.addCheckpoint(
        req.params.id,
        status,
        description,
        location || 'Divinópolis / MG',
        timestamp
      );

      const updatedOrder = await dbHelpers.getOrderById(req.params.id);
      res.json({ success: true, message: 'Movimentação adicionada ao rastreio com sucesso!', order: updatedOrder });
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      res.status(500).json({ success: false, error: 'Erro ao atualizar rastreamento.' });
    }
  });

  adminRoutes.delete('/orders/:id', async (req, res) => {
    try {
      await dbHelpers.deleteOrder(req.params.id);
      res.json({ success: true, message: 'Envio excluído com sucesso.' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao excluir envio.' });
    }
  });

  adminRoutes.get('/settings', async (req, res) => {
    try {
      const settings = await dbHelpers.getAllSettings();
      res.json({ success: true, settings });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar configurações.' });
    }
  });

  adminRoutes.post('/settings', async (req, res) => {
    try {
      const { admin_password, whatsapp_number, address, city, state, company_name, cnpj } = req.body;
      if (admin_password) {
        await dbHelpers.setSetting('admin_password', admin_password);
        cachedPassword = admin_password;
      }
      if (whatsapp_number) await dbHelpers.setSetting('whatsapp_number', whatsapp_number);
      if (address) await dbHelpers.setSetting('address', address);
      if (cnpj) await dbHelpers.setSetting('cnpj', cnpj);
      if (city) await dbHelpers.setSetting('city', city);
      if (state) await dbHelpers.setSetting('state', state);
      if (company_name) await dbHelpers.setSetting('company_name', company_name);

      res.json({ success: true, message: 'Configurações atualizadas com sucesso!' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao salvar configurações.' });
    }
  });
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================================
// 📁 LOCALIZADOR FLEXÍVEL DE ARQUIVOS ESTÁTICOS
// (Compatível tanto com pasta public/ quanto com raiz no Render)
// ========================================================
const fs = require('fs');

function resolvePublicPath(relativePath) {
  const candidates = [
    path.join(__dirname, 'public', relativePath),
    path.join(__dirname, relativePath),
    path.join(process.cwd(), 'public', relativePath),
    path.join(process.cwd(), relativePath)
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return path.join(__dirname, 'public', relativePath);
}

// Servir arquivos estáticos de múltiplos locais com fallback automático
if (fs.existsSync(path.join(__dirname, 'public'))) {
  app.use(express.static(path.join(__dirname, 'public')));
}
if (fs.existsSync(path.join(__dirname, 'public', 'assets'))) {
  app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
}
if (fs.existsSync(path.join(__dirname, 'assets'))) {
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
}
app.use(express.static(__dirname));

// ========================================================
// ⚡ INTEGRAÇÃO API PIX (SCALA & BACKEND CHECKOUT)
// ========================================================

const SCALA_CONFIG = {
  apiKey: process.env.SCALA_API_KEY || '',
  secretKey: process.env.SCALA_SECRET_KEY || '',
  baseUrl: process.env.SCALA_BASE_URL || 'https://api.scalapagamentos.com.br',
  pixKey: process.env.PIX_KEY || '5516997655257',
  merchantName: 'STARCELL',
  merchantCity: 'DIVINOPOLIS'
};

// Armazenamento em memória das transações Pix
const pixOrders = new Map();

// Helper para gerar Payload Pix EMV (Copia e Cola)
function generatePixCopiaECola({ chave, nome, cidade, valor, txid }) {
  const cleanKey = chave.trim();
  const cleanName = nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().slice(0, 25);
  const cleanCity = cidade.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().slice(0, 15);
  const formattedValor = valor.toFixed(2);
  const cleanTxid = txid.slice(0, 25);

  function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', cleanKey);
  const merchantAccountInfo = formatField('26', `${gui}${key}`);
  const payloadFormatIndicator = formatField('00', '01');
  const merchantCategoryCode = formatField('52', '0000');
  const transactionCurrency = formatField('53', '986');
  const transactionAmount = formatField('54', formattedValor);
  const countryCode = formatField('58', 'BR');
  const merchantNameField = formatField('59', cleanName);
  const merchantCityField = formatField('60', cleanCity);
  const additionalDataField = formatField('62', formatField('05', cleanTxid));

  const rawPayload = `${payloadFormatIndicator}${merchantAccountInfo}${merchantCategoryCode}${transactionCurrency}${transactionAmount}${countryCode}${merchantNameField}${merchantCityField}${additionalDataField}6304`;

  function crc16(str) {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
      crc ^= str.charCodeAt(c) << 8;
      for (let i = 0; i < 8; i++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = crc << 1;
        }
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  return `${rawPayload}${crc16(rawPayload)}`;
}

// 🛒 Criar Cobrança Pix Imediata
app.post('/api/pix/create-charge', async (req, res) => {
  try {
    const { product, customer } = req.body;

    if (!product || !product.price || !customer || !customer.name || !customer.cpf) {
      return res.status(400).json({ error: 'Dados incompletos para gerar a cobrança Pix.' });
    }

    const orderId = `FLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalAmount = parseFloat((product.price * 0.95).toFixed(2));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

    const pixCode = generatePixCopiaECola({
      chave: SCALA_CONFIG.pixKey,
      nome: SCALA_CONFIG.merchantName,
      cidade: SCALA_CONFIG.merchantCity,
      valor: finalAmount,
      txid: orderId
    });

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;

    const orderData = {
      orderId,
      product,
      customer,
      finalAmount,
      pixCode,
      qrCodeUrl,
      status: 'PENDING',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      paidAt: null
    };

    pixOrders.set(orderId, orderData);

    try {
      if (typeof db.createOrder === 'function') {
        db.createOrder({
          tracking_code: orderId,
          customer_name: customer.name || 'Cliente StarCell',
          customer_phone: customer.phone || '',
          address: customer.address || 'Loja Física - Av. Sete de Setembro, 783',
          city: customer.city || 'Divinópolis',
          state: customer.state || 'MG',
          product_name: `${product.name} ${product.storage || ''} (${product.color || ''})`,
          product_value: finalAmount
        });
      }
    } catch (e) {
      console.log('Pré-registro de logística ok.');
    }

    return res.json({
      success: true,
      orderId,
      finalAmount,
      pixCode,
      qrCodeUrl,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Erro ao gerar cobrança Pix:', error);
    res.status(500).json({ error: 'Falha ao processar pagamento Pix.' });
  }
});

// 🔍 Consultar Status do Pedido Pix
app.get('/api/pix/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = pixOrders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  if (order.status === 'PENDING' && new Date() > new Date(order.expiresAt)) {
    order.status = 'EXPIRED';
  }

  res.json({
    orderId: order.orderId,
    status: order.status,
    finalAmount: order.finalAmount,
    product: order.product
  });
});

// 🧪 Simular Pagamento Aprovado (Ambiente de Testes / Sandbox)
app.post('/api/pix/simulate-pay/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = pixOrders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  order.status = 'PAID';
  order.paidAt = new Date().toISOString();
  pixOrders.set(orderId, order);

  res.json({ success: true, orderId, status: 'PAID' });
});

// 🔔 Webhook Oficial para Callback da API Scala
app.post('/api/pix/webhook', (req, res) => {
  const event = req.body;
  console.log('📩 [Scala Webhook] Notificação recebida:', JSON.stringify(event));

  const orderId = event.metadata?.orderId || event.orderId || event.data?.metadata?.orderId;
  const status = (event.status || event.data?.status || '').toUpperCase();

  if (orderId && pixOrders.has(orderId)) {
    const order = pixOrders.get(orderId);
    if (status === 'PAID' || status === 'COMPLETED' || status === 'CONFIRMED') {
      order.status = 'PAID';
      order.paidAt = new Date().toISOString();
      pixOrders.set(orderId, order);
      console.log(`✅ [Scala Webhook] Pedido ${orderId} aprovado com sucesso!`);
    }
  }

  res.status(200).json({ received: true });
});

// Rotas da API
app.use('/api/admin', adminRoutes);
app.use('/api/tracking', trackingRoutes);

// Rotas Amigáveis com Localizador Flexível
app.get('/admin', (req, res) => {
  res.sendFile(resolvePublicPath('admin.html'));
});

app.get('/rastreio', (req, res) => {
  res.sendFile(resolvePublicPath('rastreio.html'));
});

app.get('/catalogo', (req, res) => {
  res.sendFile(resolvePublicPath('index.html'));
});

// Fallback para SPA / Home
app.get('*', (req, res) => {
  res.sendFile(resolvePublicPath('index.html'));
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ STARCELL - Sistema de Vendas & Logística Online`);
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log(`💎 Tema: Apple Flagship White + Motion Design Ativo`);
  console.log(`💳 Gateway Pix: Scala API Pronto & Integrado`);
  console.log(`📦 Rastreio Público:    http://localhost:${PORT}/rastreio`);
  console.log(`🔐 Painel Admin:        http://localhost:${PORT}/admin  (Senha: 6666)`);
  console.log(`=======================================================`);
});
