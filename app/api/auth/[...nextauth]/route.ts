import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";

const authHandler = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const client = await MongoClient.connect(
          process.env.MONGODB_URL as string
        );

        const db = client.db("commerce-db");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          await client.close();
          throw new Error("No user found with this email");
        }

        const isValid = await compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          await client.close();
          throw new Error("Invalid password");
        }

        await client.close();

        return {
          id: user._id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { authHandler as GET, authHandler as POST };
