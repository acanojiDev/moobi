import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Bear, bearSVG, MOOBI_PURPLE } from './bear.js';
import { LETTER_M, LETTER_B, LETTER_I, CAFE } from './logo-paths.js';
import { initFutbolin } from './futbolin.js';
import { cocteles, eur } from './menu.js';

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
  '¿Una copa?',
  'El futbolín está libre',
  'DJ Lope, este finde',
  '¿Un Fuego Valyrio?',
  '¿Nos vemos en la terraza?',
  'También hay batidos',
];
let phrase = 0;
const nextPhrase = () => PHRASES[phrase++ % PHRASES.length];

// letras del logo calcadas del original (misma tipografía)
const glyph = (viewBox, ...paths) => `<svg viewBox="${viewBox}">${paths.map((d) => `<path d="${d}" fill="${MOOBI_PURPLE}" />`).join('')}</svg>`;
$('.logo__m').innerHTML = glyph('56 186 193 159', LETTER_M);
$('.logo__bi').innerHTML = glyph('526 181 190 181', LETTER_B, LETTER_I);
$('.logo__cafe').innerHTML = glyph('518 360 133 57', CAFE);

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
let inCopas = false;
const syncBuddy = () => showBuddy(pastHero && !inMenu && !inCopas);
ScrollTrigger.create({
  trigger: '.hero', start: 'bottom 60%', endTrigger: '.footer', end: 'top bottom',
  onToggle: (s) => { pastHero = s.isActive; syncBuddy(); },
});
ScrollTrigger.create({
  trigger: '#carta', start: 'top 70%', end: 'bottom 70%',
  onToggle: (s) => { inMenu = s.isActive; syncBuddy(); },
});
buddyBtn.addEventListener('click', () => { buddy.jump(); buddy.say(nextPhrase()); });

ScrollTrigger.create({
  trigger: '#copas', start: 'top 70%', end: 'bottom 45%',
  onToggle: (s) => { inCopas = s.isActive; syncBuddy(); },
});
ScrollTrigger.create({
  trigger: '#copas', start: 'top 60%', end: 'bottom 40%',
  onToggle: (s) => buddy.setAwake(s.isActive),
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

/* ---------- Cuenta atrás del aniversario ---------- */
const START = new Date('2026-11-20T00:00:00+01:00');
const END = new Date('2026-11-22T06:00:00+01:00');
const countLive = $('[data-count-live]');
const countGrid = $('[data-count-grid]');
const countNow = $('[data-count-now]');
const pad = (n) => String(n).padStart(2, '0');
let lastSpoken = '';
function tickCount() {
  const now = new Date();
  let spoken;
  if (now >= END) {
    countGrid.hidden = true;
    countNow.hidden = false;
    countNow.textContent = 'El 9º aniversario fue el 20 y 21 de noviembre.';
    spoken = countNow.textContent;
  } else if (now >= START) {
    countGrid.hidden = true;
    countNow.hidden = false;
    const day = now.getDate() <= 20 ? 20 : 21;
    countNow.textContent = `Hoy, ${day} de noviembre.`;
    spoken = countNow.textContent;
  } else {
    countGrid.hidden = false;
    countNow.hidden = true;
    const diff = START - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    $('[data-d]').textContent = pad(days);
    $('[data-h]').textContent = pad(hours);
    $('[data-m]').textContent = pad(mins);
    $('[data-s]').textContent = pad(secs);
    spoken = `Faltan ${days} días, ${hours} horas y ${mins} minutos para el 20 de noviembre.`;
  }
  if (spoken !== lastSpoken) {
    lastSpoken = spoken;
    countLive.textContent = spoken;
  }
}
tickCount();
setInterval(tickCount, 1000);

/* ---------- Cócteles destacados (la carta completa está en carta.html) ---------- */
const destacados = ['matcha', 'fuego-valyrio', 'pandora', 'mordisco-marino'];
$('[data-teaser]').innerHTML = cocteles
  .flatMap((g) => g.items.map((c) => ({ ...c, price: g.price, tipo: g.name })))
  .filter((c) => destacados.includes(c.img))
  .map((c) => `
    <li class="teaser__item">
      <a href="carta.html#coctel-${c.img}">
        <img src="img/cocteles/${c.img}.jpg" width="800" height="800" alt="Cóctel ${c.name}" loading="lazy" />
        <span class="teaser__name">${c.name}</span>
        <span class="teaser__meta">${c.tipo} · ${eur(c.price)}</span>
      </a>
    </li>`)
  .join('');

/* ---------- Fotos con un parallax suave ---------- */
if (!reduced) {
  $$('.copas__photo img, .visit__img img').forEach((img) => {
    gsap.fromTo(img, { scale: 1.12, yPercent: -4 }, {
      scale: 1.12, yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

window.addEventListener('load', () => ScrollTrigger.refresh());

/* ---------- Mini futbolín contra Moobi ---------- */
initFutbolin($('.futbolin__game'), {
  reduced,
  onGoal: (who, score) => {
    if (!buddyShown) return;
    if (who === 'you') {
      buddy.setAwake(true);
      buddy.say(score.you >= 3 ? '¡Me has ganado!' : '¡Ese no lo vi!');
      gsap.delayedCall(1.6, () => buddy.setAwake(false));
    } else {
      buddy.jump();
      buddy.say(score.moobi >= 3 ? '¡Campeón Moobi!' : '¡Golazo de Moobi!');
    }
  },
});
