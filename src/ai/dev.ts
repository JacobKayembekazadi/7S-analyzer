import { config } from 'dotenv';
config();

import '@/ai/flows/generate-7s-analysis.ts';
import '@/ai/flows/refine-7s-analysis.ts';
import '@/ai/flows/prompt-from-template.ts';
import '@/ai/flows/generate-swot-analysis.ts';
import '@/ai/flows/generate-town-hall.ts';
