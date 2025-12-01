"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Milestone, ApplicationLifecycleStatus, NextAction, Application } from "@/types";
import { generateNextAction } from "@/lib/next-action-generator";
import { updateMilestoneStatus } from "@/lib/milestone-generator";

export type DocumentStatus = "pending" | "analyzing" | "valid" | "invalid";

export interface Document {
    id: string;
    name: string;
    type: string;
    status: DocumentStatus;
    uploadDate: string;
    analysisResult?: {
        valid: boolean;
        issues: string[];
        extractedData?: any;
    };
}

export interface TimelineEvent {
    id: string;
    title: string;
    date: string;
    status: "completed" | "current" | "upcoming";
    description?: string;
}

export interface GapAnalysis {
    missingDocuments: string[];
    qualityIssues: string[];
    recommendations: string[];
    score: number;
}

interface ApplicationContextType {
    // Existing
    documents: Document[];
    timeline: TimelineEvent[];
    gapAnalysis: GapAnalysis;
    addDocument: (file: File) => Promise<void>;
    analyzeDocument: (docId: string) => Promise<void>;
    refreshGapAnalysis: () => void;

    // NEW: Lifecycle management
    lifecycleStatus: ApplicationLifecycleStatus;
    milestones: Milestone[];
    nextAction: NextAction | null;
    userNotes: string;

