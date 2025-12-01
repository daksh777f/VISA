"use server";

import { analyzeDocumentWithGemini } from "@/lib/gemini";

export async function analyzeDocumentAction(formData: FormData) {
    const file = formData.get("file") as File;
    const expectedType = formData.get("expectedType") as string || "General Document";

    if (!file) {
        return { success: false, error: "No file provided" };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");

        const result = await analyzeDocumentWithGemini(base64, file.type, expectedType);

        return { success: true, data: result };
    } catch (error) {
        console.error("Analysis Action Error:", error);
        return { success: false, error: "Failed to process document" };
    }
}
