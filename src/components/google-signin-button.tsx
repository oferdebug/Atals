"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    setIsPending(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
      className="w-full bg-transparent text-white border-white/30 hover:bg-white hover:text-primary"
    >
      {isPending ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
