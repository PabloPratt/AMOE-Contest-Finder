import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface ContestData {
  title: string;
  description: string;
  sourceUrl: string;
  contestType: string;
  hasAMOE: boolean;
  amoeMethod?: string;
  physicalRequirements?: string;
  prizeDescription: string;
  estimatedValue?: number;
  startDate?: string;
  endDate: string;
  eligibility?: string;
  rules?: string;
}

export async function scoutContestSource(
  source: string,
  query: string = "world cup AMOE sweepstakes contests"
): Promise<ContestData[]> {
  const prompt = `You are a contest discovery agent. Your job is to find and extract promotional contests.

Source to research: ${source}
Query focus: ${query}

Please find ALL promotional contests that:
1. Have AMOE (Any Manner Of Entry) options available
2. Are currently active (not expired)
3. Have the specified theme (e.g., World Cup, Super Bowl, etc.)
4. Are available in the United States

For each contest found, extract and return structured data including:
- Contest title
- Description
- URL/source
- Prize description and estimated value
- Expiration date
- AMOE method (how to enter without purchase)
- Any physical requirements (mail-in, etc.)
- Eligibility restrictions

Format your response as a JSON array of contest objects. Be thorough and look for lesser-known contests too.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      thinking: {
        type: "enabled",
        budget_tokens: 10000,
      },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from agent");
    }

    const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log("No JSON found in response, trying to parse full response");
      return [];
    }

    const contests = JSON.parse(jsonMatch[0]) as ContestData[];
    return contests.filter((c) => c.hasAMOE);
  } catch (error) {
    console.error("Error scouting contests:", error);
    throw error;
  }
}

export async function analyzeContestRules(
  contestTitle: string,
  rulesText: string
): Promise<{
  hasAMOE: boolean;
  amoeMethod: string;
  physicalRequirements: string;
  estimatedValue?: number;
  verificationScore: number;
}> {
  const prompt = `Analyze these contest rules and extract key information:

Contest: ${contestTitle}
Rules: ${rulesText}

Please determine:
1. Does this contest have an AMOE (Any Manner Of Entry) option? (Boolean)
2. If yes, describe the AMOE method in detail
3. Are there any physical requirements? (mail-in, visiting locations, etc.)
4. Try to estimate the prize value in USD
5. Give a confidence score (0-1) of how accurately you understood the rules

Return as JSON with fields: hasAMOE, amoeMethod, physicalRequirements, estimatedValue, verificationScore`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from analysis");
    }

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {
      hasAMOE: false,
      amoeMethod: "",
      physicalRequirements: "",
      verificationScore: 0,
    };

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error analyzing rules:", error);
    throw error;
  }
}

export async function findExpiringSoon(days: number = 7): Promise<string[]> {
  const prompt = `What are the most significant promotional contests expiring in the next ${days} days that have AMOE options?

Focus on widely popular contests. Return as JSON array of contest names and their expiration dates.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return [];

    try {
      const parsed = JSON.parse(textContent.text);
      return Array.isArray(parsed) ? parsed.map(String) : [textContent.text];
    } catch {
      return [textContent.text];
    }
  } catch (error) {
    console.error("Error finding expiring contests:", error);
    return [];
  }
}
