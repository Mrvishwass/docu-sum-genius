import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBMEognjaCI5oIOU40RTzY4zX5cCLTpfp8";
const genAI = new GoogleGenerativeAI(API_KEY);

export const generateSummary = async (
  text: string,
  type: "professional" | "simple" | "short" | "medium" | "detailed"
): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  let prompt = "";
  
  if (type === "professional") {
    prompt = `You are a legal expert. Provide a professional summary of this judicial/legal document using appropriate legal terminology. Focus on key legal arguments, precedents, and decisions. Keep it concise but comprehensive:\n\n${text}`;
  } else if (type === "simple") {
    prompt = `You are explaining a legal document to the general public. Provide a summary in simple, plain English that anyone can understand. Avoid legal jargon and explain concepts clearly:\n\n${text}`;
  } else if (type === "short") {
    prompt = `Provide a brief 2-3 sentence summary of this legal document, highlighting only the most critical points:\n\n${text}`;
  } else if (type === "medium") {
    prompt = `Provide a moderate-length summary of this legal document, covering main points and key details in 1-2 paragraphs:\n\n${text}`;
  } else {
    prompt = `Provide a detailed, comprehensive summary of this legal document, covering all important aspects, arguments, and conclusions:\n\n${text}`;
  }

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const extractKeyPoints = async (text: string): Promise<{
  clauses: string[];
  legalSections: string[];
  names: string[];
  organizations: string[];
  locations: string[];
}> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Analyze this legal document and extract the following information in JSON format:
  {
    "clauses": ["important clause 1", "important clause 2", ...],
    "legalSections": ["Section 302 IPC", "Article 21", ...],
    "names": ["person name 1", "person name 2", ...],
    "organizations": ["organization 1", "organization 2", ...],
    "locations": ["location 1", "location 2", ...]
  }
  
  Document text:
  ${text}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  // Extract JSON from markdown code blocks if present
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
  const jsonText = jsonMatch ? jsonMatch[1] : responseText;
  
  try {
    return JSON.parse(jsonText);
  } catch {
    return {
      clauses: [],
      legalSections: [],
      names: [],
      organizations: [],
      locations: []
    };
  }
};

export const explainLawSections = async (sections: string[]): Promise<Record<string, string>> => {
  if (sections.length === 0) return {};
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `Explain the following legal sections in simple terms. For each section, provide a brief explanation of what it means and its legal significance. Format as JSON:
  {
    "section_name": "explanation"
  }
  
  Sections: ${sections.join(", ")}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
  const jsonText = jsonMatch ? jsonMatch[1] : responseText;
  
  try {
    return JSON.parse(jsonText);
  } catch {
    return {};
  }
};

export const answerQuestion = async (question: string, documentContext: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are a legal assistant. Answer the following question based on the provided document context. If the answer cannot be found in the document, say so clearly.

Document Context:
${documentContext}

Question: ${question}

Answer:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
