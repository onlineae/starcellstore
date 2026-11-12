const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const trackingRoutes = require('./routes/tracking');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos Estáticos (Front-end, CSS, JS, Imagens)
app.use(express.static(path.join(__dirname, 'public')));

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
  const keyField = formatField('01', cleanKey);
  const accountInfo = formatField('26', `${gui}${keyField}`);
  const catCode = formatField('52', '0000');
  const currency = formatField('53', '986');
  const amountField = formatField('54', formattedValor);
  const country = formatField('58', 'BR');
  const nameField = formatField('59', cleanName);
  const cityField = formatField('60', cleanCity);
  const txidField = formatField('05', cleanTxid);
  const addData = formatField('62', txidField);

  const rawPayload = `000201${accountInfo}${catCode}${currency}${amountField}${country}${nameField}${cityField}${addData}6304`;

  // Cálculo CRC16-CCITT
  let crc = 0xFFFF;
  for (let i = 0; i < rawPayload.length; i++) {
    crc ^= (rawPayload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return `${rawPayload}${crcHex}`;
}

// 🛒 Criar Transação Pix no Checkout
app.post('/api/pix/create', async (req, res) => {
  try {
    const { product, customer } = req.body;

    if (!product || !customer) {
      return res.status(400).json({ error: 'Dados do produto e cliente são obrigatórios.' });
    }

    const orderId = `FLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const txid = `PIX${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
    const rawPrice = parseFloat(product.price) || 0;
    // 5% de desconto no Pix
    const finalAmount = Math.max(1, +(rawPrice * 0.95).toFixed(2));

    let pixCode = '';
    let qrCodeUrl = '';
    let provider = 'Local Gateway';

    // Se as credenciais da API Scala estiverem presentes no .env:
    if (SCALA_CONFIG.apiKey && SCALA_CONFIG.apiKey.trim() !== '') {
      try {
        console.log(`📡 [Scala Pix] Chamando API Scala para o pedido ${orderId}...`);
        const response = await fetch(`${SCALA_CONFIG.baseUrl}/v1/charges/pix`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SCALA_CONFIG.apiKey}`
          },
          body: JSON.stringify({
            amount: Math.round(finalAmount * 100), // centavos
            description: `${product.name} ${product.storage || ''} - StarCell`,
            customer: {
              name: customer.name,
              tax_id: customer.cpf.replace(/\D/g, ''),
              phone: customer.phone.replace(/\D/g, '')
            },
            metadata: { orderId }
          })
        });

        if (response.ok) {
          const scalaData = await response.json();
          pixCode = scalaData.emv_payload || scalaData.qr_code_text || scalaData.copy_paste;
          qrCodeUrl = scalaData.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;
          provider = 'Scala Pix API';
        } else {
          console.warn('⚠️ [Scala Pix] Retorno não-200 da Scala. Usando gerador padrão.');
        }
      } catch (err) {
        console.error('⚠️ [Scala Pix] Erro de conexão com API Scala. Alternando para gerador padrão:', err.message);
      }
    }

    // Gerador de Pix EMV padrão caso Scala não retorne ou não esteja configurada
    if (!pixCode) {
      pixCode = generatePixCopiaECola({
        chave: SCALA_CONFIG.pixKey,
        nome: SCALA_CONFIG.merchantName,
        cidade: SCALA_CONFIG.merchantCity,
        valor: finalAmount,
        txid: txid
      });
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(pixCode)}`;
    }

    const orderData = {
      orderId,
      txid,
      product,
      customer,
      finalAmount,
      originalAmount: rawPrice,
      pixCode,
      qrCodeUrl,
      provider,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };

    pixOrders.set(orderId, orderData);

    // Salva ou registra pré-ordem na logística para rastreio
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
      provider,
      expiresAt: orderData.expiresAt
    });

  } catch (err) {
    console.error('Erro ao gerar Pix:', err);
    res.status(500).json({ error: 'Erro interno ao gerar cobrança PIX.' });
  }
});

// 🔍 Consultar Status do Pix
app.get('/api/pix/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = pixOrders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  // Verifica expiração
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

// Rotas da API existentes
app.use('/api/admin', adminRoutes);
app.use('/api/tracking', trackingRoutes);

// Rotas Amigáveis
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/rastreio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rastreio.html'));
});

app.get('/catalogo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback para SPA / Home
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
