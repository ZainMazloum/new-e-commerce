import { MongoClient } from "mongodb";
import hash from "bcryptjs";
import {NextResponse} from "next/server";
export async function POST(request : Request){
    const data = await request.json();
    const {email , password} = data;
    if(!email || !email.includes("@") || !password || password.trim().length < 7){
        return NextResponse.json({message : "Invalid input - password should be at least 7 characters long and email should be valid."} , {status : 422});
    }
    const client = await MongoClient.connect(process.env.MONGODB_URL!);
    const db = client.db("commerce-db")
    const existingUser = await db.collection("users").findOne({email : email});
    if(existingUser){
        client.close();
        return NextResponse.json({message : "User exists already!"} , {status : 422});
    }
    const hashedPassword = await hash.hash(password , 12);
    await db.collection("users").insertOne({email : email , password : hashedPassword});
    client.close();
    return NextResponse.json({message : "User created successfully!"} , {status : 201});
}