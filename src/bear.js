import { gsap } from 'gsap';
import { BEAR, SOCKETS, MOUTH } from './logo-paths.js';

// Moobi calcado del logo original: la silueta, las cuencas de los ojos y la sonrisa son
// trazos del PNG (src/logo-paths.js). Por encima van, como piezas sueltas para animarlas,
// el blanco de los ojos, las pupilas, los párpados y el rubor.

export const MOOBI_PURPLE = '#973079';
const INK = '#2B2B2B';

// Geometría medida sobre el logo (coordenadas del PNG)
const EYES = [
  { cx: 341.5, cy: 239.5, r: 48.5, lid: 237, px: 339.5, py: 247, pr: 28, sx: 329, sy: 246, sr: 5 },
  { cx: 436, cy: 246, r: 38, lid: 244, px: 434.5, py: 248.5, pr: 23.5, sx: 426, sy: 248, sr: 4 },
];
const GROUND = '380 439';
const MOUTH_ORIGIN = '384 330';

let uid = 0;

export function bearSVG({ label = 'Moobi, el oso de Moobi Café' } = {}) {
  const id = `b${++uid}`;
  const eyes = EYES.map((e, i) => `
      <g class="bear__eye">
        <clipPath id="${id}-e${i}"><circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" /></clipPath>
        <g clip-path="url(#${id}-e${i})">
          <circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" fill="#fff" />
          <circle class="bear__pupil" cx="${e.px}" cy="${e.py}" r="${e.pr}" fill="${INK}" />
          <circle class="bear__shine" cx="${e.sx}" cy="${e.sy}" r="${e.sr}" fill="#fff" opacity=".85" />
          <rect class="bear__lid" x="${e.cx - e.r - 2}" y="${e.lid - 140}" width="${e.r * 2 + 4}" height="140" fill="${INK}" />
        </g>
        <circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" fill="none" stroke="${INK}" stroke-width="2.5" />
      </g>`).join('');
  return `
<svg class="bear" viewBox="230 116 300 330" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>
  <ellipse class="bear__shadow" cx="380" cy="440" rx="120" ry="7" />
  <g class="bear__body">
    <path class="bear__shape" d="${BEAR}" fill="${MOOBI_PURPLE}" />
    <path d="${SOCKETS}" fill="${INK}" />
    ${eyes}
    <ellipse class="bear__blush" cx="297" cy="318" rx="17" ry="8" fill="#F27BCB" opacity="0" />
    <ellipse class="bear__blush" cx="470" cy="311" rx="15" ry="7" fill="#F27BCB" opacity="0" />
    <path class="bear__mouth" d="${MOUTH}" fill="${INK}" />
  </g>
</svg>`;
}

const rand = (a, b) => a + Math.random() * (b - a);

export class Bear {
  /**
   * @param {HTMLElement} host  contenedor donde se pinta el oso
   * @param {{ reduced?: boolean, bubble?: HTMLElement|null }} opts
   */
  constructor(host, { reduced = false, bubble = null } = {}) {
    host.insertAdjacentHTML('beforeend', bearSVG());
    this.host = host;
    this.svg = host.querySelector('svg.bear');
    this.reduced = reduced;
    this.bubble = bubble;
    this.awake = false;

    const q = (s) => this.svg.querySelector(s);
    const qa = (s) => [...this.svg.querySelectorAll(s)];
    this.body = q('.bear__body');
    this.shadow = q('.bear__shadow');
    this.eyes = qa('.bear__eye');
    this.lids = qa('.bear__lid');
    this.pupils = qa('.bear__pupil');
    this.shines = qa('.bear__shine');
    this.mouth = q('.bear__mouth');
    this.blush = qa('.bear__blush');

    gsap.set(this.body, { svgOrigin: GROUND });
    gsap.set(this.shadow, { svgOrigin: '380 440' });
    gsap.set(this.mouth, { svgOrigin: MOUTH_ORIGIN });

    // pupilas con inercia (el brillo se mueve menos y da volumen)
    const qt = (el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' }),
    });
    this.pupilTo = this.pupils.map(qt);
    this.shineTo = this.shines.map(qt);

