"use client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const Navbar: React.FC = () => {
  return (
    <nav
      className="w-full border-b bg-white backdrop-blur 
  supports-backdrop-filter:bg-white/20 sticky top-0 z-50"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-between w-full gap-2">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-shadow-gray-900"
          >
            WikiMasters
          </Link>
          <NavigationMenu>
            <NavigationMenuList className={"gap-2"}>
              <NavigationMenuItem>
                <Link
                  href={"sign-in"}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Sign-in
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={"sign-up"}
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Sign Up
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
