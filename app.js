/* ==========================================================================
   DZ VIBES SHOP — app.js  v13  (Supabase Backend + Promo Codes + Variations
                                  + Full Sub-Category Filtering System
                                  + Variation Picker Popup Modal)
   ========================================================================== */

/* ══════════════════════════════════════════════════════════════════════════
   ① SUPABASE CONFIG
   ══════════════════════════════════════════════════════════════════════════ */
const SUPABASE_URL      = 'https://kbyjyfmifsufxbmhnwnq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xZPIAOb59rGWmUvnI__Pyw_ijtSFRwo';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ══════════════════════════════════════════════════════════════════════════
   ② CONFIGURATION
   ══════════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  INSTAGRAM_URL:     "https://www.instagram.com/dzvibes_shop/",
  TELEGRAM_URL:      "https://t.me/DzVibesShop",
  TELEGRAM_USERNAME: "DzVibesShop",
  DISCORD_INVITE:    "https://discord.com/invite/cPSgv6F8X9",
  ADMIN_PASSWORD:    "Dz.Vibes.0107@",
  STORAGE_KEYS: {
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
  pc:            { label: "🖥️ ألعاب وحسابات PC",  color: 0x800000 },

  pc_digital_keys:     { label: "🔑 Digital Key",         color: 0x800000 },
  pc_shared_accounts:  { label: "👥 حسابات مشتركة",       color: 0x800000 },
  pc_online_accounts:  { label: "🌐 حسابات online",       color: 0x800000 },
  pc_offline_accounts: { label: "🖥️ حسابات اوفلاين",      color: 0x800000 },
  pc_gift_cards:       { label: "💳 Gift Card",           color: 0x800000 },

  xbox_digital_keys: { label: "🔑 Digital Key", color: 0xff4d4d },
  xbox_games:        { label: "🎮 ألعاب",       color: 0xff4d4d },
  xbox_gift_cards:   { label: "💳 Gift Card",   color: 0xff4d4d },
  xbox_game_pass:    { label: "💚 Game Pass",   color: 0xff4d4d },

  psn_digital_keys: { label: "🔑 Digital Key", color: 0xb30000 },
  psn_games:        { label: "🎮 ألعاب",       color: 0xb30000 },
  psn_gift_cards:   { label: "💳 Gift Card",   color: 0xb30000 },

  mobile_digital_keys: { label: "🔑 Digital Key", color: 0xe60000 },
  mobile_uid:          { label: "🆔 شحن UID",     color: 0xe60000 },
  mobile_card:         { label: "💳 شحن Card",    color: 0xe60000 },

  sub_digital_keys: { label: "🔑 Digital Key", color: 0xff1a1a },
  sub_netflix:      { label: "🎬 Netflix",     color: 0xff1a1a },
  sub_spotify:      { label: "🎵 Spotify",     color: 0xff1a1a },
  sub_shahid:       { label: "💜 Shahid",      color: 0xff1a1a },
  sub_crunchyroll:  { label: "🧡 Crunchyroll", color: 0xff1a1a },
  sub_other:        { label: "🛠️ Other",       color: 0xff1a1a }
};

/* ══════════════════════════════════════════════════════════════════════════
   ②.5 DYNAMIC STYLES — Variations Admin + Storefront chips
   ══════════════════════════════════════════════════════════════════════════ */
function injectVariationDynamicStyles() {
  if (document.getElementById('dzvibes-variations-style')) return;
  const style = document.createElement('style');
  style.id = 'dzvibes-variations-style';
  style.textContent = `
    .variations-section {
      margin-top: 22px;
      padding-top: 18px;
      border-top: 1px dashed #333;
    }
    .variations-section-label {
      display: block;
      font-weight: 700;
      font-size: 15px;
      color: #fff;
      margin-bottom: 12px;
    }
    .variations-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 12px;
    }
    .variation-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      background: #161616;
      border: 1px solid #333;
      border-radius: 10px;
      padding: 10px 12px;
    }
    .variation-row input[type="text"],
    .variation-row input[type="number"] {
      background: #0f0f0f;
      border: 1px solid #333;
      color: #fff;
      border-radius: 6px;
      padding: 9px 10px;
      font-size: 13px;
      outline: none;
    }
    .variation-row input[type="text"]:focus,
    .variation-row input[type="number"]:focus {
      border-color: #ff1a1a;
    }
    .variation-row .variation-name {
      flex: 1 1 180px;
      min-width: 140px;
    }
    .variation-row .variation-price {
      flex: 0 1 130px;
      min-width: 110px;
    }
    .variation-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #ccc;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }
    .variation-toggle input {
      width: 17px;
      height: 17px;
      cursor: pointer;
      accent-color: #ff1a1a;
    }
    .variation-remove-btn {
      background: #3a1414;
      border: 1px solid #ff4d4d;
      color: #ff4d4d;
      border-radius: 6px;
      padding: 7px 12px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      transition: background 0.2s, color 0.2s;
    }
    .variation-remove-btn:hover {
      background: #ff4d4d;
      color: #fff;
    }
    .add-variation-btn {
      background: #ff1a1a;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
      transition: background 0.2s;
    }
    .add-variation-btn:hover { background: #e60000; }

    /* Storefront chips (kept for non-variation cards / fallback) */
    .variation-chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 10px 0 14px;
    }
    .variation-chip {
      background: #1a1a1a;
      border: 1px solid #444;
      color: #fff;
      padding: 7px 15px;
      border-radius: 20px;
      font-size: 12.5px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .variation-chip:hover:not(.disabled) {
      border-color: #ff1a1a;
      background: #2a1010;
    }
    .variation-chip.selected {
      background: #ff1a1a;
      border-color: #ff1a1a;
      color: #fff;
      font-weight: 700;
      box-shadow: 0 0 0 2px rgba(255,26,26,0.25);
    }
    .variation-chip.disabled {
      opacity: 0.4;
      text-decoration: line-through;
      cursor: not-allowed;
      background: #111;
    }
  `;
  document.head.appendChild(style);
}
injectVariationDynamicStyles();

/* ══════════════════════════════════════════════════════════════════════════
   ②.6 DYNAMIC STYLES — Sub-Category Filter Bar
   ══════════════════════════════════════════════════════════════════════════ */
function injectSubcategoryStyles() {
  if (document.getElementById('dzvibes-subcat-style')) return;
  const style = document.createElement('style');
  style.id = 'dzvibes-subcat-style';
  style.textContent = `
    .subcat-bar {
      display: flex;
      justify-content: flex-start;
      direction: rtl;
      gap: 10px;
      align-items: center;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 4px 2px 16px;
      margin: 0 0 20px;
    }
    .subcat-bar::-webkit-scrollbar {
      display: none;
      height: 0;
    }
    .subcat-chip {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #161616;
      border: 1.5px solid #3a3a3a;
      color: #cfcfcf;
      padding: 9px 20px;
      border-radius: 24px;
      font-size: 13.5px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.22s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .subcat-chip:hover {
      border-color: #ff1a1a;
      color: #fff;
      background: #201010;
    }
    .subcat-chip.active {
      background: linear-gradient(135deg, #ff1a1a, #a00000);
      border-color: #ff1a1a;
      color: #fff;
      font-weight: 800;
      box-shadow: 0 0 14px rgba(255, 26, 26, 0.55), 0 0 0 1px rgba(255,26,26,0.35) inset;
    }
    @media (max-width: 640px) {
      .subcat-chip {
        padding: 8px 16px;
        font-size: 12.5px;
      }
    }
  `;
  document.head.appendChild(style);
}
injectSubcategoryStyles();

/* ══════════════════════════════════════════════════════════════════════════
   ②.7 DYNAMIC STYLES — Variation Picker Modal (البطاقة المنبثقة)
   ══════════════════════════════════════════════════════════════════════════ */
