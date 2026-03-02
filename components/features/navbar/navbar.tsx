import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import LinkButton from "@/components/ui/link-button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { stackServerApp } from "@/stack/server";
import { Routes } from "@/types";

export const Navbar: React.FC = async () => {
  const user = await stackServerApp.getUser();
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
                <>
                  <NavigationMenuItem>
                    <LinkButton href={Routes.NEW_ARTICLE} text="New Article" />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <UserButton />
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <LinkButton href={Routes.SIGNIN} text="Sign In" />
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <LinkButton href={Routes.SIGNUP} text="Sign Up" />
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
