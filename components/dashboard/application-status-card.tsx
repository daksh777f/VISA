"use client";

import { Application } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusLabel, getStatusColor } from "@/lib/application-status-manager";
import { Calendar, FileCheck, Clock, AlertCircle } from "lucide-react";

interface ApplicationStatusCardProps {
    application: Application;
}

export function ApplicationStatusCard({ application }: ApplicationStatusCardProps) {
    const statusColors = getStatusColor(application.lifecycleStatus);

    const formatDate = (date?: Date) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getDaysUntilDecision = () => {
        if (!application.expectedDecisionDate) return null;

        const now = new Date();
        const expected = new Date(application.expectedDecisionDate);
        const diffTime = expected.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: `${Math.abs(diffDays)} days overdue`, isOverdue: true };
        } else if (diffDays === 0) {
            return { text: "Expected today", isOverdue: false };
        } else {
            return { text: `${diffDays} days remaining`, isOverdue: false };
        }
    };

    const daysInfo = getDaysUntilDecision();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Application Status</CardTitle>
                    <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                        {getStatusLabel(application.lifecycleStatus)}
                    </Badge>
                </div>
                <CardDescription>
                    Last updated: {formatDate(application.lastStatusUpdate || application.updatedAt)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    {}
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium">Created</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(application.createdAt)}
                            </p>
                        </div>
                    </div>

                    {}
                    {application.submittedAt && (
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                                <FileCheck className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">Submitted</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(application.submittedAt)}
                                </p>
                                {application.submissionMethod && (
                                    <p className="text-xs text-muted-foreground">
                                        via {application.submissionMethod}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {}
                    {application.expectedDecisionDate && (
                        <div className="flex items-start gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${daysInfo?.isOverdue ? "bg-red-500/10" : "bg-amber-500/10"
                                }`}>
                                <Clock className={`h-4 w-4 ${daysInfo?.isOverdue ? "text-red-500" : "text-amber-500"
                                    }`} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">Expected Decision</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(application.expectedDecisionDate)}
                                </p>
                                {daysInfo && (
                                    <p className={`text-xs font-medium ${daysInfo.isOverdue ? "text-red-500" : "text-amber-600"
                                        }`}>
                                        {daysInfo.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {}
                    {application.decisionAt && (
                        <div className="flex items-start gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${application.decisionType === "APPROVED" ? "bg-emerald-500/10" : "bg-red-500/10"
                                }`}>
                                {application.decisionType === "APPROVED" ? (
                                    <FileCheck className="h-4 w-4 text-emerald-500" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">Decision</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(application.decisionAt)}
                                </p>
                                <p className={`text-xs font-medium ${application.decisionType === "APPROVED" ? "text-emerald-600" : "text-red-600"
                                    }`}>
                                    {application.decisionType}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {}
                {application.portalReferenceNumber && (
                    <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Portal Reference Number</p>
                        <p className="text-sm font-mono">{application.portalReferenceNumber}</p>
                    </div>
                )}

                {}
                {application.completionScore !== undefined && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Document Completion</span>
                            <span className={`font-semibold ${application.completionScore === 100 ? "text-green-500" : "text-amber-500"
                                }`}>
                                {application.completionScore}%
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                className={`h-full transition-all ${application.completionScore === 100
                                        ? "bg-green-500"
                                        : "bg-amber-500"
                                    }`}
                                style={{ width: `${application.completionScore}%` }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
