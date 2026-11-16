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
