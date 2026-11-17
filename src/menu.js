// Carta de Moobi Café (fuente: su carta en QRCarta). Erratas de marcas corregidas.
// price: número en euros, o null si la carta no indica precio.

export const menu = [
  {
    id: 'cafes', name: 'Cafés y tés',
    groups: [
      { name: 'Cafés', items: [
        ['Café solo, con leche o descafeinado', '', 1.5],
        ['Crema o espresso', '', 1.5],
        ['Cola Cao', '', 1.5],
        ['Café doble', '', 1.8],
        ['Café americano', '', 1.8],
        ['Café bombón', 'Con leche condensada', 2.5],
        ['Carajillo', '', 2.5],
        ['Cappuccino', 'Con crema de leche o nata', 2.5],
        ['Café coctelera', 'Sin Baileys', 2.5],
        ['Café coctelera con Baileys', '', 3.5],
        ['Café con licor', '', 3],
        ['Café doble con licor', '', 3.3],
        ['Frappelatte', 'Café con leche granizado con leche condensada', 4],
        ['Frappuccino', 'Café con leche granizado. A elegir: cacao, caramelo, vainilla o avellana', 4],
        ['Café irlandés', 'Café, whiskey irlandés, crema de leche y nata', 4.5],
      ] },
      { name: 'Tés e infusiones', items: [
        ["Five o'clock", 'Té negro', 1.8],
        ['Taj Mahal', 'Té negro, té verde y canela', 1.8],
        ['Tuareg', 'Té verde, menta y hierbabuena', 1.8],
        ['China imperial', 'Té rojo', 1.8],
        ['Kalahari', 'Rooibos, cacao y canela', 1.8],
        ['Matrioska', 'Infusión de frutos silvestres', 1.8],
        ['Copacabana', 'Mate, hierbaluisa, lemongrass y rosas', 1.8],
        ['Ramsés', 'Manzanilla', 1.8],
        ['Mare Nostrum', 'Menta poleo', 1.8],
        ['Katmandú', 'Tila y melisa', 1.8],
        ['Té americano', 'Té negro, leche, Licor 43, cáscara de limón y canela', 2.5],
        ['Té frío', 'Maracuyá o frutos rojos', 3],
      ] },
    ],
  },
  {
    id: 'batidos', name: 'Milkshakes',
    groups: [
      { name: 'Milkshakes', items: [
        ['Nutella', 'Nutella, vainilla, leche y nata montada', 6],
        ['Oreo', 'Galletas Oreo, vainilla, leche y nata montada', 6],
        ['Kinder Bueno', 'Avellana, chocolate, vainilla, leche, nata montada y Kinder Bueno', 6],
        ['Petit Suisse', 'Fresa, plátano, leche y nata montada', 6],
        ['Frigopie', 'Vainilla, fresa, leche y nata montada', 6],
        ['Silvestre tropical', 'Frambuesa, mango, leche y nata montada', 6],
        ['Moobi Amazonas', 'Kiwi, maracuyá, leche y nata montada', 6],
        ['Fabrica tu milkshake', 'Hasta 3 sabores', 6],
      ] },
      { name: 'Smoothies', items: [
        ['Crea tu smoothie', 'Hasta 2 sabores: fresa, plátano, piña, coco, mango, maracuyá, sandía, melón, arándano, lichi, frambuesa, frutas del bosque, melocotón o kiwi', 4],
      ] },
    ],
  },
  {
    id: 'bebidas', name: 'Refrescos y cervezas',
    groups: [
      { name: 'Refrescos', items: [
        ['Agua', '', 1.5],
        ['Agua con gas', '', 2],
        ['Coca-Cola, Zero o Zero Zero', '', 2],
        ['Pepsi', '', 2],
        ['Fanta naranja o limón', '', 2],
        ['Limón & Nada', '', 2],
        ['7 Up', '', 2],
        ['Tónica Schweppes, Bliss Yuzu o Bliss Berry', '', 2],
        ['Ginger ale', '', 2],
        ['Soda', '', 2],
        ['Puleva chocolate', '', 2],
        ['Zumo de naranja, melocotón o piña', '', 2],
        ['Nestea limón o maracuyá', '', 2.3],
        ['Aquarius naranja o limón', '', 2.3],
        ['Red Bull o Red Bull Zero', '', 3],
        ['Monster', '', 3],
      ] },
      { name: 'Cervezas', items: [
        ['Cruzcampo', '', 2.5],
        ['Alhambra Especial', '', 2.5],
        ['Águila 1900', '', 2.5],
        ['Sin gluten', '', 2.5],
        ['0,0', '', 2.5],
        ['Heineken', '', 3],
        ['Desperados', '', 3],
        ['Sol', '', 3],
        ['Alhambra 1925', '', 3.5],
        ['La Rubia 18/70', '', 3.5],
        ['El Alcázar', '', 3.5],
        ['Mort Subite', '', 3.5],
        ['Águila sin filtrar', '', 3.5],
        ['La Chouffe Blonde', '', 4],
        ['Alhambra Roja', '', 4],
        ['Judas', '', 4],
        ['Salitos Blue o Pink', '', 4],
        ['Cerveza IPA', 'Cerdos Voladores, Imparable o Lagunitas', 5],
        ['Cruzcampo Gran Reserva', 'Media pinta 2,50 € · pinta 3,50 €', null],
        ['Radler', 'Media pinta 2,50 € · pinta 3,50 €', null],
        ['Paulaner', 'Media pinta 3,50 € · pinta 4 €', null],
        ['Tinto con limón', '', 2.5],
        ['Ladrón de Manzanas', '', 3],
        ['Kopparberg', '', 4],
        ['Vino tinto o blanco', '', 3],
      ] },
    ],
  },
  {
    id: 'licores', name: 'Licores',
    groups: [
      { name: 'Con alcohol', items: [
        ['Amaretto', '', 6], ['Jägermeister', '', 6], ['Fernet', '', 6], ['Martini', 'Bianco o Rosso', 5],
        ['Licor 43', '', 6], ['Pacharán', 'Zoco o Ruavieja', 4.5], ['Miura', '', 5], ['Anís', '', 4.5],
        ['Ponche Caballero', '', 6], ['Tía María', '', 5], ['Frangelico', '', 6], ['Licor de hierbas', 'Ruavieja', 4.5],
        ['Baileys', 'También sin lactosa', 5], ['Crema de orujo', 'Ruavieja', 5], ['Crema catalana', 'Melody', 5],
        ['Barceló Cream', '', 5], ["Sheridan's", '', 5], ['Cointreau', '', 5], ['Fireball', '', 5], ['Drambuie', '', 5],
        ['Tequila José Cuervo', '', 6], ['Licor de tequila', 'Fresa, mango, limón, melón o nube', 5],
      ] },
      { name: 'Sin alcohol', items: [
        ['Licor de manzana', '', 4], ['Licor de mora', '', 4], ['Granadina', '', 4], ['Lima', '', 4], ['Kiwi', '', 4], ['Blue Tropic', '', 4],
      ] },
    ],
  },
  {
    id: 'whisky', name: 'Whisky',
    groups: [
      { name: 'Whisky', items: [
        ["Ballantine's", '', 6], ['J&B', '', 6], ['DYC 8', '', 6], ['White Label', '', 6], ['Red Label', '', 6],
        ['Jameson', '', 6], ['Cutty Sark', '', 6], ['Passport', '', 6], ['100 Pipers', '', 6], ['Canadian Club', '', 6],
        ['Jim Beam', '', 6], ['Four Roses', '', 6.5], ['Southern Comfort', '', 7], ["Jack Daniel's", '', 7],
        ["Jack Daniel's Apple", '', 7], ["Seagram's", '', 7], ['The Famous Grouse', '', null],
      ] },
      { name: 'Premium', items: [
        ['Bulleit Bourbon', '', 7], ['Glenfiddich 12', '', 7], ['Black Label', '', 8], ["Maker's Mark", '', 8],
        ['Cardhu 12', '', 8], ['Chivas 12', '', 8], ['White Label 12', '', 8], ['Haig Club', '', 8],
        ['Green Label', '', 12], ['Macallan Amber', '', 15], ['The Macallan Fine Oak 12', '', null], ["Dewar's 12", '', null],
        ['Cutty Sark Blended Malt', '', null], ['Cutty Sark 12', '', null], ["Ballantine's 10", '', null], ["Ballantine's 12", '', null],
      ] },
    ],
  },
  {
    id: 'ron', name: 'Ron',
    groups: [
      { name: 'Ron', items: [
        ['Barceló', '', 6], ['Cacique', '', 6], ['Brugal', '', 6], ['Pampero', '', 6], ['Arehucas', '', 6],
        ['Matusalem Añejo', '', 6], ['Montero', '', 6], ['Santa Teresa', '', 6], ['Bacardí', '', 6], ['Malibu', '', 6],
        ['Ron miel', '', 6], ['Legendario Elixir', '', 6.5], ['Legendario Elixir Rosé', '', 6.5],
      ] },
      { name: 'Premium', items: [
        ['Cacique 500', '', 8], ['Havana Club 7', '', 8], ['Bacardí 8', '', 8], ['Brugal Extra Viejo', '', 8],
        ['Matusalem 7', '', 8], ['Santa Teresa Selecto', '', 8], ['Brugal 1888', '', 9], ['Barceló Imperial', '', 9],
        ['Matusalem 15', '', 10], ['Zacapa 23', '', 10], ['Don Q 7', '', null], ['Don Q Gran Añejo', '', null], ['Flor de Caña 5', '', null],
      ] },
    ],
  },
];

export const menuNote = 'Los licores combinados con Red Bull, Red Bull Zero o Monster tienen un suplemento de 1 €.';

// Sabores para "Fabrica tu milkshake" (hasta 3), con un color para pintar el vaso.
export const flavours = [
  ['Avellana', '#B07A4A'], ['Vainilla', '#F3E3B5'], ['Chocolate con leche', '#7A4A2E'], ['Fresa', '#F06C8C'],
  ['Plátano', '#F6DE6B'], ['Piña', '#F9D04A'], ['Coco', '#F7F3EA'], ['Mango', '#FFB347'],
  ['Maracuyá', '#F4A63A'], ['Sandía', '#F2546A'], ['Melón', '#C9E58A'], ['Arándano', '#5B5FB8'],
  ['Lichi', '#F7D9DC'], ['Frambuesa', '#D93A6A'], ['Frutas del bosque', '#8E2C6A'],
];

export const eur = (n) => (n == null ? 'Consultar' : `${n.toFixed(2).replace('.', ',').replace(',00', '')} €`);
