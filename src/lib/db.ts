import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/context/CartContext';

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

// Fetch all products
export const getProducts = async (category?: string) => {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('createdAt', 'desc'));
    
    if (category && category !== 'All') {
      q = query(productsRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch single product
export const getProductById = async (id: string) => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Create an order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
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
    console.error("Error creating order:", error);
    throw error;
  }
};
