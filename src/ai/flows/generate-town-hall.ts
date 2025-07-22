'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a town hall speech from a SWOT analysis.
 *
 * - generateTownHallSpeech - A function that takes SWOT analysis markdown and generates a speech.
 * - GenerateTownHallSpeechInput - The input type for the function.
 * - GenerateTownHallSpeechOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTownHallSpeechInputSchema = z.object({
  analysis: z.string().describe('The full markdown content of the SWOT analysis.'),
  companyName: z.string().describe('The name of the company.'),
});
export type GenerateTownHallSpeechInput = z.infer<typeof GenerateTownHallSpeechInputSchema>;

const GenerateTownHallSpeechOutputSchema = z.object({
  speech: z.string().describe('The generated town hall speech, formatted in markdown.'),
});
export type GenerateTownHallSpeechOutput = z.infer<typeof GenerateTownHallSpeechOutputSchema>;

export async function generateTownHallSpeech(input: GenerateTownHallSpeechInput): Promise<GenerateTownHallSpeechOutput> {
  return generateTownHallSpeechFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTownHallSpeechPrompt',
  input: {schema: GenerateTownHallSpeechInputSchema},
  output: {schema: GenerateTownHallSpeechOutputSchema},
  prompt: `You are a world-class CEO and an expert orator. Your task is to transform a detailed SWOT analysis into a powerful and inspiring town hall speech for the employees of the company, "{{companyName}}".

The speech should not just recite the SWOT points. It must:
1.  **Acknowledge Reality:** Be honest and transparent about the challenges (Weaknesses, Threats) the company faces. This builds trust.
2.  **Inspire Action:** Frame the Strengths and Opportunities as the tools and pathways to overcome these challenges.
3.  **Create a Shared Vision:** Rally the team around a common purpose, making them feel like a crucial part of the journey ahead.
4.  **Be Structured and Clear:** Use a clear structure (e.g., Introduction, Acknowledging Challenges, Highlighting Our Strengths, Seizing Opportunities, A Call to Action, Closing).
5.  **Maintain a Positive and Determined Tone:** Even when discussing weaknesses, the tone should be one of confidence and a call to collective improvement.

**The SWOT Analysis to use:**
{{{analysis}}}

Please generate the speech in markdown format, with clear headings for each section. Make it compelling, authentic, and ready to be delivered.`,
});

const generateTownHallSpeechFlow = ai.defineFlow(
  {
    name: 'generateTownHallSpeechFlow',
    inputSchema: GenerateTownHallSpeechInputSchema,
    outputSchema: GenerateTownHallSpeechOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
