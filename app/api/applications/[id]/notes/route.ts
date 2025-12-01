import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

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
        const { userNotes } = body;

        if (userNotes === undefined) {
            return NextResponse.json(
                { error: "userNotes field is required" },
                { status: 400 }
            );
        }

        // TODO: Update application notes in database
        // await db.applications.update({
        //     where: { id: applicationId },
        //     data: {
        //         userNotes,
        //         updatedAt: new Date(),
        //     }
        // });

        return NextResponse.json({
            success: true,
            userNotes,
            message: "Notes updated successfully",
        });

    } catch (error) {
        console.error("Error updating notes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
