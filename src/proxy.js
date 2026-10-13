// import { NextRequest, NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth";
// export async function proxy(request) {
//     const session = await auth.api.getSession({
//         headers: await headers()
//     })
//     if(!session) {
//         return NextResponse.redirect(new URL("/sign-in", request.url));
//     }
//     return NextResponse.next();
// }
// export const config = {
//   matcher: ["/profile", "/product/:id"], // Specify the routes the middleware applies to
// };


import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    const signInUrl = new URL('/sign-in', request.url)

    signInUrl.searchParams.set(
      'callbackUrl',
      request.nextUrl.pathname + request.nextUrl.search
    )

    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/product/:path*', '/profile/:path*'],
}
