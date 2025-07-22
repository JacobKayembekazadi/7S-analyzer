'use server';
/**
 * @fileOverview This file defines a Genkit flow for conducting a SWOT analysis.
 *
 * - generateSwotAnalysis - A function that accepts SWOT element descriptions and returns an AI-generated analysis.
 * - GenerateSwotAnalysisInput - The input type for the generateSwotAnalysis function.
 * - GenerateSwotAnalysisOutput - The return type for the generateSwotAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSwotAnalysisInputSchema = z.object({
  strengths: z.string().describe('Description of the organization\'s internal strengths.'),
  weaknesses: z.string().describe('Description of the organization\'s internal weaknesses.'),
  opportunities: z.string().describe('Description of external opportunities.'),
  threats: z.string().describe('Description of external threats.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

const GenerateSwotAnalysisOutputSchema = z.object({
  analysis: z.string().describe('AI-generated SWOT analysis, formatted in markdown.'),
});
export type GenerateSwotAnalysisOutput = z.infer<typeof GenerateSwotAnalysisOutputSchema>;

export async function generateSwotAnalysis(input: GenerateSwotAnalysisInput): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: {schema: GenerateSwotAnalysisInputSchema},
  output: {schema: GenerateSwotAnalysisOutputSchema},
  prompt: `You are a strategic business analyst with deep expertise in the SWOT framework. Your task is to provide a comprehensive and insightful SWOT analysis based on the user's input.

The analysis should not just list the points but should connect them, identify key strategic implications, and offer high-level strategic guidance. The output must be in well-structured markdown.

**User-Provided Information:**

*   **Strengths:** {{{strengths}}}
*   **Weaknesses:** {{{weaknesses}}}
*   **Opportunities:** {{{opportunities}}}
*   **Threats:** {{{threats}}}

**Analysis Structure:**

1.  **Executive Summary:** Start with a brief overview of the company's strategic position based on the SWOT analysis.
2.  **Detailed SWOT Analysis:**
    *   **Strengths:** Elaborate on the provided strengths.
    *   **Weaknesses:** Elaborate on the provided weaknesses.
    *   **Opportunities:** Elaborate on the provided opportunities.
    *   **Threats:** Elaborate on the provided threats.
3.  **Strategic Implications & Key Insights:** This is the most crucial part. Analyze the interplay between the different quadrants:
    *   **Strengths-Opportunities (SO):** How can strengths be used to capitalize on opportunities?
    *   **Weaknesses-Opportunities (WO):** How can opportunities be used to overcome weaknesses?
    *   **Strengths-Threats (ST):** How can strengths be used to mitigate threats?
    *   **Weaknesses-Threats (WT):** How can the company minimize weaknesses to avoid threats?
4.  **High-Level Strategic Recommendations:** Conclude with 2-3 high-level strategic recommendations based on your analysis.

Return your response in the required JSON format with a single "analysis" field containing the full markdown text.
`,
});

const generateSwotAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSwotAnalysisFlow',
    inputSchema: GenerateSwotAnalysisInputSchema,
    outputSchema: GenerateSwotAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
