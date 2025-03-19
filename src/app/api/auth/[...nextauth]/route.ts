import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("NextAuth initieras med authOptions:", 
  JSON.stringify({
    ...authOptions,
    providers: authOptions.providers.map(p => p.id),
    callbacks: Object.keys(authOptions.callbacks || {})
  })
);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 