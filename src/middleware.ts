// In case the user have a valid token what can the user visit or not  
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  //   variable that check the actual path 
  const path = request.nextUrl.pathname
    // variable that catch the '/login' or '/signup' if that is 
    // the value of `path`
  const isPublicPath = path === '/login'|| path === '/signup'|| path === '/verifyemail'  

  // variable to catch from the request the token value or if is and empty value   
  const token = request.cookies.get('token')?.value || ''
  
  /*if isPublicPath(are the path mention on the variable)
     and token(have a value), redirect the user to '/' */
  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  /*if isPublicPath(are the not path mention on the variable)
     and token(have not a token), redirect the user to '/login' page */
  if(!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }



}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/login',
    '/signup',
  
    
  ]
}