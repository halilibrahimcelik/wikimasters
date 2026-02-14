"use client";
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";
import { Routes } from "@/types";

interface SignInButtonProps extends ButtonProps {}
export const SignInButton: React.FC<SignInButtonProps> = ({
  ...buttonProps
}) => {
  return (
    <Button
      nativeButton={false}
      variant={"default"}
      size={"sm"}
      render={(props) => <Link href={Routes.SIGNIN} {...props} />}
      {...buttonProps}
    >
      Sign In
    </Button>
  );
};
