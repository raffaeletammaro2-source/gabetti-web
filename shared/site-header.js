// Header comune delle landing Gabetti: apre e chiude il menu su mobile.
document.querySelectorAll('.gh').forEach(function (h) {
  var b = h.querySelector('.gh-burger');
  if (!b) return;
  b.addEventListener('click', function () {
    var open = h.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  });
});

// Voce "Compra": visibile solo se attivata dall'area admin del sito (site_settings.compra_enabled).
// Indirizzo e chiave publishable di Supabase sono pubblici (gli stessi di sito/.env).
(function () {
  var links = document.querySelectorAll('.gh a[href="/compra"]');
  if (!links.length) return;
  links.forEach(function (a) { (a.closest('li') || a).style.display = 'none'; });
  fetch('https://iaauxncprjravzxfmeno.supabase.co/rest/v1/site_settings?select=value&key=eq.compra_enabled', {
    headers: { apikey: 'sb_publishable_vq5McJrIm39jQGVe4qsrng_N5kkDuOx' }
  }).then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
    var on = rows.length ? rows[0].value !== false : true;
    if (on) links.forEach(function (a) { (a.closest('li') || a).style.display = ''; });
  }).catch(function () {});
})();
