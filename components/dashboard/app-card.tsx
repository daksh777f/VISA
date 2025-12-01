import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AppCardProps {
    id: string;
    title: string;
    description: string;
    status: string;
    stage: string;
    progress: number;
    nextMilestone: string;
    dueDate: string;
}

export function AppCard({ id, title, description, status, stage, progress, nextMilestone, dueDate }: AppCardProps) {
    const statusColors: Record<string, string> = {
        "In Progress": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        "Pending": "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        "Completed": "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit application</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={statusColors[status] || statusColors["In Progress"]}>
                            {status}
                        </Badge>
                        <span className="text-muted-foreground">{stage}</span>
                    </div>
                    <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Next Milestone</p>
                        <p className="font-medium">{nextMilestone}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{dueDate}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" variant="outline">
                    <Link href={`/dashboard/application/${id}`}>
                        Continue Application <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
