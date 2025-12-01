import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-secondary/20">
            <div className="container px-4 md:px-8 mx-auto">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                        No hidden fees. No hourly rates. Just one flat fee for your peace of mind.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {}
                    <Card className="flex flex-col border-border/50">
                        <CardHeader>
                            <CardTitle>Starter</CardTitle>
                            <CardDescription>Perfect for initial assessment</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-6">$0</div>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Profile Scan</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Visa Eligibility Check</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1 Document Analysis</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </CardFooter>
                    </Card>

                    {}
                    <Card className="flex flex-col border-primary shadow-lg scale-105 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                            Most Popular
                        </div>
                        <CardHeader>
                            <CardTitle>Pro Application</CardTitle>
                            <CardDescription>Everything you need to apply</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-6">$299</div>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Full Gap Analysis</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Document Validation</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Personal Action Plan</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 AI Concierge</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Money-back Guarantee</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Start Application</Button>
                        </CardFooter>
                    </Card>

                    {}
                    <Card className="flex flex-col border-border/50">
                        <CardHeader>
                            <CardTitle>Premium Support</CardTitle>
                            <CardDescription>For complex cases requiring experts</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-3xl font-bold mb-6">$999</div>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Everything in Pro</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1-on-1 Human Expert Review</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Interview Preparation</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
