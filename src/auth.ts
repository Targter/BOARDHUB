import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@libs/db/models/user-model";
import { connectDB } from "@libs/db/mongoose";

// Function to find or create user for OAuth providers
const findOrCreateOAuthUser = async ({
  email,
  image,
  name,
}: {
  email: string;
  image: string;
  name?: string;
}) => {
  await connectDB();

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return existingUser;
  }

  // Create new user for OAuth
  const newUser = await User.create({
    name: name || email.split("@")[0],
    email,
    image: image || "https://www.gravatar.com/avatar/?d=mp", // Default avatar if none provided
  });

  return newUser;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const email = credentials?.email;
          const password = credentials?.password;

          if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
            throw new Error('Please enter an email and password');
          }

          await connectDB();

          // Explicitly select the password field
          const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

          if (!user) {
            console.log('No user found:', email);
            throw new Error('No user found with this email');
          }

          if (!user.password) {
            console.log('User has no password (OAuth user):', email);
            throw new Error('Please use Google sign in for this account');
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          console.error('Auth error:', error.message);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      try {
        await connectDB();

        // Handle credentials sign in
        if (account?.type === "credentials") {
          return true; // Already validated in authorize callback
        }

        // Handle OAuth sign in
        if (!user?.email) {
          return false;
        }

        // Find or create user
        await findOrCreateOAuthUser({
          email: user.email,
          image: user.image || "",
          name: typeof user.name === 'string' ? user.name : 
                typeof profile?.name === 'string' ? profile.name : 
                undefined,
        });

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});