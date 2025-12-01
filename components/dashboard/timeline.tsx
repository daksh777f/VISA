"use client";

import { Milestone } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    Circle,
    MapPin,
    Calendar,
    Plus
} from "lucide-react";
import { getMilestoneDaysInfo } from "@/lib/milestone-generator";

interface TimelineProps {
    milestones: Milestone[];
    onAddMilestone?: () => void;
    onEditMilestone?: (milestoneId: string) => void;
}

export function Timeline({ milestones, onAddMilestone, onEditMilestone }: TimelineProps) {
    const sortedMilestones = [...milestones].sort((a, b) => a.order - b.order);

    const getStatusIcon = (status: Milestone["status"]) => {
        switch (status) {
            case "COMPLETED":
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case "IN_PROGRESS":
                return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
            case "OVERDUE":
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case "PENDING":
                return <Circle className="h-5 w-5 text-muted-foreground" />;
            case "CANCELLED":
                return <Circle className="h-5 w-5 text-gray-400" />;
            default:
                return <Circle className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getStatusColor = (status: Milestone["status"]) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
            case "IN_PROGRESS":
                return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
            case "OVERDUE":
                return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
            case "PENDING":
                return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
            case "CANCELLED":
                return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
            default:
                return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (milestones.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                    <CardDescription>
                        No milestones yet. They will be created automatically when you submit your application.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Timeline & Milestones</CardTitle>
                    <CardDescription>
                        Track your application progress and important dates
                    </CardDescription>
                </div>
                {onAddMilestone && (
                    <Button onClick={onAddMilestone} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Milestone
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="relative space-y-6">
                    {}
                    <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-border" />

                    {sortedMilestones.map((milestone, index) => {
                        const daysInfo = getMilestoneDaysInfo(milestone);
                        const isLast = index === sortedMilestones.length - 1;

                        return (
                            <div key={milestone.id} className="relative pl-10">
                                {}
                                <div className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background border-2 border-border">
                                    {getStatusIcon(milestone.status)}
                                </div>

                                {}
                                <div
                                    className={`rounded-lg border p-4 transition-all hover:shadow-md cursor-pointer ${milestone.status === "COMPLETED" ? "bg-muted/30" : "bg-card"
                                        }`}
                                    onClick={() => onEditMilestone?.(milestone.id)}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-semibold">{milestone.label}</h4>
                                                <Badge variant="outline" className={getStatusColor(milestone.status)}>
                                                    {milestone.status.replace("_", " ")}
                                                </Badge>
                                                {!milestone.isAutoGenerated && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Custom
                                                    </Badge>
                                                )}
                                            </div>

                                            {milestone.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {milestone.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>
                                                        {milestone.actualDate
                                                            ? `Completed: ${formatDate(milestone.actualDate)}`
                                                            : `Planned: ${formatDate(milestone.plannedDate)}`
                                                        }
                                                    </span>
                                                </div>

                                                {milestone.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        <span>{milestone.location}</span>
                                                    </div>
                                                )}

                                                {!milestone.actualDate && daysInfo.daysRemaining !== undefined && (
                                                    <div className={`flex items-center gap-1 ${daysInfo.daysRemaining <= 7 ? "text-orange-500 font-medium" : ""
                                                        }`}>
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>
                                                            {daysInfo.daysRemaining === 0
                                                                ? "Today"
                                                                : daysInfo.daysRemaining === 1
                                                                    ? "Tomorrow"
                                                                    : `${daysInfo.daysRemaining} days`
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                {daysInfo.isOverdue && (
                                                    <div className="flex items-center gap-1 text-red-500 font-medium">
                                                        <AlertCircle className="h-3.5 w-3.5" />
                                                        <span>{daysInfo.daysOverdue} days overdue</span>
                                                    </div>
                                                )}
                                            </div>

                                            {milestone.requirementsChecklist && milestone.requirementsChecklist.length > 0 && (
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-xs font-medium text-muted-foreground">Requirements:</p>
                                                    <ul className="text-xs text-muted-foreground space-y-0.5 ml-4 list-disc">
                                                        {milestone.requirementsChecklist.map((req, i) => (
                                                            <li key={i}>{req}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {milestone.notes && (
                                                <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                                                    <span className="font-medium">Note: </span>
                                                    {milestone.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
