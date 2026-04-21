import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";

const INITIAL_PRODUCTS = [
  {
    name: 'Fresh Banana',
    price: 80,
    category: 'fruits',
    stock: 120,
    status: 'In Stock',
    labels: ['Organic', 'Local'],
    img: 'https://images.unsplash.com/photo-1571771894821-ad996211fdf4?w=400'
  },
  {
    name: 'Organic Milk',
    price: 75,
    category: 'dairy',
    stock: 45,
    status: 'In Stock',
    labels: ['Organic'],
    img: 'https://images.unsplash.com/photo-1563636619-e910ef4a8b9b?w=400'
  }
];

async function seed() {
  console.log("🌱 Seeding Cloud Firestore...");
  for (const product of INITIAL_PRODUCTS) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: Date.now()
    });
    console.log(`✅ Added ${product.name}`);
  }
  console.log("✨ Cloud Catalog Initialized!");
}

seed();