function injectVariationModalStyles() {
  if (document.getElementById('dzvibes-varmodal-style')) return;
  const style = document.createElement('style');
  style.id = 'dzvibes-varmodal-style';
  style.textContent = `
    /* ── Overlay ── */
    #variationPickerOverlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.28s ease, visibility 0.28s ease;
      padding: 16px;
      box-sizing: border-box;
    }
    #variationPickerOverlay.show {
      opacity: 1;
      visibility: visible;
    }

    /* ── Modal box ── */
    #variationPickerModal {
      background: #111111;
      border: 1px solid #2a2a2a;
      border-radius: 20px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: thin;
      scrollbar-color: #ff1a1a #1a1a1a;
      box-shadow: 0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,26,26,0.08);
      transform: translateY(28px) scale(0.97);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease;
      opacity: 0;
      position: relative;
      direction: rtl;
    }
    #variationPickerOverlay.show #variationPickerModal {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    #variationPickerModal::-webkit-scrollbar {
      width: 5px;
    }
    #variationPickerModal::-webkit-scrollbar-track {
      background: #1a1a1a;
      border-radius: 10px;
    }
    #variationPickerModal::-webkit-scrollbar-thumb {
      background: #ff1a1a;
      border-radius: 10px;
    }

    /* ── Close button ── */
    #varModalCloseBtn {
      position: absolute;
      top: 14px;
      left: 14px;
      background: #1e1e1e;
      border: 1px solid #333;
      color: #aaa;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
      z-index: 2;
      flex-shrink: 0;
    }
    #varModalCloseBtn:hover {
      background: #ff1a1a;
      color: #fff;
      border-color: #ff1a1a;
    }

    /* ── Product image banner ── */
    .var-modal-image-wrap {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 20px 20px 0 0;
      flex-shrink: 0;
    }
    .var-modal-image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .var-modal-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%);
    }
    .var-modal-image-title {
      position: absolute;
      bottom: 14px;
      right: 16px;
      left: 50px;
      color: #fff;
      font-size: 17px;
      font-weight: 800;
      text-shadow: 0 2px 8px rgba(0,0,0,0.8);
      line-height: 1.3;
      font-family: inherit;
    }
    .var-modal-cat-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      background: rgba(255, 26, 26, 0.85);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
      font-family: inherit;
    }

    /* ── Body ── */
    .var-modal-body {
      padding: 20px 18px 24px;
    }

    /* ── Section label ── */
    .var-modal-section-label {
      font-size: 14px;
      font-weight: 700;
      color: #aaa;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .var-modal-section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(to left, transparent, #2a2a2a);
    }

    /* ── Vertical package buttons list ── */
    .var-modal-packages-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    .var-modal-pkg-btn {
      width: 100%;
      background: #181818;
      border: 1.5px solid #2e2e2e;
      color: #e0e0e0;
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s ease;
      text-align: right;
      -webkit-tap-highlight-color: transparent;
      position: relative;
      overflow: hidden;
    }
    .var-modal-pkg-btn::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: transparent;
      border-radius: 0 12px 12px 0;
      transition: background 0.2s ease;
    }
    .var-modal-pkg-btn:hover:not(.var-pkg-disabled) {
      border-color: #ff1a1a;
      background: #1f1010;
      color: #fff;
      transform: translateX(-2px);
    }
    .var-modal-pkg-btn:hover:not(.var-pkg-disabled)::before {
      background: #ff1a1a;
    }
    .var-modal-pkg-btn.var-pkg-selected {
      background: linear-gradient(135deg, #1e0a0a 0%, #2a0f0f 100%);
      border-color: #ff1a1a;
      color: #fff;
      box-shadow: 0 0 0 1px rgba(255,26,26,0.3), 0 4px 20px rgba(255,26,26,0.15);
    }
    .var-modal-pkg-btn.var-pkg-selected::before {
      background: #ff1a1a;
    }
    .var-modal-pkg-btn.var-pkg-disabled {
      opacity: 0.38;
      cursor: not-allowed;
      text-decoration: line-through;
      background: #0f0f0f;
      border-color: #222;
    }
    .var-pkg-name {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    .var-pkg-icon {
      font-size: 18px;
      flex-shrink: 0;
    }
    .var-pkg-name-text {
      font-size: 15px;
      font-weight: 700;
    }
    .var-pkg-price-tag {
      background: rgba(255, 26, 26, 0.12);
      border: 1px solid rgba(255, 26, 26, 0.25);
      color: #ff6b6b;
      font-size: 13px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
      transition: background 0.2s, color 0.2s;
    }
    .var-modal-pkg-btn.var-pkg-selected .var-pkg-price-tag {
      background: rgba(255, 26, 26, 0.25);
      color: #ff9999;
      border-color: rgba(255, 26, 26, 0.5);
    }
    .var-pkg-selected-check {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 22px;
      height: 22px;
      background: #ff1a1a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #fff;
      opacity: 0;
      transition: opacity 0.2s ease;
      flex-shrink: 0;
    }
    .var-modal-pkg-btn.var-pkg-selected .var-pkg-selected-check {
      opacity: 1;
    }
    .var-pkg-unavailable-tag {
      font-size: 10px;
      font-weight: 600;
      color: #666;
      background: #1a1a1a;
      border: 1px solid #333;
      padding: 2px 8px;
      border-radius: 10px;
      margin-right: 6px;
    }

    /* ── Price display section ── */
    .var-modal-price-section {
      background: #161616;
      border: 1px solid #2a2a2a;
      border-radius: 14px;
      padding: 16px 18px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .var-modal-price-left {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .var-modal-price-label {
      font-size: 12px;
      color: #666;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .var-modal-selected-name {
      font-size: 13px;
      color: #aaa;
      font-weight: 500;
    }
    #varModalSelectedName {
      color: #ff9999;
      font-weight: 700;
    }
    .var-modal-price-value {
      font-size: 28px;
      font-weight: 900;
      color: #ff4d4d;
      font-family: inherit;
      letter-spacing: -0.5px;
    }
    #varModalPriceValue {
      transition: all 0.2s ease;
    }

    /* ── Promo code section inside modal ── */
    .var-modal-promo-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }
    .var-modal-promo-row input {
      flex: 1;
      background: #161616;
      border: 1.5px solid #2a2a2a;
      color: #fff;
      border-radius: 10px;
      padding: 11px 14px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      direction: ltr;
      text-align: right;
    }
    .var-modal-promo-row input:focus {
      border-color: #ff1a1a;
    }
    .var-modal-promo-row input::placeholder {
      color: #444;
      text-align: right;
    }
    .var-modal-promo-apply-btn {
      background: #1e1e1e;
      border: 1.5px solid #333;
      color: #ccc;
      border-radius: 10px;
      padding: 11px 18px;
      font-size: 13px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .var-modal-promo-apply-btn:hover {
      background: #ff1a1a;
      border-color: #ff1a1a;
      color: #fff;
    }
    .var-modal-promo-msg {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 14px;
      min-height: 18px;
      text-align: right;
      padding-right: 4px;
    }
    .var-modal-promo-msg.success { color: #4caf50; }
    .var-modal-promo-msg.error   { color: #ff4d4d; }

    /* ── CTA Confirm Button ── */
    .var-modal-confirm-section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .var-modal-confirm-btn {
      width: 100%;
      background: linear-gradient(135deg, #ff1a1a 0%, #cc0000 100%);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 800;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px rgba(255, 26, 26, 0.35);
      -webkit-tap-highlight-color: transparent;
    }
    .var-modal-confirm-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(255, 26, 26, 0.5);
      background: linear-gradient(135deg, #ff3333 0%, #e60000 100%);
    }
    .var-modal-confirm-btn:active:not(:disabled) {
      transform: translateY(0);
    }
    .var-modal-confirm-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
    }
    .var-modal-confirm-btn svg {
      flex-shrink: 0;
    }
    .var-modal-secondary-btns {
      display: flex;
      gap: 8px;
    }
    .var-modal-ig-btn,
    .var-modal-dc-btn {
      flex: 1;
      border: none;
      border-radius: 12px;
      padding: 13px 16px;
      font-size: 13px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .var-modal-ig-btn {
      background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
      color: #fff;
    }
    .var-modal-ig-btn:hover {
      opacity: 0.88;
      transform: translateY(-1px);
    }
    .var-modal-dc-btn {
      background: #5865f2;
      color: #fff;
    }
    .var-modal-dc-btn:hover {
      background: #4752c4;
      transform: translateY(-1px);
    }

    /* ── No variation selected hint ── */
    .var-modal-hint {
      text-align: center;
      font-size: 12.5px;
      color: #555;
      margin-top: 6px;
    }

    /* ── Responsive ── */
    @media (max-width: 520px) {
      .var-modal-image-wrap {
        height: 160px;
      }
      .var-modal-image-title {
        font-size: 15px;
      }
      .var-modal-price-value {
        font-size: 24px;
      }
      .var-modal-confirm-btn {
        font-size: 15px;
        padding: 14px 20px;
      }
    }
  `;
  document.head.appendChild(style);
}
injectVariationModalStyles();

