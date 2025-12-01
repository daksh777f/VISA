import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
    validateStatusTransition,
    getRequiredFieldsForStatus
} from "@/lib/application-status-manager";
import { generateDefaultMilestones } from "@/lib/milestone-generator";
import { ApplicationLifecycleStatus } from "@/types";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const applicationId = params.id;
        const body = await request.json();

        const {
            lifecycleStatus,
            submittedAt,
            submissionMethod,
            portalReferenceNumber,
            submissionNotes,
            decisionAt,
            decisionType,
            decisionNotes,
            expectedDecisionDate,
            userNotes,
        } = body;

        const currentStatus: ApplicationLifecycleStatus = body.currentStatus || "DOCUMENTS_IN_PROGRESS";

        const validation = validateStatusTransition(
            currentStatus,
            lifecycleStatus,
            body
        );

        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        const updateData: any = {
            lifecycleStatus,
            lastStatusUpdate: new Date(),
            updatedAt: new Date(),
        };

        if (submittedAt) updateData.submittedAt = new Date(submittedAt);
        if (submissionMethod) updateData.submissionMethod = submissionMethod;
        if (portalReferenceNumber) updateData.portalReferenceNumber = portalReferenceNumber;
        if (submissionNotes) updateData.submissionNotes = submissionNotes;
        if (decisionAt) updateData.decisionAt = new Date(decisionAt);
        if (decisionType) updateData.decisionType = decisionType;
        if (decisionNotes) updateData.decisionNotes = decisionNotes;
        if (expectedDecisionDate) updateData.expectedDecisionDate = new Date(expectedDecisionDate);
        if (userNotes !== undefined) updateData.userNotes = userNotes;

        let generatedMilestones = null;
        if (lifecycleStatus === "SUBMITTED_WAITING" && submittedAt) {
            const visaType = body.visaType || "uk_global_talent";

            generatedMilestones = generateDefaultMilestones(
                applicationId,
                visaType,
                new Date(submittedAt)
            );
        }

        return NextResponse.json({
            success: true,
            application: updateData,
            milestones: generatedMilestones,
            message: "Application status updated successfully",
        });

    } catch (error) {
        console.error("Error updating application status:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
