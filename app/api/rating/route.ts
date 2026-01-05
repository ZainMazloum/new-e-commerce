// app/api/rating/route.ts
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  // 1. Security Check
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId, rating } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ message: "Invalid rating" }, { status: 400 });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URL!);
  const db = client.db("commerce-db");

  // 2. Save (or Update) the User's Review
  // We use 'upsert: true' so if they rate again, it updates their old rating
  await db.collection("reviews").updateOne(
    { 
      userEmail: session.user.email, 
      productId: new ObjectId(productId) 
    },
    { 
      $set: { 
        rating: rating, 
        userEmail: session.user.email,
        productId: new ObjectId(productId),
        updatedAt: new Date()
      } 
    },
    { upsert: true }
  );

  // 3. Calculate New Average for the Product
  const allReviews = await db.collection("reviews")
    .find({ productId: new ObjectId(productId) })
    .toArray();

  const totalScore = allReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalScore / allReviews.length;

  // 4. Update the Product Document with the new Average
  // This ensures your ProductCard and Shop page show the correct stars immediately
  await db.collection("products").updateOne(
    { _id: new ObjectId(productId) },
    { 
      $set: { 
        rating: parseFloat(averageRating.toFixed(1)), // e.g. 4.5
        reviewCount: allReviews.length 
      } 
    }
  );

  client.close();

  return NextResponse.json({ message: "Rating saved", newAverage: averageRating });
}