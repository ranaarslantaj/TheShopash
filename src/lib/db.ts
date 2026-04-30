import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
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

export const formatOrderDate = (createdAt: any): string => {
  if (!createdAt) return '—';
  if (createdAt instanceof Timestamp) return createdAt.toDate().toLocaleDateString();
  if (createdAt?.toDate) return createdAt.toDate().toLocaleDateString();
  if (typeof createdAt === 'string') return new Date(createdAt).toLocaleDateString();
  return '—';
};
