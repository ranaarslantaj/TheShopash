import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
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
  if (!isFirebaseConfigured || !db) {
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
  if (!isFirebaseConfigured || !db) {
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
  if (!isFirebaseConfigured || !db) {
    const id = `LOCAL-${Date.now().toString(36).toUpperCase()}`;
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

  try {
    const ordersRef = collection(db, 'orders');
    const newOrder = {
      ...orderData,
      status: 'pending' as OrderStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(ordersRef, newOrder);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  if (!isFirebaseConfigured || !db) {
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
  if (!isFirebaseConfigured || !db) {
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
  if (!isFirebaseConfigured || !db) {
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
    await updateDoc(ref, {
      ...cleaned,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> =>
  updateOrder(orderId, { status });

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

export const uploadProductImage = async (
  productId: string,
  file: File
): Promise<UploadedImage> => {
  if (!storage) {
    throw new Error(
      'Firebase Storage is not configured. Enable Storage in your Firebase Console first.'
    );
  }
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file, { contentType: file.type });
  const url = await getDownloadURL(ref);
  return { url, path };
};

export const deleteProductImage = async (urlOrPath: string): Promise<void> => {
  if (!storage) return;
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
