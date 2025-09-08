

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const url = req.nextUrl.clone();

//   if (!token) {
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   let decoded;
//   try {
//     const { payload } = await jwtVerify(token, secret);
//     decoded = payload;
//   } catch (err) {
//     console.error("❌ Invalid token:", err);
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   const role = decoded?.role;

//   // Role-based route protection
//   if (url.pathname.startsWith("/Superadmin") && role !== "superAdmin") {
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   if (url.pathname.startsWith("/admin") && role !== "admin") {
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   if (url.pathname.startsWith("/SMuser") && role !== "dsm") {
//     url.pathname = "/";
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/Superadmin/:path*", "/admin/:path*","/SMuser/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  // If no token → send to login
  if (!token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  let decoded;
  try {
    const { payload } = await jwtVerify(token, secret);
    decoded = payload;
  } catch (err) {
    console.error("❌ Invalid token:", err);
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const role = decoded?.role?.toLowerCase();

  // ✅ Role-based protection for /uni
  if (
    url.pathname.startsWith("/Uni") &&
    !["superadmin", "admin", "sm", "dsm", "gm"].includes(role)
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Uni/:path*"], // protect everything under /uni
};
