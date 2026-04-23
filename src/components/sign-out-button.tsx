"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }

  return (
<Button
  variant="outline"
  onClick={handleSignOut}
  className="bg-transparent text-white border-white/30 hover:bg-white hover:text-primary"
>
        Sign out
    </Button>
  );
}
