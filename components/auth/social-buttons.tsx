"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Chrome } from "lucide-react";

export function SocialButtons() {
    return (
        <div className="grid gap-2">
            <Button
                variant="outline"
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="w-full"
            >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
            </Button>
        </div>
    );
}
