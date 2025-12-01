"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { useApplication } from "@/components/dashboard/application-context";
import { Badge } from "@/components/ui/badge";

export function DocumentsTab() {
    const { documents, addDocument, analyzeDocument } = useApplication();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        for (const file of files) {
            await addDocument(file);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            for (const file of files) {
                await addDocument(file);
            }
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Documents</CardTitle>
                    <CardDescription>
                        Upload your CV, letters of recommendation, and evidence. Supported formats: PDF, DOCX, JPG.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 rounded-full bg-muted">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-lg font-medium">Drag & drop files here</p>
                                <p className="text-sm text-muted-foreground">or click to browse</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                multiple
                                onChange={handleFileSelect}
                            />
                            <Button onClick={() => fileInputRef.current?.click()}>
                                Select Files
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {documents.map((doc) => (
                    <Card key={doc.id}>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="p-2 rounded bg-muted">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium truncate">{doc.name}</p>
                                    {doc.status === "valid" && <Badge variant="default" className="bg-green-500 hover:bg-green-600">Valid</Badge>}
                                    {doc.status === "invalid" && <Badge variant="destructive">Invalid</Badge>}
                                    {doc.status === "analyzing" && <Badge variant="secondary" className="animate-pulse">Analyzing...</Badge>}
                                    {doc.status === "pending" && <Badge variant="outline">Pending</Badge>}
                                </div>
                                <p className="text-xs text-muted-foreground">Uploaded on {doc.uploadDate} · {doc.type}</p>

                                {doc.analysisResult && doc.analysisResult.issues.length > 0 && (
                                    <div className="mt-2 p-2 rounded bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <ul className="list-disc list-inside">
                                            {doc.analysisResult.issues.map((issue, i) => (
                                                <li key={i}>{issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
