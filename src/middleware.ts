
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Standard public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/pricing(.*)',
  '/about(.*)',
  '/auth-callback(.*)',
  '/favicon.ico'
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is not public, protect it
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, which improves performance significantly
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
