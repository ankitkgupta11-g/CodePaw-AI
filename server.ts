import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let genAiClient: GoogleGenAI | null = null;

function getGenAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// Fallback intelligent mentor engine when API key is unconfigured or rate limited
function generateMentorFallback(
  userQuery: string,
  context?: {
    user?: { name?: string; level?: number; xp?: number };
    pet?: { name?: string; speciesTitle?: string; mood?: string };
    learningContext?: {
      courseTitle?: string;
      chapterTitle?: string;
      language?: string;
      code?: string;
      error?: string;
    };
  }
): string {
  const queryLower = userQuery.toLowerCase();
  const petName = context?.pet?.name || "Byte";
  const lang = context?.learningContext?.language || "JavaScript";
  const error = context?.learningContext?.error;
  const code = context?.learningContext?.code;

  if (error || queryLower.includes("error") || queryLower.includes("fix") || queryLower.includes("bug")) {
    let hint = "Let's inspect what happened step-by-step! 🐾";
    if (error) {
      if (error.includes("SyntaxError") || error.includes("invalid syntax")) {
        hint = `It looks like a **Syntax Error**: \`${error}\`.\n\n*🐾 ${petName}'s Hint:* In **${lang}**, double-check:\n1. Did you close all quotes (\`"\` or \`'\`), brackets (\`()\`, \`{}\`, \`[]\`)?\n2. In Python, did you remember the colon (\`:\`) at the end of \`def\`, \`if\`, \`for\` statements and consistent indentation?\n3. In JavaScript, look for missing commas or unclosed curly braces!`;
      } else if (error.includes("ReferenceError") || error.includes("NameError")) {
        hint = `That's a **Name / Reference Error**: \`${error}\`.\n\n*🐾 ${petName}'s Hint:* The interpreter is trying to access a variable or function that hasn't been declared yet in scope. Check for typos in your variable names or make sure it's defined before it is used!`;
      } else if (error.includes("TypeError")) {
        hint = `You hit a **Type Error**: \`${error}\`.\n\n*🐾 ${petName}'s Hint:* You might be trying to call something that isn't a function, or performing an operation between incompatible types (like adding a string to a number in Python without converting).`;
      } else {
        hint = `Here is the error encountered:\n\`\`\`\n${error}\n\`\`\`\n\n*🐾 ${petName}'s Tip:* Read the line number mentioned in the trace carefully. What variable or syntax is right around that line? Try printing intermediate values to see what the state was right before the error!`;
      }
    } else {
      hint = `To squash that bug, take a close look at the data types and scope! Try adding a \`console.log()\` (or \`print()\` in Python) right before the troublesome line to verify your variables have the values you expect! 🐾`;
    }
    return `### 🐾 ${petName} is here to help debug!\n\n${hint}\n\nWould you like me to give you another small hint, or walk through an example together?`;
  }

  if (queryLower.includes("python")) {
    return `### 🐍 Python with ${petName}!\n\nPython is designed for clean readability and high expressiveness! Key concepts to keep in mind:\n- **Indentation matters**: 4 spaces define code blocks (functions, loops, conditionals).\n- **Variables are dynamically typed**: \`pet_name = "${petName}"\`\n- **Lists & Dictionaries**: \`inventory = ["snack", "gem"]\`\n\n\`\`\`python\n# Example Python companion script\ndef greet_pet(name, level):\n    return f"✨ {name} is at Level {level} and ready to code!"\n\nprint(greet_pet("${petName}", 3))\n\`\`\`\n\nWhat would you like to build or practice in Python today?`;
  }

  if (queryLower.includes("html") || queryLower.includes("css")) {
    return `### 🌐 Web Mastery (HTML & CSS) with ${petName}!\n\nHTML provides the **skeleton** (structure) and CSS provides the **styling & animation** (personality)! 🐾\n\n\`\`\`html\n<!-- CodePaw Card -->\n<div class="pet-card">\n  <h2>${petName}</h2>\n  <p>Ready for the next quest!</p>\n</div>\n\`\`\`\n\n\`\`\`css\n.pet-card {\n  background: linear-gradient(135deg, #10b981, #059669);\n  color: white;\n  padding: 1.5rem;\n  border-radius: 1rem;\n  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);\n}\n\`\`\`\n\nYou can switch to the **HTML** or **CSS** tab in our Code Sandbox to test this live with real-time preview!`;
  }

  if (queryLower.includes("javascript") || queryLower.includes("js")) {
    return `### ⚡ JavaScript Power with ${petName}!\n\nJavaScript drives the interactivity and logic of the modern web! Modern features like arrow functions, array methods, and async/await make writing code a breeze:\n\n\`\`\`javascript\nconst companionStats = {\n  name: "${petName}",\n  xp: 450,\n  levelUp() {\n    return \`🎉 \${this.name} leveled up to \${Math.floor(this.xp / 100) + 1}!\`;\n  }\n};\n\nconsole.log(companionStats.levelUp());\n\`\`\`\n\nWhat JavaScript challenge are you tackling right now?`;
  }

  if (queryLower.includes("pet") || queryLower.includes("feed") || queryLower.includes("mood")) {
    return `### 🐾 Pet Care & Companion Bond!\n\n*${petName} wags tail happily!*\n\nTaking care of your companion is directly tied to your coding habits:\n- **Solve chapters & quizzes** to earn XP and level up your pet's evolution stage.\n- **Daily Speed Debug** grants Gems to purchase fun accessories in the Pet Bazaar.\n- **Pet & Feed** your companion in the Sanctuary to keep their happiness and energy at 100%!\n\nKeep up the great work, coder! 🌟`;
  }

  return `### 🐾 Hello, Coder! I'm ${petName}, your AI Companion!\n\nI'm your personal coding mentor on CodePaw AI. I can:\n- 💡 **Explain concepts** in Python, HTML, CSS, and JavaScript in simple terms\n- 🔍 **Help you debug errors** without spoiling the whole answer\n- 🚀 **Give you hints** for your current lessons or code sandbox\n- 🎯 **Recommend the next best quest** based on your level\n\n${
    context?.learningContext?.courseTitle
      ? `Currently you are working on **${context.learningContext.courseTitle}** (${context.learningContext.chapterTitle || "Chapter"}). `
      : ""
  }How can I help you level up today?`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API: AI Companion Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: "messages array is required" });
        return;
      }

      const lastUserMessage = messages[messages.length - 1]?.content || "";
      const petName = context?.pet?.name || "Byte";
      const petSpecies = context?.pet?.speciesTitle || "Cyber Companion";
      const userName = context?.user?.name || "Learner";
      const courseTitle = context?.learningContext?.courseTitle || "Programming";
      const chapterTitle = context?.learningContext?.chapterTitle || "";
      const code = context?.learningContext?.code || "";
      const error = context?.learningContext?.error || "";
      const language = context?.learningContext?.language || "JavaScript";

      const client = getGenAiClient();

      if (!client) {
        // Fallback when GEMINI_API_KEY is not yet populated
        const fallbackText = generateMentorFallback(lastUserMessage, context);
        res.json({ reply: fallbackText, modelUsed: "codepaw-mentor-offline" });
        return;
      }

      const systemInstruction = `You are the CodePaw AI Companion — a cheerful, expert, and patient personal coding mentor and virtual companion in the CodePaw AI gamified learning platform.

Your Student Context:
- Student Name: ${userName}
- Companion Pet Name: ${petName} (${petSpecies})
- Current Course: ${courseTitle} ${chapterTitle ? `(Chapter: ${chapterTitle})` : ""}
- Active Editor Language: ${language}
${code ? `- Current Code in Editor:\n\`\`\`${language.toLowerCase()}\n${code.slice(0, 1500)}\n\`\`\`` : ""}
${error ? `- Current Error in Editor:\n\`\`\`\n${error.slice(0, 500)}\n\`\`\`` : ""}

