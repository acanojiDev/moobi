# Moobi Café (Estación de Cártama, Málaga)

La guía general de webs de presentación se carga desde `~/.claude/CLAUDE.md`. Aquí solo va lo específico de este cliente.

Hay otro Moobi en Alhaurín de la Torre (Mirador de Bellavista, 952 42 61 70, `@moobicafe`). Esta web es la de Estación de Cártama. No mezclar direcciones ni teléfonos.

## Negocio

- Bar de tarde y de noche: cafés, batidos, cervezas y copas. Terraza, dos futbolines, DJ Lope como residente. Ellos lo venden como el tardeo de Cártama estación.
- Avda. Manuel de Falla, 54, local 7, Estación de Cártama (29580). En sus posts de octubre de 2026 la misma puerta sale como Av. de Andalucía, 54, local 7: confirmar cuál es el nombre vigente.
- Teléfono 952 42 17 70. En Fedelhorce aparece también el móvil 663 058 469, sin confirmar. Instagram que citan los directorios: `@angelmoobi`. Facebook: `moobi.cartama`.
- Horario más repetido: de 15:00 a 3:00, viernes y sábado hasta las 4:00. Cylex (julio 2026) y Restaurant Guru cierran a las 2:00 de domingo a jueves. Confirmar.
- Carta y precios en `src/menu.js`, copiados de QRCarta id 6364 (la ficha de Alhaurín); revisados el 20/11/2026 y coinciden. Confirmar si Cártama usa la misma. Lo que no trae precio sale como "Consultar".
- La carta completa tiene su propia página, `carta.html` (`src/carta.js`). La portada solo enseña cuatro cócteles y enlaza a ella.
- Cócteles "Clásicos de película" (de la carta impresa del local): 6 con alcohol a 7,50 € y 3 sin alcohol a 6 €. El nombre del sin alcohol de Terminator no se lee en la foto de la carta; de momento sale como "Hasta la vista": confirmar.

## Identidad

- Logo: oso morado con ojos de sueño que hace de "OO" en "MOOBI". La silueta, las cuencas de los ojos, la sonrisa y las letras M, B, I y CAFÉ están calcadas del logo original (`fotos-originales/logo.png`) en `src/logo-paths.js`; no se redibujan a mano. `src/bear.js` le pone encima ojos, pupilas, párpados y rubor: respira, parpadea, se menea, sigue el cursor, se despierta al pasar el ratón y salta al tocarlo.
- Paleta: noche `#0E0A0F`, morado Moobi `#A6268A`, rosa `#F27BCB`, rosa claro `#FBEAF4`, rojo del cartel `#C8001E`. Tipografía: Ysabeau Office para titulares (la más parecida a la letra del logo) y Figtree para texto.

## Fotos

- Las de `public/img/` (terraza, futbolín, copa, aniversario) son del local de Cártama. Los originales están en `fotos-originales/`.
- Las generadas con IA (`fotos-originales/ia-*.png`) no son del local y no se publican.
- Excepción: las fotos de los cócteles (`public/img/cocteles/`) las pasó el cliente para la carta y sí se publican.

## En la web, a confirmar con el cliente

- La tarjeta de fidelización por copas (10 copas, la siguiente gratis) se quitó el 20/11/2026 a petición del cliente, con Firebase y `sello.html`. No volver a ponerla.
- El 9º aniversario con DJ Lope es el 20 y 21 de noviembre de 2026, según el cartel. El cartel no dice la hora.

## Publicación

- Web: https://acanojidev.github.io/moobi/
- GitHub Actions está bloqueado por la facturación de la cuenta: se publica subiendo `dist/` más `.nojekyll` a la rama `gh-pages` (ver la guía global).
