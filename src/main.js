const FORM_INSCRIPCION = 'https://docs.google.com/forms/d/e/1FAIpQLSffARB-nm0UiiQr7jGAKWspK2L_OkdyyQwVZRvvTHhjFtHaKA/viewform';

// Cuenta regresiva a la apertura de puertas: 14/11/2026 12:00 (Paraguay, UTC-3)
const inicio = new Date('2026-11-14T12:00:00-03:00').getTime();
const cd = document.getElementById('countdown');
const pad = (n) => String(n).padStart(2, '0');

function tick() {
  const diff = inicio - Date.now();
  if (diff <= 0) {
    cd.innerHTML = '<p class="live">🔴 ¡Center Stage está en marcha!</p>';
    return clearInterval(timer);
  }
  const s = Math.floor(diff / 1000);
  const vals = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
  for (const [u, v] of Object.entries(vals)) cd.querySelector(`[data-u="${u}"]`).textContent = pad(v);
}
const timer = setInterval(tick, 1000);
tick();

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

// Botones de paquetes → WhatsApp con mensaje prearmado
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/595972179261?text=${encodeURIComponent(a.dataset.wa)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

// Botones de inscripción → formulario de Google
document.querySelectorAll('[data-inscripcion]').forEach((a) => {
  a.href = FORM_INSCRIPCION;
  a.target = '_blank';
  a.rel = 'noopener';
});

// Torneos por día (las pestañas solo se ven en móvil; el domingo 15 abre ese día)
const tabs = [...document.querySelectorAll('.day-tabs button')];
const dias = [...document.querySelectorAll('.day')];
function verDia(dia) {
  tabs.forEach((t) => { const on = t.dataset.dia === dia; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
  dias.forEach((d) => d.classList.toggle('on', d.dataset.dia === dia));
}
tabs.forEach((t) => t.addEventListener('click', () => verDia(t.dataset.dia)));
verDia(new Date().toISOString().startsWith('2026-11-15') ? 'domingo' : 'sabado');

// Fotos de invitados y representantes: si falta el archivo, quedan las iniciales
document.querySelectorAll('.avatar img').forEach((img) => {
  const quitar = () => img.remove();
  if (img.complete && !img.naturalWidth) quitar();
  else img.addEventListener('error', quitar);
});

// Barra inferior móvil: aparece pasando el hero y se oculta en contacto
const bar = document.getElementById('mobileBar');
const vistos = new Set();
const barIo = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? vistos.add(e.target.id) : vistos.delete(e.target.id)));
  bar.classList.toggle('show', !vistos.has('inicio') && !vistos.has('contacto'));
});
['inicio', 'contacto'].forEach((id) => barIo.observe(document.getElementById(id)));

// Carrusel de paquetes: puntos indicadores
const plans = document.querySelector('.plans');
const dots = [...document.querySelectorAll('.plans-dots button')];
plans.addEventListener('scroll', () => {
  const i = Math.round(plans.scrollLeft / (plans.scrollWidth - plans.clientWidth || 1) * (dots.length - 1));
  dots.forEach((d, j) => d.classList.toggle('on', j === i));
}, { passive: true });
dots.forEach((d, j) => d.addEventListener('click', () => plans.children[j].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })));

// Aparición al hacer scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
  { threshold: 0.12 }
);
document.querySelectorAll('.section > *').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
