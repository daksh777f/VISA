import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export function TimelineDemo() {
    const steps = [
        { status: "completed", title: "Profile Analysis", date: "Day 1" },
        { status: "completed", title: "Document Upload", date: "Day 3" },
        { status: "active", title: "AI Validation", date: "Day 3" },
        { status: "upcoming", title: "Gap Resolution", date: "Day 5" },
        { status: "upcoming", title: "Final Review", date: "Day 7" },
        { status: "upcoming", title: "Submission", date: "Day 10" },
    ];

    return (
        <section id="how-it-works" className="py-20 overflow-hidden">
            <div className="container px-4 md:px-8 mx-auto">
                <div className="flex flex-col items-center text-center space-y-8 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Your 60-Day Path to Approval
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Visualize your entire journey. We break down complex visa processes into
                        manageable, trackable milestones.
                    </p>
                </div>

                {}
                <div className="relative max-w-5xl mx-auto">
                    {}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10" />

                    <Card className="p-6 md:p-10 border-border/50 shadow-2xl bg-card/80 backdrop-blur">
                        {}
                        <div className="flex items-center justify-between mb-12 border-b pb-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">UK Global Talent Visa</h3>
                                <p className="text-sm text-muted-foreground">Application ID: #UK-GT-2024-882</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                <Clock className="h-4 w-4" />
                                <span>On Track: 57 Days Remaining</span>
                            </div>
                        </div>

                        {}
                        <div className="relative">
                            {}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 hidden md:block" />
                            <div className="absolute top-1/2 left-0 w-[40%] h-1 bg-primary -translate-y-1/2 hidden md:block" />

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex md:flex-col items-center gap-4 md:gap-4 md:text-center z-10">
                                        {}
                                        <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center border-4 
                      ${step.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' :
                                                step.status === 'active' ? 'bg-background border-primary text-primary animate-pulse' :
                                                    'bg-background border-secondary text-muted-foreground'}
                    `}>
                                            {step.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                                                step.status === 'active' ? <div className="h-3 w-3 bg-primary rounded-full" /> :
                                                    <Circle className="h-5 w-5" />}
                                        </div>

                                        {}
                                        <div className="flex-1 md:flex-none">
                                            <p className={`font-medium ${step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{step.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {}
                        <div className="mt-12 max-w-md mx-auto">
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-4">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-primary">Current Action Required</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        AI is validating your &quot;Letter of Recommendation 1&quot;. Estimated completion: 2 mins.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
