"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Upload, FileText, X } from "lucide-react";

export function NewAppForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [visaType, setVisaType] = useState("uk-global-talent");
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNext = () => {
        if (step === 1 && !visaType) return;
        if (step === 2 && !file) return;

        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard/application/1");
        }, 1500);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Steps Indicator */}
            <div className="mb-8 flex items-center justify-between">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`
              h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300
              ${step >= s ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground"}
            `}>
                            {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                            {s === 1 ? "Visa Type" : s === 2 ? "Upload CV" : "Review"}
                        </span>
                        {s < 3 && <div className="w-12 h-0.5 bg-muted mx-2" />}
                    </div>
                ))}
            </div>

            <Card className="overflow-hidden border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Select Visa Type"}
                        {step === 2 && "Upload Your CV"}
                        {step === 3 && "Review & Start"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Choose the visa category you are applying for."}
                        {step === 2 && "We'll analyze your CV to identify gaps automatically."}
                        {step === 3 && "Ready to begin your journey to approval?"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 min-h-[300px]">
                    {step === 1 && (
                        <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid gap-2">
                                <Label htmlFor="visa-type">Visa Category</Label>
                                <Select value={visaType} onValueChange={setVisaType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select visa type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="uk-global-talent">UK Global Talent (Digital Technology)</SelectItem>
                                        <SelectItem value="us-h1b">US H1B Specialty Occupation</SelectItem>
                                        <SelectItem value="us-o1">US O-1 Extraordinary Ability</SelectItem>
                                        <SelectItem value="canada-express">Canada Express Entry</SelectItem>
                                        <SelectItem value="australia-skilled">Australia Skilled Migration</SelectItem>
                                        <SelectItem value="eu-blue-card">EU Blue Card</SelectItem>
                                        <SelectItem value="singapore-ep">Singapore Employment Pass</SelectItem>
                                        <SelectItem value="uae-golden">UAE Golden Visa</SelectItem>
                                        <SelectItem value="nz-skilled">New Zealand Skilled Migrant</SelectItem>
                                        <SelectItem value="japan-hsp">Japan Highly Skilled Professional</SelectItem>
                                        <SelectItem value="germany-blue">Germany EU Blue Card</SelectItem>
                                        <SelectItem value="netherlands-hsm">Netherlands Highly Skilled Migrant</SelectItem>
                                        <SelectItem value="ireland-critical">Ireland Critical Skills</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${file ? 'border-primary/50 bg-primary/5' : 'hover:bg-muted/50 border-muted-foreground/25'}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                />

                                {file ? (
                                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">{file.name}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <Button variant="ghost" size="sm" className="mt-4 text-destructive hover:text-destructive" onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}>
                                            Remove file
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                                            <Upload className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="font-semibold">Drag & drop your CV here</h3>
                                        <p className="text-sm text-muted-foreground mt-1">or click to browse files (PDF, DOCX)</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="rounded-lg bg-muted/50 p-4 space-y-3 border border-border/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Visa Type:</span>
                                    <span className="font-medium">
                                        {visaType === 'uk-global-talent' && 'UK Global Talent'}
                                        {visaType === 'us-h1b' && 'US H1B'}
                                        {visaType === 'us-o1' && 'US O-1'}
                                        {visaType === 'canada-express' && 'Canada Express Entry'}
                                        {visaType === 'australia-skilled' && 'Australia Skilled Migration'}
                                        {visaType === 'eu-blue-card' && 'EU Blue Card'}
                                        {visaType === 'singapore-ep' && 'Singapore Employment Pass'}
                                        {visaType === 'uae-golden' && 'UAE Golden Visa'}
                                        {visaType === 'nz-skilled' && 'New Zealand Skilled Migrant'}
                                        {visaType === 'japan-hsp' && 'Japan Highly Skilled Professional'}
                                        {visaType === 'germany-blue' && 'Germany EU Blue Card'}
                                        {visaType === 'netherlands-hsm' && 'Netherlands Highly Skilled Migrant'}
                                        {visaType === 'ireland-critical' && 'Ireland Critical Skills'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-muted-foreground">CV Uploaded:</span>
                                    <span className="font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        {file?.name}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                By clicking &quot;Start Application&quot;, our AI will begin analyzing your profile against the visa requirements.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between bg-muted/20 p-6">
                    <Button
                        variant="ghost"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1 || isLoading}
                    >
                        Back
                    </Button>
                    <Button onClick={handleNext} disabled={isLoading || (step === 2 && !file)}>
                        {isLoading ? "Creating..." : step === 3 ? "Start Application" : "Next"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
