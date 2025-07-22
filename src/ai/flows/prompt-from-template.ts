'use server';

/**
 * @fileOverview Implements a Genkit flow to pre-populate the 7-S elements based on user-selected templates.
 *
 * - promptFromTemplate - A function that retrieves a template and pre-fills the 7-S elements.
 * - PromptFromTemplateInput - The input type for the promptFromTemplate function, which is the template name.
 * - PromptFromTemplateOutput - The return type for the promptFromTemplate function, which is a dictionary of 7-S elements.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the schema for the input: template name
const PromptFromTemplateInputSchema = z.object({
  templateName: z.string().describe('The name of the template to use.'),
});
export type PromptFromTemplateInput = z.infer<typeof PromptFromTemplateInputSchema>;

// Define the schema for the output: a dictionary of 7-S elements
const PromptFromTemplateOutputSchema = z.object({
  strategy: z.string().describe('The strategy element of the 7-S framework.'),
  structure: z.string().describe('The structure element of the 7-S framework.'),
  systems: z.string().describe('The systems element of the 7-S framework.'),
  sharedValues: z.string().describe('The shared values element of the 7-S framework.'),
  style: z.string().describe('The style element of the 7-S framework.'),
  staff: z.string().describe('The staff element of the 7-S framework.'),
  skills: z.string().describe('The skills element of the 7-S framework.'),
});
export type PromptFromTemplateOutput = z.infer<typeof PromptFromTemplateOutputSchema>;

// Exported function to call the flow
export async function promptFromTemplate(input: PromptFromTemplateInput): Promise<PromptFromTemplateOutput> {
  return promptFromTemplateFlow(input);
}

// Define the Genkit prompt (not directly used in this case, but kept for potential future use)
const prompt = ai.definePrompt({
  name: 'promptFromTemplatePrompt',
  input: {schema: PromptFromTemplateInputSchema},
  output: {schema: PromptFromTemplateOutputSchema},
  prompt: `Based on the template name {{{templateName}}}, return a JSON object representing the 7-S elements.`, // This prompt might not be used directly
});


// Define the Genkit flow
const promptFromTemplateFlow = ai.defineFlow(
  {
    name: 'promptFromTemplateFlow',
    inputSchema: PromptFromTemplateInputSchema,
    outputSchema: PromptFromTemplateOutputSchema,
  },
  async input => {
    // Mock template data (replace with actual data retrieval logic)
    const templateData: Record<string, PromptFromTemplateOutput> = {
      'tech-startup': {
        strategy: 'Aggressive growth through innovation.',
        structure: 'Flat, agile teams.',
        systems: 'Cloud-based, automated workflows.',
        sharedValues: 'Customer obsession, data-driven decisions.',
        style: 'Entrepreneurial, risk-taking.',
        staff: 'Highly skilled engineers and marketers.',
        skills: 'Software development, digital marketing.',
      },
      'traditional-manufacturing': {
        strategy: 'Cost leadership through efficiency.',
        structure: 'Hierarchical, functional departments.',
        systems: 'ERP, standardized processes.',
        sharedValues: 'Quality, safety, reliability.',
        style: 'Conservative, process-oriented.',
        staff: 'Experienced technicians and operators.',
        skills: 'Manufacturing, engineering, supply chain management.',
      },
      'non-profit': {
        strategy: 'Maximizing social impact through collaboration.',
        structure: 'Decentralized, community-based teams.',
        systems: 'CRM, impact measurement tools.',
        sharedValues: 'Social justice, equity, compassion.',
        style: 'Collaborative, mission-driven.',
        staff: 'Passionate advocates and community organizers.',
        skills: 'Fundraising, advocacy, program management.',
      },
    };

    const template = templateData[input.templateName];

    if (!template) {
      throw new Error(`Template ${input.templateName} not found.`);
    }

    // Return the template data directly without LLM processing
    return template;
  }
);
