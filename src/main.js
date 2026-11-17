import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Bear, bearSVG } from './bear.js';
import { menu, menuNote, flavours, eur } from './menu.js';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Scroll suave ---------- */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = id.length > 1 && $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    else target.scrollIntoView();
  });
});

/* ---------- Moobi grande (hero) ---------- */
const PHRASES = [
  '¿Un café?',
  'Sin café no soy oso',
  'Hoy apetece un milkshake',
  '¿Nos vemos en la terraza?',
  'Pruébate el Moobi Amazonas',
  'De noche me despierto',
];
let phrase = 0;
const nextPhrase = () => PHRASES[phrase++ % PHRASES.length];

const heroBearBtn = $('.logo__bear');
const hero = new Bear(heroBearBtn, { reduced, bubble: $('.bubble', heroBearBtn) });

// entrada: cae el oso y aparecen las letras alrededor
if (!reduced) {
  gsap.timeline({ delay: 0.1 })
    .add(hero.enter())
    .fromTo('.logo__m', { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.45)
    .fromTo('.logo__bi', { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.5)
    .fromTo('.logo__sub', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.75)
    .fromTo('.hero__foot', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.85)
    .add(() => hero.say('¡Hola!'), 1.3);
}

// mirada: sigue al cursor por toda la página (o pasea sola en táctil)
if (finePointer && !reduced) {
  window.addEventListener('pointermove', (e) => {
    hero.look(e.clientX, e.clientY);
    buddy?.look(e.clientX, e.clientY);
  }, { passive: true });
} else if (!reduced) {
  const wander = () => {
    const x = innerWidth * (0.2 + Math.random() * 0.6);
    const y = innerHeight * (0.2 + Math.random() * 0.6);
    hero.look(x, y);
    buddy?.look(x, y);
    gsap.delayedCall(1.6 + Math.random() * 1.8, wander);
  };
  gsap.delayedCall(2, wander);
}

// al pasar por encima se despierta; al tocarlo salta y habla
heroBearBtn.addEventListener('pointerenter', () => hero.setAwake(true));
heroBearBtn.addEventListener('pointerleave', () => hero.setAwake(false));
heroBearBtn.addEventListener('click', () => {
  hero.setAwake(true);
  hero.jump();
  hero.say(nextPhrase());
  if (!finePointer) gsap.delayedCall(2.2, () => hero.setAwake(false));
});

// el logo se aleja al bajar
if (!reduced) {
  gsap.to('.logo', {
    yPercent: -12, scale: 0.92, autoAlpha: 0.4, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
}

/* ---------- Mini Moobi en la navegación ---------- */
$('.nav__mini').innerHTML = bearSVG({ label: '' });

/* ---------- Mini Moobi que acompaña ---------- */
const buddyBtn = $('.buddy');
const buddy = new Bear(buddyBtn, { reduced, bubble: $('.bubble', buddyBtn) });
let buddyShown = false;
const showBuddy = (on) => {
  if (buddyShown === on) return;
  buddyShown = on;
  gsap.to(buddyBtn, { y: on ? '18%' : '110%', duration: on ? 0.7 : 0.4, ease: on ? 'back.out(1.6)' : 'power2.in' });
  if (on) gsap.delayedCall(0.5, () => buddy.say(nextPhrase()));
};
gsap.set(buddyBtn, { y: '110%' });
// visible después del hero; se esconde en la carta para no tapar los precios
let pastHero = false;
let inMenu = false;
const syncBuddy = () => showBuddy(pastHero && !inMenu);
ScrollTrigger.create({
  trigger: '.hero', start: 'bottom 60%', endTrigger: '.footer', end: 'top bottom',
  onToggle: (s) => { pastHero = s.isActive; syncBuddy(); },
});
ScrollTrigger.create({
  trigger: '#carta', start: 'top 70%', end: 'bottom 70%',
  onToggle: (s) => { inMenu = s.isActive; syncBuddy(); },
});
buddyBtn.addEventListener('click', () => { buddy.jump(); buddy.say(nextPhrase()); });

// de día dormido, de noche despierto
ScrollTrigger.create({
  trigger: '#noche', start: 'top 60%', end: 'bottom 40%',
  onToggle: (s) => buddy.setAwake(s.isActive),
});
// con el café (o un milkshake) también abre un ojo
ScrollTrigger.create({
  trigger: '#batidos', start: 'top 50%', end: 'bottom 50%',
  onEnter: () => buddy.say('¡Batidooo!'),
});

/* ---------- Navegación ---------- */
const nav = $('[data-nav]');
let lastY = 0;
const heroEl = $('.hero');
function onScrollNav(y) {
  nav.classList.toggle('is-solid', y > heroEl.offsetHeight - 80);
  if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > 200);
  lastY = y;
}
if (lenis) lenis.on('scroll', ({ scroll }) => onScrollNav(scroll));
else window.addEventListener('scroll', () => onScrollNav(scrollY), { passive: true });

const toggle = $('.nav__toggle');
const mobileMenu = $('#menu-movil');
function closeMenu() {
  if (mobileMenu.hidden) return;
  mobileMenu.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  lenis && lenis.start();
}
toggle.addEventListener('click', () => {
  const open = mobileMenu.hidden;
  mobileMenu.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  if (open) {
    lenis && lenis.stop();
    if (!reduced) gsap.from($$('a', mobileMenu), { y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.45, ease: 'power3.out' });
  } else {
    lenis && lenis.start();
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Fabrica tu milkshake ---------- */
const flavourBox = $('.flavours');
const layers = $('.glass__layers');
const result = $('.maker__result strong');
const picked = [];
flavourBox.innerHTML = flavours
  .map(([name, color]) => `<button type="button" class="flavour" aria-pressed="false" data-name="${name}" style="--c:${color}"><i aria-hidden="true"></i>${name}</button>`)
  .join('');
const GLASS_TOP = 70;
const GLASS_BOTTOM = 290;
function drawGlass() {
  const n = picked.length;
  const h = (GLASS_BOTTOM - GLASS_TOP) / Math.max(n, 1);
  layers.innerHTML = picked
    .map((p, i) => `<rect x="0" y="${GLASS_BOTTOM - h * (i + 1)}" width="200" height="${h + 1}" fill="${p.color}" />`)
    .join('');
  if (!reduced) gsap.from($$('rect', layers), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.5, ease: 'power3.out', stagger: 0.05 });
  result.textContent = n ? picked.map((p) => p.name).join(' + ') : 'elige sabores';
  $$('.flavour', flavourBox).forEach((b) => {
    b.disabled = n >= 3 && b.getAttribute('aria-pressed') !== 'true';
  });
}
flavourBox.addEventListener('click', (e) => {
  const btn = e.target.closest('.flavour');
  if (!btn || btn.disabled) return;
  const name = btn.dataset.name;
  const i = picked.findIndex((p) => p.name === name);
  if (i >= 0) {
    picked.splice(i, 1);
    btn.setAttribute('aria-pressed', 'false');
  } else if (picked.length < 3) {
    picked.push({ name, color: btn.style.getPropertyValue('--c') });
    btn.setAttribute('aria-pressed', 'true');
    if (!reduced) gsap.fromTo('.glass__cherry', { y: -30 }, { y: 0, duration: 0.6, ease: 'bounce.out' });
  }
  drawGlass();
});
drawGlass();

/* ---------- La carta ---------- */
const tabs = $('.tabs');
const panels = $('.menu__panels');
tabs.innerHTML = menu
  .map((c, i) => `<button class="tab" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${c.name}</button>`)
  .join('');
panels.innerHTML = menu
  .map((c, i) => `
    <div class="panel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${i ? 'hidden' : ''}>
      ${c.groups.map((g) => `
        <div class="group">
          <h3>${g.name}</h3>
          <ul class="items">
            ${g.items.map(([n, d, p]) => `<li><span class="n">${n}</span>${d ? `<span class="d">${d}</span>` : ''}<span class="p${p == null ? ' is-ask' : ''}">${eur(p)}</span></li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>`)
  .join('');
$('.menu__note').textContent = menuNote;

const tabBtns = $$('.tab', tabs);
function selectTab(btn, focus = false) {
  tabBtns.forEach((t) => {
    const on = t === btn;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
  });
  if (focus) btn.focus();
  btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  if (!reduced) gsap.from(`#${btn.getAttribute('aria-controls')} .items li`, { autoAlpha: 0, y: 8, duration: 0.3, stagger: 0.012, ease: 'power2.out' });
  ScrollTrigger.refresh();
}
tabBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => selectTab(btn));
  btn.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabBtns[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabBtns.length) % tabBtns.length];
    selectTab(next, true);
  });
});

/* ---------- Fotos con un parallax suave ---------- */
if (!reduced) {
  $$('.day__img img, .night__img img, .visit__img img, .shakes__img img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.12, yPercent: -4 }, {
      scale: 1.12, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

window.addEventListener('load', () => ScrollTrigger.refresh());
