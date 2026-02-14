"use client";
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";

interface SignOutButtonProps extends ButtonProps {}
export const SignOutButton: React.FC<SignOutButtonProps> = ({
  ...buttonProps
}) => {
  return (
    <Button
      nativeButton={false}
      variant={"outline"}
      size={"sm"}
      render={(props) => <Link href={"/signup"} {...props} />}
      {...buttonProps}
    >
      Sign Up
    </Button>
  );
};
