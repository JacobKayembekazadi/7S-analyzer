'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining the 7S analysis based on user feedback.
 *
 * - refine7SAnalysis - A function that refines the 7S analysis based on feedback.
 * - Refine7SAnalysisInput - The input type for the refine7SAnalysis function.
 * - Refine7SAnalysisOutput - The return type for the refine7SAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Generate7SAnalysisOutput } from './generate-7s-analysis';

const Refine7SAnalysisInputSchema = z.object({
  analysis: z.string().describe('The AI-generated 7S analysis to refine.'),
  feedback: z.string().describe('User feedback on the AI-generated analysis.'),
  recommendations: z.array(z.object({
    recommendation: z.string(),
    priority: z.string(),
  })).describe("The original recommendations."),
  chartData: z.array(z.object({
    name: z.string(),
    score: z.number(),
  })).describe("The original chart data."),
});
export type Refine7SAnalysisInput = z.infer<typeof Refine7SAnalysisInputSchema>;


export type Refine7SAnalysisOutput = Generate7SAnalysisOutput;


export async function refine7SAnalysis(input: Refine7SAnalysisInput): Promise<Refine7SAnalysisOutput> {
  return refine7SAnalysisFlow(input);
}

const refine7SAnalysisPrompt = ai.definePrompt({
  name: 'refine7SAnalysisPrompt',
  input: {schema: Refine7SAnalysisInputSchema},
  output: {schema: z.object({
    analysis: z.string().describe('The refined 7S analysis based on user feedback, in markdown format.'),
    recommendations: z.array(z.object({
      recommendation: z.string().describe("A specific, actionable recommendation for improvement."),
      priority: z.enum(["High", "Medium", "Low"]).describe("The priority of the recommendation."),
    })).describe("An updated list of actionable recommendations based on the feedback."),
    chartData: z.array(z.object({
        name: z.string().describe("The name of the 7-S element."),
        score: z.number().min(0).max(100).describe("An updated alignment score from 0 (poor) to 100 (excellent)."),
    })).describe("Updated data for the alignment radar chart based on the feedback.")
  })},
  prompt: `You are an AI expert in McKinsey 7-S framework. You have generated an analysis based on user provided data.
Now the user has provided feedback on your analysis. Please refine your entire output (analysis, recommendations, and chart scores) based on the feedback.

It is critical that you re-evaluate all three parts of the output. The user's feedback might fundamentally change the interpretation of their situation.

Original Analysis:
{{{analysis}}}

Original Recommendations:
{{#each recommendations}}
- [{{priority}}] {{{recommendation}}}
{{/each}}

Original Chart Scores:
{{#each chartData}}
- {{name}}: {{score}}
{{/each}}

User Feedback:
"{{{feedback}}}"

Now, provide the refined output in the required JSON format.
`,
});

const refine7SAnalysisFlow = ai.defineFlow(
  {
    name: 'refine7SAnalysisFlow',
    inputSchema: Refine7SAnalysisInputSchema,
    outputSchema: z.object({
        analysis: z.string(),
        recommendations: z.array(z.object({ recommendation: z.string(), priority: z.enum(["High", "Medium", "Low"])})),
        chartData: z.array(z.object({ name: z.string(), score: z.number() })),
    }),
  },
  async input => {
    const {output} = await refine7SAnalysisPrompt(input);
    return output!;
  }
);
