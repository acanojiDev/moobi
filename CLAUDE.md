# Moobi Café (Alhaurín de la Torre, Málaga)

La guía general de webs de presentación se carga desde `~/.claude/CLAUDE.md`. Aquí solo va lo específico de este cliente.

## Negocio

- Bar-cafetería: cafés y tés de día, milkshakes, cervezas especiales y copas (whisky, ron, licores) de noche. Un blog lo describe como café y club donde se daban clases de salsa y bachata (sin confirmar si siguen).
- Calle Mirador de Bellavista, local 2, Alhaurín de la Torre. Teléfono 952 42 61 70. Instagram `@moobicafe`, Facebook `Moobicafe`.
- Servicios según QRCarta: terraza, cócteles, carta de vinos, pago con tarjeta, aparcamiento, accesible.
- Carta completa y precios reales en `src/menu.js` (fuente: QRCarta, id 6364). Erratas de marcas corregidas; los productos sin precio en la carta aparecen como "Consultar".

## Identidad

- Logo: oso morado con ojos de sueño que hace de "OO" en "MOOBI CAFÉ ALHAURÍN" (original en `fotos-originales/logo-qrcarta.jpg`, 1024×768 sobre negro).
- El oso está redibujado en SVG (`src/bear.js`) para animarlo: respira, parpadea, mueve las orejas, sigue el cursor con la mirada, se despierta al pasar el ratón y salta y habla al tocarlo. Un mini Moobi acompaña desde la esquina (se esconde en la carta para no tapar precios).
- Paleta: noche `#0E0A0F`, morado Moobi `#A6268A`, rosa `#F27BCB`, rosa claro `#FBEAF4`. Tipografía: Bricolage Grotesque (títulos) y Figtree (texto, parecida a la del logo).

## Pendiente

- **Fotos generadas con IA** (ElevenLabs, en `fotos-originales/ia-*.png`): no son del local. Se recortaron rótulos inventados ("The Luna", "El Café de la Plaza").
- Falta el horario: no aparece en ninguna fuente.
- Logo vectorial original si lo tienen; el SVG es una reinterpretación fiel.

## Publicación

- GitHub Actions está bloqueado por la facturación de la cuenta: se publica subiendo `dist/` más `.nojekyll` a la rama `gh-pages` (ver la guía global).
