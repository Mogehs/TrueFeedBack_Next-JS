import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from "ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const buildGoogleGenAIPrompt = (content) => {
  return {
    contents: [
      {
        role: "user",
        parts: [{ text: content }],
      },
    ],
  };
};

export async function POST(request) {
  try {
    const promptString =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Pass the prompt to the AI model
    const geminiStream = await genAI
      .getGenerativeModel({ model: "gemini-pro" })
      .generateContentStream(buildGoogleGenAIPrompt(promptString));

    // Convert the AI model's stream into a proper response stream
    const stream = GoogleGenerativeAIStream(geminiStream);

    // Return the streaming text response
    return new StreamingTextResponse(stream);
  } catch (e) {
    throw e;
  }
}
