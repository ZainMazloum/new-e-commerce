import { MongoClient, ObjectId } from "mongodb";
import { Key } from "react";

export interface Product {
    _id: Key | null | undefined;
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    originalPrice?: number;
    isOnSale: boolean;
    rating: number;
    numReviews: number;
    category: string;
    countInStock: number;
}
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder {
  _id: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  createdAt: string;
}
const MONGODB_URL = process.env.MONGODB_URL || "";
const DATABASE_NAME = "commerce-db";
const COLLECTION_NAME = "products";

/**
 * Helper to handle database connection
 */
async function getCollection() {
    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL is not defined in .env.local");
    }
    const client = await MongoClient.connect(MONGODB_URL);
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    return { collection, client };
}

/**
 * Fetches all products from the database
 */
export async function getAllProducts(): Promise<Product[]> {
    const { collection, client } = await getCollection();
    try {
        const products = await collection.find().toArray();
        return products.map((p) => {
            const { _id, ...rest } = p;
            return { id: _id.toString(), ...rest } as Product;
        });
    } finally {
        await client.close();
    }
}

/**
 * Fetches only products where isOnSale is true
 */
export async function getOnSaleProducts(): Promise<Product[]> {
    const { collection, client } = await getCollection();
    try {
        const products = await collection.find({ isOnSale: true }).toArray();
        return products.map((p) => {
            const { _id, ...rest } = p;
            return { id: _id.toString(), ...rest } as Product;
        });
    } finally {
        await client.close();
    }
}

/**
 * Fetches a single product by its MongoDB ID
 */
export async function getProductById(id: string): Promise<Product | null> {
    const { collection, client } = await getCollection();
    try {
        const product = await collection.findOne({ _id: new ObjectId(id) });
        if (!product) return null;

        const { _id, ...rest } = product;
        return { id: _id.toString(), ...rest } as Product;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    } finally {
        await client.close();
    }
}

/**
 * Fetches products by category
 */
export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
    const { collection, client } = await getCollection();
    try {
        const products = await collection.find({ category: categoryName }).toArray();
        return products.map((p) => {
            const { _id, ...rest } = p;
            return { id: _id.toString(), ...rest } as Product;
        });
    } finally {
        await client.close();
    }
}
export async function getFiltredProducts(query: string): Promise<Product[]> {
    const {collection , client} = await getCollection();
    try{
        const products = await collection.find({ name: { $regex: query, $options: "i" } }).toArray();
        return products.map((p) => {
            const { _id, ...rest } = p;
            return { id: _id.toString(), ...rest } as Product;
        });
    }
    finally {
        await client.close();
    }
}