"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApplication } from "@/components/dashboard/application-context";
import { AlertTriangle, CheckCircle2, Lightbulb, ArrowRight, Loader2, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { generateGapAnalysisReport } from "@/app/actions/generate-report";

export function GapAnalysisTab() {
    const { gapAnalysis, documents } = useApplication();
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReport(null);

        try {
            const result = await generateGapAnalysisReport(gapAnalysis, documents);
            if (result.success && result.report) {
                setReport(result.report);
                setIsOpen(true);
            } else {
                console.error("Report generation failed", result.error);
            }
        } catch (error) {
            console.error("Error generating report", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Readiness Score</span>
                        <span className="text-2xl font-bold text-primary">{gapAnalysis.score}%</span>
                    </CardTitle>
                    <CardDescription>Based on the documents you've uploaded so far.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Progress value={gapAnalysis.score} className="h-3" />
                    <p className="mt-2 text-sm text-muted-foreground">
                        You need a score of at least 80% to have a strong chance of endorsement.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Missing Documents
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {gapAnalysis.missingDocuments.length > 0 ? (
                        <ul className="space-y-3">
                            {gapAnalysis.missingDocuments.map((doc, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                                    {doc}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                            <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                            <p>All required documents uploaded!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        AI Recommendations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {gapAnalysis.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                                <ArrowRight className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleGenerateReport}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating Report...
                                        </>
                                    ) : (
                                        "Generate Detailed Report"
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                                <DialogHeader className="pb-6 border-b border-border/50">
                                    <DialogTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        Gap Analysis Report
                                    </DialogTitle>
                                    <DialogDescription className="text-base mt-2">
                                        AI-generated assessment of your current application status
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto py-8 px-2">
                                    <div className="max-w-3xl mx-auto space-y-8">
                                        {report?.split('\n\n').map((section, idx) => {
                                            const isHeading = section.trim().startsWith('#');
                                            const headingLevel = section.match(/^#+/)?.[0].length || 0;
                                            const content = section.replace(/^#+\s*/, '');

                                            if (isHeading && headingLevel === 1) {
                                                return (
                                                    <div key={idx} className="space-y-3">
                                                        <h2 className="text-2xl font-bold text-foreground tracking-tight">
                                                            {content}
                                                        </h2>
                                                        <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                                                    </div>
                                                );
                                            }

                                            if (isHeading && headingLevel === 2) {
                                                return (
                                                    <div key={idx} className="pt-6">
                                                        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            {content}
                                                        </h3>
                                                    </div>
                                                );
                                            }

                                            if (section.trim().startsWith('-') || section.trim().match(/^\d+\./)) {
                                                return (
                                                    <div key={idx} className="bg-muted/30 rounded-xl p-6 space-y-4">
                                                        {section.split('\n').filter(line => line.trim()).map((line, i) => (
                                                            <div key={i} className="flex gap-4 text-base leading-relaxed">
                                                                <span className="text-primary mt-1.5 shrink-0 font-bold">•</span>
                                                                <span className="text-muted-foreground">{line.replace(/^[-\d.]\s*/, '')}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }

                                            if (content.trim()) {
                                                return (
                                                    <p key={idx} className="text-base leading-relaxed text-muted-foreground">
                                                        {content}
                                                    </p>
                                                );
                                            }

                                            return null;
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-border/50 mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        Generated by AI • {new Date().toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={() => {
                                            const blob = new Blob([report || ''], { type: 'text/markdown' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `gap-analysis-report-${Date.now()}.md`;
                                            a.click();
                                            URL.revokeObjectURL(url);
                                        }}
                                    >
                                        <FileText className="h-4 w-4" />
                                        Download Report
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
