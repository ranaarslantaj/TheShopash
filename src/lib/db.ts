import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  runTransaction,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import { MOCK_PRODUCTS } from './products';
import { Product, WatchBrand, Gender } from '@/context/CartContext';

const isClientOffline = (): boolean => typeof window !== 'undefined' && !navigator.onLine;
const shouldUseMockData = (): boolean => !isFirebaseConfigured || !db || isClientOffline();

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  userId?: string | null;
  products: {
    id: string;
    title: string;
    pricePKR: number;
    quantity: number;
    image?: string;
    brand?: string;
  }[];
  totalPricePKR: number;
  totalPriceUSD: number;
  status: OrderStatus;
  paymentMethod: string;
  courier?: import('./couriers').Courier;
  trackingNumber?: string;
  createdAt: any;
  updatedAt?: any;
}

export interface ProductFilters {
  brand?: WatchBrand;
  gender?: Gender;
}

const filterMock = (filters: ProductFilters): Product[] => {
  return MOCK_PRODUCTS.filter((p) => {
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.gender && p.gender !== filters.gender) return false;
    return true;
  });
};

export const getProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
  if (shouldUseMockData()) {
    return filterMock(filters);
  }

  try {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [];

    if (filters.brand) constraints.push(where('brand', '==', filters.brand));
    if (filters.gender) constraints.push(where('gender', '==', filters.gender));
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    return results.length === 0 ? filterMock(filters) : results;
  } catch (error) {
    console.error('Error fetching products, falling back to mock data:', error);
    return filterMock(filters);
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (shouldUseMockData()) {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  } catch (error) {
    console.error('Error fetching product, falling back to mock:', error);
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
};

// ─── Order ID format ────────────────────────────────────────────
// Customer-facing IDs look like SA00001, SA00002, … — sequential, padded.
// Internally each order uses this string as its Firestore document ID, so
// URLs (/account/orders/SA00012, /track) and admin views all match.
export const ORDER_ID_PREFIX = 'SA';
export const ORDER_ID_PAD_LENGTH = 5;

const formatOrderId = (n: number): string =>
  `${ORDER_ID_PREFIX}${String(n).padStart(ORDER_ID_PAD_LENGTH, '0')}`;

// Local counter for offline fallback (mirrors the Firestore counter doc).
const LOCAL_COUNTER_KEY = 'shop-ash-order-counter';
const readLocalCounter = (): number => {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(LOCAL_COUNTER_KEY) ?? '0', 10) || 0;
};
const writeLocalCounter = (n: number) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_COUNTER_KEY, String(n));
};

// Local guest-order log (so /track works without Firebase configured)
const GUEST_ORDERS_KEY = 'shop-ash-guest-orders';

const readGuestOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_ORDERS_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const writeGuestOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
};

