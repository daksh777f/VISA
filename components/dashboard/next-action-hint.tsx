"use client";

import { NextAction } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    Clock,
    Info,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

interface NextActionHintProps {
    nextAction: NextAction | null;
    onActionClick?: (action: string) => void;
}

export function NextActionHint({ nextAction, onActionClick }: NextActionHintProps) {
    if (!nextAction) {
        return null;
    }

    const getPriorityIcon = () => {
        switch (nextAction.priority) {
            case "HIGH":
                return <AlertCircle className="h-5 w-5" />;
            case "MEDIUM":
                return <Clock className="h-5 w-5" />;
            case "LOW":
                return <Info className="h-5 w-5" />;
            default:
                return <Info className="h-5 w-5" />;
        }
    };

    const getPriorityColor = () => {
        switch (nextAction.priority) {
            case "HIGH":
                return "border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10";
            case "MEDIUM":
                return "border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-amber-500/10";
            case "LOW":
                return "border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10";
            default:
                return "border-border bg-card";
        }
    };

    const getActionTypeIcon = () => {
        switch (nextAction.actionType) {
            case "USER_ACTION":
                return <ArrowRight className="h-4 w-4" />;
            case "WAITING":
                return <Clock className="h-4 w-4" />;
            case "INFORMATIONAL":
                return <CheckCircle2 className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getDaysUntilDue = () => {
        if (!nextAction.dueDate) return null;

        const now = new Date();
        const due = new Date(nextAction.dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
        } else if (diffDays === 0) {
            return { text: "Due today", isOverdue: false };
        } else if (diffDays === 1) {
            return { text: "Due tomorrow", isOverdue: false };
        } else {
            return { text: `${diffDays} days remaining`, isOverdue: false };
        }
    };

    const daysInfo = getDaysUntilDue();

    return (
        <Card className={`border-2 ${getPriorityColor()}`}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${nextAction.priority === "HIGH"
                            ? "bg-red-500/10 text-red-500"
                            : nextAction.priority === "MEDIUM"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-blue-500/10 text-blue-500"
                        }`}>
                        {getPriorityIcon()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-semibold">{nextAction.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                    {getActionTypeIcon()}
                                    <span className="ml-1">
                                        {nextAction.actionType.replace("_", " ")}
                                    </span>
                                </Badge>
                                {daysInfo && (
                                    <Badge
                                        variant={daysInfo.isOverdue ? "destructive" : "secondary"}
                                        className="text-xs"
                                    >
                                        {daysInfo.text}
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">
                                {nextAction.description}
                            </p>
                        </div>

                        {/* CTA Button */}
                        {nextAction.ctaLabel && nextAction.ctaAction && (
                            <Button
                                onClick={() => onActionClick?.(nextAction.ctaAction!)}
                                size="sm"
                                className={
                                    nextAction.priority === "HIGH"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : ""
                                }
                            >
                                {nextAction.ctaLabel}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
