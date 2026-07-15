/* ==========================================================================
   DZ VIBES SHOP — app.js  v8  (Supabase Backend)
   5 Categories: subscriptions · mobile · playstation · xbox · pc
   ALL official links guaranteed:
     Discord  → https://discord.com/invite/cPSgv6F8X9
     Instagram→ https://www.instagram.com/dzvibes_shop/
     Telegram → https://t.me/DzVibesShop
   ========================================================================== */

/* ══════════════════════════════════════════════════════════════════════════
   ① SUPABASE CONFIG
   ══════════════════════════════════════════════════════════════════════════ */
const SUPABASE_URL      = 'https://btxmvkdlxcbnqvlcuxzb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oKG9Cc_JAtKGbVnq-ep07g_LpLdLCiw';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ══════════════════════════════════════════════════════════════════════════
   ② CONFIGURATION — all official links defined here as single source of truth
   ══════════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  INSTAGRAM_URL:     "https://www.instagram.com/dzvibes_shop/",
  TELEGRAM_URL:      "https://t.me/DzVibesShop",
  TELEGRAM_USERNAME: "DzVibesShop",
  DISCORD_INVITE:    "https://discord.com/invite/cPSgv6F8X9",
  ADMIN_PASSWORD:    "Dz.Vibes.0107@",
  STORAGE_KEYS: {
    PROMOS:        "dzvibes_promocodes",
    ADMIN_SESSION: "dzvibes_admin_session"
  }
};

/* ── Discord Webhook URL ─────────────────────────────────────────────────── */
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1526595172257890495/z4h2S55tHBplz3uoa5cvQwiCmHuWZ_BA7Ru6QBkNH8iEYjqZwpirDO5ZkFQ0H4OVzhT8";

/* ── Category metadata ───────────────────────────────────────────────────── */
const CATEGORY_META = {
  subscriptions: { label: "🔌 اشتراكات رقمية",    color: 0xff1a1a },
  mobile:        { label: "📱 شحن ألعاب الهاتف",   color: 0xe60000 },
  playstation:   { label: "🎮 بلاي ستايشن (PSN)",  color: 0xb30000 },
  xbox:          { label: "💚 إكس بوكس (Xbox)",    color: 0xff4d4d },
  pc:            { label: "🖥️ ألعاب وحسابات PC",  color: 0x800000 }
};

/* ══════════════════════════════════════════════════════════════════════════
   ③ SUPABASE PRODUCT HELPERS
   ══════════════════════════════════════════════════════════════════════════ */

async function fetchProducts() {
  const { data, error } = await supabaseClient
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('fetchProducts error:', error.message);
    showToast('⚠️ تعذّر تحميل المنتجات. تحقق من الاتصال.');
    return [];
  }

  return (data || []).map(mapDbRowToProduct);
}

async function insertProduct(productData) {
  const { error } = await supabaseClient
    .from('products')
    .insert([mapProductToDbRow(productData)]);

  if (error) {
    console.error('insertProduct error:', error.message);
    showToast('⚠️ فشل إضافة المنتج: ' + error.message);
    return false;
  }
  return true;
}

async function updateProduct(productData) {
  const { error } = await supabaseClient
    .from('products')
    .update(mapProductToDbRow(productData))
    .eq('id', productData.id);

  if (error) {
    console.error('updateProduct error:', error.message);
    showToast('⚠️ فشل تحديث المنتج: ' + error.message);
    return false;
  }
  return true;
}

async function deleteProductFromDb(id) {
  const { error } = await supabaseClient
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteProduct error:', error.message);
    showToast('⚠️ فشل حذف المنتج: ' + error.message);
    return false;
  }
  return true;
}

/* ── Column-name mapping helpers ─────────────────────────────────────────── */

function mapDbRowToProduct(row) {
  let meta        = {};
  let description = row.description || '';

  if (description.startsWith('__meta__')) {
    const newline = description.indexOf('\n');
    try {
      const jsonStr = newline === -1
        ? description.slice(8)
        : description.slice(8, newline);
      meta        = JSON.parse(jsonStr);
      description = newline === -1 ? '' : description.slice(newline + 1);
    } catch (_) { /* Malformed meta — ignore */ }
  }

  return {
    id:               row.id,
    title:            row.title            || '',
    category:         row.category         || '',
    image:            row.image_url        || '',
    price:            parseFloat(row.price) || 0,
    cost:             parseFloat(meta.cost)            || 0,
    profitPercent:    parseFloat(meta.profitPercent)   || 0,
    discountPercent:  parseFloat(meta.discountPercent) || 0,
    description:      description,
    telegramUsername: meta.telegramUsername || '',
    discordLink:      meta.discordLink      || '',
    topSeller:        meta.topSeller        === true,
    available:        meta.available        !== false
  };
}

function mapProductToDbRow(p) {
  const meta = {
    cost:             p.cost,
    profitPercent:    p.profitPercent,
    discountPercent:  p.discountPercent,
    telegramUsername: p.telegramUsername,
    discordLink:      p.discordLink,
    topSeller:        p.topSeller,
    available:        p.available
  };

  const finalPrice      = calculateFinalPrice(p.cost, p.profitPercent, p.discountPercent);
  const fullDescription = `__meta__${JSON.stringify(meta)}\n${p.description || ''}`;

  return {
    title:       p.title,
    price:       finalPrice,
    image_url:   p.image,
    category:    p.category,
    description: fullDescription
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   ④ PROMO CODE HELPERS (localStorage)
   ══════════════════════════════════════════════════════════════════════════ */
const getPromoCodes  = () =>
  JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.PROMOS) || '[]');
