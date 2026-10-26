// Cuenta regresiva al 14/11/2026 (Paraguay, UTC-3)
const inicio = new Date('2026-11-14T09:00:00-03:00').getTime();
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
