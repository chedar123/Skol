import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getServerSession } from "next-auth/next";

// Utöka Session-typen för att inkludera användar-ID och roll
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
  
  // Utöka User-typen för att inkludera roll
  interface User {
    id: string;
    role?: string | null;
  }
}

// Utöka JWT-typen för att inkludera roll
declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    id?: string;
    userId?: string;
    sub?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      console.log('JWT callback: token before =', JSON.stringify(token));
      console.log('JWT callback: user =', user ? JSON.stringify(user) : 'undefined');
      console.log('JWT callback: account =', account ? JSON.stringify(account) : 'undefined');
      
      if (user) {
        // Säkerställ att användar-ID finns på flera platser för redundans
        token.id = user.id;
        token.userId = user.id;
        token.sub = user.id; // Använd samma ID för alla tre fält
        token.role = user.role;
      }
      
      // Särskild hantering för Google-inloggning - spara Google sub som ID om den inte redan finns
      if (account?.provider === 'google' && !token.id && token.sub) {
        console.log('Använder Google sub som ID:', token.sub);
        token.id = token.sub;
        token.userId = token.sub;
      }
      
      console.log('JWT callback: token after =', JSON.stringify(token));
      return token;
    },
    session: async ({ session, token }) => {
      console.log('Session callback: session before =', JSON.stringify(session));
      console.log('Session callback: token =', JSON.stringify(token));
      
      // Säkerställa att session.user har id
      if (token) {
        // Bestäm användar-ID från token
        const userId = token.userId || token.id || token.sub;
        
        if (!userId) {
          console.error('Varning: Kunde inte hitta användar-ID i token:', token);
        } else {
          // Kontrollera om användaren existerar i databasen eller skapa automatiskt
          try {
            const existingUser = await prisma.user.findUnique({
              where: { id: userId as string },
              select: { id: true, role: true }
            });
            
            if (!existingUser && token.email) {
              console.log('Skapar ny användare från OAuth:', token.email);
              await prisma.user.create({
                data: {
                  id: userId as string,
                  name: token.name as string,
                  email: token.email as string,
                  image: token.picture as string,
                  role: "USER"
                }
              });
            }
          } catch (error) {
            console.error('Fel vid kontroll/skapande av användare:', error);
          }
        }
        
        // Ange användar-ID i sessionen (garantera att det alltid finns)
        session.user = {
          ...session.user,
          id: userId as string,
          role: token.role as string
        };
      }
      
      console.log('Session callback: session after =', JSON.stringify(session));
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dagar
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-key-change-in-production"
}; 