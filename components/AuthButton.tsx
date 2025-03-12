"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Button disabled>Loading...</Button>;
  }

  if (session) {
    return (
      <Button variant="outline" onClick={() => signOut()}>
        Sign Out
      </Button>
    );
  }

  return (
    <Button onClick={() => signIn("auth0")}>
      Sign In
    </Button>
  );
} 