import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request) => {
  try {
    const { behaviorData } = await request.json();

    const prompt = `
                    You are an AI assistant with expertise in educational psychology and behavioral analysis, specializing in K-12 settings. You've been tasked with analyzing behavior tracking data for a student or group of students. Each data point includes a behavior, timestamp, notes, and a behavior description. Your goal is to provide in-depth, actionable insights for educators.

                    Behavior Data:
                    ${JSON.stringify(behaviorData, null, 2)}
                    Please begin by explaining the data and citing specifc examples.

                    Please conduct a thorough analysis of this data and provide detailed insights in the following areas:

                    1. Behavior Patterns and Frequency:
                    - Identify recurring patterns in behaviors, considering frequency, time of day, day of the week, and subject/class (if applicable).
                    - Calculate the frequency of each behavior type and present the top 3 most frequent behaviors.
                    - Determine if there are any patterns related to the time of day or specific classes/subjects.

                    2. Temporal Trend Analysis:
                    - Analyze how behaviors have changed over the recorded time period.
                    - Identify any behaviors that are increasing or decreasing in frequency.
                    - Note any sudden changes or anomalies in behavior patterns.

                    3. Antecedent Analysis:
                    - Based on the notes and descriptions, identify potential triggers or antecedents for the observed behaviors.
                    - Group similar triggers and rank them by likely impact on behavior.

                    4. Positive Behavior Recognition:
                    - Highlight all instances of positive behaviors.
                    - Identify conditions or factors that seem to promote positive behaviors.
                    - Suggest ways to reinforce and increase these positive behaviors.

                    5. Areas of Concern:
                    - Identify behaviors that require immediate attention or intervention.
                    - Rank these behaviors based on their frequency and potential impact on learning.
                    - For each area of concern, provide a brief explanation of why it's problematic.

                    6. Behavior Function Hypothesis:
                    - For the top 3 most frequent or concerning behaviors, hypothesize about the possible functions (e.g., attention-seeking, escape, sensory stimulation, access to tangibles).
                    - Provide reasoning for each hypothesis based on the available data.

                    7. Intervention Recommendations:
                    - Suggest 3-5 evidence-based strategies that teachers or staff could implement to address the most pressing behavioral concerns.
                    - For each strategy, provide:
                        a) A brief description of the intervention
                        b) How to implement it in the classroom
                        c) Expected outcomes
                        d) Any potential challenges in implementation

                    8. Data-Driven Goals:
                    - Propose 2-3 specific, measurable goals for behavior improvement based on the data.
                    - Suggest how progress towards these goals could be tracked and measured.

                    9. Environmental Considerations:
                    - Based on the data, identify any environmental factors (classroom setup, seating arrangements, time of day, etc.) that might be influencing behavior.
                    - Suggest potential environmental modifications that could positively impact behavior.

                    10. Peer Interaction Analysis:
                        - If the data includes information about peer interactions, analyze how these might be influencing the observed behaviors.
                        - Suggest strategies for promoting positive peer interactions if relevant.

                    11. Questions for Further Investigation:
                        - Propose 3-4 specific questions that staff should consider to gather more information about the observed behaviors.
                        - Suggest methods for collecting this additional information.

                    12. Summary and Key Takeaways:
                        - Provide a concise summary of the most important findings and recommendations.
                        - List 3-5 key actionable takeaways for educators.

                    Please present this analysis in a clear, structured format that is easily digestible for educators. Use professional but not overly technical language, focusing on practical, evidence-based insights and recommendations. Ensure all suggestions are ethical, respect student dignity, and align with positive behavior support principles.

`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    if (completion.choices[0].message.content) {
      console.log(completion.choices[0].message.content);
      return new Response(
        JSON.stringify({ insight: completion.choices[0].message.content }),
        { status: 200 },
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
