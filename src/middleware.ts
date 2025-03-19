import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rutter som kräver autentisering
const protectedRoutes = ["/profil"];

// Rutter som kräver administratörsrättigheter
const adminRoutes = ["/admin"];

/**
 * Hanterar omdirigeringar på toppnivå i appen och autentisering
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Omdirigera casinobonusar-sverige till forum/casinobonusar-sverige
  if (pathname === '/casinobonusar-sverige') {
    return NextResponse.redirect(new URL('/forum/casinobonusar-sverige', request.url));
  }
  
  // Kontrollera om rutten är skyddad
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Kontrollera om rutten är en admin-rutt
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Hämta token
  const token = await getToken({ req: request });
  
  // Om rutten är skyddad och användaren inte är inloggad, omdirigera till inloggningssidan
  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  
  // Om rutten är en admin-rutt
  if (isAdminRoute) {
    // Om användaren inte är inloggad, omdirigera till inloggningssidan
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    // Om användaren inte är administratör, omdirigera till startsidan
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  return NextResponse.next();
}

// Konfigurera middleware att köras på specifika rutter
export const config = {
  matcher: [
    /*
     * Matcher ignorerar _next och API-rutter.
     * Matchar alla rutter som inte börjar med:
     * - api (API-rutter)
     * - _next/static (statiska filer)
     * - _next/image (optimerade bilder)
     * - favicon.ico (favicon-fil)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    '/casinobonusar-sverige',
  ],
}; 