    // NEW: Actions
    updateLifecycleStatus: (
        status: ApplicationLifecycleStatus,
        data?: Partial<Application>
    ) => Promise<void>;
    createMilestone: (milestone: Partial<Milestone>) => Promise<void>;
    updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
    deleteMilestone: (milestoneId: string) => Promise<void>;
    saveNotes: (notes: string) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export function ApplicationProvider({ children }: { children: ReactNode }) {
    const [documents, setDocuments] = useState<Document[]>([
        // Initial mock data to start with (can be empty)
        { id: "1", name: "resume_2024.pdf", type: "CV", status: "valid", uploadDate: "2024-10-24" },
    ]);

    const [timeline, setTimeline] = useState<TimelineEvent[]>([
        { id: "1", title: "Application Created", date: "2024-10-20", status: "completed", description: "Initial setup" },
        { id: "2", title: "CV Validated", date: "2024-10-24", status: "completed", description: "AI check passed" },
        { id: "3", title: "Document Collection", date: "Today", status: "current", description: "Gathering required evidence" },
        { id: "4", title: "Gap Analysis", date: "Pending", status: "upcoming", description: "Waiting for all docs" },
    ]);

    const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis>({
        missingDocuments: ["Letter of Recommendation 1", "Letter of Recommendation 2", "Personal Statement"],
        qualityIssues: [],
        recommendations: ["Upload your letters of recommendation to proceed."],
        score: 25,
    });

    // NEW: Lifecycle state
    const [lifecycleStatus, setLifecycleStatus] = useState<ApplicationLifecycleStatus>("DOCUMENTS_IN_PROGRESS");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [nextAction, setNextAction] = useState<NextAction | null>(null);
    const [userNotes, setUserNotes] = useState<string>("");

    // Update next action when status or milestones change
    useEffect(() => {
        const mockApplication: Application = {
            id: "1",
            userId: "user1",
            visaType: "uk_global_talent",
            status: "STAGE_1",
            stage: 1,
            createdAt: new Date("2024-10-20"),
            updatedAt: new Date(),
            isPausedAtStage1: false,
            lifecycleStatus,
            completionScore: gapAnalysis.score,
        };

        const action = generateNextAction(mockApplication, milestones);
        setNextAction(action);
    }, [lifecycleStatus, milestones, gapAnalysis.score]);

    // Update milestone statuses periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setMilestones(prev => prev.map(updateMilestoneStatus));
        }, 60000); // Every minute

        return () => clearInterval(interval);
    }, []);

    const refreshGapAnalysis = () => {
        const requiredDocs = ["CV", "Letter of Recommendation 1", "Letter of Recommendation 2", "Personal Statement"];
        const uploadedTypes = documents.filter(d => d.status === "valid").map(d => d.type);

        const missing = requiredDocs.filter(req => !uploadedTypes.includes(req));

        // Calculate quality issues from actual analysis results
        const qualityIssues = documents
            .filter(d => d.analysisResult && d.analysisResult.issues.length > 0)
            .flatMap(d => d.analysisResult!.issues.map(issue => `${d.name}: ${issue}`));

        const score = Math.round((uploadedTypes.length / requiredDocs.length) * 100);

        setGapAnalysis({
            missingDocuments: missing,
            qualityIssues: qualityIssues,
            recommendations: missing.length > 0
                ? [`Please upload: ${missing.join(", ")}`]
                : ["All documents uploaded! Review for quality."],
            score: score,
        });

        // Auto-transition to READY_TO_SUBMIT when score reaches 100%
        if (score === 100 && lifecycleStatus === "DOCUMENTS_IN_PROGRESS") {
            setLifecycleStatus("READY_TO_SUBMIT");
        }
    };

    const analyzeDocument = async (docId: string) => {
        // Placeholder if we needed to re-analyze existing docs
        console.log("Re-analyzing document", docId);
    };

    const addDocument = async (file: File) => {
        const newDoc: Document = {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: "Analyzing...",
            status: "analyzing",
            uploadDate: new Date().toISOString().split("T")[0],
        };
        setDocuments((prev) => [...prev, newDoc]);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("expectedType", "Visa Document");

        try {
            const { analyzeDocumentAction } = await import("@/app/actions/analyze-document");
            const result = await analyzeDocumentAction(formData);

            setDocuments((prev) =>
                prev.map((doc) => {
                    if (doc.id !== newDoc.id) return doc;

                    if (result.success && result.data) {
                        return {
                            ...doc,
                            status: result.data.valid ? "valid" : "invalid",
                            type: result.data.type || "Unknown Document",
                            analysisResult: {
                                valid: result.data.valid,
                                issues: result.data.issues || [],
                                extractedData: result.data.extractedData
                            },
                        };
                    } else {
                        return {
                            ...doc,
                            status: "invalid",
                            analysisResult: {
                                valid: false,
                                issues: ["Analysis failed: " + (result.error || "Unknown error")]
                            }
                        };
                    }
                })
            );
        } catch (error) {
            console.error("Upload/Analysis Error", error);
            setDocuments((prev) =>
                prev.map((doc) =>
                    doc.id === newDoc.id
                        ? { ...doc, status: "invalid", analysisResult: { valid: false, issues: ["Network or Server Error"] } }
                        : doc
                )
            );
        }

        // Trigger gap analysis update after analysis completes
        setTimeout(refreshGapAnalysis, 100);
    };

    // NEW: Update lifecycle status
    const updateLifecycleStatus = async (
        status: ApplicationLifecycleStatus,
        data?: Partial<Application>
    ) => {
        try {
            const response = await fetch("/api/applications/1/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentStatus: lifecycleStatus,
                    lifecycleStatus: status,
                    visaType: "uk_global_talent",
                    ...data,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setLifecycleStatus(status);

                // If milestones were generated, add them
                if (result.milestones) {
                    setMilestones(result.milestones);
                }
            } else {
                console.error("Failed to update status:", result.error);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // NEW: Create milestone
    const createMilestone = async (milestone: Partial<Milestone>) => {
        try {
            const response = await fetch("/api/applications/1/milestones", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(milestone),
            });

            const result = await response.json();

            if (result.success && result.milestone) {
                setMilestones(prev => [...prev, result.milestone]);
            }
        } catch (error) {
            console.error("Error creating milestone:", error);
        }
    };

    // NEW: Update milestone
    const updateMilestone = async (milestoneId: string, updates: Partial<Milestone>) => {
        try {
            const response = await fetch(`/api/applications/1/milestones/${milestoneId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            const result = await response.json();

            if (result.success) {
                setMilestones(prev =>
                    prev.map(m => m.id === milestoneId ? { ...m, ...updates } : m)
                );
            }
        } catch (error) {
            console.error("Error updating milestone:", error);
        }
    };

    // NEW: Delete milestone
    const deleteMilestone = async (milestoneId: string) => {
        try {
            const response = await fetch(`/api/applications/1/milestones/${milestoneId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                setMilestones(prev => prev.filter(m => m.id !== milestoneId));
            }
        } catch (error) {
            console.error("Error deleting milestone:", error);
        }
    };

    // NEW: Save notes
    const saveNotes = async (notes: string) => {
        try {
            const response = await fetch("/api/applications/1/notes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userNotes: notes }),
            });

            const result = await response.json();

            if (result.success) {
                setUserNotes(notes);
            }
        } catch (error) {
            console.error("Error saving notes:", error);
        }
    };

    return (
        <ApplicationContext.Provider value={{
            documents,
            timeline,
            gapAnalysis,
            addDocument,
            analyzeDocument,
            refreshGapAnalysis,
            lifecycleStatus,
            milestones,
            nextAction,
            userNotes,
            updateLifecycleStatus,
            createMilestone,
            updateMilestone,
            deleteMilestone,
            saveNotes,
        }}>
            {children}
        </ApplicationContext.Provider>
    );
}

export function useApplication() {
    const context = useContext(ApplicationContext);
    if (context === undefined) {
        throw new Error("useApplication must be used within an ApplicationProvider");
    }
    return context;
}
