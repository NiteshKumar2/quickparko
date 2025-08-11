import { connect } from "@/models/dbConfig";
import { Owner } from "@/models/ownerModel";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  pages: {
    signIn: "/login",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your Password",
        },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        connect();
        const user = await Owner.findOne({ email: credentials?.email });

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Check if the login is through Google
        if (account.provider === "google") {
          const userExist = await Owner.findOne({ email: profile.email });
          if (!userExist) {
            const password = Math.floor(1000 + Math.random() * 9000);
            const updatepassword = password.toString();
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(updatepassword, salt);

            const newUser = await Owner.create({
              username: profile.name,
              email: profile.email,
              password: hashedPassword,
              isVerfied: true,
            });
          }
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};
