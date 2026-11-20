// Mini futbolín: tú (amarillos, abajo) contra Moobi (morados, arriba). Gana el primero que meta 3.
// Se mueve con el ratón, el dedo o las flechas. Solo pinta mientras se juega y está a la vista.

const W = 300;
const H = 440;
const GOAL = 116;
const BALL_R = 8;
const MAN_W = 30;
const MAN_H = 15;
const WIN = 3;

const RODS = [
  { team: 'moobi', y: 50, offs: [0], speed: 190, range: 70 },
  { team: 'you', y: 150, offs: [-88, 0, 88] },
  { team: 'moobi', y: 290, offs: [-88, 0, 88], speed: 165 },
  { team: 'you', y: 392, offs: [0], range: 70 },
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function initFutbolin(root, { onGoal, reduced = false } = {}) {
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const overlay = root.querySelector('.futbolin__overlay');
  const msg = root.querySelector('.futbolin__msg');
  const serveBtn = root.querySelector('[data-serve]');
  const youEl = root.querySelector('[data-you]');
  const moobiEl = root.querySelector('[data-moobi]');

  const rods = RODS.map((r) => {
    const minOff = Math.min(...r.offs); const maxOff = Math.max(...r.offs);
    const lo = r.range ? W / 2 - r.range : MAN_W / 2 + 4 - minOff;
    const hi = r.range ? W / 2 + r.range : W - MAN_W / 2 - 4 - maxOff;
    return { ...r, x: W / 2, vx: 0, lo, hi, kick: 0 };
  });
  const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0 };
  const score = { you: 0, moobi: 0 };
  let state = 'idle'; // idle | play | goal | end
  let target = W / 2;
  let keys = 0;
  let raf = 0;
  let last = 0;
  let visible = false;
  let flash = { text: '', t: 0 };
  let time = 0;

  /* ---------- tamaño ---------- */
  let scale = 1;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    scale = w / W;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(w * (H / W) * dpr);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    draw();
  };
  new ResizeObserver(resize).observe(canvas);

  /* ---------- control ---------- */
  const fieldX = (clientX) => {
    const r = canvas.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * W;
  };
  canvas.addEventListener('pointermove', (e) => { target = fieldX(e.clientX); });
  canvas.addEventListener('pointerdown', (e) => {
    target = fieldX(e.clientX);
    if (state === 'idle' || state === 'end') start();
  });
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { keys = -1; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys = 1; e.preventDefault(); }
    if ((e.key === ' ' || e.key === 'Enter') && state !== 'play') { e.preventDefault(); start(); }
  });
  canvas.addEventListener('keyup', (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') keys = 0; });
  serveBtn.addEventListener('click', () => { start(); canvas.focus({ preventScroll: true }); });

  /* ---------- partido ---------- */
  function serve(towards = Math.random() < 0.5 ? -1 : 1) {
    ball.x = W / 2; ball.y = H / 2;
    const a = (Math.random() - 0.5) * 1.2;
    ball.vx = Math.sin(a) * 150;
    ball.vy = towards * 150;
  }
  function start() {
    if (state === 'end' || state === 'idle') { score.you = 0; score.moobi = 0; paint(); }
    state = 'play';
    overlay.hidden = true;
    serve();
    loop();
  }
  function paint() {
    youEl.textContent = score.you;
    moobiEl.textContent = score.moobi;
  }
  function goal(who) {
    score[who]++;
    paint();
    state = 'goal';
    flash = { text: who === 'you' ? '¡GOOOL!' : 'GOL DE MOOBI', t: 0, who };
    onGoal?.(who, { ...score });
    setTimeout(() => {
      if (score[who] >= WIN) {
        state = 'end';
        msg.textContent = who === 'you'
          ? `¡Ganaste ${score.you}–${score.moobi}! Ahora ven a por la revancha de verdad.`
          : `Moobi gana ${score.moobi}–${score.you}. La revancha, en el local.`;
        serveBtn.textContent = 'Revancha';
        overlay.hidden = false;
        draw();
        return;
      }
      state = 'play';
      serve(who === 'you' ? 1 : -1); // saca hacia el que ha encajado
    }, 1100);
  }

  /* ---------- física ---------- */
  function step(dt) {
    time += dt;
    // tus barras siguen al puntero (o a las flechas)
    if (keys) target = clamp(target + keys * 280 * dt, 0, W);
    rods.forEach((r) => {
      const prev = r.x;
      if (r.team === 'you') {
        const tx = clamp(target, r.lo, r.hi);
        r.x += clamp(tx - r.x, -900 * dt, 900 * dt);
      } else {
        // Moobi busca la bola con el muñeco más cercano, con algo de despiste
        const coming = ball.vy < 0 || ball.y < r.y + 40;
        let best = r.offs[0];
        r.offs.forEach((o) => { if (Math.abs(ball.x - (r.x + o)) < Math.abs(ball.x - (r.x + best))) best = o; });
        const aim = coming ? ball.x - best + Math.sin(time * 1.7 + r.y) * 10 : W / 2;
        const tx = clamp(aim, r.lo, r.hi);
        r.x += clamp(tx - r.x, -r.speed * dt, r.speed * dt);
      }
      r.vx = (r.x - prev) / Math.max(dt, 1e-4);
      r.kick = Math.max(0, r.kick - dt * 5);
    });

    if (state !== 'play') return;

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    // rozamiento suave, pero la bola nunca se queda muerta
    const sp = Math.hypot(ball.vx, ball.vy);
    const k = Math.exp(-0.35 * dt);
    let nv = clamp(sp * k, 70, 560);
    if (sp > 0) { ball.vx *= nv / sp; ball.vy *= nv / sp; }

    // bandas
    if (ball.x < BALL_R) { ball.x = BALL_R; ball.vx = Math.abs(ball.vx); }
    if (ball.x > W - BALL_R) { ball.x = W - BALL_R; ball.vx = -Math.abs(ball.vx); }
    const inMouth = Math.abs(ball.x - W / 2) < GOAL / 2 - BALL_R / 2;
    if (ball.y < BALL_R) {
      if (inMouth && ball.y < -BALL_R) return goal('you');
      if (!inMouth) { ball.y = BALL_R; ball.vy = Math.abs(ball.vy); }
    }
    if (ball.y > H - BALL_R) {
      if (inMouth && ball.y > H + BALL_R) return goal('moobi');
      if (!inMouth) { ball.y = H - BALL_R; ball.vy = -Math.abs(ball.vy); }
    }

    // muñecos: cualquier toque es un chut hacia la portería contraria
    rods.forEach((r) => {
      if (Math.abs(ball.y - r.y) > MAN_H / 2 + BALL_R) return;
      r.offs.forEach((o) => {
        const mx = r.x + o;
        const nx = clamp(ball.x, mx - MAN_W / 2, mx + MAN_W / 2);
        const ny = clamp(ball.y, r.y - MAN_H / 2, r.y + MAN_H / 2);
        if ((ball.x - nx) ** 2 + (ball.y - ny) ** 2 > BALL_R ** 2) return;
        const dir = r.team === 'you' ? -1 : 1;
        const power = r.team === 'you' ? 380 : 300;
        ball.vy = dir * Math.max(Math.abs(ball.vy) * 0.6, power);
        ball.vx = clamp(ball.vx * 0.4 + (ball.x - mx) * 9 + r.vx * 0.35, -420, 420);
        ball.y = r.y + dir * (MAN_H / 2 + BALL_R + 1);
        r.kick = 1;
      });
    });
  }

  /* ---------- dibujo ---------- */
  function man(x, y, team, kick) {
    const lean = kick * 5 * (team === 'you' ? -1 : 1);
    ctx.save();
    ctx.translate(x, y + lean);
    // cuerpo (visto desde arriba)
    ctx.fillStyle = team === 'you' ? '#F5D33B' : '#A6268A';
    ctx.strokeStyle = 'rgba(0,0,0,.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.roundRect(-MAN_W / 2, -MAN_H / 2, MAN_W, MAN_H, 5); ctx.fill(); ctx.stroke();
    // cabeza: los de Moobi llevan orejas de oso
    ctx.fillStyle = team === 'you' ? '#E8B98F' : '#A6268A';
    if (team === 'moobi') {
      ctx.beginPath(); ctx.arc(-6, -4, 3.6, 0, Math.PI * 2); ctx.arc(6, -4, 3.6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (team === 'moobi') {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(-2.6, 0.6, 2, 0, Math.PI * 2); ctx.arc(2.6, 0.6, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // césped a franjas
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? '#178C4B' : '#1A9853';
      ctx.fillRect(0, (H / 8) * i, W, H / 8 + 1);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.75)';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, W - 12, H - 12);
    ctx.beginPath(); ctx.moveTo(6, H / 2); ctx.lineTo(W - 6, H / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 36, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeRect(W / 2 - 70, 6, 140, 54);
    ctx.strokeRect(W / 2 - 70, H - 60, 140, 54);
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 3, 0, Math.PI * 2); ctx.fill();
    // porterías
    ctx.fillStyle = '#0E0A0F';
    ctx.fillRect(W / 2 - GOAL / 2, 0, GOAL, 6);
    ctx.fillRect(W / 2 - GOAL / 2, H - 6, GOAL, 6);

    // barras y muñecos
    rods.forEach((r) => {
      const g = ctx.createLinearGradient(0, r.y - 2, 0, r.y + 2);
      g.addColorStop(0, '#f2f2f2'); g.addColorStop(1, '#8a8a8a');
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      ctx.fillRect(0, r.y + 2, W, 3);
      ctx.fillStyle = g;
      ctx.fillRect(0, r.y - 1.5, W, 3);
      r.offs.forEach((o) => man(r.x + o, r.y, r.team, r.kick));
    });

    // bola
    if (state === 'play' || state === 'goal') {
      ctx.fillStyle = 'rgba(0,0,0,.3)';
      ctx.beginPath(); ctx.ellipse(ball.x + 2, ball.y + 3, BALL_R, BALL_R * 0.8, 0, 0, Math.PI * 2); ctx.fill();
      const bg = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, BALL_R);
      bg.addColorStop(0, '#fff'); bg.addColorStop(1, '#d9d4cf');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2); ctx.fill();
    }

    // cartel de gol
    if (state === 'goal' && flash.text) {
      const a = Math.min(1, flash.t * 4);
      const s = reduced ? 1 : 0.6 + Math.min(1, flash.t * 3) * 0.4;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(W / 2, H / 2);
      ctx.scale(s, s);
      ctx.fillStyle = flash.who === 'you' ? '#F5D33B' : '#F27BCB';
      ctx.strokeStyle = '#0E0A0F';
      ctx.lineWidth = 6;
      ctx.font = '800 38px "Ysabeau Office Variable", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(flash.text, 0, 0);
      ctx.fillText(flash.text, 0, 0);
      ctx.restore();
    }
  }

  function frame(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0;
    last = now;
    if (state === 'goal') flash.t += dt;
    step(dt);
    draw();
    if ((state === 'play' || state === 'goal') && visible) raf = requestAnimationFrame(frame);
    else { raf = 0; last = 0; }
  }
  function loop() { if (!raf && visible) raf = requestAnimationFrame(frame); }

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) loop();
  }).observe(canvas);

  paint();
  resize();
}
