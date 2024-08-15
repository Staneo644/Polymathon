import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const authorizedUrls = [
    "/",
    "/rechercher",
    "/contacte",
    "/api/word/day",
    "/api/theme",
    "/api/word",
  ];
  const url = new URL(request.url);

  console.log(authorizedUrls.includes(url.pathname));
  if (authorizedUrls.includes(url.pathname)) {
    return NextResponse.next(); // Accès autorisé sans authentification
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
