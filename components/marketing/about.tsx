import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function About() {
    return (
        <section id="about" className="py-20">
            <div className="container px-4 md:px-8 mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            We're on a mission to democratize global mobility.
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Bureaucracy shouldn't be a barrier to talent. We built Red Tape Cutter to help
                            exceptional individuals navigate complex visa systems without the need for
                            expensive lawyers or confusing government websites.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Our AI-first approach ensures accuracy, speed, and affordability, giving you
                            the best chance of success.
                        </p>
                        <div className="pt-4">
                            <Button asChild variant="outline">
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                        <Image
                            src="/images/about-illustration-v2.png"
                            alt="About Red Tape Cutter"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
