import { StatsCards } from "@/components/dashboard/stats-cards";
import { AppCard } from "@/components/dashboard/app-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const applications = [
    {
        id: "1",
        title: "UK Global Talent Visa",
        description: "Tech Nation Endorsement",
        status: "In Progress",
        stage: "Stage 1",
        progress: 65,
        nextMilestone: "Document Review",
        dueDate: "Nov 24, 2024"
    },
    {
        id: "2",
        title: "US O-1 Visa",
        description: "Extraordinary Ability",
        status: "Pending",
        stage: "Stage 2",
        progress: 45,
        nextMilestone: "Evidence Collection",
        dueDate: "Dec 15, 2024"
    },
    {
        id: "3",
        title: "Canada Express Entry",
        description: "Federal Skilled Worker",
        status: "In Progress",
        stage: "Stage 1",
        progress: 80,
        nextMilestone: "Language Test",
        dueDate: "Jan 10, 2025"
    }
];

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground">
                        Welcome back! Here&apos;s what&apos;s happening with your applications.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/application/new">
                        <Plus className="mr-2 h-4 w-4" /> New Application
                    </Link>
                </Button>
            </div>

            <StatsCards />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                    <AppCard key={app.id} {...app} />
                ))}

                {}
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Create new application</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Start a new visa application process.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/application/new">
                            Get Started
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
