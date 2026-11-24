/* Tracciamento comune delle landing (/cantieri/<slug>/).
   Si include nel <head>, SENZA defer/async, prima degli altri script:
     <script src="/shared/tracking.js"></script>

   Fa le stesse cose del sito principale (sito/index.html + src/lib/consent.ts + src/lib/tracking.ts):
   - Consent Mode v2 con default "negato", oppure la scelta già salvata (stessa chiave del sito: cookie_consent_v1,
     quindi chi ha già scelto sul sito non rivede il banner sulla landing e viceversa);
   - carica lo stesso container GTM del sito;
   - mostra il banner cookie se l'utente non ha ancora scelto;
   - traccia i clic su telefono e WhatsApp;
   - espone GabettiTracking.lead({...}) da chiamare SOLO dopo che il server ha confermato l'invio del modulo.
   Il Pixel Meta e GA4 NON si mettono nella pagina: li gestisce GTM (vedi docs/tracciamento/README.md). */
(function () {
  var GTM_ID = 'GTM-TLKTBLW6';
  var STORAGE_KEY = 'cookie_consent_v1';
  var CONSENT_VERSION = 1;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function getConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return c && c.version === CONSENT_VERSION ? c : null;
    } catch (e) { return null; }
  }

  // 1. Consenso di default (prima di GTM)
  var stored = getConsent();
  var mk = stored && stored.marketing ? 'granted' : 'denied';
  window.gtag('consent', 'default', {
    ad_storage: mk,
    ad_user_data: mk,
    ad_personalization: mk,
    analytics_storage: stored && stored.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    personalization_storage: stored && stored.preferences ? 'granted' : 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
  window.gtag('set', 'ads_data_redaction', mk === 'denied');
  window.gtag('set', 'url_passthrough', true);

  // 2. Google Tag Manager
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
  document.head.appendChild(g);

  // 3. Salvataggio e applicazione della scelta (come src/lib/consent.ts)
  function applyConsent(c) {
    window.gtag('consent', 'update', {
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
      analytics_storage: c.analytics ? 'granted' : 'denied',
      functionality_storage: c.preferences ? 'granted' : 'denied',
      personalization_storage: c.preferences ? 'granted' : 'denied',
      security_storage: 'granted'
    });
    window.dataLayer.push({
      event: 'cookie_consent_update',
      consent_analytics: c.analytics,
      consent_marketing: c.marketing,
      consent_preferences: c.preferences
    });
  }
  function saveConsent(analytics, marketing, preferences) {
    var c = { necessary: true, analytics: analytics, marketing: marketing, preferences: preferences,
      timestamp: new Date().toISOString(), version: CONSENT_VERSION };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch (e) { /* noop */ }
    applyConsent(c);
    return c;
  }
  // Come il sito: a ogni caricamento si riapplica la scelta salvata
  if (stored) applyConsent(stored);

  // 4. Utilità
  function uuid() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  }
  function clean(v) { v = String(v || '').trim().toLowerCase(); return v || undefined; }
  function normalizePhone(raw) {
    var d = String(raw || '').replace(/\D/g, '');
    if (!d) return undefined;
    if (d.indexOf('39') === 0) return '+' + d;
    if (d.indexOf('00') === 0) return '+' + d.slice(2);
    return '+39' + d;
  }
  function pagePath() { return location.pathname + location.hash; }
  function utm() {
    var p = new URLSearchParams(location.search), out = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'gclid', 'gbraid', 'wbraid', 'fbclid']
      .forEach(function (k) { if (p.get(k)) out[k] = p.get(k); });
    return out;
  }
  function buildUserData(u) {
    var c = getConsent();
    if (!u || !c || !c.marketing) return undefined;
    var parts = String(u.name || '').trim().split(/\s+/);
    return {
      email: clean(u.email),
      phone_number: normalizePhone(u.phone),
      address: {
        first_name: clean(u.first_name || parts[0]),
        last_name: clean(u.last_name || parts.slice(1).join(' ')),
        city: clean(u.city),
        region: 'na',
        country: 'IT'
      }
    };
  }
  function push(o) { window.dataLayer.push(o); }

  // 5. API per la pagina
  window.GabettiTracking = {
    // Da chiamare SOLO dopo la risposta positiva del server.
    // opts: { form_name, project, lead_category (default nuove_costruzioni), lead_type, event_id, user: {name, email, phone, city} }
    lead: function (opts) {
      opts = opts || {};
      var ud = buildUserData(opts.user);
      if (ud) window.gtag('set', 'user_data', ud);
      var ev = {
        event: 'generate_lead',
        form_name: opts.form_name,
        lead_category: opts.lead_category || 'nuove_costruzioni',
        lead_type: opts.lead_type || 'form_submit',
        project: opts.project,
        event_id: opts.event_id || uuid(),
        page_path: pagePath()
      };
      var u = utm(); for (var k in u) ev[k] = u[k];
      if (opts.extra) for (var x in opts.extra) ev[x] = opts.extra[x];
      if (ud) ev.user_data = ud;
      push(ev);
      return ev.event_id;
    },
    openConsent: function () { showBanner(true); }
  };

  // 6. Clic su telefono e WhatsApp (anche sui link creati dopo)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.href || '';
    if (/^tel:/i.test(href)) push({ event: 'click_phone', click_url: href, page_path: pagePath(), event_id: uuid() });
    else if (/wa\.me|whatsapp\.com/i.test(href)) push({ event: 'click_whatsapp', click_url: href, page_path: pagePath(), event_id: uuid() });
  }, true);

  // 7. Banner cookie (stessi testi e scelte del banner del sito)
  var CSS = '' +
    '.gcb{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;padding:12px;font-family:Inter,system-ui,sans-serif}' +
    '.gcb-box{max-width:960px;margin:0 auto;background:#fff;color:#1f2937;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.25);padding:18px 20px;border:1px solid #e5e7eb}' +
    '.gcb h2{font-size:16px;font-weight:700;margin:0 0 6px}' +
    '.gcb p{font-size:13.5px;line-height:1.5;margin:0 0 12px;color:#4b5563}' +
    '.gcb a{color:#B20933;text-decoration:underline}' +
    '.gcb-btns{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}' +
    '.gcb button{font:600 14px Inter,system-ui,sans-serif;border-radius:8px;padding:10px 16px;cursor:pointer;border:1px solid #B20933}' +
    '.gcb .gcb-pri{background:#B20933;color:#fff}' +
    '.gcb .gcb-sec{background:#fff;color:#B20933}' +
    '.gcb label{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;margin:0 0 10px;color:#374151}' +
    '.gcb label input{margin-top:3px;accent-color:#B20933;width:16px;height:16px}' +
    '@media(max-width:600px){.gcb-btns button{flex:1 1 100%}}';

  function showBanner(prefs) {
    var old = document.querySelector('.gcb'); if (old) old.remove();
    if (!document.getElementById('gcb-css')) {
      var st = document.createElement('style'); st.id = 'gcb-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var cur = getConsent() || { analytics: false, marketing: false, preferences: false };
    var el = document.createElement('div');
    el.className = 'gcb';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-labelledby', 'gcb-title');
    el.innerHTML = prefs
      ? '<div class="gcb-box"><h2 id="gcb-title">Preferenze cookie</h2>' +
        '<label><input type="checkbox" checked disabled> <span><b>Necessari</b> — indispensabili al funzionamento del sito.</span></label>' +
        '<label><input type="checkbox" id="gcb-an"' + (cur.analytics ? ' checked' : '') + '> <span><b>Analisi</b> — statistiche anonime sull\'uso del sito (Google Analytics).</span></label>' +
        '<label><input type="checkbox" id="gcb-mk"' + (cur.marketing ? ' checked' : '') + '> <span><b>Marketing</b> — misurazione e personalizzazione degli annunci (Meta, Google Ads).</span></label>' +
        '<label><input type="checkbox" id="gcb-pr"' + (cur.preferences ? ' checked' : '') + '> <span><b>Preferenze</b> — ricordano le tue scelte.</span></label>' +
        '<div class="gcb-btns"><button class="gcb-sec" data-a="rej">Rifiuta tutti</button><button class="gcb-sec" data-a="save">Salva preferenze</button><button class="gcb-pri" data-a="all">Accetta tutti</button></div></div>'
      : '<div class="gcb-box"><h2 id="gcb-title">Rispettiamo la tua privacy</h2>' +
        '<p>Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo tuo consenso, cookie di analisi e marketing per migliorare l\'esperienza e mostrarti contenuti pertinenti. Leggi la <a href="/cookie-policy">Cookie Policy</a> e la <a href="privacy.html">Informativa privacy</a>.</p>' +
        '<div class="gcb-btns"><button class="gcb-sec" data-a="prefs">Personalizza</button><button class="gcb-sec" data-a="rej">Rifiuta</button><button class="gcb-pri" data-a="all">Accetta tutti</button></div></div>';
    el.addEventListener('click', function (e) {
      var a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
      if (!a) return;
      if (a === 'prefs') return showBanner(true);
      if (a === 'all') saveConsent(true, true, true);
      if (a === 'rej') saveConsent(false, false, false);
      if (a === 'save') saveConsent(
        document.getElementById('gcb-an').checked,
        document.getElementById('gcb-mk').checked,
        document.getElementById('gcb-pr').checked
      );
      el.remove();
    });
    document.body.appendChild(el);
  }

  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
  }
  onReady(function () {
    if (!getConsent()) showBanner(false);
    // Un link con data-cookie-settings riapre le preferenze (es. nel footer)
    document.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); showBanner(true); });
    });
  });
})();
