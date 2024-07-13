import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request) => {
  const promptSections = {
    patternsAndFrequency:
        "Summarize identifiable patterns in the behavior data. Make note of any significant data with regards to the frequency of the behavior.",
    temporalTrendAnalysis:
      "Summarize changes in behavior over time. Highlight key trends.",
    antecedentAnalysis:
      "Identify potential behavior triggers based on notes. Cite evidence from the data to support your hypothesized antecedents.",
    areasOfConcern:
      "List behaviors needing immediate attention. State your rationale for the ranking, citing evidence of the behavior's proposed impact on learning.",
    function:
      "Hypothesize functions for the top 3 frequent/concerning behaviors. Include your rationale and reasoning for the hypothesized function, citing evidence from the data",
    intervention:
      "Suggest 3 strategies to address key behavioral concerns. Include rationale for each.",
  };
  
  const { behaviorData, selectedPrompts } = await request.json();
  
  try {
    const sectionsToInclude = selectedPrompts.map(
      (prompt) => promptSections[prompt]
    );
    const prompt = `Behavior Data: ${JSON.stringify(behaviorData)}\n\n${sectionsToInclude.join('\n\n')}\n\nRespond in json format`;
  
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a behavior analysis assistant that responds in json format. Respond in the format: [{title: title, response: response}, ...] where the title is the detail such as 'Antecedent Analysis' or 'Patterns and Frequency', and response is the complete response. Each response should only have one object. Only title and response.  Do not include any ambiguous or vague suggestions. If there is not enough data to suggest an intervention, state so explicitly",
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
  
    return new Response(JSON.stringify({ error: "Failed to generate insights" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  };
