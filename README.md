# ⚡ FLINN iPHONES - Sistema de Vendas & Logística com Rastreio

Sistema completo desenvolvido para a **FLINN iPhones**, incluindo:
1. **Loja Virtual / Catálogo Completo**: iPhone 18 Pro Max, 18 Pro, Linha 17, 15, Apple Watch Ultra e Acessórios com troca dinâmica de cor, capacidade e botões diretos de WhatsApp com mensagem personalizada.
2. **Área de Clientes Satisfeitos**: Fotos reais de entregas com a marca FLINN iPhones, avaliações 4.7+ e sem nomes individuais.
3. **Endereço Físico Oficial**: Av. Washington Luiz, 2102 - Jardim Paulista, Pres. Prudente - SP, 19023-450.
4. **Painel de Emissão de Rastreio (`/admin`)**: Acesso protegido com a **senha 1103**, gerador de código com prefixo `FL...BR`, preenchimento automático de endereço por CEP (ViaCEP), controle de checkpoints e botão de envio de mensagem pronta no WhatsApp do cliente.
5. **Página Pública de Rastreamento (`/rastreio`)**: Onde o cliente digita o código ou acessa diretamente pelo link (ex: `/rastreio?codigo=FL849204928BR`) e acompanha a barra de progresso e histórico de movimentações.

---

## 🔐 Dados de Acesso do Lojista
- **URL do Painel:** `http://localhost:3000/admin` (ou seu domínio na Render: `https://sua-loja.onrender.com/admin`)
- **Senha Padrão:** `1103`

---

## 🚀 Como Subir para o GitHub

1. Abra o terminal (PowerShell ou Git Bash) dentro da pasta do projeto:
```bash
git init
git add .
git commit -m "FLINN iPhones - Catálogo e Sistema de Rastreio"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

---

## ☁️ Como Fazer o Deploy na Render

1. Acesse **[dashboard.render.com](https://dashboard.render.com)**.
2. Clique em **New +** > **Web Service**.
3. Conecte seu repositório do GitHub.
4. Preencha as configurações:
   - **Name:** `bs-phone-store` (ou o nome que preferir)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`
5. (Opcional - Banco de Dados na Nuvem):
   - Se desejar que os rastreios nunca sumam após reinicializações do plano gratuito da Render, crie um **PostgreSQL** gratuito na Render e adicione a variável de ambiente:
     - Key: `DATABASE_URL`
     - Value: `(Sua Internal Database URL da Render)`
   - O sistema detecta automaticamente se existe PostgreSQL ou utiliza SQLite/JSON como fallback!
6. Clique em **Deploy Web Service** e pronto!

---

## 💻 Como Rodar no Computador Localmente

1. Dê dois cliques em **`iniciar-servidor.bat`** ou execute:
```bash
npm start
```
2. Acesse:
- Loja: `http://localhost:3000`
- Rastreio: `http://localhost:3000/rastreio`
- Admin: `http://localhost:3000/admin`
