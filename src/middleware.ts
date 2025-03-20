import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/detector']
const authRoutes = ['/auth/signin', '/auth/signup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          })
        },
      },
    }
  )

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      if (!session) {
        const redirectUrl = new URL('/auth/signin', request.url)
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    if (authRoutes.includes(request.nextUrl.pathname)) {
      if (session) {
        return NextResponse.redirect(new URL('/detector', request.url))
      }
    }

    return response
  } catch (error) {
    return response
  }
}

export const config = {
  matcher: [

    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 