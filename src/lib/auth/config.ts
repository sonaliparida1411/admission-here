import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        let permissions: string[] = [];
        if (user.role === UserRole.STAFF) {
          const staffPerm = await db.staffPermission.findUnique({
            where: { userId: user.id },
          });
          permissions = staffPerm?.permissions || [];
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          managedCollegeId: user.managedCollegeId,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || UserRole.STUDENT;
        token.managedCollegeId = (user as any).managedCollegeId;
        token.permissions = (user as any).permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as UserRole;
        (session.user as any).managedCollegeId = token.managedCollegeId as string | null;
        (session.user as any).permissions = (token.permissions as string[]) || [];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || "default-secret-dev-random-admissions-hub-key",
});

