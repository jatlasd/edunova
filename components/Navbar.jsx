"use client";

import { useGlobalContext } from "@/lib/GlobalProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";
import { navLinks } from "@/constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuList,
  NavigationMenuLink, 
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn, logout, user } = useGlobalContext();

  return (
    <section className="h-20 w-full px-5">
      <nav className="flex h-full w-full items-center justify-between">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            width={40}
            height={40}
            alt="Horizon Logo"
          />
          <h1 className="ml-1.5 text-xl font-bold text-primary">EduNova</h1>
        </Link>
        <div className="mr-10 flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {navLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                  <Link
                    key={link.name}
                    href={link.route}
                    className={cn("nav-link", {
                      "nav-link-active": isActive,
                    })}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {user.role === "admin" || user.role === 'super' && (
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger
                        className={cn("nav-link", {
                          "nav-link-active":
                            pathname === "/manage" ||
                            pathname.startsWith("/manage"),
                        })}
                      >
                        Manage
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="w-[170px] gap-5 p-2">
                          <li className="manage-nav-link">
                            <NavigationMenuLink>
                              <a href="/manage/staff">Manage Staff</a>
                            </NavigationMenuLink>
                          </li>
                          <li className="manage-nav-link">
                            <NavigationMenuLink>
                              <a href="/manage/students">Manage Students</a>
                            </NavigationMenuLink>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              )}
              <button onClick={logout} className="nav-btn ml-10">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/sign-in">
              <button className="nav-btn">Sign In</button>
            </Link>
          )}
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
