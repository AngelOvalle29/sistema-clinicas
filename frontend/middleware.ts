import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {locales} from '@/config';

export default async function middleware(request: NextRequest) {
  
 


  // Step 1: Use the incoming request (example)
  const defaultLocale = request.headers.get('dashcode-locale') || 'en';
 
  // Step 2: Create and call the next-intl middleware (example)
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
    
  });
  const response = handleI18nRouting(request);
 
  // Step 3: Alter the response (example)
  response.headers.set('dashcode-locale', defaultLocale);


 
  return response;
}
 
export const config = {
  // Todas las rutas menos API, internos de Next y archivos estáticos: así una URL
  // sin locale (p. ej. /clinica/dashboard) redirige a /en/... en vez de dar 404.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};