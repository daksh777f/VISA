"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, ExternalLink, Calendar, FileText, Loader2 } from "lucide-react";

interface ReadyToSubmitPanelProps {
    applicationId: string;
    visaType: string;
    onSubmit: (data: {
        submittedAt: Date;
        portalReferenceNumber?: string;
        submissionNotes?: string;
    }) => Promise<void>;
}

export function ReadyToSubmitPanel({ applicationId, visaType, onSubmit }: ReadyToSubmitPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submissionDate, setSubmissionDate] = useState(new Date().toISOString().split('T')[0]);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await onSubmit({
                submittedAt: new Date(submissionDate),
                portalReferenceNumber: referenceNumber || undefined,
                submissionNotes: notes || undefined,
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Error submitting:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get portal URL based on visa type (placeholder)
    const getPortalUrl = () => {
        const portals: Record<string, string> = {
            uk_global_talent: "https://www.gov.uk/global-talent",
            us_h1b: "https://www.uscis.gov/",
            canada_express_entry: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
        };
        return portals[visaType] || "#";
    };

    return (
        <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <CardTitle className="text-2xl md:text-3xl">All Documents Validated!</CardTitle>
                <CardDescription className="text-base">
                    Your application is complete and ready to submit to the official portal.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Next Steps:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-6">
                        <li>Go to the official portal and create your application</li>
                        <li>Upload your validated documents from this platform</li>
                        <li>Submit your application and get a reference number</li>
                        <li>Return here and click "Mark as Submitted" below</li>
                    </ol>
                </div>

                <Button asChild variant="outline" className="w-full">
                    <a href={getPortalUrl()} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Official Portal
                    </a>
                </Button>
            </CardContent>

            <CardFooter>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="w-full">
                            Mark as Submitted
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Submission</DialogTitle>
                            <DialogDescription>
                                Please provide details about your submission to the official portal.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="submission-date">
                                    Submission Date <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="submission-date"
                                        type="date"
                                        value={submissionDate}
                                        onChange={(e) => setSubmissionDate(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reference-number">
                                    Portal Reference Number (Optional)
                                </Label>
                                <Input
                                    id="reference-number"
                                    placeholder="e.g., APP-2024-123456"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">
                                    Notes (Optional)
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Any additional notes about your submission..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading || !submissionDate}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Confirm Submission"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