Pedagogical Directives:
1. Patient & Beginner-Friendly: Explain programming concepts (Python, HTML, CSS, JavaScript) using clear analogies and bite-sized explanations.
2. Socratic & Hints First: When the student is stuck or has an error, provide an insightful hint that guides them to spot the problem themselves. Do NOT dump the complete final answer immediately unless they explicitly request: "give me the complete solution" or "give me the answer".
3. Virtual Pet Persona: You represent their loyal coding companion (${petName}). Infuse gentle, positive companion warmth (e.g., 🐾 *wags tail*, ✨ *cheers*, 🐱 *paws the keyboard*). Celebrate their persistence and progress!
4. Structured Formatting: Use markdown formatting with clear headings, bullet points, and code snippets when appropriate.
5. Contextual: If they ask "why does this fail?" or "how do I fix my code?", directly reference their actual code and error provided above!`;

      // Build contents for @google/genai generateContent
      // Map conversation history
      const formattedContents = messages.slice(-10).map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Woof! I'm thinking... Let's try again! 🐾";
      res.json({ reply: replyText, modelUsed: "gemini-3.8-flash" });
    } catch (err: unknown) {
      console.error("Gemini API error in /api/chat:", err);
      // Graceful fallback to avoid leaving user hanging
      const lastMsg = req.body?.messages?.[req.body.messages.length - 1]?.content || "";
      const fallbackText = generateMentorFallback(lastMsg, req.body?.context);
      res.json({
        reply: fallbackText,
        modelUsed: "codepaw-mentor-fallback",
      });
    }
  });

  // API: Course Generation endpoint
  app.post("/api/generate-course", async (req, res) => {
    try {
      const { topic, level } = req.body;
      const client = getGenAiClient();

      if (!client) {
        res.json({ success: false, reason: "No API key configured" });
        return;
      }

      const prompt = `Generate a 5-chapter interactive coding course on the topic "${topic}" for ${level} level.
Return strict JSON with this schema:
{
  "title": string,
  "description": string,
  "category": "python" | "web" | "ai" | "ml" | "datascience",
  "chapters": [
    {
      "chapterNumber": number,
      "title": string,
      "description": string,
      "durationMin": number,
      "explanation": string,
      "codeSnippet": string,
      "question": string,
      "options": [
        { "id": "opt1", "text": string, "isCorrect": boolean, "explanation": string },
        { "id": "opt2", "text": string, "isCorrect": boolean, "explanation": string }
      ]
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      res.json({ success: true, data: JSON.parse(response.text || "{}") });
    } catch (err: unknown) {
      console.error("Error in /api/generate-course:", err);
      res.status(500).json({ success: false, error: String(err) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodePaw server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start CodePaw server:", err);
});
