import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth";
// Import your interfaces
import { IOrder , OrderItem } from "@/helpers/api-util";

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Define what we expect from the request body
  const body: { items: OrderItem[], totalAmount: number } = await req.json();

  const client = await MongoClient.connect(process.env.MONGODB_URL!);
  const db = client.db("commerce-db");

  // Create the order object using the IOrder structure
  // We omit _id here because MongoDB generates it automatically
  const newOrder: Omit<IOrder, "_id"> = {
    userEmail: session.user.email,
    items: body.items,
    total: body.totalAmount,
    status: "Processing",
    date: new Date().toLocaleDateString("en-US", { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    createdAt: new Date().toISOString()
  };

  const result = await db.collection("orders").insertOne(newOrder);
  client.close();

  return NextResponse.json({ 
    message: "Order created", 
    orderId: result.insertedId 
  });
}

export async function GET() {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URL!);
  const db = client.db("commerce-db");

  // Type the results coming out of the database
  const orders = await db.collection("orders")
    .find({ userEmail: session.user.email })
    .sort({ createdAt: -1 }) 
    .toArray() as unknown as IOrder[];

  client.close();

  return NextResponse.json(orders);
}