import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request) => {
  const promptSections = {
    patternsAndFrequency:
      "Behavior Patterns and Frequency: Analyze how behaviors have changed over the recorded time period. Identify any behaviors that are increasing or decreasing in frequency. Note any sudden changes or anomalies in behavior patterns. Reasoning: Explain the trends and anomalies with reference to the data.",
    temporalTrendAnalysis:
      "Temporal Trend Analysis: Analyze how behaviors have changed over the recorded time period. Identify any behaviors that are increasing or decreasing in frequency. Note any sudden changes or anomalies in behavior patterns. Reasoning: Explain the trends and anomalies with reference to the data.",
    antecedentAnalysis:
      "Antecedent Analysis: Based on the notes and descriptions, identify potential triggers or antecedents for the observed behaviors. Group similar triggers and rank them by likely impact on behavior. Reasoning: Justify the identified triggers and their rankings using the data.",
    areasOfConcern:
      "Areas of Concern: Identify behaviors that require immediate attention or intervention. Rank these behaviors based on their frequency and potential impact on learning. For each area of concern, provide a brief explanation of why it's problematic. Reasoning: Support the identification and ranking of areas of concern with data-based reasoning.",
    function:
      "Behavior Function Hypothesis: For the top 3 most frequent or concerning behaviors, hypothesize the possible functions or reasons behind these behaviors (e.g., attention-seeking, escape, sensory stimulation). Reasoning: Explain the hypotheses with reference to the behavior data and any relevant notes.",
    intervention:
      "Intervention Suggestions: Based on the identified areas of concern and hypothesized behavior functions, suggest 3-5 strategies or interventions to address the most pressing behavioral concerns. Reasoning: Provide a rationale for each suggested intervention, including how it addresses the behavior and any potential challenges.",
    environmentalConsiderations:
      "Environmental Considerations: Identify any environmental factors (e.g., classroom layout, noise levels, schedule) that might be contributing to the observed behaviors. Suggest changes to the environment that could mitigate these factors. Reasoning: Justify the identified environmental factors and suggested changes with reference to the behavior data.",
  };

  const { behaviorData, selectedPrompts } = await request.json();

  try {
    const sectionsToInclude = selectedPrompts.map(
      (prompt) => promptSections[prompt],
    );
    const prompt = `Behavior Data: ${JSON.stringify(behaviorData)}\n\n${sectionsToInclude}\n\nRespond in json format`;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a behavior analysis assistant that responds in json format. Respond in the format: [{title: title, response: response}, ...] where the title is the detail such as 'Antecedent Analysis' or 'Patterns and Frequency', and response is the complete response. Each response should only have one object. only title and response.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      max_tokens: 3000,
    });

    const completion = response.choices[0]?.message?.content;
    const jsonResponse = JSON.parse(completion);

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    return new Response(
      JSON.stringify({ error: "Failed to generate insights" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
