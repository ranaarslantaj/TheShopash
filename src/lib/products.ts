import { Product } from '@/context/CartContext';

export const MOCK_PRODUCTS: Product[] = [
  // ─── Rolex ───────────────────────────────────────────────────
  {
    id: '1',
    title: 'Rolex Day-Date Platinum',
    reference: '228206',
    pricePKR: 3500000,
    priceUSD: 12500,
    description:
      'The ultimate prestige watch, crafted from solid 950 platinum with the legendary ice-blue dial. Worn by world leaders and visionaries — the definitive symbol of achievement.',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509941943102-10c232535736?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Rolex',
    gender: 'Men',
    style: 'Dress',
    tags: ['editors-pick', 'rare'],
    stock: 2,
  },
  {
    id: '2',
    title: 'Rolex Submariner Date',
    reference: '126610LN',
    pricePKR: 2900000,
    priceUSD: 10400,
    description:
      'The original tool diver. 41mm Oystersteel case, ceramic Cerachrom bezel, 300m water resistance. A reference that has defined the dive watch for seventy years.',
    images: [
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Rolex',
    gender: 'Men',
    style: 'Diver',
    tags: ['bestseller', 'editors-pick'],
    stock: 3,
  },
  {
    id: '3',
    title: 'Rolex Datejust 31 Mother of Pearl',
    reference: '278273',
    pricePKR: 2100000,
    priceUSD: 7560,
    description:
      'A refined 31mm Oystersteel and yellow gold timepiece with a shimmering mother-of-pearl dial and diamond hour markers. Elegance distilled into a single iconic silhouette.',
    images: [
      'https://images.unsplash.com/photo-1629581678015-fa48ad8441bb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1651133488734-a5e2be6c6a7b?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Rolex',
    gender: 'Women',
    style: 'Dress',
    tags: ['bestseller'],
    stock: 2,
  },

  // ─── Tomi ────────────────────────────────────────────────────
  {
    id: '4',
    title: 'Tomi Classic Chronograph',
    reference: 'T-001',
    pricePKR: 8500,
    priceUSD: 30,
    description:
      'A bold three-counter chronograph with luminous indices, a tachymeter bezel and a steel link bracelet. Everyday confidence at an exceptional price.',
    images: [
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=2076&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Tomi',
    gender: 'Men',
    style: 'Chronograph',
    tags: ['new', 'bestseller'],
    stock: 25,
  },
  {
    id: '5',
    title: 'Tomi Steel Edition',
    reference: 'T-555',
    pricePKR: 7200,
    priceUSD: 26,
    description:
      'Polished stainless steel case and bracelet with a dark sunburst dial. Day-date complication, sapphire-coated mineral glass.',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2099&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1942&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Tomi',
    gender: 'Men',
    style: 'Dress',
    tags: ['new'],
    stock: 30,
  },

  // ─── Tissot ──────────────────────────────────────────────────
  {
    id: '6',
    title: 'Tissot PRX Powermatic 80',
    reference: 'T137.407',
    pricePKR: 185000,
    priceUSD: 665,
    description:
      'Integrated bracelet design with a tonneau-shaped steel case and textured waffle dial, powered by an 80-hour Powermatic automatic movement.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Tissot',
    gender: 'Unisex',
    style: 'Sport',
    tags: ['new', 'bestseller', 'editors-pick'],
    stock: 9,
  },
  {
    id: '7',
    title: 'Tissot Le Locle Powermatic',
    reference: 'T006.407',
    pricePKR: 145000,
    priceUSD: 520,
    description:
      'Roman-numeral classic dress watch in Tissot’s heritage line. Polished case, guilloché silver dial, and an 80-hour Swiss automatic calibre.',
    images: [
      'https://images.unsplash.com/photo-1612646898898-3eae46bfe1c4?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617711164094-dae2c79b88e1?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Tissot',
    gender: 'Men',
    style: 'Dress',
    tags: ['bestseller'],
    stock: 6,
  },

  // ─── Cartier ─────────────────────────────────────────────────
  {
    id: '8',
    title: 'Cartier Ballon Bleu',
    reference: 'W6920046',
    pricePKR: 1350000,
    priceUSD: 4860,
    description:
      'A Parisian silhouette with a signature blue sapphire cabochon set into the crown. A feminine classic that has defined understated luxury for a generation.',
    images: [
      'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Cartier',
    gender: 'Women',
    style: 'Dress',
    tags: ['editors-pick'],
    stock: 3,
  },
  {
    id: '9',
    title: 'Cartier Tank Solo',
    reference: 'WSTA0029',
    pricePKR: 980000,
    priceUSD: 3500,
    description:
      'The dress-watch archetype since 1917 — rectangular case, Roman numerals, blued steel hands. Quiet, considered, eternal.',
    images: [
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=2030&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2074&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Cartier',
    gender: 'Men',
    style: 'Dress',
    tags: ['editors-pick', 'rare'],
    stock: 2,
  },

  // ─── Casio ───────────────────────────────────────────────────
  {
    id: '10',
    title: 'Casio G-Shock GA-2100',
    reference: 'GA-2100-1A',
    pricePKR: 18500,
    priceUSD: 65,
    description:
      'The “CasiOak.” Octagonal carbon-core case, analogue-digital display, 200m water resistance. The cult sport watch of a generation.',
    images: [
      'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Casio',
    gender: 'Unisex',
    style: 'Sport',
    tags: ['new', 'bestseller'],
    stock: 15,
  },
  {
    id: '11',
    title: 'Casio Edifice Solar',
    reference: 'EFR-526',
    pricePKR: 22500,
    priceUSD: 80,
    description:
      'Tough-solar chronograph in a slim stainless case. Black sunburst dial, perpetual calendar, and a sapphire crystal — built for daily wear.',
    images: [
      'https://images.unsplash.com/photo-1697731315333-eaa6b7358ffa?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1623998021446-45cd9b269c95?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Casio',
    gender: 'Men',
    style: 'Chronograph',
    tags: ['bestseller'],
    stock: 12,
  },

  // ─── Seiko ───────────────────────────────────────────────────
  {
    id: '12',
    title: 'Seiko 5 Sports SRPD',
    reference: 'SRPD55',
    pricePKR: 38500,
    priceUSD: 138,
    description:
      'The reborn 5 Sports — automatic 4R36 movement, 100m water resistance, day-date and that famously legible dial. The everyman’s automatic.',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Seiko',
    gender: 'Men',
    style: 'Sport',
    tags: ['new', 'bestseller'],
    stock: 18,
  },
  {
    id: '13',
    title: 'Seiko Prospex Turtle',
    reference: 'SRPE93',
    pricePKR: 72000,
    priceUSD: 260,
    description:
      'A modern reissue of the legendary 1976 turtle — cushion case, 200m diver rated, 4R36 automatic, and a black hardlex crystal.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'Watches',
    brand: 'Seiko',
    gender: 'Men',
    style: 'Diver',
    tags: ['editors-pick'],
    stock: 5,
  },
];
