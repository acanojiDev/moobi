import './style.css';
import { bearSVG } from './bear.js';
import { menu, menuNote, cocteles, flavours, eur } from './menu.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

$('.nav__mini').innerHTML = bearSVG({ label: '' });

/* ---------- Cócteles ---------- */
const coctelCard = (c) => `
  <li class="coctel" id="coctel-${c.img}">
    <figure class="coctel__img"><img src="img/cocteles/${c.img}.jpg" width="800" height="800" alt="Cóctel ${c.name}" loading="lazy" /></figure>
    <div class="coctel__body">
      <h4 class="coctel__name">${c.name}</h4>
      ${c.badge ? `<p class="coctel__badge">${c.badge}</p>` : ''}
      ${c.quote ? `<blockquote class="coctel__quote"><p>«${c.quote}»</p><footer>${c.film}</footer></blockquote>` : ''}
      ${c.notes ? `<p class="coctel__notes">${c.notes}.</p>` : ''}
    </div>
  </li>`;

$('[data-cocteles]').innerHTML = cocteles
  .map((g) => `
    <div class="cocteles__group">
      <h3>${g.name} <span class="cocteles__price">${eur(g.price)}</span></h3>
      <ul class="cocteles__list">${g.items.map(coctelCard).join('')}</ul>
    </div>`)
  .join('');

/* ---------- Resto de la carta: todas las secciones seguidas ---------- */
$('[data-carta]').innerHTML = menu
  .map((c) => `
    <section class="carta-sec" id="${c.id}" aria-labelledby="h-${c.id}">
      <h2 class="carta-sec__title" id="h-${c.id}">${c.name}</h2>
      <div class="panel">
        ${c.groups.map((g) => `
          <div class="group">
            ${c.groups.length > 1 || g.name !== c.name ? `<h3>${g.name}</h3>` : ''}
            <ul class="items">
              ${g.items.map(([n, d, p]) => `<li><span class="n">${n}</span>${d ? `<span class="d">${d}</span>` : ''}<span class="p${p == null ? ' is-ask' : ''}">${eur(p)}</span></li>`).join('')}
            </ul>
          </div>`).join('')}
        ${c.id === 'batidos' ? `
          <div class="mix">
            <h3>Fabrica tu milkshake</h3>
            <p class="mix__hint">Elige hasta 3 sabores. Sigue a 6 €.</p>
            <div class="flavours"></div>
            <p class="mix__result">Tu milkshake: <strong>elige sabores</strong></p>
          </div>` : ''}
      </div>
    </section>`)
  .join('');
$('[data-note]').textContent = menuNote;

/* ---------- Fabrica tu milkshake ---------- */
const flavourBox = $('.flavours');
const mixResult = $('.mix__result strong');
const picked = [];
flavourBox.innerHTML = flavours
  .map(([name]) => `<button type="button" class="flavour" aria-pressed="false" data-name="${name}">${name}</button>`)
  .join('');
const drawMix = () => {
  const n = picked.length;
  mixResult.textContent = n ? `${picked.join(', ')} · 6 €` : 'elige sabores';
  $$('.flavour', flavourBox).forEach((b) => {
    b.disabled = n >= 3 && b.getAttribute('aria-pressed') !== 'true';
  });
};
flavourBox.addEventListener('click', (e) => {
  const btn = e.target.closest('.flavour');
  if (!btn || btn.disabled) return;
  const i = picked.indexOf(btn.dataset.name);
  if (i >= 0) picked.splice(i, 1);
  else if (picked.length < 3) picked.push(btn.dataset.name);
  btn.setAttribute('aria-pressed', String(i < 0));
  drawMix();
});
drawMix();

/* ---------- Barra de secciones con la sección activa marcada ---------- */
const sections = [{ id: 'cocteles', name: 'Cócteles' }, ...menu];
const catbar = $('[data-catbar]');
catbar.innerHTML = sections.map((s) => `<a class="tab" href="#${s.id}">${s.name}</a>`).join('');
const links = $$('a', catbar);
const markActive = (id) => {
  links.forEach((a) => {
    const on = a.getAttribute('href') === `#${id}`;
    if (on) {
      a.setAttribute('aria-current', 'true');
      catbar.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' });
    } else a.removeAttribute('aria-current');
  });
};
const io = new IntersectionObserver((entries) => {
  entries.filter((e) => e.isIntersecting).forEach((e) => markActive(e.target.id));
}, { rootMargin: '-35% 0px -60% 0px' });
sections.forEach((s) => io.observe(document.getElementById(s.id)));

/* ---------- Navegación ---------- */
const nav = $('[data-nav]');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = scrollY;
  if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > 200);
  document.body.classList.toggle('nav-hidden', nav.classList.contains('is-hidden'));
  lastY = y;
}, { passive: true });

const toggle = $('.nav__toggle');
const mobileMenu = $('#menu-movil');
const closeMenu = () => {
  mobileMenu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};
toggle.addEventListener('click', () => {
  const open = mobileMenu.hidden;
  mobileMenu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
$$('a', mobileMenu).forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
