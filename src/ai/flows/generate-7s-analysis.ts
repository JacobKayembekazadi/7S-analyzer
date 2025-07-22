'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing the alignment of the McKinsey 7-S framework elements.
 *
 * - generate7SAnalysis - A function that accepts 7-S framework element descriptions and returns an AI-generated analysis.
 * - Generate7SAnalysisInput - The input type for the generate7SAnalysis function.
 * - Generate7SAnalysisOutput - The return type for the generate7SAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Generate7SAnalysisInputSchema = z.object({
  strategy: z.string().describe('Description of the organization\'s strategy.'),
  structure: z.string().describe('Description of the organization\'s structure.'),
  systems: z.string().describe('Description of the organization\'s systems.'),
  sharedValues: z.string().describe('Description of the organization\'s shared values.'),
  style: z.string().describe('Description of the organization\'s leadership style.'),
  staff: z.string().describe('Description of the organization\'s staff.'),
  skills: z.string().describe('Description of the organization\'s skills.'),
});
export type Generate7SAnalysisInput = z.infer<typeof Generate7SAnalysisInputSchema>;

const RecommendationSchema = z.object({
    recommendation: z.string().describe("A specific, actionable recommendation for improvement."),
    priority: z.enum(["High", "Medium", "Low"]).describe("The priority of the recommendation."),
  });
export type Recommendation = z.infer<typeof RecommendationSchema>;

const Generate7SAnalysisOutputSchema = z.object({
  analysis: z.string().describe('AI-generated analysis of the alignment between the seven elements, in markdown format.'),
  recommendations: z.array(RecommendationSchema).describe("A list of actionable recommendations."),
  chartData: z.array(z.object({
      name: z.string().describe("The name of the 7-S element."),
      score: z.number().min(0).max(100).describe("An alignment score from 0 (poor) to 100 (excellent)."),
  })).describe("Data for the alignment radar chart.")
});
export type Generate7SAnalysisOutput = z.infer<typeof Generate7SAnalysisOutputSchema>;

export async function generate7SAnalysis(input: Generate7SAnalysisInput): Promise<Generate7SAnalysisOutput> {
  return generate7SAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generate7SAnalysisPrompt',
  input: {schema: Generate7SAnalysisInputSchema},
  output: {schema: Generate7SAnalysisOutputSchema},
  prompt: `You are a world-class management consultant specializing in organizational transformation using the McKinsey 7-S framework. Your analysis is not just descriptive, but prescriptive and insightful, designed to catalyze significant positive change within a company.

You will be provided with descriptions of each of the seven elements: Strategy, Structure, Systems, Shared Values, Style, Staff, and Skills.

Your multi-part task is to:

1.  **Generate an In-depth Analysis:**
    *   Analyze the alignment (or misalignment) between all seven elements.
    *   Identify the core strengths and critical weaknesses.
    *   Pinpoint the root causes of any identified issues.
    *   The analysis should be comprehensive, insightful, and formatted in clear markdown.

2.  **Create Actionable Recommendations:**
    *   Provide a list of at least three specific, concrete, and actionable recommendations.
    *   For each recommendation, assign a priority level: "High", "Medium", or "Low". High-priority items should address the most critical misalignments that will unlock the most value.

3.  **Produce Alignment Scores for a Radar Chart:**
    *   For each of the seven elements, provide an "alignment score" from 0 to 100.
    *   A score of 100 represents perfect alignment with all other elements.
    *   A score of 0 represents a complete lack of alignment.
    *   The scores should be a thoughtful, relative measure based on the provided descriptions. For example, if the 'Strategy' is aggressive growth but the 'Skills' are outdated, the 'Skills' element would have a very low score, and the 'Strategy' might have a medium score because it's not supported by the team's capabilities.

**User-Provided Information:**

*   **Strategy:** {{{strategy}}}
*   **Structure:** {{{structure}}}
*   **Systems:** {{{systems}}}
*   **Shared Values:** {{{sharedValues}}}
*   **Style:** {{{style}}}
*   **Staff:** {{{staff}}}
*   **Skills:** {{{skills}}}

Return your response in the required JSON format, with fields for "analysis", "recommendations", and "chartData".
`,
});

const generate7SAnalysisFlow = ai.defineFlow(
  {
    name: 'generate7SAnalysisFlow',
    inputSchema: Generate7SAnalysisInputSchema,
    outputSchema: Generate7SAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
