"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { Bell, CheckCircle2, AlertTriangle, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
    {
        id: 1,
        title: "Visa Application Update",
        description: "Your UK Global Talent application has moved to the 'Review' stage.",
        time: "2 hours ago",
        type: "success",
        read: false,
    },
    {
        id: 2,
        title: "Document Analysis Complete",
        description: "We've finished analyzing your Resume_2024.pdf. 3 gaps identified.",
        time: "1 day ago",
        type: "info",
        read: true,
    },
    {
        id: 3,
        title: "Action Required: Missing Document",
        description: "Please upload your University Transcript to proceed.",
        time: "2 days ago",
        type: "warning",
        read: true,
    },
    {
        id: 4,
        title: "Welcome to Red Tape Cutter!",
        description: "Get started by creating your first visa application.",
        time: "1 week ago",
        type: "info",
        read: true,
    },
];

export default function NotificationsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-12 md:py-24 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-muted-foreground">
                                Stay updated on your application progress.
                            </p>
                        </div>
                        <Button variant="outline" size="sm">Mark all as read</Button>
                    </div>

                    <div className="grid gap-4">
                        {notifications.map((notification) => (
                            <Card key={notification.id} className={`border-border/50 hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}>
                                <CardContent className="p-4 flex gap-4 items-start">
                                    <div className={`mt-1 p-2 rounded-full shrink-0 
                                        ${notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                            notification.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-blue-500/10 text-blue-500'}`}>
                                        {notification.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                                        {notification.type === 'warning' && <AlertTriangle className="h-5 w-5" />}
                                        {notification.type === 'info' && <Info className="h-5 w-5" />}
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-medium leading-none ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {notification.description}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
