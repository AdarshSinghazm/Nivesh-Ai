const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access API key from environment or hardcode for this one-off script since we know what it is
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Initial dummy model to get client
        // Actually, accessing .listModels isn't on the model instance usually, it's on the client or specific endpoint.
        // The google-generative-ai SDK might not expose listModels directly on the main class in older versions, 
        // but let's try the standard way if available, or just use fetch directly which is more reliable for "listing".

        console.log("Fetching models via REST API...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (${m.displayName}) - Supported generation methods: ${m.supportedGenerationMethods}`);
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
