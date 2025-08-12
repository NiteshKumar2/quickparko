import { connect } from "@/models/dbConfig";
import { Owner } from "@/models/ownerModel";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect(); // ✅ ensure DB connection before query
        const user = await Owner.findOne({ email: credentials?.username });
        return user || null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connect(); // ✅ ensure DB connection before query

        if (account.provider === "google") {
          let userExist = await Owner.findOne({ email: profile.email });

          if (!userExist) {
            const randomPassword = Math.floor(
              1000 + Math.random() * 9000
            ).toString();
            const hashedPassword = await bcryptjs.hash(randomPassword, 10);

            await Owner.create({
              username: profile.name,
              email: profile.email,
              password: hashedPassword,
            });
          }
        }
        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
  },
};