export const createOrder = async (
  orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'updatedAt'>
): Promise<string> => {
  // ─── Offline fallback (no Firebase) ──────────────────────────
  if (shouldUseMockData()) {
    const next = readLocalCounter() + 1;
    writeLocalCounter(next);
    const id = formatOrderId(next);
    const newOrder: Order = {
      id,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const orders = readGuestOrders();
    writeGuestOrders([newOrder, ...orders]);
    return id;
  }

  // ─── Atomic sequential ID via transaction ────────────────────
  // Reads & increments meta/orderCounter, then writes the new order doc
  // with id `SA00001` etc. — all in one atomic operation. Guarantees no
  // duplicate IDs even with concurrent checkouts.
  try {
    const counterRef = doc(db, 'meta', 'orderCounter');
    const orderId = await runTransaction(db, async (tx) => {
      const counterSnap = await tx.get(counterRef);
      const current = counterSnap.exists() ? (counterSnap.data().value ?? 0) : 0;
      const next = current + 1;
      const id = formatOrderId(next);

      tx.set(counterRef, { value: next, updatedAt: serverTimestamp() }, { merge: true });
      tx.set(doc(db!, 'orders', id), {
        ...orderData,
        status: 'pending' as OrderStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return id;
    });

    // Fire-and-forget order confirmation email. We don't await it because
    // email failure must not break checkout — the email layer logs errors.
    void (async () => {
      try {
        const { sendOrderConfirmationEmail } = await import('./emails');
        await sendOrderConfirmationEmail({
          ...orderData,
          id: orderId,
          status: 'pending',
          createdAt: new Date().toISOString(),
        } as Order);
      } catch (err) {
        console.error('[Emails] Confirmation send failed:', err);
      }
    })();

    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  if (shouldUseMockData()) {
    return readGuestOrders().find((o) => o.id === id) ?? null;
  }
  try {
    const docRef = doc(db, 'orders', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  if (shouldUseMockData()) {
    return readGuestOrders().filter((o) => o.userId === userId);
  }
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// ─── Admin helpers ──────────────────────────────────────────────
export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
}

export const getAllOrders = async (filters: OrderFilters = {}): Promise<Order[]> => {
  if (shouldUseMockData()) {
    let mock = readGuestOrders();
    if (filters.status) mock = mock.filter((o) => o.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      mock = mock.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q)
      );
    }
    return mock;
  }

  try {
    const constraints: QueryConstraint[] = [];
    if (filters.status) constraints.push(where('status', '==', filters.status));
    constraints.push(orderBy('createdAt', 'desc'));
    const snap = await getDocs(query(collection(db, 'orders'), ...constraints));
    let results = snap.docs
      .filter((d) => d.id !== '_schema')
      .map((d) => ({ id: d.id, ...d.data() })) as Order[];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q)
      );
    }
    return results;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrder = async (
  orderId: string,
  updates: Partial<Omit<Order, 'id' | 'createdAt'>>
): Promise<void> => {
  // Firestore rejects undefined values — strip them
  const cleaned = Object.fromEntries(
    Object.entries(updates).filter(([, v]) => v !== undefined)
  ) as Partial<Omit<Order, 'id' | 'createdAt'>>;

  if (!isFirebaseConfigured || !db) {
    const orders = readGuestOrders();
    const next = orders.map((o) =>
      o.id === orderId ? { ...o, ...cleaned, updatedAt: new Date().toISOString() } : o
    );
    writeGuestOrders(next);
    return;
  }
  try {
    const ref = doc(db, 'orders', orderId);

    // Read previous state so we can detect status transitions for emails
    const previousSnap = await getDoc(ref);
    const previous = previousSnap.exists()
      ? ({ id: previousSnap.id, ...previousSnap.data() } as Order)
      : null;

    await updateDoc(ref, {
      ...cleaned,
      updatedAt: serverTimestamp(),
    });

    // Send a status-change email if status moved to a new actionable state
    if (
      previous &&
      cleaned.status &&
      cleaned.status !== previous.status &&
      previous.email
    ) {
      void (async () => {
        try {
          const { sendOrderStatusEmail } = await import('./emails');
          await sendOrderStatusEmail(
            { ...previous, ...cleaned, id: orderId } as Order,
            cleaned.status as OrderStatus
          );
        } catch (err) {
          console.error('[Emails] Status email failed:', err);
        }
      })();
    }
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> =>
  updateOrder(orderId, { status });

// ─── Site settings ──────────────────────────────────────────────
export interface SiteSettings {
  announcement: string;
  announcementEnabled: boolean;
  email: string;
  phone: string;
  whatsapp: string; // digits only, country code first (no +)
  address: string;
  city: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  updatedAt?: any;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement:
    'Complimentary insured shipping worldwide · Authenticated by master watchmakers',
  announcementEnabled: true,
  email: 'concierge@shopash.com',
  phone: '+92 300 1234567',
  whatsapp: '923001234567',
  address: 'Luxury Avenue, Karachi, Pakistan',
  city: 'Karachi',
  instagramUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (shouldUseMockData()) return DEFAULT_SETTINGS;
  try {
    const snap = await getDoc(doc(db, 'settings', 'site'));
    if (!snap.exists()) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(snap.data() as Partial<SiteSettings>) };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateSiteSettings = async (updates: Partial<SiteSettings>): Promise<void> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase not configured. Cannot save settings in offline mode.');
  }
  const cleaned = Object.fromEntries(
    Object.entries(updates).filter(([, v]) => v !== undefined)
  );
  await setDoc(
    doc(db, 'settings', 'site'),
    { ...cleaned, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

// ─── Customers ──────────────────────────────────────────────────
export type UserRole = 'customer' | 'admin';

export interface Customer {
  id: string; // == Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  createdAt?: any;
  updatedAt?: any;
  lastSignInAt?: any;
}

/**
 * Idempotently upserts the users/{uid} document.
 * Called on every auth state change so customer records always exist.
 */
export const ensureUserDoc = async (params: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phone?: string | null;
}): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  const ref = doc(db, 'users', params.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      // Update last sign-in timestamp + refresh display fields
      await setDoc(
        ref,
        {
          email: params.email ?? snap.data()?.email ?? '',
          displayName: params.displayName ?? snap.data()?.displayName ?? '',
          photoURL: params.photoURL ?? snap.data()?.photoURL ?? '',
          lastSignInAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // First time we see this user — create with default customer role
      await setDoc(ref, {
        email: params.email ?? '',
        displayName: params.displayName ?? '',
        photoURL: params.photoURL ?? '',
        phone: params.phone ?? '',
        role: 'customer' as UserRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastSignInAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('ensureUserDoc failed:', error);
  }
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  if (shouldUseMockData()) return [];
  try {
    const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
    return snap.docs
      .filter((d) => d.id !== '_schema' && !d.data()?._placeholder)
      .map((d) => ({ id: d.id, ...d.data() })) as Customer[];
  } catch {
    // Fallback if orderBy('createdAt') fails because some docs lack the field
    try {
      const snap = await getDocs(collection(db!, 'users'));
      return snap.docs
        .filter((d) => d.id !== '_schema' && !d.data()?._placeholder)
        .map((d) => ({ id: d.id, ...d.data() })) as Customer[];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }
};

export const getCustomerById = async (uid: string): Promise<Customer | null> => {
  if (shouldUseMockData()) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Customer;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};

// ─── Product CRUD ───────────────────────────────────────────────
const isReal = () => isFirebaseConfigured && !!db;

export const createProduct = async (
  productData: Omit<Product, 'id'>
): Promise<string> => {
  if (!isReal()) {
    throw new Error('Firebase not configured. Cannot create products in offline mode.');
  }
  const cleaned = Object.fromEntries(
    Object.entries(productData).filter(([, v]) => v !== undefined)
  );
  const docRef = await addDoc(collection(db!, 'products'), {
    ...cleaned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const createProductWithId = async (
  id: string,
  productData: Omit<Product, 'id'>
): Promise<void> => {
  if (!isReal()) {
    throw new Error('Firebase not configured. Cannot create products in offline mode.');
  }
  const cleaned = Object.fromEntries(
    Object.entries(productData).filter(([, v]) => v !== undefined)
  );
  await setDoc(doc(db!, 'products', id), {
    ...cleaned,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateProduct = async (
  id: string,
  updates: Partial<Omit<Product, 'id'>>
): Promise<void> => {
  if (!isReal()) {
    throw new Error('Firebase not configured. Cannot update products in offline mode.');
  }
  const cleaned = Object.fromEntries(
    Object.entries(updates).filter(([, v]) => v !== undefined)
  );
  await updateDoc(doc(db!, 'products', id), {
    ...cleaned,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!isReal()) {
    throw new Error('Firebase not configured. Cannot delete products in offline mode.');
  }
  await deleteDoc(doc(db!, 'products', id));
};

// ─── Storage: product image upload ──────────────────────────────
export interface UploadedImage {
  url: string;
  path: string; // storage path, used for deletion
}

// Helper to compress and convert image files to Base64 data URLs on the client side
const compressAndConvertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Target reasonable sizes to keep under the 1MB Firestore doc limit
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original data URL
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to WebP at 70% quality to get tiny file sizes (typically 20-50KB)
        const dataUrl = canvas.toDataURL('image/webp', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        reject(err);
      };
    };
    reader.onerror = (err) => {
      reject(err);
    };
  });
};

export const uploadProductImage = async (
  productId: string,
  file: File
): Promise<UploadedImage> => {
  if (!storage) {
    console.warn('[Storage] Firebase Storage not initialized. Using Base64 fallback.');
    try {
      const base64 = await compressAndConvertToBase64(file);
      return { url: base64, path: 'base64' };
    } catch (err: any) {
      throw new Error('Failed to encode image: ' + (err?.message ?? err));
    }
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const ref = storageRef(storage, path);
  try {
    await uploadBytes(ref, file, { contentType: file.type });
    const url = await getDownloadURL(ref);
    return { url, path };
  } catch (err: any) {
    console.warn('[Storage] Firebase Storage failed (possibly needs plan upgrade/CORS setup). Falling back to client-side Base64 encoding.', err);
    try {
      const base64 = await compressAndConvertToBase64(file);
      return { url: base64, path: 'base64' };
    } catch (fallbackErr: any) {
      throw new Error(err?.message ?? 'Image upload failed. Fallback also failed.');
    }
  }
};

export const deleteProductImage = async (urlOrPath: string): Promise<void> => {
  if (!storage || urlOrPath === 'base64' || urlOrPath.startsWith('data:')) return;
  try {
    // Accept either a full https URL (from getDownloadURL) or a storage path
    const ref = urlOrPath.startsWith('http')
      ? storageRef(storage, decodeURIComponent(urlOrPath.split('/o/')[1].split('?')[0]))
      : storageRef(storage, urlOrPath);
    await deleteObject(ref);
  } catch (error: any) {
    // Object may already be deleted or path may be external — non-fatal
    console.warn('Could not delete image:', error?.code ?? error);
  }
};

export const formatOrderDate = (createdAt: any): string => {
  if (!createdAt) return '—';
  if (createdAt instanceof Timestamp) return createdAt.toDate().toLocaleDateString();
  if (createdAt?.toDate) return createdAt.toDate().toLocaleDateString();
  if (typeof createdAt === 'string') return new Date(createdAt).toLocaleDateString();
  return '—';
};
