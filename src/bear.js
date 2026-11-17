import { gsap } from 'gsap';

// Moobi redibujado en SVG a partir del logo: morado, ojos de sueño (las dos "O" de MOOBI)
// y sonrisa ladeada. Cada parte va por separado para poder animarla.

let uid = 0;

const MOUTH_SLEEPY = 'M104 230 C132 256 180 256 208 226';
const MOUTH_HAPPY = 'M100 222 C128 270 186 270 212 218';
const TICK_SLEEPY = 'M208 226 L215 218';
const TICK_HAPPY = 'M212 218 L218 209';

export function bearSVG({ label = 'Moobi, el oso de Moobi Café' } = {}) {
  const id = `b${++uid}`;
  return `
<svg class="bear" viewBox="0 0 300 330" role="img" aria-label="${label}">
  <defs>
    <radialGradient id="${id}-fur" cx="38%" cy="28%" r="80%">
      <stop offset="0" stop-color="#C846A8" />
      <stop offset=".55" stop-color="#A6268A" />
      <stop offset="1" stop-color="#7A1866" />
    </radialGradient>
    <clipPath id="${id}-eyeL"><circle cx="112" cy="152" r="31" /></clipPath>
    <clipPath id="${id}-eyeR"><circle cx="194" cy="154" r="26" /></clipPath>
  </defs>
  <g class="bear__all">
    <ellipse class="bear__shadow" cx="150" cy="322" rx="92" ry="7" />
    <g class="bear__body">
      <g class="bear__ear bear__ear--l">
        <circle cx="74" cy="72" r="44" fill="url(#${id}-fur)" stroke="#5E1450" stroke-width="2.5" />
        <circle cx="74" cy="72" r="21" fill="#7A1866" opacity=".35" />
      </g>
      <g class="bear__ear bear__ear--r">
        <circle cx="226" cy="72" r="44" fill="url(#${id}-fur)" stroke="#5E1450" stroke-width="2.5" />
        <circle cx="226" cy="72" r="21" fill="#7A1866" opacity=".35" />
      </g>
      <path class="bear__shape" fill="url(#${id}-fur)" stroke="#5E1450" stroke-width="2.5" stroke-linejoin="round"
        d="M150 86 C215 86 262 118 262 172 C262 212 242 232 230 244 C237 264 237 292 231 309 Q228 318 217 318 L170 318 Q161 318 161 308 L161 292 Q150 283 139 292 L139 308 Q139 318 130 318 L83 318 Q72 318 69 309 C63 292 63 264 70 244 C58 232 38 212 38 172 C38 118 85 86 150 86 Z" />
      <g class="bear__face">
        <g class="bear__eye bear__eye--l">
          <circle cx="112" cy="152" r="45" fill="#262226" />
          <g clip-path="url(#${id}-eyeL)">
            <circle cx="112" cy="152" r="31" fill="#fff" />
            <circle class="bear__pupil" cx="112" cy="150" r="19" fill="#141114" />
            <circle class="bear__shine" cx="104" cy="143" r="4.5" fill="#fff" opacity=".9" />
            <ellipse class="bear__lid" cx="112" cy="110" rx="40" ry="42" fill="#262226" />
          </g>
        </g>
        <g class="bear__eye bear__eye--r">
          <circle cx="194" cy="154" r="39" fill="#262226" />
          <g clip-path="url(#${id}-eyeR)">
            <circle cx="194" cy="154" r="26" fill="#fff" />
            <circle class="bear__pupil" cx="194" cy="152" r="16" fill="#141114" />
            <circle class="bear__shine" cx="187" cy="146" r="4" fill="#fff" opacity=".9" />
            <ellipse class="bear__lid" cx="194" cy="118" rx="34" ry="36" fill="#262226" />
          </g>
        </g>
        <ellipse class="bear__blush bear__blush--l" cx="82" cy="214" rx="15" ry="8" fill="#F27BCB" opacity="0" />
        <ellipse class="bear__blush bear__blush--r" cx="226" cy="210" rx="13" ry="7" fill="#F27BCB" opacity="0" />
        <path class="bear__mouth" d="${MOUTH_SLEEPY}" fill="none" stroke="#262226" stroke-width="6" stroke-linecap="round" />
        <path class="bear__tick" d="${TICK_SLEEPY}" fill="none" stroke="#262226" stroke-width="6" stroke-linecap="round" />
      </g>
    </g>
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
    this.all = q('.bear__all');
    this.body = q('.bear__body');
    this.earL = q('.bear__ear--l');
    this.earR = q('.bear__ear--r');
    this.lids = qa('.bear__lid');
    this.pupils = qa('.bear__pupil');
    this.shines = qa('.bear__shine');
    this.eyes = qa('.bear__eye');
    this.mouth = q('.bear__mouth');
    this.tick = q('.bear__tick');
    this.blush = qa('.bear__blush');
    this.shadow = q('.bear__shadow');

    gsap.set(this.body, { transformOrigin: '50% 100%' });
    gsap.set(this.earL, { transformOrigin: '80% 90%' });
    gsap.set(this.earR, { transformOrigin: '20% 90%' });

    // movimiento de pupilas con inercia
    this.pupilTo = this.pupils.map((p) => ({
      x: gsap.quickTo(p, 'x', { duration: 0.35, ease: 'power3' }),
      y: gsap.quickTo(p, 'y', { duration: 0.35, ease: 'power3' }),
    }));
    this.shineTo = this.shines.map((p) => ({
      x: gsap.quickTo(p, 'x', { duration: 0.35, ease: 'power3' }),
      y: gsap.quickTo(p, 'y', { duration: 0.35, ease: 'power3' }),
    }));

    if (!reduced) this.idle();
  }

  idle() {
    // respiración y balanceo suaves
    gsap.set(this.all, { rotation: -1.6, svgOrigin: '150 320' });
    this.sway = gsap.to(this.all, { rotation: 1.6, svgOrigin: '150 320', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    this.breath = gsap.to(this.body, { scaleY: 1.018, scaleX: 0.992, duration: 1.7, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    this.scheduleBlink();
    this.scheduleEars();
  }

  scheduleBlink() {
    this.blinkCall = gsap.delayedCall(rand(2.2, 5.5), () => {
      this.blink(Math.random() < 0.2);
      this.scheduleBlink();
    });
  }

  scheduleEars() {
    this.earCall = gsap.delayedCall(rand(3, 7), () => {
      this.wiggleEars();
      this.scheduleEars();
    });
  }

  blink(double = false) {
    const open = this.awake ? -30 : 0;
    const tl = gsap.timeline();
    const once = () => tl.to(this.lids, { y: 40, duration: 0.07, ease: 'power2.in' }).to(this.lids, { y: open, duration: 0.14, ease: 'power2.out' });
    once();
    if (double) { tl.to({}, { duration: 0.08 }); once(); }
    return tl;
  }

  wiggleEars() {
    const side = Math.random() < 0.5 ? this.earL : this.earR;
    const dir = side === this.earL ? -1 : 1;
    gsap.timeline()
      .to(side, { rotation: 14 * dir, duration: 0.09, ease: 'power2.out' })
      .to(side, { rotation: -6 * dir, duration: 0.1 })
      .to(side, { rotation: 0, duration: 0.5, ease: 'elastic.out(1, .4)' });
  }

  /** Mira hacia un punto de la pantalla (px de cliente). */
  look(cx, cy) {
    this.eyes.forEach((eye, i) => {
      const r = eye.getBoundingClientRect();
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      const dx = cx - ex;
      const dy = cy - ey;
      const d = Math.hypot(dx, dy) || 1;
      const max = i === 0 ? 10 : 8.5;
      const k = Math.min(1, d / 220);
      this.pupilTo[i].x((dx / d) * max * k);
      this.pupilTo[i].y((dy / d) * max * k);
      this.shineTo[i].x((dx / d) * max * k * 0.6);
      this.shineTo[i].y((dy / d) * max * k * 0.6);
    });
  }

  lookCenter() {
    this.pupilTo.forEach((p) => { p.x(0); p.y(0); });
    this.shineTo.forEach((p) => { p.x(0); p.y(0); });
  }

  /** Despierto: ojos abiertos, sonrisa grande y rubor. Dormido: la cara del logo. */
  setAwake(on) {
    if (this.awake === on) return;
    this.awake = on;
    const d = this.reduced ? 0 : 0.45;
    gsap.to(this.lids, { y: on ? -30 : 0, duration: d, ease: on ? 'back.out(2)' : 'power2.inOut' });
    gsap.to(this.mouth, { attr: { d: on ? MOUTH_HAPPY : MOUTH_SLEEPY }, duration: d, ease: 'power2.out' });
    gsap.to(this.tick, { attr: { d: on ? TICK_HAPPY : TICK_SLEEPY }, duration: d, ease: 'power2.out' });
    gsap.to(this.blush, { opacity: on ? 0.75 : 0, duration: d });
  }

  /** Salto con aplastamiento y estiramiento. */
  jump() {
    if (this.reduced) return;
    if (this.jumping) return;
    this.jumping = true;
    this.breath?.pause();
    gsap.timeline({ onComplete: () => { this.jumping = false; this.breath?.restart(); } })
      .to(this.body, { scaleY: 0.82, scaleX: 1.12, duration: 0.12, ease: 'power2.in' })
      .to(this.body, { y: -70, scaleY: 1.1, scaleX: 0.93, duration: 0.28, ease: 'power2.out' })
      .to(this.shadow, { scaleX: 0.6, opacity: 0.4, svgOrigin: '150 322', duration: 0.28, ease: 'power2.out' }, '<')
      .to([this.earL, this.earR], { rotation: (i) => (i ? 18 : -18), duration: 0.2 }, '<')
      .to(this.body, { y: 0, scaleY: 1, scaleX: 1, duration: 0.26, ease: 'power2.in' })
      .to(this.shadow, { scaleX: 1, opacity: 1, duration: 0.26, ease: 'power2.in' }, '<')
      .to(this.body, { scaleY: 0.9, scaleX: 1.07, duration: 0.08, ease: 'power1.out' })
      .to(this.body, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, .35)' })
      .to([this.earL, this.earR], { rotation: 0, duration: 0.6, ease: 'elastic.out(1, .35)' }, '<');
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
      .fromTo(this.body, { y: -260, scaleY: 1.15, scaleX: 0.9 }, { y: 0, scaleY: 1, scaleX: 1, duration: 0.55, ease: 'power3.in' })
      .fromTo(this.shadow, { scaleX: 0.3, opacity: 0, svgOrigin: '150 322' }, { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power3.in' }, '<')
      .to(this.body, { scaleY: 0.84, scaleX: 1.12, duration: 0.1, ease: 'power2.out' })
      .to(this.body, { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, .32)' })
      .add(() => this.wiggleEars(), '-=0.6');
  }
}
