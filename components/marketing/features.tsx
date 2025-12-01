"use client";

import { useRef } from "react";
import {
    Clock,
    FileCheck,
    Globe2,
    ShieldAlert,
    Sparkles,
    Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: Sparkles,
        title: "Smart Gap Analysis",
        description: "Our AI scans your profile against visa criteria to identify exactly what's missing.",
        color: "from-yellow-400 to-orange-500"
    },
    {
        icon: FileCheck,
        title: "Format Perfection",
        description: "Automated validation ensures your documents meet strict government formatting rules.",
        color: "from-green-400 to-emerald-500"
    },
    {
        icon: Clock,
        title: "Timeline Guardian",
        description: "Never miss a deadline. We track every milestone and alert you before it's too late.",
        color: "from-blue-400 to-cyan-500"
    },
    {
        icon: Zap,
        title: "Real-time Validation",
        description: "Get instant feedback on your documents. Fix issues in minutes, not weeks.",
        color: "from-purple-400 to-pink-500"
    },
    {
        icon: Globe2,
        title: "Multi-Visa Support",
        description: "Templates for UK Global Talent, US H1B, Canada Express Entry, and more.",
        color: "from-indigo-400 to-violet-500"
    },
    {
        icon: ShieldAlert,
        title: "Human Escalation",
        description: "Stuck? One-click escalation to human experts for complex edge cases.",
        color: "from-red-400 to-rose-500"
    },
];

export function Features() {
    const containerRef = useRef(null);
    const headerRef = useRef(null);

    useGSAP(() => {
        
        gsap.from(headerRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        gsap.from(".feature-card", {
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        gsap.to(".feature-icon", {
            rotation: 360,
            duration: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 60%",
                end: "bottom 40%",
                scrub: 2
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} id="features" className="py-20 bg-secondary/30 relative overflow-hidden">
            {}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container px-4 md:px-8 mx-auto relative z-10">
                {}
                <div ref={headerRef} className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md mb-4">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Powered by AI
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Everything You Need,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                            Nothing You Don't
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Built for speed, designed for success. Our AI handles the complexity so you don't have to.
                    </p>
                </div>

                {}
                <div className="features-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="feature-card group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] hover:-translate-y-2 cursor-pointer"
                        >
                            {}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <CardHeader className="relative flex flex-row items-center gap-4">
                                <div className={`feature-icon inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-background/95">
                                        <feature.icon className="h-6 w-6 text-foreground" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <CardDescription className="text-base leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>

                            {}
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${feature.color} blur-xl opacity-20`} />
                            </div>
                        </Card>
                    ))}
                </div>

                {}
                <div className="text-center pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-lg text-muted-foreground mb-4">
                        Ready to experience the future of visa applications?
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300 cursor-pointer group">
                        <span>Explore all features</span>
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </section>
    );
}