const savePromoCodes = (p) =>
  localStorage.setItem(CONFIG.STORAGE_KEYS.PROMOS, JSON.stringify(p));

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

/* ══════════════════════════════════════════════════════════════════════════
   ⑤ PRICING ENGINE
   ══════════════════════════════════════════════════════════════════════════ */
const calculateBasePrice = (cost, profit) =>
  (parseFloat(cost) || 0) * (1 + (parseFloat(profit) || 0) / 100);

const calculateFinalPrice = (cost, profit, discount) => {
  const base = calculateBasePrice(cost, profit);
  const d    = parseFloat(discount) || 0;
  return d > 0 ? base * (1 - d / 100) : base;
};

const formatPrice = (v) => {
  const r = Math.round(v * 100) / 100;
  return r % 1 === 0 ? r.toString() : r.toFixed(2);
};

/* ══════════════════════════════════════════════════════════════════════════
   ⑥ ROUTER
   ══════════════════════════════════════════════════════════════════════════ */
const homeView      = document.getElementById('home-view');
const adminView     = document.getElementById('admin-view');
const searchWrapper = document.getElementById('searchWrapper');

function router() {
  const hash = window.location.hash.replace('#', '') || 'home';
  if (hash === 'admin') {
    if (!isAdminAuthenticated()) {
      window.location.hash = 'home';
      openPasswordModal();
      return;
    }
    showAdminView();
  } else {
    showHomeView();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAdminView() {
  homeView.style.display  = 'none';
  adminView.style.display = 'block';
  searchWrapper.style.visibility = 'hidden';
  renderAdminProductTable();
  renderAdminPromoList();
}

function showHomeView() {
  homeView.style.display  = 'block';
  adminView.style.display = 'none';
  searchWrapper.style.visibility = 'visible';
  renderProductsGrid();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN AUTH
   ══════════════════════════════════════════════════════════════════════════ */
const passwordModalOverlay = document.getElementById('passwordModalOverlay');
const passwordForm         = document.getElementById('passwordForm');
const adminPasswordInput   = document.getElementById('adminPasswordInput');
const passwordCancelBtn    = document.getElementById('passwordCancelBtn');

const isAdminAuthenticated = () =>
  sessionStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_SESSION) === 'true';

function openPasswordModal() {
  passwordModalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => adminPasswordInput.focus(), 100);
}
function closePasswordModal() {
  passwordModalOverlay.classList.remove('show');
  document.body.style.overflow = '';
  passwordForm.reset();
}

passwordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (adminPasswordInput.value === CONFIG.ADMIN_PASSWORD) {
    sessionStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_SESSION, 'true');
    closePasswordModal();
    window.location.hash = 'admin';
  } else {
    alert('Access Denied / عذراً، كلمة المرور خاطئة');
    adminPasswordInput.value = '';
    adminPasswordInput.focus();
  }
});

passwordCancelBtn.addEventListener('click', () => {
  closePasswordModal();
  if (window.location.hash.replace('#', '') !== 'home') window.location.hash = 'home';
});
passwordModalOverlay.addEventListener('click', (e) => {
  if (e.target === passwordModalOverlay) passwordCancelBtn.click();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && passwordModalOverlay.classList.contains('show'))
    passwordCancelBtn.click();
});

document.getElementById('adminDot').addEventListener('click', () =>
  isAdminAuthenticated() ? (window.location.hash = 'admin') : openPasswordModal()
);
document.getElementById('logoHome').addEventListener('click', () =>
  window.location.hash = 'home'
);

/* ══════════════════════════════════════════════════════════════════════════
   ⑦ CATEGORY FILTER STATE
   ══════════════════════════════════════════════════════════════════════════ */
let activeCategory = 'all';

