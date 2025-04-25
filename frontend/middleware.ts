import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

function isLoggedIn(req: NextRequest) {
  const token = req.cookies.get('token');
  return token !== undefined;
}

export function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isRegisterPage = req.nextUrl.pathname === '/register';

  if ((isLoginPage || isRegisterPage) && isLoggedIn(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'],
};
