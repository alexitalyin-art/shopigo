import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: String(credentials.email).toLowerCase(),
          isActive: true,
        });

        if (!user) {
          return null;
        }

        const passwordValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );

        if (!passwordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name || user.email,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";

        if (token.role === "admin" || token.role === "customer") {
          session.user.role = token.role;
        }
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});