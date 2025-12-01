"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useApplication } from "@/components/dashboard/application-context";
import { DocumentsTab } from "@/components/dashboard/documents-tab";
import { TimelineTab } from "@/components/dashboard/timeline-tab";
import { GapAnalysisTab } from "@/components/dashboard/gap-analysis-tab";
import { ReadyToSubmitPanel } from "@/components/dashboard/ready-to-submit-panel";
import { Timeline } from "@/components/dashboard/timeline";
import { NextActionHint } from "@/components/dashboard/next-action-hint";
import { ApplicationStatusCard } from "@/components/dashboard/application-status-card";
import { StatusNotesPanel } from "@/components/dashboard/status-notes-panel";
import { getStatusLabel, getStatusColor } from "@/lib/application-status-manager";
import { use } from "react";

function DashboardContent({ id }: { id: string }) {
    const {
        documents,
        gapAnalysis,
        lifecycleStatus,
        milestones,
        nextAction,
        userNotes,
        updateLifecycleStatus,
        saveNotes
    } = useApplication();

    // Calculate stats based on real data
    const uploadedCount = documents.length;
    const validCount = documents.filter(d => d.status === "valid").length;
    const pendingCount = documents.filter(d => d.status === "pending" || d.status === "analyzing").length;
    const issuesCount = documents.filter(d => d.status === "invalid").length + gapAnalysis.qualityIssues.length;

    // Mock application data for status card
    const mockApplication = {
        id,
        userId: "user1",
        visaType: "uk_global_talent" as const,
        status: "STAGE_1" as const,
        stage: 1 as const,
        createdAt: new Date("2024-10-20"),
        updatedAt: new Date(),
        isPausedAtStage1: false,
        lifecycleStatus,
        completionScore: gapAnalysis.score,
    };

    const statusColors = getStatusColor(lifecycleStatus);

    const handleSubmit = async (data: {
        submittedAt: Date;
        portalReferenceNumber?: string;
        submissionNotes?: string;
    }) => {
        await updateLifecycleStatus("SUBMITTED_WAITING", data);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-bold tracking-tight">UK Global Talent Visa</h2>
                        <Badge className={`${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                            {getStatusLabel(lifecycleStatus)}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">Application ID: #{id} · Tech Nation Endorsement</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const tabsList = document.querySelector('[role="tablist"]');
                            const timelineTab = document.querySelector('[value="timeline"]') as HTMLElement;
                            timelineTab?.click();
                            tabsList?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        View Timeline
                    </Button>
                    <Button
                        onClick={() => {
                            const documentsTab = document.querySelector('[value="documents"]') as HTMLElement;
                            documentsTab?.click();
                        }}
                    >
                        Upload Documents
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="gap-analysis">Gap Analysis</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{gapAnalysis.score}%</div>
                                <Progress value={gapAnalysis.score} className="mt-2 h-2" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">57</div>
                                <p className="text-xs text-muted-foreground">Target: 60 days</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{uploadedCount}</div>
                                <p className="text-xs text-muted-foreground">{pendingCount} pending validation</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Issues</CardTitle>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{issuesCount}</div>
                                <p className="text-xs text-muted-foreground">{issuesCount === 0 ? "All checks passed" : "Requires attention"}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* NEW: Ready to Submit Panel (when score = 100% and READY_TO_SUBMIT) */}
                    {lifecycleStatus === "READY_TO_SUBMIT" && (
                        <ReadyToSubmitPanel
                            applicationId={id}
                            visaType="uk_global_talent"
                            onSubmit={handleSubmit}
                        />
                    )}

                    {/* NEW: Next Action Hint (always show if available) */}
                    {nextAction && (
                        <NextActionHint
                            nextAction={nextAction}
                            onActionClick={(action) => {
                                console.log("Action clicked:", action);
                                // Handle different actions
                                if (action === "UPLOAD_DOCS" || action === "UPLOAD_ADDITIONAL_DOCS") {
                                    const documentsTab = document.querySelector('[value="documents"]') as HTMLElement;
                                    documentsTab?.click();
                                } else if (action === "MARK_SUBMITTED") {
                                    // Already handled by ReadyToSubmitPanel
                                }
                            }}
                        />
                    )}

                    {/* NEW: Timeline (show after submission) */}
                    {lifecycleStatus !== "DOCUMENTS_IN_PROGRESS" && lifecycleStatus !== "READY_TO_SUBMIT" && milestones.length > 0 && (
                        <Timeline milestones={milestones} />
                    )}

                    {/* NEW: Application Status Card and Notes (show after submission) */}
                    {lifecycleStatus !== "DOCUMENTS_IN_PROGRESS" && lifecycleStatus !== "READY_TO_SUBMIT" && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <ApplicationStatusCard application={mockApplication} />
                            <StatusNotesPanel
                                applicationId={id}
                                initialNotes={userNotes}
                                onSave={saveNotes}
                            />
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Gap Analysis Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <GapAnalysisTab />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TimelineTab />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="timeline">
                    <TimelineTab />
                </TabsContent>
                <TabsContent value="documents">
                    <DocumentsTab />
                </TabsContent>
                <TabsContent value="gap-analysis">
                    <GapAnalysisTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return <DashboardContent id={id} />;
}
