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

const Generate7SAnalysisOutputSchema = z.object({
  analysis: z.string().describe('AI-generated analysis of the alignment between the seven elements, in markdown format.'),
});
export type Generate7SAnalysisOutput = z.infer<typeof Generate7SAnalysisOutputSchema>;

export async function generate7SAnalysis(input: Generate7SAnalysisInput): Promise<Generate7SAnalysisOutput> {
  return generate7SAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generate7SAnalysisPrompt',
  input: {schema: Generate7SAnalysisInputSchema},
  output: {schema: Generate7SAnalysisOutputSchema},
  prompt: `You are a management consultant specializing in organizational alignment using the McKinsey 7-S framework.

You will be provided with descriptions of each of the seven elements of the framework: Strategy, Structure, Systems, Shared Values, Style, Staff, and Skills.

Your task is to analyze the alignment between these elements and provide a concise analysis, formatted in markdown, identifying potential areas for improvement within the organization.

Strategy: {{{strategy}}}
Structure: {{{structure}}}
Systems: {{{systems}}}
Shared Values: {{{sharedValues}}}
Style: {{{style}}}
Staff: {{{staff}}}
Skills: {{{skills}}}

Analyze the alignment between these elements and provide a concise analysis in markdown, identifying potential areas for improvement within the organization.
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