    if (!reduced) this.idle();
  }

  idle() {
    // respiración y balanceo suaves, apoyado en los pies
    gsap.set(this.body, { rotation: -1.4 });
    this.sway = gsap.to(this.body, { rotation: 1.4, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    this.breath = gsap.to(this.body, { scaleY: 1.02, scaleX: 0.99, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    this.scheduleBlink();
    this.scheduleWiggle();
  }

  scheduleBlink() {
    this.blinkCall = gsap.delayedCall(rand(2.2, 5.5), () => {
      this.blink(Math.random() < 0.2);
      this.scheduleBlink();
    });
  }

  scheduleWiggle() {
    this.wiggleCall = gsap.delayedCall(rand(4, 8), () => {
      this.wiggleEars();
      this.scheduleWiggle();
    });
  }

  lidOpen(i) {
    const e = EYES[i];
    return this.awake ? -(e.lid - (e.cy - e.r)) - 6 : 0;
  }

  blink(double = false) {
    const tl = gsap.timeline();
    const once = () => tl
      .to(this.lids, { y: (i) => EYES[i].cy + EYES[i].r - EYES[i].lid + 4, duration: 0.07, ease: 'power2.in' })
      .to(this.lids, { y: (i) => this.lidOpen(i), duration: 0.14, ease: 'power2.out' });
    once();
    if (double) { tl.to({}, { duration: 0.08 }); once(); }
    return tl;
  }

  /** Meneíto: un "boing" con el cuerpo entero (en el logo las orejas van pegadas a la cabeza). */
  wiggleEars() {
    if (this.jumping) return;
    const dir = Math.random() < 0.5 ? -1 : 1;
    gsap.timeline()
      .to(this.body, { skewX: 5 * dir, duration: 0.12, ease: 'power2.out' })
      .to(this.body, { skewX: -3 * dir, duration: 0.12 })
      .to(this.body, { skewX: 0, duration: 0.6, ease: 'elastic.out(1, .35)' });
  }

  /** Mira hacia un punto de la pantalla (px de cliente). */
  look(cx, cy) {
    this.eyes.forEach((eye, i) => {
      const r = eye.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 240);
      const max = EYES[i].r - EYES[i].pr - 2;
      // hacia arriba se mueven menos: el párpado tapa esa zona
      const ux = (dx / d) * max * k;
      const uy = (dy / d) * max * k * (dy < 0 ? 0.55 : 1);
      this.pupilTo[i].x(ux);
      this.pupilTo[i].y(uy);
      this.shineTo[i].x(ux * 0.7);
      this.shineTo[i].y(uy * 0.7);
    });
  }

  lookCenter() {
    this.pupilTo.forEach((p) => { p.x(0); p.y(0); });
    this.shineTo.forEach((p) => { p.x(0); p.y(0); });
  }

  /** Despierto: abre los ojos, sonríe más y se sonroja. Dormido: la cara del logo. */
  setAwake(on) {
    if (this.awake === on) return;
    this.awake = on;
    const d = this.reduced ? 0 : 0.45;
    gsap.to(this.lids, { y: (i) => this.lidOpen(i), duration: d, ease: on ? 'back.out(2)' : 'power2.inOut' });
    gsap.to(this.mouth, { scaleX: on ? 1.08 : 1, scaleY: on ? 1.45 : 1, duration: d, ease: on ? 'back.out(2.5)' : 'power2.out' });
    gsap.to(this.blush, { opacity: on ? 0.8 : 0, duration: d });
  }

  /** Salto con aplastamiento y estiramiento. */
  jump() {
    if (this.reduced || this.jumping) return;
    this.jumping = true;
    this.breath?.pause();
    gsap.timeline({ onComplete: () => { this.jumping = false; this.breath?.restart(); } })
      .to(this.body, { scaleY: 0.8, scaleX: 1.14, duration: 0.12, ease: 'power2.in' })
      .to(this.body, { y: -90, scaleY: 1.12, scaleX: 0.92, duration: 0.28, ease: 'power2.out' })
      .to(this.shadow, { scaleX: 0.55, opacity: 0.35, duration: 0.28, ease: 'power2.out' }, '<')
      .to(this.body, { y: 0, scaleY: 1, scaleX: 1, duration: 0.26, ease: 'power2.in' })
      .to(this.shadow, { scaleX: 1, opacity: 1, duration: 0.26, ease: 'power2.in' }, '<')
      .to(this.body, { scaleY: 0.88, scaleX: 1.08, duration: 0.08, ease: 'power1.out' })
      .to(this.body, { scaleY: 1, scaleX: 1, duration: 0.55, ease: 'elastic.out(1, .35)' });
  }

  say(text) {
    if (!this.bubble) return;
    const b = this.bubble;
    b.textContent = text;
    gsap.killTweensOf(b);
    gsap.timeline()
      .fromTo(b, { autoAlpha: 0, scale: 0.6, y: 10 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(2.2)' })
      .to(b, { autoAlpha: 0, y: -6, duration: 0.3, delay: 2.4 });
  }

  /** Entrada: cae desde arriba y rebota. */
  enter(delay = 0) {
    if (this.reduced) return gsap.timeline();
    this.breath?.pause();
    return gsap.timeline({ delay, onComplete: () => this.breath?.restart() })
      .fromTo(this.body, { y: -320, scaleY: 1.15, scaleX: 0.9 }, { y: 0, scaleY: 1, scaleX: 1, duration: 0.55, ease: 'power3.in' })
      .fromTo(this.shadow, { scaleX: 0.3, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power3.in' }, '<')
      .to(this.body, { scaleY: 0.82, scaleX: 1.14, duration: 0.1, ease: 'power2.out' })
      .to(this.body, { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, .32)' })
      .add(() => this.blink(), '-=0.4');
  }
}
