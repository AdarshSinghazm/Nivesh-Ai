const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
    "models/gemini-2.5-flash-native-audio-preview-09-2025"
];

async function testModels() {
    console.log("Starting model tests...");
    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Test");
            const response = await result.response;
            console.log(`✅ SUCCESS: ${modelName}`);
            return;
        } catch (error) {
            console.log(`❌ FAIL: ${modelName} - ${error.message.split('\n')[0]}`);
            // Check if it mentions supported methods
            if (error.message.includes("supported methods")) {
                console.log("   (Model exists but usage incorrect or method unsupported)");
            }
        }
    }
    console.log("All tests completed.");
}

testModels();
