"use client";
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";

interface LinkButtonProps extends ButtonProps {
  href: string;
  text: string;
}
const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  text,
  ...buttonProps
}) => {
  return (
    <Button
      nativeButton={false}
      variant={"default"}
      size={"sm"}
      render={(props) => <Link href={href} {...props} />}
      {...buttonProps}
    >
      {text}
    </Button>
  );
};

export default LinkButton;
