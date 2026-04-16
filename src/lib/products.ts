import { Product } from '@/context/CartContext';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Royal Oak Skeleton',
    pricePKR: 1250000,
    priceUSD: 4500,
    description: 'A masterpiece of horological engineering, featuring a hand-finished skeleton movement visible through the sapphire crystal caseback. The iconic octagonal bezel with exposed screws speaks to decades of uncompromising Swiss watchmaking tradition.',
    images: [
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1974&auto=format&fit=crop'
    ],
    category: 'Watches',
    stock: 5
  },
  {
    id: '2',
    title: 'Seamaster Heritage',
    pricePKR: 850000,
    priceUSD: 3100,
    description: 'A tribute to the classic diving watches of the 1960s. This heritage timepiece combines vintage aesthetics with cutting-edge ceramic materials and a Co-Axial Master Chronometer movement.',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2099&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1942&auto=format&fit=crop'
    ],
    category: 'Watches',
    stock: 3
  },
  {
    id: '3',
    title: 'Day-Date Platinum',
    pricePKR: 3500000,
    priceUSD: 12500,
    description: 'The ultimate prestige watch, crafted from solid 950 platinum with the legendary ice-blue dial. Worn by world leaders and visionaries, this timepiece is the definitive symbol of achievement.',
    images: [
      'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509941943102-10c232535736?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Watches',
    stock: 2
  },
  {
    id: '4',
    title: 'Nautilus Rose Gold',
    pricePKR: 4200000,
    priceUSD: 15120,
    description: 'Elegant sports luxury in 18k rose gold with a sunburst brown dial and horizontal embossing. A masterwork of Gerald Genta design philosophy, coveted by collectors worldwide.',
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Watches',
    stock: 1
  },
  {
    id: '5',
    title: 'Chronograph Noir',
    pricePKR: 680000,
    priceUSD: 2450,
    description: 'A striking all-black chronograph with luminous indices and a tachymeter bezel. Precision movement housed in a 42mm ceramic case, built for those who command attention.',
    images: [
      'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=2076&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2070&auto=format&fit=crop'
    ],
    category: 'Watches',
    stock: 7
  },
  {
    id: '6',
    title: 'Moonphase Classic',
    pricePKR: 1950000,
    priceUSD: 7020,
    description: 'An exquisite moonphase complication set against a deep midnight-blue enamel dial. The 40mm white gold case houses a hand-wound manufacture calibre with 72-hour power reserve.',
    images: [
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=2030&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2074&auto=format&fit=crop'
    ],
    category: 'Watches',
    stock: 4
  }
];
