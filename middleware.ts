export { auth as middleware } from "next-auth/middleware"

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"
  ],
}
