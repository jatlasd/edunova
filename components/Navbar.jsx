// "use client";

// import { useGlobalContext } from "@/lib/GlobalProvider";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { cn } from "@lib/utils";
// import { navLinks } from "@/constants";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuTrigger,
//   NavigationMenuList,
//   NavigationMenuLink,
// } from "@/components/ui/navigation-menu";
// import AddTodoDialog from "./todos/AddTodoDialog";
// import WhatWasIDoingNow from "./todos/WhatWasIDoingNow";

// const Navbar = () => {
//   const pathname = usePathname();
//   const { isLoggedIn, logout, user } = useGlobalContext();

//   return (
//     <section className="h-20 w-full px-5">
//       <nav className="flex h-full w-full items-center justify-between">
//         <Link href="/" className="flex items-center justify-center">
//           <Image
//             src="/icons/logo.png"
//             width={40}
//             height={40}
//             alt="Horizon Logo"
//           />
//           <h1 className="ml-1.5 text-xl font-bold text-primary">EduNova</h1>
//         </Link>
//         <div className="mr-10 flex items-center gap-4">
//           {isLoggedIn ? (
//             <>
//               {navLinks.map((link) => {
//                 const isActive = pathname === link.route;
//                 return (
//                   <Link
//                     key={link.route}
//                     href={link.route}
//                     className={cn("nav-link", {
//                       "nav-link-active": isActive,
//                     })}
//                   >
//                     {link.label}
//                   </Link>
//                 );
//               })}
//               {user.role === "admin" ||
//                 (user.role === "super" && (
//                   <NavigationMenu>
//                     <NavigationMenuList>
//                       <NavigationMenuItem>
//                         <NavigationMenuTrigger
//                           className={cn("nav-link", {
//                             "nav-link-active":
//                               pathname === "/manage" ||
//                               pathname.startsWith("/manage"),
//                           })}
//                         >
//                           Manage
//                         </NavigationMenuTrigger>
//                         <NavigationMenuContent>
//                           <ul className="w-[170px] gap-5 p-2">
//                             <li className="manage-nav-link">
//                               <NavigationMenuLink asChild>
//                                 <a href="/manage/staff">Manage Staff</a>
//                               </NavigationMenuLink>
//                             </li>
//                             <li className="manage-nav-link">
//                               <NavigationMenuLink asChild>
//                                 <a href="/manage/students">Manage Students</a>
//                               </NavigationMenuLink>
//                             </li>
//                           </ul>
//                         </NavigationMenuContent>
//                       </NavigationMenuItem>
//                     </NavigationMenuList>
//                   </NavigationMenu>
//                 ))}

//               {/*          DELETE BEFORE PUBLISH  */}
//               <NavigationMenu>
//                 <NavigationMenuList>
//                   <NavigationMenuItem>
//                     <NavigationMenuTrigger
//                       className={cn("nav-link", {
//                         "nav-link-active":
//                           pathname === "/todos" ||
//                           pathname.startsWith("/todos"),
//                       })}
//                     >
//                       Todos
//                     </NavigationMenuTrigger>
//                     <NavigationMenuContent>
//                       <ul className="w-[170px] gap-5 p-2">
//                         <li className="manage-nav-link">
//                           <NavigationMenuLink asChild>
//                             <a href="/todos" className="">Todos List</a>
//                           </NavigationMenuLink>
//                         </li>
//                         <li className="manage-nav-link hover:bg-transparent">
//                           <AddTodoDialog />
//                         </li>
//                         <li className="manage-nav-link hover:bg-transparent">
//                           <AddTodoDialog type="bug"/>
//                         </li>
//                         <li className="manage-nav-link hover:bg-transparent">
//                           <WhatWasIDoingNow />
//                         </li>
//                       </ul>
//                     </NavigationMenuContent>
//                   </NavigationMenuItem>
//                 </NavigationMenuList>
//               </NavigationMenu>
//               {/*          DELETE BEFORE PUBLISH  */}

//               <button onClick={logout} className="nav-btn ml-10">
//                 Sign Out
//               </button>
//             </>
//           ) : (
//             <Link href="/sign-in">
//               <button className="nav-btn">Sign In</button>
//             </Link>
//           )}
//         </div>
//       </nav>
//     </section>
//   );
// };

// export default Navbar;

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
import AddTodoDialog from "./todos/AddTodoDialog";
import WhatWasIDoingNow from "./todos/WhatWasIDoingNow";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn, logout, user } = useGlobalContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const NavLinks = () => (
    <>
      {navLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={link.route}
            href={link.route}
            className={cn("nav-link", {
              "nav-link-active": isActive,
            })}
          >
            {link.label}
          </Link>
        );
      })}
      {(user.role === "admin" || user.role === "super") && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn("nav-link", {
                  "nav-link-active":
                    pathname === "/manage" || pathname.startsWith("/manage"),
                })}
              >
                Manage
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-[170px] gap-5 p-2">
                  <li className="manage-nav-link">
                    <NavigationMenuLink asChild>
                      <a href="/manage/staff">Manage Staff</a>
                    </NavigationMenuLink>
                  </li>
                  <li className="manage-nav-link">
                    <NavigationMenuLink asChild>
                      <a href="/manage/students">Manage Students</a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
      {/* DELETE ME */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn("nav-link", {
                "nav-link-active":
                  pathname === "/todos" || pathname.startsWith("/todos"),
              })}
            >
              Todos
            </NavigationMenuTrigger>
            <NavigationMenuContent className='bg-white-1'>
              <ul className="w-[170px] gap-5 p-2">
                <li className="manage-nav-link">
                  <NavigationMenuLink asChild>
                    <a href="/todos" className="">Todos List</a>
                  </NavigationMenuLink>
                </li>
                <li className="manage-nav-link hover:bg-transparent">
                  <AddTodoDialog />
                </li>
                <li className="manage-nav-link hover:bg-transparent">
                  <AddTodoDialog type="bug"/>
                </li>
                <li className="manage-nav-link hover:bg-transparent">
                  <WhatWasIDoingNow />
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* DELETE ME */}
    </>
  );

  return (
    <section className="w-full px-5">
      <nav className="flex h-20 w-full items-center justify-between">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/logo.png"
            width={40}
            height={40}
            alt="Horizon Logo"
          />
          <h1 className="ml-1.5 text-xl font-bold text-primary">EduNova</h1>
        </Link>
        <div className={cn("items-center gap-4", {
          "hidden": isMobile,
          "flex": !isMobile
        })}>
          {isLoggedIn ? (
            <>
              <NavLinks />
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
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent className='bg-white-1'>
              <div className="flex flex-col gap-4 py-4">
                {isLoggedIn ? (
                  <>
                    <NavLinks />
                    <button onClick={logout} className="nav-btn w-full">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/sign-in" className="w-full">
                    <button className="nav-btn w-full">Sign In</button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </nav>
    </section>
  );
};

export default Navbar;