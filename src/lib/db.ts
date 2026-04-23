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
  QueryConstraint,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { MOCK_PRODUCTS } from './products';
import { Product, WatchBrand, Gender } from '@/context/CartContext';

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  country: string;
  products: {
    id: string;
    title: string;
    pricePKR: number;
    quantity: number;
  }[];
  totalPricePKR: number;
  totalPriceUSD: number;
  status: 'pending' | 'shipped' | 'delivered';
  paymentMethod: string;
  createdAt: any;
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

// Fetch products, optionally filtered by brand and/or gender.
// Falls back to local MOCK_PRODUCTS when Firebase isn't configured.
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

// Fetch single product
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

// Create an order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
  if (!isFirebaseConfigured || !db) {
    console.warn('[Shop Ash] Firebase not configured — order stored locally only.');
    return `local-${Date.now()}`;
  }

  try {
    const ordersRef = collection(db, 'orders');
    const newOrder = {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(ordersRef, newOrder);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
