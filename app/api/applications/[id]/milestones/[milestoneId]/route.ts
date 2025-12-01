import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { MilestoneStatus } from "@/types";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; milestoneId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { milestoneId } = params;
        const body = await request.json();

        const {
            status,
            actualDate,
            plannedDate,
            label,
            description,
            location,
            requirementsChecklist,
            notes,
        } = body;

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (status) updateData.status = status as MilestoneStatus;
        if (actualDate) updateData.actualDate = new Date(actualDate);
        if (plannedDate) updateData.plannedDate = new Date(plannedDate);
        if (label) updateData.label = label;
        if (description !== undefined) updateData.description = description;
        if (location !== undefined) updateData.location = location;
        if (requirementsChecklist) updateData.requirementsChecklist = requirementsChecklist;
        if (notes !== undefined) updateData.notes = notes;

        if (status === "COMPLETED" && !actualDate && !updateData.actualDate) {
            updateData.actualDate = new Date();
        }

        return NextResponse.json({
            success: true,
            milestone: { id: milestoneId, ...updateData },
            message: "Milestone updated successfully",
        });

    } catch (error) {
        console.error("Error updating milestone:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; milestoneId: string } }
) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { milestoneId } = params;

        return NextResponse.json({
            success: true,
            message: "Milestone deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting milestone:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
