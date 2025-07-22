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

const Refine7SAnalysisInputSchema = z.object({
  analysis: z.string().describe('The AI-generated 7S analysis to refine.'),
  feedback: z.string().describe('User feedback on the AI-generated analysis.'),
});
export type Refine7SAnalysisInput = z.infer<typeof Refine7SAnalysisInputSchema>;

const Refine7SAnalysisOutputSchema = z.object({
  refinedAnalysis: z.string().describe('The refined 7S analysis based on user feedback.'),
});
export type Refine7SAnalysisOutput = z.infer<typeof Refine7SAnalysisOutputSchema>;

export async function refine7SAnalysis(input: Refine7SAnalysisInput): Promise<Refine7SAnalysisOutput> {
  return refine7SAnalysisFlow(input);
}

const refine7SAnalysisPrompt = ai.definePrompt({
  name: 'refine7SAnalysisPrompt',
  input: {schema: Refine7SAnalysisInputSchema},
  output: {schema: Refine7SAnalysisOutputSchema},
  prompt: `You are an AI expert in McKinsey 7-S framework. You have generated an analysis based on user provided data.
Now the user has provided feedback on your analysis. Please refine your analysis based on the feedback.

Original Analysis: {{{analysis}}}

User Feedback: {{{feedback}}}

Refined Analysis:`,
});

const refine7SAnalysisFlow = ai.defineFlow(
  {
    name: 'refine7SAnalysisFlow',
    inputSchema: Refine7SAnalysisInputSchema,
    outputSchema: Refine7SAnalysisOutputSchema,
  },
  async input => {
    const {output} = await refine7SAnalysisPrompt(input);
    return output!;
  }
);
