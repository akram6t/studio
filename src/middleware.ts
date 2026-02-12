
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Standard public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/pricing(.*)',
  '/about(.*)',
  '/auth-callback(.*)',
  '/favicon.ico',
  '/exams',
  '/books'
]);

export default clerkMiddleware(async (auth, request) => {
  // If the route is not public, protect it
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Optimized matcher: Skip all static files and Next.js internals
    // This reduces middleware execution time significantly
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
