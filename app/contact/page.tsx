"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { Mail, MapPin, Phone } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.from(".animate-in", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
        });
    }, { scope: containerRef });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main ref={containerRef} className="flex-1 container py-12 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <div className="space-y-8 animate-in">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">Get in touch</h1>
                            <p className="text-muted-foreground text-lg">
                                Have questions about our AI visa concierge? We're here to help you navigate the bureaucracy.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 animate-in">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <p className="text-muted-foreground">support@redtapecutter.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 animate-in">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Phone</h3>
                                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 animate-in">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Office</h3>
                                    <p className="text-muted-foreground">123 Innovation Dr, Tech City, TC 90210</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <Card className="animate-in hover-card border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                            <CardDescription>We'll get back to you within 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                        <Input id="first-name" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                        <Input id="last-name" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                                </div>
                                <Button className="w-full hover-scale">Send Message</Button>
                            </form>
                        </CardContent>
                    </Card>

                </div>
            </main>
            <Footer />
        </div>
    );
}
