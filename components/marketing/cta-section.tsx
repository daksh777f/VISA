import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-24 relative overflow-hidden">
            {}
            <div className="absolute inset-0 bg-primary/5 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="container px-4 md:px-8 mx-auto text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
                    Ready to get your visa approved?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of applicants who skipped the paperwork nightmare.
                    Start your free gap analysis today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="h-12 px-8 text-base">
                        <Link href="/auth/signup">
                            Start Free Application <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background">
                        <Link href="/contact">
                            Schedule Demo
                        </Link>
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    No credit card required · Free initial assessment · Cancel anytime
                </p>
            </div>
        </section>
    );
}
