/* eslint-disable */
/**
 * ─────────────────────────────────────────────────────────────────────
 * Shop Ash · Firebase one-shot setup
 * ─────────────────────────────────────────────────────────────────────
 *
 * TEMPORARY FILE — delete after running successfully.
 *
 * What this does:
 *   1. Reads Firebase config from `.env.local`
 *   2. Seeds these collections (skips each if already populated):
 *        • products           — 12 watches
 *        • brands             — 8 Maisons (Rolex, Patek, AP, Omega…)
 *        • genderCollections  — 2 hero tiles (Men, Women)
 *        • styleCollections   — 4 tiles (Dress, Sport, Diver, Chronograph)
 *   3. Creates a `_schema` placeholder doc in `orders`, `users`,
 *      `newsletter`, `messages` so the collections appear in the
 *      Firestore console with documented field shapes.
 *
 * Run it:
 *   npm run setup-firebase
 *   # or:
 *   node scripts/setup-firebase.mjs
 *
 * Re-running is safe — collections that already have data are skipped.
 * ─────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

// ──────────────────────────────────────────────────────────────────────
// 1. Load env from .env.local manually (no dotenv dep needed)
// ──────────────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '..', '.env.local');

const env = {};
try {
  const raw = readFileSync(envPath, 'utf-8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && value) env[key] = value;
  }
} catch (e) {
  console.error(`✗ Could not read .env.local at ${envPath}`);
  process.exit(1);
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('✗ Firebase env vars missing. Fill in .env.local first.');
  process.exit(1);
}

console.log(`\n✓ Connecting to project: ${firebaseConfig.projectId}\n`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ──────────────────────────────────────────────────────────────────────
// 2. Catalogue data
// ──────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { title: 'Rolex Day-Date Platinum', reference: '228206', pricePKR: 3500000, priceUSD: 12500, description: 'The ultimate prestige watch, crafted from solid 950 platinum with the legendary ice-blue dial. Worn by world leaders and visionaries — the definitive symbol of achievement.', images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=2070&auto=format&fit=crop','https://images.unsplash.com/photo-1509941943102-10c232535736?q=80&w=2070&auto=format&fit=crop'], category: 'Watches', brand: 'Rolex', gender: 'Men', style: 'Dress', tags: ['editors-pick','rare'], stock: 2 },
  { title: 'Rolex Submariner Date', reference: '126610LN', pricePKR: 2900000, priceUSD: 10400, description: 'The original tool diver. 41mm Oystersteel case, ceramic Cerachrom bezel, 300m water resistance. A reference that has defined the dive watch for seventy years.', images: ['https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1974&auto=format&fit=crop','https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Rolex', gender: 'Men', style: 'Diver', tags: ['bestseller','editors-pick'], stock: 3 },
  { title: 'Rolex Datejust 31 Mother of Pearl', reference: '278273', pricePKR: 2100000, priceUSD: 7560, description: 'A refined 31mm Oystersteel and yellow gold timepiece with a shimmering mother-of-pearl dial and diamond hour markers. Elegance distilled into a single iconic silhouette.', images: ['https://images.unsplash.com/photo-1629581678015-fa48ad8441bb?q=80&w=2070&auto=format&fit=crop','https://images.unsplash.com/photo-1651133488734-a5e2be6c6a7b?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Rolex', gender: 'Women', style: 'Dress', tags: ['bestseller'], stock: 2 },
  { title: 'Tomi Classic Chronograph', reference: 'T-001', pricePKR: 8500, priceUSD: 30, description: 'A bold three-counter chronograph with luminous indices, a tachymeter bezel and a steel link bracelet. Everyday confidence at an exceptional price.', images: ['https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=2076&auto=format&fit=crop','https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2070&auto=format&fit=crop'], category: 'Watches', brand: 'Tomi', gender: 'Men', style: 'Chronograph', tags: ['new','bestseller'], stock: 25 },
  { title: 'Tomi Steel Edition', reference: 'T-555', pricePKR: 7200, priceUSD: 26, description: 'Polished stainless steel case and bracelet with a dark sunburst dial. Day-date complication, sapphire-coated mineral glass.', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=2099&auto=format&fit=crop','https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1942&auto=format&fit=crop'], category: 'Watches', brand: 'Tomi', gender: 'Men', style: 'Dress', tags: ['new'], stock: 30 },
  { title: 'Tissot PRX Powermatic 80', reference: 'T137.407', pricePKR: 185000, priceUSD: 665, description: 'Integrated bracelet design with a tonneau-shaped steel case and textured waffle dial, powered by an 80-hour Powermatic automatic movement.', images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1974&auto=format&fit=crop','https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Tissot', gender: 'Unisex', style: 'Sport', tags: ['new','bestseller','editors-pick'], stock: 9 },
  { title: 'Tissot Le Locle Powermatic', reference: 'T006.407', pricePKR: 145000, priceUSD: 520, description: 'Roman-numeral classic dress watch in Tissot’s heritage line. Polished case, guilloché silver dial, and an 80-hour Swiss automatic calibre.', images: ['https://images.unsplash.com/photo-1612646898898-3eae46bfe1c4?q=80&w=1974&auto=format&fit=crop','https://images.unsplash.com/photo-1617711164094-dae2c79b88e1?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Tissot', gender: 'Men', style: 'Dress', tags: ['bestseller'], stock: 6 },
  { title: 'Cartier Ballon Bleu', reference: 'W6920046', pricePKR: 1350000, priceUSD: 4860, description: 'A Parisian silhouette with a signature blue sapphire cabochon set into the crown. A feminine classic that has defined understated luxury for a generation.', images: ['https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1974&auto=format&fit=crop','https://images.unsplash.com/photo-1611923134239-b9be5816e23c?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Cartier', gender: 'Women', style: 'Dress', tags: ['editors-pick'], stock: 3 },
  { title: 'Cartier Tank Solo', reference: 'WSTA0029', pricePKR: 980000, priceUSD: 3500, description: 'The dress-watch archetype since 1917 — rectangular case, Roman numerals, blued steel hands. Quiet, considered, eternal.', images: ['https://images.unsplash.com/photo-1539874754764-5a96559165b0?q=80&w=2030&auto=format&fit=crop','https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2074&auto=format&fit=crop'], category: 'Watches', brand: 'Cartier', gender: 'Men', style: 'Dress', tags: ['editors-pick','rare'], stock: 2 },
  { title: 'Casio G-Shock GA-2100', reference: 'GA-2100-1A', pricePKR: 18500, priceUSD: 65, description: 'The “CasiOak.” Octagonal carbon-core case, analogue-digital display, 200m water resistance. The cult sport watch of a generation.', images: ['https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=2070&auto=format&fit=crop','https://images.unsplash.com/photo-1600003263720-95b45a4035d5?q=80&w=2070&auto=format&fit=crop'], category: 'Watches', brand: 'Casio', gender: 'Unisex', style: 'Sport', tags: ['new','bestseller'], stock: 15 },
  { title: 'Casio Edifice Solar', reference: 'EFR-526', pricePKR: 22500, priceUSD: 80, description: 'Tough-solar chronograph in a slim stainless case. Black sunburst dial, perpetual calendar, and a sapphire crystal — built for daily wear.', images: ['https://images.unsplash.com/photo-1697731315333-eaa6b7358ffa?q=80&w=1974&auto=format&fit=crop','https://images.unsplash.com/photo-1623998021446-45cd9b269c95?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Casio', gender: 'Men', style: 'Chronograph', tags: ['bestseller'], stock: 12 },
  { title: 'Seiko 5 Sports SRPD', reference: 'SRPD55', pricePKR: 38500, priceUSD: 138, description: 'The reborn 5 Sports — automatic 4R36 movement, 100m water resistance, day-date and that famously legible dial. The everyman’s automatic.', images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop','https://images.unsplash.com/photo-1594534475808-b18fc33b045e?q=80&w=2070&auto=format&fit=crop'], category: 'Watches', brand: 'Seiko', gender: 'Men', style: 'Sport', tags: ['new','bestseller'], stock: 18 },
  { title: 'Seiko Prospex Turtle', reference: 'SRPE93', pricePKR: 72000, priceUSD: 260, description: 'A modern reissue of the legendary 1976 turtle — cushion case, 200m diver rated, 4R36 automatic, and a black hardlex crystal.', images: ['https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop','https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=1974&auto=format&fit=crop'], category: 'Watches', brand: 'Seiko', gender: 'Men', style: 'Diver', tags: ['editors-pick'], stock: 5 },
];

const BRANDS = [
  { slug: 'rolex',   name: 'Rolex',   tagline: 'A Crown for Every Achievement', since: 'Geneva · 1905',   featured: true,  order: 1, image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'tomi',    name: 'Tomi',    tagline: 'Modern. Bold. Accessible.',      since: 'Established',     featured: false, order: 2, image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'tissot',  name: 'Tissot',  tagline: 'Innovators Since 1853',          since: 'Le Locle · 1853', featured: false, order: 3, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'cartier', name: 'Cartier', tagline: 'The Jeweller of Kings',          since: 'Paris · 1847',    featured: false, order: 4, image: 'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'casio',   name: 'Casio',   tagline: 'Tough by Design',                since: 'Tokyo · 1946',    featured: false, order: 5, image: 'https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?q=80&w=1600&auto=format&fit=crop' },
  { slug: 'seiko',   name: 'Seiko',   tagline: 'The Spirit of Japan',            since: 'Tokyo · 1881',    featured: false, order: 6, image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1600&auto=format&fit=crop' },
];

const GENDER_COLLECTIONS = [
  {
    slug: 'men',
    name: "Men's Watches",
    tag: 'The Gentleman',
    copy: 'Dress, sport, diver, chronograph — for the man who marks time with intention.',
    href: '/shop?gender=Men',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
    order: 1,
  },
  {
    slug: 'women',
    name: "Women's Watches",
    tag: 'The Icon',
    copy: 'Mother of pearl, diamond indices, and silhouettes that become heirlooms.',
    href: '/shop?gender=Women',
    image: 'https://images.unsplash.com/photo-1663949800049-a4489eb63dfc?q=80&w=2080&auto=format&fit=crop',
    order: 2,
  },
];

const STYLE_COLLECTIONS = [
  { slug: 'dress',       name: 'Dress',       copy: 'Refined slimness for the boardroom and beyond',     href: '/shop?style=Dress',       order: 1, image: 'https://images.unsplash.com/photo-1612646898898-3eae46bfe1c4?q=80&w=1200&auto=format&fit=crop' },
  { slug: 'sport',       name: 'Sport',       copy: 'Integrated bracelets, engineered for the adventurous', href: '/shop?style=Sport',     order: 2, image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1200&auto=format&fit=crop' },
  { slug: 'diver',       name: 'Diver',       copy: 'Built for the deep, worn on land',                  href: '/shop?style=Diver',       order: 3, image: 'https://images.unsplash.com/photo-1697731315333-eaa6b7358ffa?q=80&w=1200&auto=format&fit=crop' },
  { slug: 'chronograph', name: 'Chronograph', copy: 'Precision instruments of motorsport heritage',     href: '/shop?style=Chronograph', order: 4, image: 'https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=1200&auto=format&fit=crop' },
];

// ──────────────────────────────────────────────────────────────────────
// 3. Schema placeholders
// ──────────────────────────────────────────────────────────────────────
const SCHEMA_DOCS = {
  orders: {
    _placeholder: true,
    _description:
      'Customer orders. Each doc auto-generated id is the order ID shown to users. Delete this _schema doc once real orders exist.',
    _shape: {
      customerName: 'string',
      email: 'string',
      phone: 'string',
      address: 'string',
      country: 'Pakistan | International',
      userId: 'string | null  // Firebase Auth UID, null for guest checkouts',
      products: 'array<{ id, title, pricePKR, quantity, image, brand }>',
      totalPricePKR: 'number',
      totalPriceUSD: 'number',
      paymentMethod: 'cod | stripe',
      status: 'pending | confirmed | shipped | out-for-delivery | delivered | cancelled',
      trackingNumber: 'string?  // optional, set by admin when shipped',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    },
  },
  users: {
    _placeholder: true,
    _description:
      'Optional extended user profiles. Doc ID = Firebase Auth UID. Set role="admin" on your own UID to grant admin access.',
    _shape: {
      email: 'string',
      displayName: 'string',
      phone: 'string?',
      defaultAddress: 'string?',
      country: 'string?',
      role: 'customer | admin',
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    },
  },
  newsletter: {
    _placeholder: true,
    _description: 'Newsletter subscribers from the footer form.',
    _shape: { email: 'string', subscribedAt: 'timestamp' },
  },
  messages: {
    _placeholder: true,
    _description: 'Contact form submissions.',
    _shape: { name: 'string', email: 'string', message: 'string', read: 'boolean', createdAt: 'timestamp' },
  },
};

// ──────────────────────────────────────────────────────────────────────
// 4. Helpers
// ──────────────────────────────────────────────────────────────────────
async function isCollectionEmpty(name) {
  const snap = await getDocs(query(collection(db, name), limit(1)));
  // Treat a collection that only holds the _schema placeholder as still empty
  if (snap.empty) return true;
  const onlyPlaceholder = snap.docs.every((d) => d.id === '_schema' || d.data()?._placeholder);
  return onlyPlaceholder && snap.size <= 1;
}

async function seedAutoIdCollection(name, docs, labelFn = (d) => d.title || d.name) {
  if (!(await isCollectionEmpty(name))) {
    console.log(`  ↪ ${name}: already populated, skipping.`);
    return;
  }
  for (const d of docs) {
    await addDoc(collection(db, name), { ...d, createdAt: serverTimestamp() });
    console.log(`  ✓ ${name.padEnd(20)} ${labelFn(d)}`);
  }
}

async function seedSlugCollection(name, docs) {
  if (!(await isCollectionEmpty(name))) {
    console.log(`  ↪ ${name}: already populated, skipping.`);
    return;
  }
  for (const d of docs) {
    const { slug, ...rest } = d;
    await setDoc(doc(db, name, slug), { ...rest, slug, createdAt: serverTimestamp() });
    console.log(`  ✓ ${name.padEnd(20)} ${slug}`);
  }
}

async function createSchemaPlaceholders() {
  for (const [name, payload] of Object.entries(SCHEMA_DOCS)) {
    const ref = doc(db, name, '_schema');
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() }, { merge: true });
    console.log(`  ✓ ${name}/_schema`);
  }
}

// ──────────────────────────────────────────────────────────────────────
// 5. Run
// ──────────────────────────────────────────────────────────────────────
async function main() {
  try {
    console.log('━━━ products ━━━');
    await seedAutoIdCollection('products', PRODUCTS, (p) => `${p.brand.padEnd(18)} ${p.title}`);

    console.log('\n━━━ brands ━━━');
    await seedSlugCollection('brands', BRANDS);

    console.log('\n━━━ genderCollections ━━━');
    await seedSlugCollection('genderCollections', GENDER_COLLECTIONS);

    console.log('\n━━━ styleCollections ━━━');
    await seedSlugCollection('styleCollections', STYLE_COLLECTIONS);

    console.log('\n━━━ schema placeholders ━━━');
    await createSchemaPlaceholders();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ Done. Verify in Firestore console:');
    console.log(
      `  https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`
    );
    console.log('\nCollections you should see:');
    console.log('  • products            (12 watches)');
    console.log('  • brands              (8 Maisons)');
    console.log('  • genderCollections   (Men, Women)');
    console.log('  • styleCollections    (Dress, Sport, Diver, Chronograph)');
    console.log('  • orders, users, newsletter, messages  (each with _schema doc)\n');
    process.exit(0);
  } catch (err) {
    console.error('\n✗ Setup failed:', err?.message ?? err);
    if (String(err?.message ?? '').toLowerCase().includes('permission')) {
      console.error(
        '\n  Firestore rules are blocking writes. In the Firebase console set\n' +
          '  rules to TEST mode for now:\n\n' +
          '    rules_version = "2";\n' +
          '    service cloud.firestore {\n' +
          '      match /databases/{database}/documents {\n' +
          '        match /{document=**} {\n' +
          '          allow read, write: if true;\n' +
          '        }\n' +
          '      }\n' +
          '    }\n'
      );
    }
    process.exit(1);
  }
}

main();