/* ══════════════════════════════════════════════════════════════════════════
   ②.8 BUILD & INJECT THE VARIATION PICKER MODAL INTO THE DOM
   ══════════════════════════════════════════════════════════════════════════ */
function buildVariationPickerModalDOM() {
  if (document.getElementById('variationPickerOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'variationPickerOverlay';

  overlay.innerHTML = `
    <div id="variationPickerModal" role="dialog" aria-modal="true" aria-labelledby="varModalTitle">

      <!-- Close button -->
      <button type="button" id="varModalCloseBtn" aria-label="إغلاق">✕</button>

      <!-- Product image header -->
      <div class="var-modal-image-wrap">
        <img id="varModalImage" src="" alt="">
        <div class="var-modal-image-overlay"></div>
        <span id="varModalCatBadge" class="var-modal-cat-badge"></span>
        <div id="varModalTitle" class="var-modal-image-title"></div>
      </div>

      <!-- Body -->
      <div class="var-modal-body">

        <!-- Packages label -->
        <div class="var-modal-section-label">📦 اختر الباقة المناسبة</div>

        <!-- Vertical packages list -->
        <div class="var-modal-packages-list" id="varModalPackagesList"></div>

        <!-- Dynamic price display -->
        <div class="var-modal-price-section">
          <div class="var-modal-price-left">
            <span class="var-modal-price-label">السعر المحدد</span>
            <span class="var-modal-selected-name">الباقة: <span id="varModalSelectedName">—</span></span>
          </div>
          <div class="var-modal-price-value" id="varModalPriceValue">— DA</div>
        </div>

        <!-- Promo code -->
        <div class="var-modal-section-label">🎟️ كود الخصم</div>
        <div class="var-modal-promo-row">
          <input type="text" id="varModalPromoInput" placeholder="أدخل كود الخصم" maxlength="20">
          <button type="button" class="var-modal-promo-apply-btn" id="varModalPromoApplyBtn">تطبيق</button>
        </div>
        <div class="var-modal-promo-msg" id="varModalPromoMsg"></div>

        <!-- CTA Buttons -->
        <div class="var-modal-confirm-section">

          <!-- Primary: Telegram -->
          <button type="button" class="var-modal-confirm-btn" id="varModalTelegramBtn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            تأكيد الطلب عبر تيليغرام
          </button>

          <!-- Secondary: Instagram + Discord -->
          <div class="var-modal-secondary-btns">
            <button type="button" class="var-modal-ig-btn" id="varModalInstagramBtn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              انستغرام
            </button>
            <button type="button" class="var-modal-dc-btn" id="varModalDiscordBtn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.114 18.105.134 18.12a19.919 19.919 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              ديسكورد
            </button>
          </div>

          <div class="var-modal-hint" id="varModalHint">⬆️ يرجى اختيار باقة أولاً لتفعيل الطلب</div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  bindVariationModalEvents();
}

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
function parseVariations(raw) {
  if (!raw) return [];

  let arr = raw;
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw);
    } catch (_) {
      return [];
    }
  }

  if (!Array.isArray(arr)) return [];

  return arr
    .map(v => ({
      id:           v && v.id ? String(v.id) : generateId(),
      name:         (v && (v.name || v.value)) ? String(v.name || v.value).trim() : '',
      price:        parseFloat(v && v.price) || 0,
      is_available: v && v.is_available === false ? false : true
    }))
    .filter(v => v.name !== '');
}

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
    available:        meta.available        !== false,
    variations:       parseVariations(row.variations)
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

  const cleanVariations = Array.isArray(p.variations)
    ? p.variations
        .filter(v => v && v.name && v.name.trim() !== '')
        .map(v => ({
          id:           v.id || generateId(),
          name:         v.name.trim(),
          price:        parseFloat(v.price) || 0,
          is_available: v.is_available !== false
        }))
    : [];

  return {
    title:       p.title,
    price:       finalPrice,
    image_url:   p.image,
    category:    p.category,
    description: fullDescription,
    variations:  cleanVariations
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   ④ PROMO CODE HELPERS — Supabase
   ══════════════════════════════════════════════════════════════════════════ */

async function fetchPromoCodes() {
  const { data, error } = await supabaseClient
    .from('promo_codes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('fetchPromoCodes error:', error.message);
    return [];
  }

  return (data || []).map(row => ({
    id:            row.id,
    code:          row.code,
    discountValue: parseFloat(row.discount_percent) || 0,
    isActive:      row.is_active !== false
  }));
}

async function savePromoCodeToDb(code, discountValue) {
  const { error } = await supabaseClient
    .from('promo_codes')
    .insert([{
      code:             code.toUpperCase().trim(),
      discount_percent: parseFloat(discountValue),
      is_active:        true
    }]);

  if (error) {
    console.error('savePromoCodeToDb error:', error.message);
    showToast('⚠️ فشل إضافة الكود: ' + error.message);
    return false;
  }
  return true;
}

async function deletePromoCodeFromDb(id) {
  const { error } = await supabaseClient
    .from('promo_codes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deletePromoCodeFromDb error:', error.message);
    showToast('⚠️ فشل حذف الكود: ' + error.message);
    return false;
  }
  return true;
}

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

const calculateProfitPercent = (cost, sellingPrice) => {
  const c = parseFloat(cost) || 0;
  const s = parseFloat(sellingPrice) || 0;
  if (c <= 0) return 0;
  return ((s - c) / c) * 100;
};

const calculateDiscountPercent = (originalPrice, discountedPrice) => {
  const orig = parseFloat(originalPrice)    || 0;
  const disc = parseFloat(discountedPrice)  || 0;
  if (orig <= 0 || disc <= 0 || disc >= orig) return 0;
  return ((orig - disc) / orig) * 100;
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
  refreshSubcategoryBar();
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
   ⑦ CATEGORY FILTER STATE — Main Tabs + Dynamic Sub-Category Chips
   ══════════════════════════════════════════════════════════════════════════ */
let activeCategory    = 'all';
let activeSubCategory = 'all';

const MAIN_CATEGORIES = {
  pc: {
    legacyValue: 'pc',
    subcats: [
      { value: 'all',                 label: 'الكل 🌟',             all: true },
      { value: 'pc_digital_keys',     label: 'Digital Key 🔑' },
      { value: 'pc_shared_accounts',  label: 'حسابات مشتركة 👥' },
      { value: 'pc_online_accounts',  label: 'حسابات online 🌐' },
      { value: 'pc_offline_accounts', label: 'حسابات اوفلاين 🖥️' },
      { value: 'pc_gift_cards',       label: 'Gift Card 💳' }
    ]
  },
  xbox: {
    legacyValue: 'xbox',
    subcats: [
      { value: 'all',               label: 'الكل 🌟',       all: true },
      { value: 'xbox_digital_keys', label: 'Digital Key 🔑' },
      { value: 'xbox_games',        label: 'ألعاب 🎮' },
      { value: 'xbox_gift_cards',   label: 'Gift Card 💳' },
      { value: 'xbox_game_pass',    label: 'Game Pass 💚' }
    ]
  },
  playstation: {
    legacyValue: 'playstation',
    subcats: [
      { value: 'all',              label: 'الكل 🌟',        all: true },
      { value: 'psn_digital_keys', label: 'Digital Key 🔑' },
      { value: 'psn_games',        label: 'ألعاب 🎮' },
      { value: 'psn_gift_cards',   label: 'Gift Card 💳' }
    ]
  },
  mobile: {
    legacyValue: 'mobile',
    subcats: [
      { value: 'all',                 label: 'الكل 🌟',       all: true },
      { value: 'mobile_digital_keys', label: 'Digital Key 🔑' },
      { value: 'mobile_uid',          label: 'شحن UID 🆔' },
      { value: 'mobile_card',         label: 'شحن Card 💳' }
    ]
  },
  subscriptions: {
    legacyValue: 'subscriptions',
    subcats: [
      { value: 'all',               label: 'الكل 🌟',         all: true },
      { value: 'sub_digital_keys',  label: 'Digital Key 🔑' },
      { value: 'sub_netflix',       label: 'Netflix 🎬' },
      { value: 'sub_spotify',       label: 'Spotify 🎵' },
      { value: 'sub_shahid',        label: 'Shahid 💜' },
      { value: 'sub_crunchyroll',   label: 'Crunchyroll 🧡' },
      { value: 'sub_other',         label: 'Other 🛠️' }
    ]
  }
};

function getMainCategoryKeys(mainCat) {
  const cfg = MAIN_CATEGORIES[mainCat];
  if (!cfg) return [mainCat];
  return [cfg.legacyValue, ...cfg.subcats.filter(s => !s.all).map(s => s.value)];
}

let subcategoryBarEl = null;

function buildSubcategoryBar(mainCat) {
  const cfg = MAIN_CATEGORIES[mainCat];
  const bar = document.createElement('div');
  bar.id        = 'subcategoryBar';
  bar.className = 'subcat-bar';

  if (!cfg) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return bar;
  }

  bar.style.display = 'flex';
  bar.innerHTML = cfg.subcats.map(sub => `
    <button type="button"
            class="subcat-chip${sub.all ? ' active' : ''}"
            data-subcat="${sub.value}">${sub.label}</button>
  `).join('');
  return bar;
}

function refreshSubcategoryBar() {
  const existing = document.getElementById('subcategoryBar');
  if (existing) existing.remove();

  const bar = buildSubcategoryBar(activeCategory);
  productsGrid.parentNode.insertBefore(bar, productsGrid);
  subcategoryBarEl = bar;

  bar.addEventListener('click', (e) => {
    const chip = e.target.closest('.subcat-chip');
    if (!chip) return;

    bar.querySelectorAll('.subcat-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    activeSubCategory = chip.dataset.subcat;
    renderProductsGrid(document.getElementById('searchInput').value);
  });
}

document.querySelectorAll('.cat-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-tab').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    activeCategory    = btn.dataset.cat;
    activeSubCategory = 'all';

    refreshSubcategoryBar();
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

/* Insert sub-category bar above the products grid on initial load */
refreshSubcategoryBar();

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

  let filtered;

  if (activeCategory === 'all') {
    filtered = allProducts;
  } else if (MAIN_CATEGORIES[activeCategory]) {
    const keys = getMainCategoryKeys(activeCategory);
    filtered = allProducts.filter(p => keys.includes(p.category));
    if (activeSubCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeSubCategory);
    }
  } else {
    filtered = allProducts.filter(p => p.category === activeCategory);
  }

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
   ══════════════════════════════════════════════════════════════════════════ */
function resolveOrderLink(platform, product, message) {
  const encoded = encodeURIComponent(message);
  switch (platform) {
    case 'instagram':
      return CONFIG.INSTAGRAM_URL;

    case 'telegram': {
      const user = (product.telegramUsername && product.telegramUsername.trim())
        ? product.telegramUsername.trim()
        : CONFIG.TELEGRAM_USERNAME;
      return `https://t.me/${user}?text=${encoded}`;
    }

    case 'discord':
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
async function sendDiscordWebhookEmbed(product, finalPrice, appliedPromo, variation) {
  if (!DISCORD_WEBHOOK_URL) return;

  const catMeta  = CATEGORY_META[product.category] || { label: '—', color: 0x5865f2 };
  const priceStr = `${formatPrice(finalPrice)} DA${appliedPromo
    ? `  *(كود: ${appliedPromo.code} -${appliedPromo.discountValue}%)*`
    : ''}`;

  const fields = [
    { name: '📦 المنتج', value: product.title, inline: true }
  ];

  if (variation) {
    fields.push({ name: '🎁 الباقة', value: variation.name, inline: true });
  }

  fields.push({ name: '🏷️ القسم', value: catMeta.label, inline: true });
  fields.push({ name: '💰 السعر',  value: priceStr,        inline: false });

  const payload = {
    username:   'Dz Vibes Bot',
    avatar_url: 'https://i.imgur.com/4M34hi2.png',
    embeds: [{
      title:       `🛒 طلب جديد — ${product.title}`,
      description: 'وصل طلب جديد عبر Dz Vibes Shop!',
      color:       15073024,
      thumbnail:   product.image ? { url: product.image } : undefined,
      fields:      fields,
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
   ORDER MESSAGE BUILDER
   ══════════════════════════════════════════════════════════════════════════ */
function buildOrderMessage(product, finalPrice, appliedPromo, variation) {
  const catMeta = product.category ? CATEGORY_META[product.category] : null;
  let msg  = `🛒 طلب جديد من Dz Vibes Shop\n`;
  msg     += `----------------------------\n`;
  msg     += `📦 المنتج: ${product.title}\n`;
  if (variation) msg += `🎁 الباقة: ${variation.name}\n`;
  if (catMeta)   msg += `🏷️ القسم: ${catMeta.label}\n`;
  msg     += `💰 السعر النهائي: ${formatPrice(finalPrice)} DA\n`;
  if (appliedPromo)
    msg += `🎟️ كود الخصم: ${appliedPromo.code} (-${appliedPromo.discountValue}%)\n`;
  msg     += `----------------------------\n`;
  msg     += `أرجو تأكيد الطلب. شكراً!`;
  return msg;
}

/* ══════════════════════════════════════════════════════════════════════════
   BUILD PRODUCT CARD
   ══════════════════════════════════════════════════════════════════════════ */
function buildProductCard(product) {
  const hasVariations = Array.isArray(product.variations) && product.variations.length > 0;

  const basePriceNoVar  = calculateBasePrice(product.cost, product.profitPercent);
  const finalPriceNoVar = calculateFinalPrice(product.cost, product.profitPercent, product.discountPercent);
  const hasDiscount     = !hasVariations && parseFloat(product.discountPercent) > 0;

  const isAvail = hasVariations
    ? product.variations.some(v => v.is_available)
    : product.available;

  /* For non-variation products we still need the price shown on the card */
  const initialPrice = hasVariations ? 0 : finalPriceNoVar;

  const orderMsg      = buildOrderMessage(product, initialPrice, null, null);
  const instagramHref = CONFIG.INSTAGRAM_URL;
  const telegramHref  = resolveOrderLink('telegram', product, orderMsg);
  const discordHref   = (product.discordLink && product.discordLink.trim() &&
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
    ? `<span class="card-cat-chip" data-cat="${escapeAttr(product.category)}">${catMeta.label}</span>`
    : '';

  const igSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

  const tgSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`;

  const dcSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.082.114 18.105.134 18.12a19.919 19.919 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;

  /* ── If this product HAS variations: show only the single picker button ── */
  if (hasVariations) {
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

        <div class="order-buttons" style="margin-top:12px;">
          <button type="button"
                  class="btn btn-variation-picker"
                  data-open-variation-modal
                  data-product-id="${escapeHtml(String(product.id))}"
                  ${isAvail ? '' : 'disabled'}>
            🛒 اختر الباقة المناسبة
          </button>
        </div>
      </div>
    `;
    return card;
  }

  /* ── No variations: normal card with price, promo input, and 3 order btns ── */
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
          ? `<span class="price-original">${formatPrice(basePriceNoVar)} DA</span>`
          : ''}
        <span class="price-final" data-final-price="${initialPrice}">
          ${formatPrice(initialPrice)} DA
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
        <a href="${instagramHref}"
           target="_blank"
           rel="noopener noreferrer"
           class="btn btn-instagram card-order-btn"
           data-order="instagram"
           data-product-id="${escapeHtml(String(product.id))}"
           title="تواصل عبر انستغرام">
          ${igSvg} انستغرام
        </a>

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

/* HTML escape utilities */
function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ══════════════════════════════════════════════════════════════════════════
   EVENT DELEGATION — product card clicks
   ══════════════════════════════════════════════════════════════════════════ */
let _cachedProducts = [];

productsGrid.addEventListener('click', async (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  const productId = card.dataset.id;

  /* ── "اختر الباقة المناسبة" button → open variation picker modal ── */
  if (e.target.closest('[data-open-variation-modal]')) {
    const product = _cachedProducts.find(p => String(p.id) === String(productId));
    if (!product) return;
    openVariationPickerModal(product);
    return;
  }

  /* ── Promo apply button (non-variation cards only) ── */
  if (e.target.closest('[data-apply-promo]')) {
    handleApplyPromo(card, productId);
    return;
  }

  /* ── Order buttons (non-variation cards only) ── */
  const orderLink = e.target.closest('.card-order-btn');
  if (orderLink) {
    const platform = orderLink.dataset.order;

    if (platform === 'discord') {
      e.preventDefault();
      const product = _cachedProducts.find(p => String(p.id) === String(productId));
      if (!product) return;
      const finalPrice   = parseFloat(card.querySelector('.price-final').dataset.finalPrice);
      const appliedPromo = appliedPromosPerCard[productId] || null;
      sendDiscordWebhookEmbed(product, finalPrice, appliedPromo, null);
      const discordUrl = (product.discordLink && product.discordLink.trim() &&
                          product.discordLink.trim() !== '#')
                          ? product.discordLink.trim()
                          : CONFIG.DISCORD_INVITE;
      window.open(discordUrl, '_blank');
      return;
    }

    if (platform === 'telegram') {
      e.preventDefault();
      const product = _cachedProducts.find(p => String(p.id) === String(productId));
      if (!product) return;
      if (!product.available) {
        showToast('⚠️ هذا المنتج غير متوفر حالياً.');
        return;
      }
      const finalPrice   = parseFloat(card.querySelector('.price-final').dataset.finalPrice);
      const appliedPromo = appliedPromosPerCard[productId] || null;
      const msg          = buildOrderMessage(product, finalPrice, appliedPromo, null);
      const url          = resolveOrderLink('telegram', product, msg);
      window.open(url, '_blank');
      return;
    }

    return;
  }

  /* ── "معرفة المزيد" button ── */
  if (e.target.closest('[data-learn-more]')) {
    let product = _cachedProducts.find(p => String(p.id) === String(productId));
    if (!product) {
      const all = await fetchProducts();
      _cachedProducts = all;
      product = all.find(p => String(p.id) === String(productId));
    }
    if (!product) return;

    const hasVariations = Array.isArray(product.variations) && product.variations.length > 0;

    /* For variation products, pass null variation + 0 price (modal shows generic info) */
    const finalPrice = hasVariations
      ? 0
      : parseFloat(card.querySelector('.price-final').dataset.finalPrice);

    openProductDetailsModal(product, finalPrice, null);
  }
});

/* ══════════════════════════════════════════════════════════════════════════
   PROMO CODE — card level (non-variation products only)
   ══════════════════════════════════════════════════════════════════════════ */
const appliedPromosPerCard = {};

async function handleApplyPromo(card, productId) {
  const input    = card.querySelector('[data-promo-input]');
  const msgEl    = card.querySelector('[data-promo-msg]');
  const applyBtn = card.querySelector('[data-apply-promo]');
  const code     = input.value.trim().toUpperCase();

  if (!code) {
    showPromoMsg(msgEl, 'يرجى إدخال كود.', false);
    return;
  }

  applyBtn.disabled    = true;
  applyBtn.textContent = '...';
  msgEl.textContent    = '';

  const promos = await fetchPromoCodes();

  applyBtn.disabled    = false;
  applyBtn.textContent = 'تطبيق';

  const match = promos.find(p => p.code.toUpperCase() === code);

  if (!match || !match.isActive || !(match.discountValue > 0)) {
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

  const base     = calculateFinalPrice(product.cost, product.profitPercent, product.discountPercent);
  const priceEl  = card.querySelector('.price-final');
  const tagEl    = card.querySelector('[data-promo-tag]');
  const applied  = appliedPromosPerCard[productId];
  let displayed  = base;

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
   ══ VARIATION PICKER MODAL — STATE & OPEN / CLOSE LOGIC ══
   ══════════════════════════════════════════════════════════════════════════ */

/* Modal-level state — reset on every open */
let _varModal = {
  product:          null,
  selectedVariation: null,
  appliedPromo:     null,
  displayedPrice:   0
};

/**
 * Opens the variation picker modal for the given product.
 * Builds the packages list, resets promo state, and animates the overlay in.
 */
function openVariationPickerModal(product) {
  /* Ensure the modal DOM exists (built once on first call) */
  buildVariationPickerModalDOM();

  const overlay       = document.getElementById('variationPickerOverlay');
  const imgEl         = document.getElementById('varModalImage');
  const titleEl       = document.getElementById('varModalTitle');
  const catBadgeEl    = document.getElementById('varModalCatBadge');
  const pkgListEl     = document.getElementById('varModalPackagesList');
  const nameEl        = document.getElementById('varModalSelectedName');
  const priceEl       = document.getElementById('varModalPriceValue');
  const promoInput    = document.getElementById('varModalPromoInput');
  const promoMsg      = document.getElementById('varModalPromoMsg');
  const tgBtn         = document.getElementById('varModalTelegramBtn');
  const hintEl        = document.getElementById('varModalHint');

  /* Reset state */
  _varModal = {
    product:           product,
    selectedVariation: null,
    appliedPromo:      null,
    displayedPrice:    0
  };

  /* Populate image / title / category */
  imgEl.src     = product.image;
  imgEl.alt     = product.title;
  titleEl.textContent = product.title;

  const catMeta = product.category ? CATEGORY_META[product.category] : null;
  if (catMeta) {
    catBadgeEl.textContent   = catMeta.label;
    catBadgeEl.style.display = 'inline-block';
  } else {
    catBadgeEl.style.display = 'none';
  }

  /* Clear promo inputs */
  promoInput.value   = '';
  promoMsg.textContent = '';
  promoMsg.className = 'var-modal-promo-msg';

  /* Reset price display */
  nameEl.textContent  = '—';
  priceEl.textContent = '— DA';

  /* Disable confirm button until a package is selected */
  tgBtn.disabled    = true;
  hintEl.style.display = 'block';

  /* Build vertical package buttons */
  pkgListEl.innerHTML = '';
  if (!Array.isArray(product.variations) || product.variations.length === 0) {
    pkgListEl.innerHTML = `<p style="color:#555;text-align:center;padding:20px 0;">لا توجد باقات متاحة لهذا المنتج.</p>`;
  } else {
    product.variations.forEach(v => {
      const isDisabled = !v.is_available;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'var-modal-pkg-btn' + (isDisabled ? ' var-pkg-disabled' : '');
      btn.dataset.variationId = String(v.id);
      btn.disabled = isDisabled;

      btn.innerHTML = `
        <div class="var-pkg-name">
          <span class="var-pkg-icon">📦</span>
          <span class="var-pkg-name-text">${escapeHtml(v.name)}</span>
          ${isDisabled ? `<span class="var-pkg-unavailable-tag">غير متوفر</span>` : ''}
        </div>
        <span class="var-pkg-price-tag">${formatPrice(v.price)} DA</span>
        <span class="var-pkg-selected-check">✓</span>
      `;

      if (!isDisabled) {
        btn.addEventListener('click', () => {
          _varModalSelectPackage(v);
        });
      }

      pkgListEl.appendChild(btn);
    });
  }

  /* Show overlay */
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

/**
 * Selects a package inside the variation modal, updates price display
 * and enables the confirm buttons.
 */
function _varModalSelectPackage(variation) {
  _varModal.selectedVariation = variation;

  /* Update button UI */
  const pkgListEl = document.getElementById('varModalPackagesList');
  pkgListEl.querySelectorAll('.var-modal-pkg-btn').forEach(btn => {
    btn.classList.toggle(
      'var-pkg-selected',
      btn.dataset.variationId === String(variation.id)
    );
  });

  /* Recalculate price with any active promo */
  _varModalRecalcPrice();

  /* Enable confirm buttons */
  const tgBtn  = document.getElementById('varModalTelegramBtn');
  const hintEl = document.getElementById('varModalHint');
  if (tgBtn)  tgBtn.disabled = false;
  if (hintEl) hintEl.style.display = 'none';
}

/**
 * Recalculates and updates the price display inside the variation modal.
 * Applies the active promo code if one has been validated.
 */
function _varModalRecalcPrice() {
  if (!_varModal.selectedVariation) return;

  const base     = parseFloat(_varModal.selectedVariation.price) || 0;
  const promo    = _varModal.appliedPromo;
  const final    = promo ? base * (1 - promo.discountValue / 100) : base;

  _varModal.displayedPrice = final;

  const nameEl  = document.getElementById('varModalSelectedName');
  const priceEl = document.getElementById('varModalPriceValue');

  if (nameEl) {
    nameEl.textContent = _varModal.selectedVariation.name;
  }
  if (priceEl) {
    priceEl.textContent = `${formatPrice(final)} DA`;
    /* Animate price change with a quick scale pulse */
    priceEl.style.transform = 'scale(1.08)';
    priceEl.style.color     = '#ff4d4d';
    setTimeout(() => {
      priceEl.style.transform = 'scale(1)';
    }, 180);
  }
}

/**
 * Closes the variation picker modal and resets body scroll.
 */
function closeVariationPickerModal() {
  const overlay = document.getElementById('variationPickerOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  document.body.style.overflow = '';

  /* Reset state */
  _varModal = {
    product:           null,
    selectedVariation: null,
    appliedPromo:      null,
    displayedPrice:    0
  };
}

/**
 * Binds all events INSIDE the variation picker modal.
 * Called once after the modal DOM is injected.
 */
function bindVariationModalEvents() {
  const overlay       = document.getElementById('variationPickerOverlay');
  const closeBtn      = document.getElementById('varModalCloseBtn');
  const promoInput    = document.getElementById('varModalPromoInput');
  const promoApplyBtn = document.getElementById('varModalPromoApplyBtn');
  const tgBtn         = document.getElementById('varModalTelegramBtn');
  const igBtn         = document.getElementById('varModalInstagramBtn');
  const dcBtn         = document.getElementById('varModalDiscordBtn');

  /* Close on X button */
  closeBtn.addEventListener('click', closeVariationPickerModal);

  /* Close on overlay backdrop click */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeVariationPickerModal();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) {
      closeVariationPickerModal();
    }
  });

  /* Promo code apply */
  promoApplyBtn.addEventListener('click', async () => {
    const code     = promoInput.value.trim().toUpperCase();
    const promoMsg = document.getElementById('varModalPromoMsg');

    if (!code) {
      promoMsg.textContent = 'يرجى إدخال كود الخصم.';
      promoMsg.className   = 'var-modal-promo-msg error';
      return;
    }

    promoApplyBtn.disabled    = true;
    promoApplyBtn.textContent = '...';
    promoMsg.textContent      = '';

    const promos = await fetchPromoCodes();

    promoApplyBtn.disabled    = false;
    promoApplyBtn.textContent = 'تطبيق';

    const match = promos.find(p => p.code.toUpperCase() === code);

    if (!match || !match.isActive || !(match.discountValue > 0)) {
      promoMsg.textContent = 'كود غير صالح / Invalid code';
      promoMsg.className   = 'var-modal-promo-msg error';
      _varModal.appliedPromo = null;
      _varModalRecalcPrice();
      return;
    }

    _varModal.appliedPromo = match;
    promoMsg.textContent   = `✅ "${match.code}" مطبّق: -${match.discountValue}%`;
    promoMsg.className     = 'var-modal-promo-msg success';
    _varModalRecalcPrice();
  });

  /* Telegram confirm button */
  tgBtn.addEventListener('click', () => {
    if (!_varModal.product || !_varModal.selectedVariation) {
      showToast('⚠️ يرجى اختيار باقة أولاً.');
      return;
    }
    const { product, selectedVariation, appliedPromo, displayedPrice } = _varModal;
    const msg = buildOrderMessage(product, displayedPrice, appliedPromo, selectedVariation);
    const url = resolveOrderLink('telegram', product, msg);
    sendDiscordWebhookEmbed(product, displayedPrice, appliedPromo, selectedVariation);
    window.open(url, '_blank');
    closeVariationPickerModal();
  });

  /* Instagram button */
  igBtn.addEventListener('click', () => {
    if (_varModal.product && _varModal.selectedVariation) {
      sendDiscordWebhookEmbed(
        _varModal.product,
        _varModal.displayedPrice,
        _varModal.appliedPromo,
        _varModal.selectedVariation
      );
    }
    window.open(CONFIG.INSTAGRAM_URL, '_blank');
    closeVariationPickerModal();
  });

  /* Discord button */
  dcBtn.addEventListener('click', () => {
    if (!_varModal.product || !_varModal.selectedVariation) {
      showToast('⚠️ يرجى اختيار باقة أولاً.');
      return;
    }
    const { product, selectedVariation, appliedPromo, displayedPrice } = _varModal;
    sendDiscordWebhookEmbed(product, displayedPrice, appliedPromo, selectedVariation);
    const discordUrl = (product.discordLink && product.discordLink.trim() &&
                        product.discordLink.trim() !== '#')
                        ? product.discordLink.trim()
                        : CONFIG.DISCORD_INVITE;
    window.open(discordUrl, '_blank');
    closeVariationPickerModal();
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   PRODUCT DETAILS MODAL (معرفة المزيد)
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

function openProductDetailsModal(product, finalPrice, variation = null) {
  const appliedPromo = appliedPromosPerCard[product.id] || null;
  currentModalContext = { product, finalPrice, appliedPromo, variation };

  modalProductImage.src               = product.image;
  modalProductImage.alt               = product.title;
  modalProductTitle.textContent       = product.title;
  modalProductDescription.textContent = product.description?.trim()
    ? product.description
    : 'لا يوجد وصف إضافي لهذا المنتج حالياً.\nNo additional description provided yet.';

  const hasVariations = Array.isArray(product.variations) && product.variations.length > 0;

  if (hasVariations) {
    /* Show generic info for variation products — no specific price yet */
    modalProductPrice.textContent = `${product.variations.length} باقة/باقات متاحة — اختر من البطاقة المنبثقة`;
  } else {
    modalProductPrice.textContent = variation
      ? `${formatPrice(finalPrice)} DA — ${variation.name}`
      : `${formatPrice(finalPrice)} DA`;
  }

  const catMeta = product.category ? CATEGORY_META[product.category] : null;
  if (catMeta) {
    modalCategoryBadge.textContent   = catMeta.label;
    modalCategoryBadge.style.display = 'inline-block';
  } else {
    modalCategoryBadge.style.display = 'none';
  }

  const orderMsg = buildOrderMessage(product, finalPrice, appliedPromo, variation);

  modalInstagramBtn.href = CONFIG.INSTAGRAM_URL;
  modalInstagramBtn.setAttribute('target', '_blank');
  modalInstagramBtn.setAttribute('rel', 'noopener noreferrer');

  if (hasVariations) {
    /* For variation products the telegram / discord buttons in the details
       modal open the variation picker modal instead of placing a direct order */
    modalTelegramBtn.href = '#';
    modalDiscordBtn.href  = '#';

    modalTelegramBtn.onclick = (e) => {
      e.preventDefault();
      closeProductDetailsModal();
      openVariationPickerModal(product);
    };

    modalDiscordBtn.onclick = (e) => {
      e.preventDefault();
      closeProductDetailsModal();
      openVariationPickerModal(product);
    };

    modalOutOfStockNote.style.display    = 'none';
    modalTelegramBtn.classList.remove('btn-disabled-look');
    modalTelegramBtn.removeAttribute('aria-disabled');
    modalTelegramBtn.style.opacity = '';
  } else {
    const telegramUrl = resolveOrderLink('telegram', product, orderMsg);
    modalTelegramBtn.href = telegramUrl;
    modalTelegramBtn.setAttribute('target', '_blank');
    modalTelegramBtn.setAttribute('rel', 'noopener noreferrer');
    modalTelegramBtn.onclick = null;

    const discordUrl = (product.discordLink && product.discordLink.trim() &&
                        product.discordLink.trim() !== '#')
                        ? product.discordLink.trim()
                        : CONFIG.DISCORD_INVITE;
    modalDiscordBtn.href = discordUrl;
    modalDiscordBtn.setAttribute('target', '_blank');
    modalDiscordBtn.setAttribute('rel', 'noopener noreferrer');

    modalDiscordBtn.onclick = (e) => {
      e.preventDefault();
      sendDiscordWebhookEmbed(product, finalPrice, appliedPromo, variation);
      window.open(discordUrl, '_blank');
    };

    const availableToOrder = product.available;

    if (availableToOrder) {
      modalOutOfStockNote.style.display    = 'none';
      modalTelegramBtn.classList.remove('btn-disabled-look');
      modalTelegramBtn.removeAttribute('aria-disabled');
      modalTelegramBtn.style.pointerEvents = '';
      modalTelegramBtn.style.opacity       = '';
    } else {
      modalOutOfStockNote.style.display = 'block';
      modalTelegramBtn.classList.add('btn-disabled-look');
      modalTelegramBtn.setAttribute('aria-disabled', 'true');
      modalTelegramBtn.style.opacity    = '0.45';
    }

    modalDiscordBtn.classList.remove('btn-disabled-look');
    modalDiscordBtn.removeAttribute('aria-disabled');
    modalDiscordBtn.style.pointerEvents = '';
    modalDiscordBtn.style.opacity       = '';
  }

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

const prodSellingPrice    = document.getElementById('prodProfit');
const prodDiscountedPrice = document.getElementById('prodDiscount');

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

function initAdminPriceInputsUI() {
  const sellingLabel = document.querySelector('label[for="prodProfit"]');
  if (sellingLabel) sellingLabel.textContent = '💰 Selling Price (DA)';

  const discountLabel = document.querySelector('label[for="prodDiscount"]');
  if (discountLabel) discountLabel.textContent = '💥 Discounted Selling Price (DA) — optional';

  if (prodSellingPrice) {
    prodSellingPrice.removeAttribute('max');
    prodSellingPrice.removeAttribute('min');
    prodSellingPrice.setAttribute('step', '0.01');
    prodSellingPrice.setAttribute('placeholder', 'e.g. 2800');
  }

  if (prodDiscountedPrice) {
    prodDiscountedPrice.removeAttribute('max');
    prodDiscountedPrice.removeAttribute('min');
    prodDiscountedPrice.removeAttribute('required');
    prodDiscountedPrice.setAttribute('step', '0.01');
    prodDiscountedPrice.setAttribute('placeholder', 'e.g. 2200 (leave empty if no discount)');
  }
}
initAdminPriceInputsUI();

/* ── Admin: rebuild category <select> with full optgroups ── */
function buildAdminCategoryDropdown() {
  if (!prodCategory) return;

  const groups = [
    {
      label: '🔌 اشتراكات رقمية',
      options: [
        { value: 'sub_digital_keys', label: 'Digital Key 🔑' },
        { value: 'sub_netflix',      label: 'Netflix 🎬' },
        { value: 'sub_spotify',      label: 'Spotify 🎵' },
        { value: 'sub_shahid',       label: 'Shahid 💜' },
        { value: 'sub_crunchyroll',  label: 'Crunchyroll 🧡' },
        { value: 'sub_other',        label: 'Other 🛠️' }
      ]
    },
    {
      label: '📱 شحن ألعاب الهاتف',
      options: [
        { value: 'mobile_digital_keys', label: 'Digital Key 🔑' },
        { value: 'mobile_uid',          label: 'شحن UID 🆔' },
        { value: 'mobile_card',         label: 'شحن Card 💳' }
      ]
    },
    {
      label: '🎮 بلاي ستايشن (PSN)',
      options: [
        { value: 'psn_digital_keys', label: 'Digital Key 🔑' },
        { value: 'psn_games',        label: 'ألعاب 🎮' },
        { value: 'psn_gift_cards',   label: 'Gift Card 💳' }
      ]
    },
    {
      label: '💚 إكس بوكس (Xbox)',
      options: [
        { value: 'xbox_digital_keys', label: 'Digital Key 🔑' },
        { value: 'xbox_games',        label: 'ألعاب 🎮' },
        { value: 'xbox_gift_cards',   label: 'Gift Card 💳' },
        { value: 'xbox_game_pass',    label: 'Game Pass 💚' }
      ]
    },
    {
      label: '🖥️ ألعاب وحسابات PC',
      options: [
        { value: 'pc_digital_keys',     label: 'Digital Key 🔑' },
        { value: 'pc_shared_accounts',  label: 'حسابات مشتركة 👥' },
        { value: 'pc_online_accounts',  label: 'حسابات online 🌐' },
        { value: 'pc_offline_accounts', label: 'حسابات اوفلاين 🖥️' },
        { value: 'pc_gift_cards',       label: 'Gift Card 💳' }
      ]
    }
  ];

  let html = '<option value="">— اختر القسم —</option>';
  groups.forEach(group => {
    html += `<optgroup label="${escapeAttr(group.label)}">`;
    group.options.forEach(opt => {
      html += `<option value="${escapeAttr(opt.value)}">${escapeHtml(opt.label)}</option>`;
    });
    html += `</optgroup>`;
  });

  prodCategory.innerHTML = html;
}
buildAdminCategoryDropdown();

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN VARIATIONS SECTION (dynamically injected into the product form)
   ══════════════════════════════════════════════════════════════════════════ */

function createVariationsSection() {
  const section = document.createElement('div');
  section.className        = 'variations-section';
  section.id               = 'variationsSection';
  section.style.gridColumn = '1 / -1';
  section.innerHTML = `
    <label class="variations-section-label">📦 Product Variations (الباقات المتاحة)</label>
    <div class="variations-list" id="variationsList"></div>
    <button type="button" class="add-variation-btn" id="addVariationBtn">+ Add New Variation</button>
  `;
  return section;
}

function createVariationRow(variation = {}) {
  const id  = variation.id || generateId();
  const row = document.createElement('div');
  row.className           = 'variation-row';
  row.dataset.variationId = id;
  row.innerHTML = `
    <input type="text" class="variation-name"
           placeholder="اسم الباقة (e.g. 5$, 100 Diamonds, 660 UC)"
           value="${escapeAttr(variation.name || '')}">
    <input type="number" class="variation-price"
           placeholder="السعر (DA)" step="0.01" min="0"
           value="${variation.price !== undefined && variation.price !== null ? variation.price : ''}">
    <label class="variation-toggle">
      <input type="checkbox" class="variation-active" ${variation.is_available !== false ? 'checked' : ''}>
      <span>تفعيل</span>
    </label>
    <button type="button" class="variation-remove-btn">✕ حذف</button>
  `;
  row.querySelector('.variation-remove-btn').addEventListener('click', () => row.remove());
  return row;
}

function insertVariationsSectionIntoForm() {
  const section = createVariationsSection();
  let refNode = submitBtn;
  while (refNode && refNode.parentElement !== productForm) {
    refNode = refNode.parentElement;
  }
  if (refNode && refNode.parentElement === productForm) {
    productForm.insertBefore(section, refNode);
  } else {
    productForm.appendChild(section);
  }
  return section;
}

const _variationsSectionEl = insertVariationsSectionIntoForm();
const variationsListEl     = _variationsSectionEl.querySelector('#variationsList');
const addVariationBtnEl    = _variationsSectionEl.querySelector('#addVariationBtn');

addVariationBtnEl.addEventListener('click', () => {
  variationsListEl.appendChild(createVariationRow());
});

function renderVariationsRows(variations = []) {
  variationsListEl.innerHTML = '';
  variations.forEach(v => variationsListEl.appendChild(createVariationRow(v)));
}

function collectVariationsFromForm() {
  const rows       = variationsListEl.querySelectorAll('.variation-row');
  const variations = [];
  rows.forEach(row => {
    const name        = row.querySelector('.variation-name').value.trim();
    const price       = parseFloat(row.querySelector('.variation-price').value) || 0;
    const isAvailable = row.querySelector('.variation-active').checked;
    if (name) {
      variations.push({
        id:           row.dataset.variationId,
        name:         name,
        price:        price,
        is_available: isAvailable
      });
    }
  });
  return variations;
}

/* ══════════════════════════════════════════════════════════════════════════ */

function updatePricePreview() {
  const costVal            = parseFloat(prodCost.value)            || 0;
  const sellingPriceVal    = parseFloat(prodSellingPrice.value)    || 0;
  const discountedPriceVal = parseFloat(prodDiscountedPrice.value) || 0;

  if (!costVal || !sellingPriceVal) {
    pricePreview.innerHTML = 'Final Price: <strong>-- DA</strong>';
    return;
  }

  const profitPercent = calculateProfitPercent(costVal, sellingPriceVal);
  const hasDiscount   = discountedPriceVal > 0 && discountedPriceVal < sellingPriceVal;
  const discountPercent = hasDiscount
    ? calculateDiscountPercent(sellingPriceVal, discountedPriceVal)
    : 0;

  const base  = sellingPriceVal;
  const final = hasDiscount ? discountedPriceVal : sellingPriceVal;

  pricePreview.innerHTML = hasDiscount
    ? `Base: <s>${formatPrice(base)} DA</s> &nbsp;→&nbsp; Final: <strong>${formatPrice(final)} DA</strong>
       <br><span style="color:#8a8a8a;font-size:12px;">Profit: ${profitPercent.toFixed(2)}% &nbsp;|&nbsp; Discount: ${discountPercent.toFixed(2)}%</span>`
    : `Final Price: <strong>${formatPrice(final)} DA</strong>
       <br><span style="color:#8a8a8a;font-size:12px;">Profit: ${profitPercent.toFixed(2)}%</span>`;
}

[prodCost, prodSellingPrice, prodDiscountedPrice].forEach(inp =>
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

  const costVal            = parseFloat(prodCost.value)            || 0;
  const sellingPriceVal    = parseFloat(prodSellingPrice.value)    || 0;
  const discountedPriceVal = parseFloat(prodDiscountedPrice.value) || 0;

  const variationsData    = collectVariationsFromForm();
  const hasVariationsData = variationsData.length > 0;

  if (costVal <= 0 && !hasVariationsData) {
    showToast('⚠️ Please enter a valid Cost Price / أدخل سعر التكلفة الصحيح.');
    prodCost.focus();
    return;
  }

  if (sellingPriceVal <= 0 && !hasVariationsData) {
    showToast('⚠️ Please enter a valid Selling Price / أدخل سعر البيع الصحيح.');
    prodSellingPrice.focus();
    return;
  }

  if (discountedPriceVal > 0 && sellingPriceVal > 0 && discountedPriceVal >= sellingPriceVal) {
    showToast('⚠️ Discounted Price must be less than the Selling Price.');
    prodDiscountedPrice.focus();
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = 'جارٍ الحفظ...';

  const editingId  = productIdInput.value;
  const discordVal = prodDiscord.value.trim() || CONFIG.DISCORD_INVITE;

  const profitPercent   = calculateProfitPercent(costVal, sellingPriceVal);
  const discountPercent = discountedPriceVal > 0
    ? calculateDiscountPercent(sellingPriceVal, discountedPriceVal)
    : 0;

  const productData = {
    id:               editingId || null,
    title:            prodTitle.value.trim(),
    category:         categoryVal,
    image:            prodImage.value.trim(),
    cost:             costVal,
    profitPercent:    profitPercent,
    discountPercent:  discountPercent,
    description:      prodDescription.value.trim(),
    telegramUsername: prodTelegram.value.trim(),
    discordLink:      discordVal,
    topSeller:        prodTopSeller.checked,
    available:        prodAvailable.checked,
    variations:       variationsData
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
  renderVariationsRows([]);
}

cancelEditBtn.addEventListener('click', resetProductForm);

function editProduct(id) {
  const product = _cachedProducts.find(p => String(p.id) === String(id));
  if (!product) return;

  productIdInput.value  = product.id;
  prodTitle.value       = product.title;
  prodCategory.value    = product.category || '';
  prodImage.value       = product.image;
  prodCost.value        = product.cost;

  const sellingPrice = calculateBasePrice(product.cost, product.profitPercent);
  prodSellingPrice.value = product.cost > 0 ? formatPrice(sellingPrice) : '';

  if (parseFloat(product.discountPercent) > 0) {
    const discountedPrice = calculateFinalPrice(
      product.cost, product.profitPercent, product.discountPercent
    );
    prodDiscountedPrice.value = formatPrice(discountedPrice);
  } else {
    prodDiscountedPrice.value = '';
  }

  prodDescription.value = product.description || '';
  prodTelegram.value    = product.telegramUsername || '';
  prodDiscord.value     = (product.discordLink === CONFIG.DISCORD_INVITE)
                            ? ''
                            : (product.discordLink || '');
  prodTopSeller.checked = product.topSeller;
  prodAvailable.checked = product.available;

  renderVariationsRows(product.variations || []);

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
    const finalPrice = calculateFinalPrice(
      product.cost, product.profitPercent, product.discountPercent
    );
    const sellingPrice = calculateBasePrice(product.cost, product.profitPercent);
    const catMeta  = product.category ? CATEGORY_META[product.category] : null;
    const catCell  = catMeta
      ? `<span class="cat-pill" data-cat="${escapeAttr(product.category)}">${catMeta.label}</span>`
      : `<span style="color:var(--text-muted)">—</span>`;

    const effectiveDiscord = (product.discordLink && product.discordLink.trim() &&
                              product.discordLink.trim() !== '#')
                              ? product.discordLink.trim()
                              : CONFIG.DISCORD_INVITE;
    const discordCell = `<a href="${escapeHtml(effectiveDiscord)}"
          target="_blank" class="discord-pill">🔗 Link</a>`;

    const hasVariations  = Array.isArray(product.variations) && product.variations.length > 0;
    const variationsNote = hasVariations
      ? `<br><span style="font-size:11px;color:#ff6b6b;">📦 ${product.variations.length} باقة/باقات</span>`
      : '';

    return `
      <tr>
        <td>
          <img src="${escapeHtml(product.image)}"
               alt="${escapeHtml(product.title)}"
               onerror="this.src='https://via.placeholder.com/60/141414/555?text=IMG'">
        </td>
        <td>${escapeHtml(product.title)}${variationsNote}</td>
        <td>${catCell}</td>
        <td>${formatPrice(product.cost)} DA</td>
        <td>${formatPrice(sellingPrice)} DA <span style="color:#8a8a8a;font-size:11px;">(${product.profitPercent.toFixed(1)}%)</span></td>
        <td>${product.discountPercent > 0 ? product.discountPercent.toFixed(1) + '%' : '—'}</td>
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
   ADMIN — PROMO CODES (fully Supabase-backed)
   ══════════════════════════════════════════════════════════════════════════ */
const promoForm       = document.getElementById('promoForm');
const promoCodeInput  = document.getElementById('promoCode');
const promoValueInput = document.getElementById('promoValue');
const promoList       = document.getElementById('promoList');

promoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const code  = promoCodeInput.value.trim().toUpperCase();
  const value = parseFloat(promoValueInput.value);

  if (!code || !value || value <= 0 || value > 100) {
    showToast('⚠️ Please enter a valid code and discount value.');
    return;
  }

  const submitPromoBtn       = promoForm.querySelector('button[type="submit"]');
  submitPromoBtn.disabled    = true;
  submitPromoBtn.textContent = 'جارٍ الحفظ...';

  const existing = await fetchPromoCodes();
  if (existing.some(p => p.code.toUpperCase() === code)) {
    showToast('⚠️ This promo code already exists.');
    submitPromoBtn.disabled    = false;
    submitPromoBtn.textContent = 'Add Code';
    return;
  }

  const success = await savePromoCodeToDb(code, value);

  submitPromoBtn.disabled    = false;
  submitPromoBtn.textContent = 'Add Code';

  if (success) {
    promoForm.reset();
    renderAdminPromoList();
    showToast('✅ Promo code added!');
  }
});

async function deletePromoCode(id) {
  if (!confirm('Delete this promo code?')) return;
  const success = await deletePromoCodeFromDb(id);
  if (success) {
    renderAdminPromoList();
    showToast('🗑️ Promo code deleted.');
  }
}

async function renderAdminPromoList() {
  promoList.innerHTML = `<p class="muted-text">⏳ جارٍ التحميل...</p>`;

  const promos = await fetchPromoCodes();

  if (promos.length === 0) {
    promoList.innerHTML = `<p class="muted-text">No promo codes yet.</p>`;
    return;
  }

  promoList.innerHTML = promos.map(promo => `
    <div class="promo-item">
      <div>
        <span class="promo-code">${escapeHtml(promo.code)}</span>
        <span class="promo-value">-${promo.discountValue}%</span>
        ${!promo.isActive
          ? `<span class="promo-inactive-tag" style="color:#ff6b6b;font-size:12px;margin-left:6px;">(inactive)</span>`
          : ''}
      </div>
      <button class="btn btn-sm btn-danger"
              onclick="deletePromoCode('${escapeHtml(promo.id)}')">Delete</button>
    </div>`).join('');
}

/* ══════════════════════════════════════════════════════════════════════════
   VARIATION PICKER BUTTON — inline CSS injection
   (Ensures "اختر الباقة المناسبة" button always looks correct)
   ══════════════════════════════════════════════════════════════════════════ */
function injectVariationPickerBtnStyle() {
  if (document.getElementById('dzvibes-varpickerbtn-style')) return;
  const style = document.createElement('style');
  style.id = 'dzvibes-varpickerbtn-style';
  style.textContent = `
    .btn-variation-picker {
      width: 100%;
      background: linear-gradient(135deg, #ff1a1a 0%, #cc0000 100%);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 14px 20px;
      font-size: 15px;
      font-weight: 800;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.22s ease;
      box-shadow: 0 4px 18px rgba(255, 26, 26, 0.3);
      -webkit-tap-highlight-color: transparent;
      letter-spacing: 0.2px;
    }
    .btn-variation-picker:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(255, 26, 26, 0.5);
      background: linear-gradient(135deg, #ff3333 0%, #e60000 100%);
    }
    .btn-variation-picker:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(255, 26, 26, 0.3);
    }
    .btn-variation-picker:disabled {
      opacity: 0.38;
      cursor: not-allowed;
      box-shadow: none;
      background: #333;
    }
  `;
  document.head.appendChild(style);
}
injectVariationPickerBtnStyle();

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