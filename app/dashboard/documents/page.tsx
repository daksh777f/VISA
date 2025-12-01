"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, MoreVertical, Clock, CheckCircle, AlertCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const documents = [
    {
        id: 1,
        name: "Resume_2024.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploaded: "2 hours ago",
        status: "analyzed",
    },
    {
        id: 2,
        name: "Recommendation_Letter_1.docx",
        type: "DOCX",
        size: "1.1 MB",
        uploaded: "1 day ago",
        status: "pending",
    },
    {
        id: 3,
        name: "Passport_Scan.jpg",
        type: "JPG",
        size: "4.5 MB",
        uploaded: "3 days ago",
        status: "verified",
    },
    {
        id: 4,
        name: "University_Transcript.pdf",
        type: "PDF",
        size: "3.2 MB",
        uploaded: "1 week ago",
        status: "rejected",
    },
];

export default function DocumentsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Documents</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage and track your uploaded documents.
                    </p>
                </div>
                <Button>
                    <FileText className="mr-2 h-4 w-4" /> Upload New
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                    <Card key={doc.id} className="hover-card border-border/50">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-medium leading-none truncate max-w-[150px]" title={doc.name}>
                                        {doc.name}
                                    </CardTitle>
                                    <CardDescription>{doc.size} • {doc.uploaded}</CardDescription>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View details</DropdownMenuItem>
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mt-4">
                                <Badge variant={
                                    doc.status === 'verified' ? 'default' :
                                        doc.status === 'analyzed' ? 'secondary' :
                                            doc.status === 'rejected' ? 'destructive' : 'outline'
                                } className="capitalize">
                                    {doc.status === 'verified' && <CheckCircle className="mr-1 h-3 w-3" />}
                                    {doc.status === 'analyzed' && <CheckCircle className="mr-1 h-3 w-3" />}
                                    {doc.status === 'rejected' && <AlertCircle className="mr-1 h-3 w-3" />}
                                    {doc.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                                    {doc.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
