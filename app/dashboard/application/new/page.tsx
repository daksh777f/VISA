import { NewAppForm } from "@/components/dashboard/new-app-form";

export default function NewApplicationPage() {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full py-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">New Application</h2>
                <p className="text-muted-foreground">
                    Let&apos;s get you started on the path to approval.
                </p>
            </div>
            <NewAppForm />
        </div>
    );
}
