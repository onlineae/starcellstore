const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database');

let cachedPassword = '6666'; // 🔐 Senha padrão solicitada

// Middleware de Autenticação Admin
async function requireAdminAuth(req, res, next) {
  const authPassword = req.headers['x-admin-password'] || req.headers['authorization'];
  if (!authPassword) {
    return res.status(401).json({
      success: false,
      error: 'Acesso negado. Senha não fornecida.'
    });
  }

  const cleanAuth = authPassword.replace('Bearer ', '').trim();
  if (cleanAuth !== cachedPassword) {
    try {
      const currentDbPassword = await dbHelpers.getSetting('admin_password');
      if (currentDbPassword) cachedPassword = currentDbPassword;
    } catch (e) {}

    if (cleanAuth !== cachedPassword) {
      return res.status(401).json({
        success: false,
        error: 'Acesso negado. Senha incorreta.'
      });
    }
  }
  next();
}

// Rota de Login / Validação de Senha
router.post('/login', async (req, res) => {
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
      return res.json({
        success: true,
        message: 'Autenticado com sucesso!',
        token: currentPassword
      });
    } else {
      return res.status(401).json({
        success: false,
        error: 'Senha incorreta.'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro no servidor de autenticação.' });
  }
});

// A partir daqui, todas as rotas exigem a senha de admin
router.use(requireAdminAuth);

// Gerar novo código de rastreio único
router.get('/generate-code', async (req, res) => {
  try {
    const code = await dbHelpers.generateTrackingCode();
    res.json({ success: true, code });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao gerar código de rastreamento.' });
  }
});

// Listar todos os envios
router.get('/orders', async (req, res) => {
  try {
    const orders = await dbHelpers.getAllOrders();
    const info = dbHelpers.getDatabaseInfo();
    res.json({
      success: true,
      orders,
      database: info
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar pedidos no servidor.' });
  }
});

// Cadastrar novo envio
router.post('/orders', async (req, res) => {
  try {
    const { customer_name, customer_phone, address, number, complement, neighborhood, city, state, cep, items_description, tracking_code } = req.body;

    if (!customer_name || !address || !cep) {
      return res.status(400).json({
        success: false,
        error: 'Preencha os campos obrigatórios: Nome do Cliente, Endereço e CEP.'
      });
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

    res.status(201).json({
      success: true,
      message: 'Envio cadastrado e código gerado com sucesso!',
      order: newOrder
    });
  } catch (error) {
    console.error('Erro ao cadastrar envio:', error);
    res.status(500).json({ success: false, error: 'Erro ao criar envio no servidor.' });
  }
});

// Obter detalhes de um pedido
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await dbHelpers.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Envio não encontrado.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar detalhes do envio.' });
  }
});

// Adicionar checkpoint/atualização de rastreio
router.post('/orders/:id/checkpoints', async (req, res) => {
  try {
    const { status, description, location, timestamp } = req.body;

    if (!status || !description) {
      return res.status(400).json({
        success: false,
        error: 'Informe o status e a descrição da movimentação.'
      });
    }

    await dbHelpers.addCheckpoint(
      req.params.id,
      status,
      description,
      location || 'Divinópolis / MG',
      timestamp
    );

    const updatedOrder = await dbHelpers.getOrderById(req.params.id);

    res.json({
      success: true,
      message: 'Movimentação adicionada ao rastreio com sucesso!',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Erro ao adicionar movimentação:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar rastreamento.' });
  }
});

// Excluir envio
router.delete('/orders/:id', async (req, res) => {
  try {
    await dbHelpers.deleteOrder(req.params.id);
    res.json({ success: true, message: 'Envio excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao excluir envio.' });
  }
});

// Configurações
router.get('/settings', async (req, res) => {
  try {
    const settings = await dbHelpers.getAllSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao buscar configurações.' });
  }
});

router.post('/settings', async (req, res) => {
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

module.exports = router;
