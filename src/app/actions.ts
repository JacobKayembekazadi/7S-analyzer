"use server";

import {
  generate7SAnalysis,
  Generate7SAnalysisInput,
  Generate7SAnalysisOutput,
} from "@/ai/flows/generate-7s-analysis";
import {
  promptFromTemplate,
  PromptFromTemplateInput,
  PromptFromTemplateOutput,
} from "@/ai/flows/prompt-from-template";
import {
  refine7SAnalysis,
  Refine7SAnalysisInput,
  Refine7SAnalysisOutput,
} from "@/ai/flows/refine-7s-analysis";

export async function generateAnalysis(
  input: Generate7SAnalysisInput
): Promise<Generate7SAnalysisOutput> {
  return await generate7SAnalysis(input);
}

export async function refineAnalysis(
  input: Refine7SAnalysisInput
): Promise<Refine7SAnalysisOutput> {
  return await refine7SAnalysis(input);
}

export async function getTemplate(
  input: PromptFromTemplateInput
): Promise<PromptFromTemplateOutput> {
  return await promptFromTemplate(input);
}
