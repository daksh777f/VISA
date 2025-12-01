"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, Check } from "lucide-react";

interface StatusNotesPanelProps {
    applicationId: string;
    initialNotes?: string;
    onSave: (notes: string) => Promise<void>;
}

export function StatusNotesPanel({ applicationId, initialNotes = "", onSave }: StatusNotesPanelProps) {
    const [notes, setNotes] = useState(initialNotes);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setNotes(initialNotes);
    }, [initialNotes]);

    useEffect(() => {
        setHasChanges(notes !== initialNotes);
    }, [notes, initialNotes]);

    useEffect(() => {
        if (!hasChanges) return;

        const timer = setTimeout(async () => {
            await handleSave();
        }, 2000);

        return () => clearTimeout(timer);
    }, [notes, hasChanges]);

    const handleSave = async () => {
        if (!hasChanges || isSaving) return;

        setIsSaving(true);
        try {
            await onSave(notes);
            setLastSaved(new Date());
            setHasChanges(false);
        } catch (error) {
            console.error("Error saving notes:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const getLastSavedText = () => {
        if (!lastSaved) return null;

        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

        if (diffSeconds < 60) {
            return "Saved just now";
        } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            return `Saved ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        } else {
            return `Saved at ${lastSaved.toLocaleTimeString()}`;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Notes</CardTitle>
                        <CardDescription>
                            Keep track of important information and updates
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <Badge variant="secondary" className="text-xs">
                                <Save className="h-3 w-3 mr-1 animate-pulse" />
                                Saving...
                            </Badge>
                        )}
                        {!isSaving && lastSaved && !hasChanges && (
                            <Badge variant="secondary" className="text-xs text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                {getLastSavedText()}
                            </Badge>
                        )}
                        {hasChanges && !isSaving && (
                            <Badge variant="outline" className="text-xs">
                                Unsaved changes
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about your application... (e.g., 'Called embassy on 12/1, they said processing might take 2 extra weeks')"
                    className="min-h-[150px] resize-y"
                    maxLength={2000}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{notes.length} / 2000 characters</span>
                    {hasChanges && (
                        <span className="text-amber-600">
                            Changes will auto-save in a moment...
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
