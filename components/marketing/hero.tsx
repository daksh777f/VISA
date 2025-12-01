
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, FileText, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const badgeRef = useRef(null);
    const ctaRef = useRef(null);
    const trustBadgesRef = useRef(null);
    const bgGradientRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Animated background gradient
        gsap.to(bgGradientRef.current, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        // Badge entrance with bounce
        tl.from(badgeRef.current, {
            y: -30,
            opacity: 0,
            scale: 0.8,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        // Headline stagger animation
        tl.from(".hero-headline", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
        }, "-=0.4");

        // Subheadline fade in
        tl.from(".hero-subheadline", {
            y: 30,
            opacity: 0,
            duration: 0.8,
        }, "-=0.5");

        // CTA buttons with scale
        tl.from(".hero-cta", {
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            stagger: 0.1,
        }, "-=0.4");

        // Trust badges with stagger
        tl.from(".trust-badge", {
            y: 20,
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            stagger: 0.1,
        }, "-=0.3");

        // Floating animation for badges
        gsap.to(".trust-badge", {
            y: -10,
            duration: 2,
            stagger: 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Parallax effect on scroll
        gsap.to(".hero-bg", {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative min-h-[800px] flex items-center justify-center overflow-hidden pt-16 pb-16">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 hero-bg">
                <Image
                    src="/images/hero-illustration.png"
                    alt="AI streamlining bureaucracy"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
            </div>

            {/* Animated Background Gradients */}
            <div
                ref={bgGradientRef}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-[120px] -z-10 mix-blend-screen"
            />

            <div className="container px-4 md:px-8 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">

                    {/* Text Content */}
                    <div ref={textRef} className="space-y-8">
                        {/* Badge */}
                        <div
                            ref={badgeRef}
                            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.5)] transition-all duration-300 cursor-pointer hover:scale-105"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]"></span>
                            Now supporting UK Global Talent & US H1B
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground drop-shadow-2xl">
                            <span className="hero-headline inline-block">Skip the Paperwork</span>{" "}
                            <br />
                            <span className="hero-headline inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                                Nightmare.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="hero-subheadline text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                            Get your visa approved on the first try. Our AI concierge validates documents,
                            identifies gaps, and manages your entire application timeline.
                        </p>

                        {/* CTA Buttons */}
                        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center pt-4">
                            <Button asChild size="lg" className="hero-cta h-14 px-10 text-lg rounded-full shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                                <Link href="/auth/signup">
                                    Start Free Application <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="hero-cta h-14 px-10 text-lg rounded-full backdrop-blur-sm bg-background/30 border-primary/20 hover:bg-background/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                                <Link href="#demo">
                                    Watch 2-min Demo
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div ref={trustBadgesRef} className="pt-12 flex flex-wrap justify-center gap-6 md:gap-12 text-sm md:text-base text-muted-foreground font-medium">
                            <div className="trust-badge flex items-center gap-2 bg-background/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5 hover:bg-background/60 hover:border-white/10 transition-all duration-300 cursor-pointer hover:scale-110">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span>0% Rejection Rate</span>
                            </div>
                            <div className="trust-badge flex items-center gap-2 bg-background/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5 hover:bg-background/60 hover:border-white/10 transition-all duration-300 cursor-pointer hover:scale-110">
                                <FileText className="h-5 w-5 text-blue-400" />
                                <span>1M+ Documents Validated</span>
                            </div>
                            <div className="trust-badge flex items-center gap-2 bg-background/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5 hover:bg-background/60 hover:border-white/10 transition-all duration-300 cursor-pointer hover:scale-110">
                                <ShieldCheck className="h-5 w-5 text-purple-400" />
                                <span>60-Day Guarantee</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
