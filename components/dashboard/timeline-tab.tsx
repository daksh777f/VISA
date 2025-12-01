"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApplication } from "@/components/dashboard/application-context";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export function TimelineTab() {
    const { timeline } = useApplication();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
                <CardDescription>Track your progress towards the Global Talent Visa.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-8 pl-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-20px)] before:w-[2px] before:bg-border">
                    {timeline.map((event, index) => (
                        <div key={event.id} className="relative">
                            <div className={`absolute -left-[37px] top-1 flex h-6 w-6 items-center justify-center rounded-full border ${event.status === "completed" ? "bg-primary border-primary text-primary-foreground" :
                                    event.status === "current" ? "bg-background border-primary text-primary ring-4 ring-primary/20" :
                                        "bg-background border-muted-foreground/30 text-muted-foreground"
                                }`}>
                                {event.status === "completed" && <CheckCircle2 className="h-4 w-4" />}
                                {event.status === "current" && <Circle className="h-3 w-3 fill-current" />}
                                {event.status === "upcoming" && <Circle className="h-3 w-3" />}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-semibold leading-none ${event.status === "upcoming" ? "text-muted-foreground" : ""}`}>
                                        {event.title}
                                    </h4>
                                    {event.status === "current" && (
                                        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                            Current Stage
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {event.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
