import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeDocumentWithGemini(
    fileBase64: string,
    mimeType: string,
    expectedType: string
) {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        console.error("GOOGLE_API_KEY is not set");
        // Return a mock response if key is missing to prevent crash, but warn user
        return {
            valid: false,
            issues: ["System Error: AI Service not configured (Missing API Key)"],
            extractedData: {},
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      You are an expert visa document analyst. 
      Analyze the attached document image/file.
      
      Expected Document Type: "${expectedType}"
      
      Tasks:
      1. Verify if the document matches the Expected Document Type.
      2. Check for common quality issues (blurry, cutoff, low resolution).
      3. Extract key information relevant to this document type (e.g., Name, Dates).
      
      Return ONLY a JSON object with this structure:
      {
        "valid": boolean, // true if it matches expected type and is legible
        "type": string, // The detected document type
        "issues": string[], // List of specific issues found (e.g. "Document is blurry", "Wrong document type")
        "extractedData": object // Key-value pairs of extracted info
      }
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: fileBase64,
                    mimeType: mimeType,
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            valid: false,
            issues: ["AI Analysis Failed: " + (error instanceof Error ? error.message : "Unknown error")],
            extractedData: {},
        };
    }
}