document.querySelectorAll('.cat-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeCategory = btn.dataset.cat;
    renderProductsGrid(document.getElementById('searchInput').value);
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   ⑧ SKELETON LOADER
   ══════════════════════════════════════════════════════════════════════════ */
const skeletonGrid      = document.getElementById('skeletonGrid');
const productsGrid      = document.getElementById('productsGrid');
const emptyState        = document.getElementById('emptyState');
const emptyTitle        = document.getElementById('emptyTitle');
const emptyMsg          = document.getElementById('emptyMsg');
const productCountBadge = document.getElementById('productCountBadge');

const SKELETON_COUNT    = 6;
const SKELETON_DELAY_MS = 650;

function buildSkeletonCard() {
  const sk = document.createElement('div');
  sk.className = 'skeleton-card';
  sk.innerHTML = `
    <div class="skeleton-image skeleton-shimmer"></div>
    <div class="skeleton-body">
      <div class="skeleton-line w-80 skeleton-shimmer"></div>
      <div class="skeleton-line w-55 skeleton-shimmer"></div>
      <div class="skeleton-line w-40 skeleton-shimmer"></div>
      <div class="skeleton-btn-row">
        <div class="skeleton-btn skeleton-shimmer"></div>
        <div class="skeleton-btn skeleton-shimmer"></div>
        <div class="skeleton-btn skeleton-shimmer"></div>
      </div>
    </div>`;
  return sk;
}

async function renderProductsGrid(filterText = '') {
  productsGrid.style.display  = 'none';
  emptyState.style.display    = 'none';
  skeletonGrid.style.display  = 'grid';
  skeletonGrid.innerHTML      = '';
  productCountBadge.textContent = '';

  for (let i = 0; i < SKELETON_COUNT; i++) {
    skeletonGrid.appendChild(buildSkeletonCard());
  }

  const [allProducts] = await Promise.all([
    fetchProducts(),
    new Promise(resolve => setTimeout(resolve, SKELETON_DELAY_MS))
  ]);

  _cachedProducts = allProducts;

  skeletonGrid.style.display = 'none';
  productsGrid.style.display = 'grid';
  _doRender(allProducts, filterText);
}

/* ══════════════════════════════════════════════════════════════════════════
   ⑨ STORE FRONT — RENDER PRODUCTS
   ══════════════════════════════════════════════════════════════════════════ */
function _doRender(allProducts, filterText = '') {
  const term = filterText.trim().toLowerCase();

  let filtered = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  if (term) filtered = filtered.filter(p =>
    p.title.toLowerCase().includes(term)
  );

  productsGrid.innerHTML   = '';
  emptyState.style.display = 'none';

  if (allProducts.length === 0) {
    emptyState.style.display   = 'block';
    emptyTitle.textContent     = 'لا توجد منتجات بعد';
    emptyMsg.textContent       = 'تحقق لاحقاً — فريقنا يُعدّ عروضاً رائعة لك!';
    productCountBadge.textContent = '';
    productsGrid.style.display = 'none';
    return;
  }

  if (filtered.length === 0) {
    emptyState.style.display   = 'block';
    emptyTitle.textContent     = 'لا توجد منتجات مطابقة';
    emptyMsg.textContent       = term
      ? 'جرّب كلمة بحث مختلفة أو غيّر القسم.'
      : 'لا توجد منتجات في هذا القسم بعد.';
    productCountBadge.textContent = '';
    productsGrid.style.display = 'none';
    return;
  }

  productsGrid.style.display    = 'grid';
  productCountBadge.textContent = `${filtered.length} منتج`;
  filtered.forEach(p => productsGrid.appendChild(buildProductCard(p)));
}

/* Search input */
document.getElementById('searchInput').addEventListener('input', (e) =>
  renderProductsGrid(e.target.value)
);

/* ══════════════════════════════════════════════════════════════════════════
   ORDER LINK RESOLVER
   — Always uses official CONFIG links as guaranteed fallback
   ══════════════════════════════════════════════════════════════════════════ */
function resolveOrderLink(platform, product, message) {
  const encoded = encodeURIComponent(message);
  switch (platform) {
    case 'instagram':
      /* Always official Instagram — no override */
      return CONFIG.INSTAGRAM_URL;

    case 'telegram': {
      /* Use product-level override username if set, else global default */
      const user = (product.telegramUsername && product.telegramUsername.trim())
        ? product.telegramUsername.trim()
        : CONFIG.TELEGRAM_USERNAME;
      return `https://t.me/${user}?text=${encoded}`;
    }

    case 'discord':
      /* Use product-level discord link if valid, else ALWAYS fall back to
         the official invite — never return '#' or void  */
      if (product.discordLink && product.discordLink.trim() &&
          product.discordLink.trim() !== '#') {
        return product.discordLink.trim();
      }
      return CONFIG.DISCORD_INVITE;

    default:
      return CONFIG.DISCORD_INVITE;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   DISCORD WEBHOOK
   ══════════════════════════════════════════════════════════════════════════ */
async function sendDiscordWebhookEmbed(product, finalPrice, appliedPromo) {
  if (!DISCORD_WEBHOOK_URL) return;

  const catMeta  = CATEGORY_META[product.category] || { label: '—', color: 0x5865f2 };
  const priceStr = `${formatPrice(finalPrice)} DA${appliedPromo
    ? `  *(كود: ${appliedPromo.code} -${appliedPromo.discountValue}%)*`
    : ''}`;

  const payload = {
    username:   'Dz Vibes Bot',
    avatar_url: 'https://i.imgur.com/4M34hi2.png',
    embeds: [{
      title:       `🛒 طلب جديد — ${product.title}`,
      description: 'وصل طلب جديد عبر Dz Vibes Shop!',
      color:       15073024,
      thumbnail:   product.image ? { url: product.image } : undefined,
      fields: [
        { name: '📦 المنتج', value: product.title, inline: true  },
        { name: '🏷️ القسم', value: catMeta.label,  inline: true  },
        { name: '💰 السعر',  value: priceStr,        inline: false }
      ],
      footer:    { text: 'Dz Vibes Shop Notification System' },
      timestamp: new Date().toISOString()
    }]
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Discord webhook error:', err);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   BUILD PRODUCT CARD
   — Buttons are <a> tags with real href values (no javascript:void)
   ══════════════════════════════════════════════════════════════════════════ */
function buildProductCard(product) {
  const basePrice   = calculateBasePrice(product.cost, product.profitPercent);
  const finalPrice  = calculateFinalPrice(product.cost, product.profitPercent, product.discountPercent);
  const hasDiscount = parseFloat(product.discountPercent) > 0;
  const isAvail     = product.available;

  /* Resolve the actual order URLs right now so they are baked into the href */
  const orderMsg       = buildOrderMessage(product, finalPrice, null);
  const instagramHref  = CONFIG.INSTAGRAM_URL;
  const telegramHref   = resolveOrderLink('telegram', product, orderMsg);
  /* Discord: product-level link or official invite — NEVER a placeholder */
  const discordHref    = (product.discordLink && product.discordLink.trim() &&
                          product.discordLink.trim() !== '#')
                          ? product.discordLink.trim()
                          : CONFIG.DISCORD_INVITE;

  const card = document.createElement('div');
  card.className  = 'product-card' + (isAvail ? '' : ' unavailable');
  card.dataset.id = product.id;

  let badges = '';
  if (product.topSeller) badges += `<span class="badge badge-hot">🔥 HOT</span>`;
  if (hasDiscount)       badges += `<span class="badge badge-sale">💥 SALE</span>`;
  if (!isAvail)          badges += `<span class="badge badge-outofstock">غير متوفر</span>`;

  const catMeta = product.category ? CATEGORY_META[product.category] : null;
  const catChip = catMeta
    ? `<span class="card-cat-chip" data-cat="${escapeHtml(product.category)}">${catMeta.label}</span>`
    : '';

  /* SVG icons */
  const igSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

  const tgSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`;

  const dcSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.114 18.105.134 18.12a19.919 19.919 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;

  /*
   * CRITICAL FIX:
   * All three order buttons are now proper <a> anchor tags with real href values.
   * - Instagram → always CONFIG.INSTAGRAM_URL
   * - Telegram  → resolveOrderLink result (with pre-filled message)
   * - Discord   → product.discordLink if valid, else CONFIG.DISCORD_INVITE
   *
   * For unavailable products: Instagram & Discord remain clickable (links still work).
   * Telegram is visually dimmed but still links via CSS pointer-events kept on <a>.
   * We add aria-disabled for accessibility on unavailable Telegram.
   */
  card.innerHTML = `
    <div class="product-image-wrap">
      <img src="${escapeHtml(product.image)}"
           alt="${escapeHtml(product.title)}"
           onerror="this.src='https://via.placeholder.com/400x250/141414/555?text=No+Image'">
      ${badges}
      ${catChip}
    </div>

    <div class="product-body">
      <div class="product-title">${escapeHtml(product.title)}</div>

      <button type="button" class="btn btn-learn-more" data-learn-more>
        📄 معرفة المزيد حول المنتج
      </button>

      <div class="price-row">
        ${hasDiscount
          ? `<span class="price-original">${formatPrice(basePrice)} DA</span>`
          : ''}
        <span class="price-final" data-final-price="${finalPrice}">
          ${formatPrice(finalPrice)} DA
        </span>
        <span class="applied-promo-tag" data-promo-tag></span>
      </div>

      <div class="promo-apply-row">
        <input type="text" placeholder="كود الخصم"
               data-promo-input maxlength="20" ${isAvail ? '' : 'disabled'}>
        <button class="btn btn-apply btn-sm" data-apply-promo
                ${isAvail ? '' : 'disabled'}>تطبيق</button>
      </div>
      <div class="promo-msg" data-promo-msg></div>

      <div class="order-buttons">

        <!-- Instagram: always official link, always opens in new tab -->
        <a href="${instagramHref}"
           target="_blank"
           rel="noopener noreferrer"
           class="btn btn-instagram card-order-btn"
           data-order="instagram"
           data-product-id="${escapeHtml(String(product.id))}"
           title="تواصل عبر انستغرام">
          ${igSvg} انستغرام
        </a>

        <!-- Telegram: pre-resolved link with message, disabled style if unavailable -->
        <a href="${isAvail ? escapeHtml(telegramHref) : 'https://t.me/DzVibesShop'}"
           target="_blank"
           rel="noopener noreferrer"
           class="btn btn-telegram card-order-btn${isAvail ? '' : ' btn-disabled-look'}"
           data-order="telegram"
           data-product-id="${escapeHtml(String(product.id))}"
           title="اطلب عبر التيليغرام"
           ${isAvail ? '' : 'aria-disabled="true"'}>
          ${tgSvg} تيليغرام
        </a>

        <!-- Discord: product link or official invite — NEVER a placeholder -->
        <a href="${escapeHtml(discordHref)}"
           target="_blank"
           rel="noopener noreferrer"
           class="btn btn-discord card-order-btn"
           data-order="discord"
           data-product-id="${escapeHtml(String(product.id))}"
           title="اطلب عبر الديسكورد">
          ${dcSvg} ديسكورد
        </a>

      </div>
    </div>
  `;

  return card;
}

/* HTML escape utility */
function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ══════════════════════════════════════════════════════════════════════════
   EVENT DELEGATION — product card clicks
   ══════════════════════════════════════════════════════════════════════════ */
let _cachedProducts = [];

productsGrid.addEventListener('click', async (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  const productId = card.dataset.id;

  /* Promo apply button */
  if (e.target.closest('[data-apply-promo]')) {
    handleApplyPromo(card, productId);
    return;
  }

  /* Order button clicks — for <a> tags we intercept to also send webhook
     and update telegram href with promo-adjusted price if promo applied */
  const orderLink = e.target.closest('.card-order-btn');
  if (orderLink) {
    const platform = orderLink.dataset.order;

    /* For Discord: always fire webhook + open the baked-in href */
    if (platform === 'discord') {
      e.preventDefault();
      const product = _cachedProducts.find(p => String(p.id) === String(productId));
      if (!product) return;
      const finalPrice = parseFloat(card.querySelector('.price-final').dataset.finalPrice);
      const appliedPromo = appliedPromosPerCard[productId] || null;
      sendDiscordWebhookEmbed(product, finalPrice, appliedPromo);
      const discordUrl = (product.discordLink && product.discordLink.trim() &&
                          product.discordLink.trim() !== '#')
                          ? product.discordLink.trim()
                          : CONFIG.DISCORD_INVITE;
      window.open(discordUrl, '_blank');
      return;
    }

    /* For Telegram: rebuild link with promo-adjusted price */
    if (platform === 'telegram') {
      e.preventDefault();
      const product = _cachedProducts.find(p => String(p.id) === String(productId));
      if (!product) return;
      if (!product.available) return; /* blocked for unavailable */
      const finalPrice   = parseFloat(card.querySelector('.price-final').dataset.finalPrice);
      const appliedPromo = appliedPromosPerCard[productId] || null;
      const msg          = buildOrderMessage(product, finalPrice, appliedPromo);
      const url          = resolveOrderLink('telegram', product, msg);
      window.open(url, '_blank');
      return;
    }

    /* For Instagram: just let the <a> href do its job (it already has the right URL) */
    /* No e.preventDefault() — browser opens the link naturally */
    return;
  }

  /* Learn more button */
  if (e.target.closest('[data-learn-more]')) {
    let product = _cachedProducts.find(p => String(p.id) === String(productId));
    if (!product) {
      const all = await fetchProducts();
      _cachedProducts = all;
      product = all.find(p => String(p.id) === String(productId));
    }
    const finalPrice = parseFloat(
      card.querySelector('.price-final').dataset.finalPrice
    );
    if (product) openProductDetailsModal(product, finalPrice);
  }
});

/* ══════════════════════════════════════════════════════════════════════════
   PROMO CODE — card level
   ══════════════════════════════════════════════════════════════════════════ */
const appliedPromosPerCard = {};

function handleApplyPromo(card, productId) {
  const input = card.querySelector('[data-promo-input]');
  const msgEl = card.querySelector('[data-promo-msg]');
  const code  = input.value.trim().toUpperCase();

  if (!code) { showPromoMsg(msgEl, 'يرجى إدخال كود.', false); return; }

  const match = getPromoCodes().find(p => p.code.toUpperCase() === code);
  if (!match) {
    showPromoMsg(msgEl, 'كود غير صالح / Invalid code', false);
    delete appliedPromosPerCard[productId];
    updateCardPriceDisplay(card, productId);
    return;
  }
  appliedPromosPerCard[productId] = match;
  showPromoMsg(msgEl, `✅ "${match.code}" مطبّق: -${match.discountValue}%`, true);
  updateCardPriceDisplay(card, productId);
}

function showPromoMsg(el, text, success) {
  el.textContent = text;
  el.className   = 'promo-msg ' + (success ? 'success' : 'error');
}

function updateCardPriceDisplay(card, productId) {
  const product = _cachedProducts.find(p => String(p.id) === String(productId));
  if (!product) return;
  const base    = calculateFinalPrice(
    product.cost, product.profitPercent, product.discountPercent
  );
  const priceEl = card.querySelector('.price-final');
  const tagEl   = card.querySelector('[data-promo-tag]');
  const applied = appliedPromosPerCard[productId];
  let displayed = base;
  if (applied) {
    displayed           = base * (1 - applied.discountValue / 100);
    tagEl.textContent   = `كود: ${applied.code}`;
    tagEl.style.display = 'inline-block';
  } else {
    tagEl.style.display = 'none';
  }
  priceEl.textContent        = `${formatPrice(displayed)} DA`;
  priceEl.dataset.finalPrice = displayed;
}

/* ══════════════════════════════════════════════════════════════════════════
   ORDER MESSAGE BUILDER
   ══════════════════════════════════════════════════════════════════════════ */
function buildOrderMessage(product, finalPrice, appliedPromo) {
  const catMeta = product.category ? CATEGORY_META[product.category] : null;
  let msg  = `🛒 طلب جديد من Dz Vibes Shop\n`;
  msg     += `----------------------------\n`;
  msg     += `📦 المنتج: ${product.title}\n`;
  if (catMeta) msg += `🏷️ القسم: ${catMeta.label}\n`;
  msg     += `💰 السعر النهائي: ${formatPrice(finalPrice)} DA\n`;
  if (appliedPromo)
    msg += `🎟️ كود الخصم: ${appliedPromo.code} (-${appliedPromo.discountValue}%)\n`;
  msg     += `----------------------------\n`;
  msg     += `أرجو تأكيد الطلب. شكراً!`;
  return msg;
}

function openOrderLink(platform, product, finalPrice, appliedPromo) {
  if (platform === 'discord') {
    sendDiscordWebhookEmbed(product, finalPrice, appliedPromo);
    /* Always use the official Discord invite as ultimate fallback */
    const link = (product.discordLink && product.discordLink.trim() &&
                  product.discordLink.trim() !== '#')
                  ? product.discordLink.trim()
                  : CONFIG.DISCORD_INVITE;
    window.open(link, '_blank');
    return;
  }
  if (platform === 'instagram') {
    window.open(CONFIG.INSTAGRAM_URL, '_blank');
    return;
  }
  if (platform === 'telegram') {
    const msg = buildOrderMessage(product, finalPrice, appliedPromo);
    const url = resolveOrderLink('telegram', product, msg);
    window.open(url, '_blank');
    return;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   PRODUCT DETAILS MODAL
   — Modal buttons are now <a> tags whose href is set dynamically when
     the modal opens, guaranteeing correct official URLs every time.
   ══════════════════════════════════════════════════════════════════════════ */
const productDetailsModalOverlay = document.getElementById('productDetailsModal');
const modalProductImage          = document.getElementById('modalProductImage');
const modalProductTitle          = document.getElementById('modalProductTitle');
const modalProductDescription    = document.getElementById('modalProductDescription');
const modalProductPrice          = document.getElementById('modalProductPrice');
const modalOutOfStockNote        = document.getElementById('modalOutOfStockNote');
const productModalCloseBtn       = document.getElementById('productModalCloseBtn');
const modalCategoryBadge         = document.getElementById('modalCategoryBadge');
const modalInstagramBtn          = document.getElementById('modalInstagramBtn');
const modalTelegramBtn           = document.getElementById('modalTelegramBtn');
const modalDiscordBtn            = document.getElementById('modalDiscordBtn');

let currentModalContext = null;

function openProductDetailsModal(product, finalPrice) {
  const appliedPromo = appliedPromosPerCard[product.id] || null;
  currentModalContext = { product, finalPrice, appliedPromo };

  /* ── Populate modal content ── */
  modalProductImage.src               = product.image;
  modalProductImage.alt               = product.title;
  modalProductTitle.textContent       = product.title;
  modalProductDescription.textContent = product.description?.trim()
    ? product.description
    : 'لا يوجد وصف إضافي لهذا المنتج حالياً.\nNo additional description provided yet.';
  modalProductPrice.textContent = `${formatPrice(finalPrice)} DA`;

  const catMeta = product.category ? CATEGORY_META[product.category] : null;
  if (catMeta) {
    modalCategoryBadge.textContent   = catMeta.label;
    modalCategoryBadge.style.display = 'inline-block';
  } else {
    modalCategoryBadge.style.display = 'none';
  }

  /* ── Build order message for pre-filling Telegram link ── */
  const orderMsg = buildOrderMessage(product, finalPrice, appliedPromo);

  /* ── Set Instagram button href — ALWAYS official Instagram ── */
  modalInstagramBtn.href = CONFIG.INSTAGRAM_URL;
  modalInstagramBtn.setAttribute('target', '_blank');
  modalInstagramBtn.setAttribute('rel', 'noopener noreferrer');

  /* ── Set Telegram button href — resolved with product override or global default ── */
  const telegramUrl = resolveOrderLink('telegram', product, orderMsg);
  modalTelegramBtn.href = telegramUrl;
  modalTelegramBtn.setAttribute('target', '_blank');
  modalTelegramBtn.setAttribute('rel', 'noopener noreferrer');

  /* ── Set Discord button href — product link or OFFICIAL INVITE, never placeholder ── */
  const discordUrl = (product.discordLink && product.discordLink.trim() &&
                      product.discordLink.trim() !== '#')
                      ? product.discordLink.trim()
                      : CONFIG.DISCORD_INVITE;
  modalDiscordBtn.href = discordUrl;
  modalDiscordBtn.setAttribute('target', '_blank');
  modalDiscordBtn.setAttribute('rel', 'noopener noreferrer');

  /* ── Availability: dim Telegram for out-of-stock, Discord always accessible ── */
  if (product.available) {
    modalOutOfStockNote.style.display = 'none';
    modalTelegramBtn.classList.remove('btn-disabled-look');
    modalTelegramBtn.removeAttribute('aria-disabled');
    modalTelegramBtn.style.pointerEvents = '';
    modalTelegramBtn.style.opacity       = '';
  } else {
    modalOutOfStockNote.style.display    = 'block';
    modalTelegramBtn.classList.add('btn-disabled-look');
    modalTelegramBtn.setAttribute('aria-disabled', 'true');
    /* Keep the link functional but visually dimmed */
    modalTelegramBtn.style.opacity = '0.45';
  }

  /* Discord is ALWAYS enabled — even for out-of-stock items */
  modalDiscordBtn.classList.remove('btn-disabled-look');
  modalDiscordBtn.removeAttribute('aria-disabled');
  modalDiscordBtn.style.pointerEvents = '';
  modalDiscordBtn.style.opacity       = '';

  /* ── Also attach click handler for Discord to fire webhook ── */
  modalDiscordBtn.onclick = (e) => {
    e.preventDefault();
    sendDiscordWebhookEmbed(product, finalPrice, appliedPromo);
    window.open(discordUrl, '_blank');
  };

  productDetailsModalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductDetailsModal() {
  productDetailsModalOverlay.classList.remove('show');
  document.body.style.overflow = '';
  currentModalContext = null;
}

productModalCloseBtn.addEventListener('click', closeProductDetailsModal);
productDetailsModalOverlay.addEventListener('click', (e) => {
  if (e.target === productDetailsModalOverlay) closeProductDetailsModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && productDetailsModalOverlay.classList.contains('show'))
    closeProductDetailsModal();
});

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN — PRODUCT FORM (Supabase INSERT / UPDATE)
   ══════════════════════════════════════════════════════════════════════════ */
const productForm       = document.getElementById('productForm');
const productIdInput    = document.getElementById('productId');
const prodTitle         = document.getElementById('prodTitle');
const prodCategory      = document.getElementById('prodCategory');
const prodImage         = document.getElementById('prodImage');
const prodCost          = document.getElementById('prodCost');
const prodProfit        = document.getElementById('prodProfit');
const prodDiscount      = document.getElementById('prodDiscount');
const prodDescription   = document.getElementById('prodDescription');
const prodTelegram      = document.getElementById('prodTelegram');
const prodDiscord       = document.getElementById('prodDiscord');
const prodTopSeller     = document.getElementById('prodTopSeller');
const prodAvailable     = document.getElementById('prodAvailable');
const pricePreview      = document.getElementById('pricePreview');
const formTitle         = document.getElementById('formTitle');
const submitBtn         = document.getElementById('submitBtn');
const cancelEditBtn     = document.getElementById('cancelEditBtn');
const productsTableBody = document.getElementById('productsTableBody');

/* Live price preview */
function updatePricePreview() {
  const cost     = prodCost.value;
  const profit   = prodProfit.value;
  const discount = prodDiscount.value;
  if (!cost || !profit) {
    pricePreview.innerHTML = 'Final Price: <strong>-- DA</strong>';
    return;
  }
  const base   = calculateBasePrice(cost, profit);
  const final  = calculateFinalPrice(cost, profit, discount);
  const hasDis = parseFloat(discount) > 0;
  pricePreview.innerHTML = hasDis
    ? `Base: <s>${formatPrice(base)} DA</s> &nbsp;→&nbsp; Final: <strong>${formatPrice(final)} DA</strong>`
    : `Final Price: <strong>${formatPrice(final)} DA</strong>`;
}
[prodCost, prodProfit, prodDiscount].forEach(inp =>
  inp.addEventListener('input', updatePricePreview)
);

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const categoryVal = prodCategory.value;

  if (!categoryVal) {
    showToast('⚠️ Please select a category / اختر القسم.');
    prodCategory.focus();
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = 'جارٍ الحفظ...';

  const editingId = productIdInput.value;

  /* Discord field is optional — falls back to official invite if blank */
  const discordVal = prodDiscord.value.trim() || CONFIG.DISCORD_INVITE;

  const productData = {
    id:               editingId || null,
    title:            prodTitle.value.trim(),
    category:         categoryVal,
    image:            prodImage.value.trim(),
    cost:             parseFloat(prodCost.value)     || 0,
    profitPercent:    parseFloat(prodProfit.value)   || 0,
    discountPercent:  parseFloat(prodDiscount.value) || 0,
    description:      prodDescription.value.trim(),
    telegramUsername: prodTelegram.value.trim(),
    discordLink:      discordVal,
    topSeller:        prodTopSeller.checked,
    available:        prodAvailable.checked
  };

  let success = false;

  if (editingId) {
    success = await updateProduct(productData);
    if (success) showToast('✅ Product updated successfully!');
  } else {
    success = await insertProduct(productData);
    if (success) showToast('✅ Product added successfully!');
  }

  submitBtn.disabled = false;

  if (success) {
    resetProductForm();
    renderAdminProductTable();
  }
});

function resetProductForm() {
  productForm.reset();
  productIdInput.value        = '';
  prodAvailable.checked       = true;
  formTitle.textContent       = '➕ Add New Product';
  submitBtn.textContent       = 'Add Product';
  submitBtn.disabled          = false;
  cancelEditBtn.style.display = 'none';
  pricePreview.innerHTML      = 'Final Price: <strong>-- DA</strong>';
}
cancelEditBtn.addEventListener('click', resetProductForm);

function editProduct(id) {
  const product = _cachedProducts.find(p => String(p.id) === String(id));
  if (!product) return;

  productIdInput.value      = product.id;
  prodTitle.value           = product.title;
  prodCategory.value        = product.category || '';
  prodImage.value           = product.image;
  prodCost.value            = product.cost;
  prodProfit.value          = product.profitPercent;
  prodDiscount.value        = product.discountPercent;
  prodDescription.value     = product.description || '';
  prodTelegram.value        = product.telegramUsername || '';
  /* Show stored discord link — if it equals the global default, show blank for clarity */
  prodDiscord.value         = (product.discordLink === CONFIG.DISCORD_INVITE)
                                ? ''
                                : (product.discordLink || '');
  prodTopSeller.checked     = product.topSeller;
  prodAvailable.checked     = product.available;

  formTitle.textContent       = '✏️ Edit Product';
  submitBtn.textContent       = 'Update Product';
  cancelEditBtn.style.display = 'inline-flex';

  updatePricePreview();
  document.querySelector('.admin-card').scrollIntoView({
    behavior: 'smooth', block: 'start'
  });
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  const success = await deleteProductFromDb(id);
  if (success) {
    renderAdminProductTable();
    showToast('🗑️ Product deleted.');
  }
}

async function toggleProductStatus(id) {
  const product = _cachedProducts.find(p => String(p.id) === String(id));
  if (!product) return;

  const updated = { ...product, available: !product.available };
  const success = await updateProduct(updated);
  if (success) {
    showToast(`🔄 Status → ${updated.available ? 'Available' : 'Unavailable'}`);
    renderAdminProductTable();
  }
}

/* Render admin product table */
async function renderAdminProductTable() {
  productsTableBody.innerHTML = `
    <tr>
      <td colspan="11"
          style="text-align:center;color:#5a5a5a;padding:24px;">
        ⏳ جارٍ التحميل...
      </td>
    </tr>`;

  const products  = await fetchProducts();
  _cachedProducts = products;

  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="11"
            style="text-align:center;color:#5a5a5a;padding:24px;">
          No products yet — add your first product above.
        </td>
      </tr>`;
    return;
  }

  productsTableBody.innerHTML = products.map(product => {
    const finalPrice  = calculateFinalPrice(
      product.cost, product.profitPercent, product.discountPercent
    );
    const catMeta     = product.category ? CATEGORY_META[product.category] : null;
    const catCell     = catMeta
      ? `<span class="cat-pill" data-cat="${escapeHtml(product.category)}">${catMeta.label}</span>`
      : `<span style="color:var(--text-muted)">—</span>`;

    /* Resolve the effective discord link for display */
    const effectiveDiscord = (product.discordLink && product.discordLink.trim() &&
                              product.discordLink.trim() !== '#')
                              ? product.discordLink.trim()
                              : CONFIG.DISCORD_INVITE;
    const discordCell = `<a href="${escapeHtml(effectiveDiscord)}"
          target="_blank" class="discord-pill">🔗 Link</a>`;

    return `
      <tr>
        <td>
          <img src="${escapeHtml(product.image)}"
               alt="${escapeHtml(product.title)}"
               onerror="this.src='https://via.placeholder.com/60/141414/555?text=IMG'">
        </td>
        <td>${escapeHtml(product.title)}</td>
        <td>${catCell}</td>
        <td>${formatPrice(product.cost)} DA</td>
        <td>${product.profitPercent}%</td>
        <td>${product.discountPercent}%</td>
        <td><strong>${formatPrice(finalPrice)} DA</strong></td>
        <td>${discordCell}</td>
        <td>
          <span class="status-pill
            ${product.available ? 'status-available' : 'status-unavailable'}">
            ${product.available ? 'Available' : 'Unavailable'}
          </span>
        </td>
        <td>${product.topSeller ? '🔥 Yes' : '—'}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-edit"
                    onclick="editProduct('${product.id}')">Edit</button>
            <button class="btn btn-sm btn-toggle"
                    onclick="toggleProductStatus('${product.id}')">Toggle</button>
            <button class="btn btn-sm btn-danger"
                    onclick="deleteProduct('${product.id}')">Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN — PROMO CODES
   ══════════════════════════════════════════════════════════════════════════ */
const promoForm       = document.getElementById('promoForm');
const promoCodeInput  = document.getElementById('promoCode');
const promoValueInput = document.getElementById('promoValue');
const promoList       = document.getElementById('promoList');

promoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const code  = promoCodeInput.value.trim().toUpperCase();
  const value = parseFloat(promoValueInput.value);
  if (!code || !value || value <= 0 || value > 100) {
    showToast('⚠️ Please enter a valid code and discount value.');
    return;
  }
  const promos = getPromoCodes();
  if (promos.some(p => p.code.toUpperCase() === code)) {
    showToast('⚠️ This promo code already exists.');
    return;
  }
  promos.push({ id: generateId(), code, discountValue: value });
  savePromoCodes(promos);
  promoForm.reset();
  renderAdminPromoList();
  showToast('✅ Promo code added!');
});

function deletePromoCode(id) {
  if (!confirm('Delete this promo code?')) return;
  savePromoCodes(getPromoCodes().filter(p => p.id !== id));
  renderAdminPromoList();
  showToast('🗑️ Promo code deleted.');
}

function renderAdminPromoList() {
  const promos = getPromoCodes();
  if (promos.length === 0) {
    promoList.innerHTML = `<p class="muted-text">No promo codes yet.</p>`;
    return;
  }
  promoList.innerHTML = promos.map(promo => `
    <div class="promo-item">
      <div>
        <span class="promo-code">${escapeHtml(promo.code)}</span>
        <span class="promo-value">-${promo.discountValue}%</span>
      </div>
      <button class="btn btn-sm btn-danger"
              onclick="deletePromoCode('${promo.id}')">Delete</button>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════════════════════════════════ */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}