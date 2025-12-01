"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Menu, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { useSession } from "next-auth/react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span>Red Tape Cutter</span>
                    </Link>
                </div>

                {}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="#features" className="transition-colors hover:text-primary">Features</Link>
                    <Link href="#how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
                    <Link href="#pricing" className="transition-colors hover:text-primary">Pricing</Link>
                    <Link href="#about" className="transition-colors hover:text-primary">About</Link>
                </nav>

                {}
                <div className="hidden md:flex items-center gap-4">
                    {!isLoading && session ? (
                        <Button asChild size="sm">
                            <Link href="/dashboard">Go to Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
                                Sign In
                            </Link>
                            <Button asChild size="sm">
                                <Link href="/auth/signup">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                {}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background p-4 space-y-4">
                    <nav className="flex flex-col gap-4 text-sm font-medium">
                        <Link href="#features" onClick={() => setIsMenuOpen(false)}>Features</Link>
                        <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How it Works</Link>
                        <Link href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                        <Link href="#about" onClick={() => setIsMenuOpen(false)}>About</Link>
                        {!isLoading && session ? (
                            <Button asChild className="w-full">
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>Go to Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                                <Button asChild className="w-full">
                                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
