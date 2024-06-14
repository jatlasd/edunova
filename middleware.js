import { NextResponse } from "next/server";

export const middleware = async (req) => {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("userToken");

  console.log("Cookie value:", cookie.value);
  if (!cookie) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  let userData;
  try {
    userData = JSON.parse(cookie.value);
  } catch (error) {
    console.error("Error parsing cookie:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const { id, role } = userData;

  console.log("User role:", role);

  const protectedRoutes = {
    "/manage": ["admin", "super"],
  };

  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];

      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/manage",
};
