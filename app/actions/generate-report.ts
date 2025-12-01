"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GapAnalysis, Document } from "@/components/dashboard/application-context";

export async function generateGapAnalysisReport(
    gapAnalysis: GapAnalysis,
    documents: Document[]
) {
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("Checking API Key:", apiKey ? "Present" : "Missing");

    if (!apiKey) {
        return { success: false, error: "API Key missing" };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const uploadedDocsSummary = documents.map(d =>
            `- ${d.name} (${d.type}): ${d.status} ${d.analysisResult?.issues.length ? `(Issues: ${d.analysisResult.issues.join(", ")})` : ""}`
        ).join("\n");

        const prompt = `
            You are an expert UK Global Talent Visa consultant.
            
            Current Application Status:
            - Readiness Score: ${gapAnalysis.score}%
            - Missing Documents: ${gapAnalysis.missingDocuments.join(", ")}
            - Quality Issues: ${gapAnalysis.qualityIssues.join(", ")}
            
            Uploaded Documents:
            ${uploadedDocsSummary}
            
            Task:
            Write a detailed, professional "Gap Analysis Report" for the applicant.
            Use Markdown formatting.
            
            Structure:
            1. **Executive Summary**: Brief assessment of their current standing.
            2. **Critical Gaps**: Explain why the missing documents are crucial.
            3. **Document Quality Review**: specific feedback on uploaded files (if any issues).
            4. **Action Plan**: A numbered list of immediate next steps to reach 100% readiness.
            5. **Pro Tip**: One specific piece of advice for the Tech Nation endorsement.
            
            Tone: Encouraging but professional and strict about requirements.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, report: text };
    } catch (error) {
        console.error("Report Generation Error Details:", JSON.stringify(error, null, 2));
        if (error instanceof Error) {
            console.error("Error Message:", error.message);
            console.error("Error Stack:", error.stack);
        }
        return { success: false, error: "Failed to generate report: " + (error instanceof Error ? error.message : String(error)) };
    }
}
