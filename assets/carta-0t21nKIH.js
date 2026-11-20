import{a as e,c as t,i as n,n as r,r as i,t as a}from"./menu-CgJ85-yM.js";var o=(e,t=document)=>t.querySelector(e),s=(e,t=document)=>[...t.querySelectorAll(e)];o(`.nav__mini`).innerHTML=t({label:``});var c=e=>`
  <li class="coctel" id="coctel-${e.img}">
    <figure class="coctel__img"><img src="img/cocteles/${e.img}.jpg" width="800" height="800" alt="Cóctel ${e.name}" loading="lazy" /></figure>
    <div class="coctel__body">
      <h4 class="coctel__name">${e.name}</h4>
      ${e.badge?`<p class="coctel__badge">${e.badge}</p>`:``}
      ${e.quote?`<blockquote class="coctel__quote"><p>«${e.quote}»</p><footer>${e.film}</footer></blockquote>`:``}
      ${e.notes?`<p class="coctel__notes">${e.notes}.</p>`:``}
    </div>
  </li>`;o(`[data-cocteles]`).innerHTML=a.map(e=>`
    <div class="cocteles__group">
      <h3>${e.name} <span class="cocteles__price">${r(e.price)}</span></h3>
      <ul class="cocteles__list">${e.items.map(c).join(``)}</ul>
    </div>`).join(``),o(`[data-carta]`).innerHTML=n.map(e=>`
    <section class="carta-sec" id="${e.id}" aria-labelledby="h-${e.id}">
      <h2 class="carta-sec__title" id="h-${e.id}">${e.name}</h2>
      <div class="panel">
        ${e.groups.map(t=>`
          <div class="group">
            ${e.groups.length>1||t.name!==e.name?`<h3>${t.name}</h3>`:``}
            <ul class="items">
              ${t.items.map(([e,t,n])=>`<li><span class="n">${e}</span>${t?`<span class="d">${t}</span>`:``}<span class="p${n==null?` is-ask`:``}">${r(n)}</span></li>`).join(``)}
            </ul>
          </div>`).join(``)}
        ${e.id===`batidos`?`
          <div class="mix">
            <h3>Fabrica tu milkshake</h3>
            <p class="mix__hint">Elige hasta 3 sabores. Sigue a 6 €.</p>
            <div class="flavours"></div>
            <p class="mix__result">Tu milkshake: <strong>elige sabores</strong></p>
          </div>`:``}
      </div>
    </section>`).join(``),o(`[data-note]`).textContent=e;var l=o(`.flavours`),u=o(`.mix__result strong`),d=[];l.innerHTML=i.map(([e])=>`<button type="button" class="flavour" aria-pressed="false" data-name="${e}">${e}</button>`).join(``);var f=()=>{let e=d.length;u.textContent=e?`${d.join(`, `)} · 6 €`:`elige sabores`,s(`.flavour`,l).forEach(t=>{t.disabled=e>=3&&t.getAttribute(`aria-pressed`)!==`true`})};l.addEventListener(`click`,e=>{let t=e.target.closest(`.flavour`);if(!t||t.disabled)return;let n=d.indexOf(t.dataset.name);n>=0?d.splice(n,1):d.length<3&&d.push(t.dataset.name),t.setAttribute(`aria-pressed`,String(n<0)),f()}),f();var p=[{id:`cocteles`,name:`Cócteles`},...n],m=o(`[data-catbar]`);m.innerHTML=p.map(e=>`<a class="tab" href="#${e.id}">${e.name}</a>`).join(``);var h=s(`a`,m),g=e=>{h.forEach(t=>{t.getAttribute(`href`)===`#${e}`?(t.setAttribute(`aria-current`,`true`),m.scrollTo({left:t.offsetLeft-16,behavior:`smooth`})):t.removeAttribute(`aria-current`)})},_=new IntersectionObserver(e=>{e.filter(e=>e.isIntersecting).forEach(e=>g(e.target.id))},{rootMargin:`-35% 0px -60% 0px`});p.forEach(e=>_.observe(document.getElementById(e.id)));var v=o(`[data-nav]`),y=0;window.addEventListener(`scroll`,()=>{let e=scrollY;document.body.classList.contains(`menu-open`)||v.classList.toggle(`is-hidden`,e>y&&e>200),document.body.classList.toggle(`nav-hidden`,v.classList.contains(`is-hidden`)),y=e},{passive:!0});var b=o(`.nav__toggle`),x=o(`#menu-movil`),S=()=>{x.hidden=!0,b.setAttribute(`aria-expanded`,`false`),document.body.classList.remove(`menu-open`)};b.addEventListener(`click`,()=>{let e=x.hidden;x.hidden=!e,b.setAttribute(`aria-expanded`,String(e)),document.body.classList.toggle(`menu-open`,e)}),s(`a`,x).forEach(e=>e.addEventListener(`click`,S)),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&S()});