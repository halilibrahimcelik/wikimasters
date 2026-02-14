import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SignOutButton } from "./signup-button";
import { SignInButton } from "./signin-button";
import { stackServerApp } from "@/stack/server";
import { UserButton } from "@stackframe/stack";

export const Navbar: React.FC = async () => {
  const user = await stackServerApp.getUser();
  console.log(user);
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
              {user ? (
                <NavigationMenuItem>
                  <UserButton />
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <SignOutButton />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <SignInButton />
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};
