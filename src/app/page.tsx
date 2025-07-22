"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { generateAnalysis, getTemplate, refineAnalysis } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { SevenSElements } from "@/lib/types";

const formSchema = z.object({
  strategy: z.string().min(1, "Strategy description is required."),
  structure: z.string().min(1, "Structure description is required."),
  systems: z.string().min(1, "Systems description is required."),
  sharedValues: z.string().min(1, "Shared Values description is required."),
  style: z.string().min(1, "Style description is required."),
  staff: z.string().min(1, "Staff description is required."),
  skills: z.string().min(1, "Skills description is required."),
});

const S_ELEMENTS: {
  key: keyof SevenSElements;
  label: string;
  tooltip: string;
}[] = [
  { key: "strategy", label: "Strategy", tooltip: "The plan devised to maintain and build competitive advantage over the competition." },
  { key: "structure", label: "Structure", tooltip: "The way the organization is structured and who reports to whom." },
  { key: "systems", label: "Systems", tooltip: "The daily activities and procedures that staff members engage in to get the job done." },
  { key: "sharedValues", label: "Shared Values", tooltip: "Called 'superordinate goals' when the model was first developed, these are the core values of the company that are evidenced in the corporate culture and the general work ethic." },
  { key: "style", label: "Style", tooltip: "The style of leadership adopted." },
  { key: "staff", label: "Staff", tooltip: "The employees and their general capabilities." },
  { key: "skills", label: "Skills", tooltip: "The actual skills and competencies of the employees working for the company." },
];

export default function Home() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      strategy: "",
      structure: "",
      systems: "",
      sharedValues: "",
      style: "",
      staff: "",
      skills: "",
    },
  });

  const handleTemplateChange = async (templateName: string) => {
    if (!templateName) return;
    setIsLoading(true);
    try {
      const templateData = await getTemplate({ templateName });
      if (templateData) {
        form.reset(templateData);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading template",
        description: "Could not load the selected template. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await generateAnalysis(values);
      setAnalysis(result.analysis);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The AI could not generate an analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!analysis || !feedback) return;
    setIsRefining(true);
    try {
      const result = await refineAnalysis({ analysis, feedback });
      setAnalysis(result.refinedAnalysis);
      setFeedback("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: "The AI could not refine the analysis. Please try again.",
      });
    } finally {
      setIsRefining(false);
    }
  };


  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-background">
        <main className="container mx-auto grid grid-cols-1 gap-12 px-4 py-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <header className="mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">7S Analyzer</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Assess your organization's alignment with the McKinsey 7S framework.
              </p>
            </header>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm font-medium">Load a template:</p>
                <Select onValueChange={handleTemplateChange} disabled={isLoading}>
                    <SelectTrigger className="w-full sm:w-[240px]">
                        <SelectValue placeholder="Select an example" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tech-startup">Tech Startup</SelectItem>
                        <SelectItem value="traditional-manufacturing">Traditional Manufacturing</SelectItem>
                        <SelectItem value="non-profit">Non-Profit</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Accordion type="single" collapsible className="w-full" defaultValue="strategy">
                  {S_ELEMENTS.map(({ key, label, tooltip }) => (
                    <AccordionItem value={key} key={key}>
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-2">
                           {label}
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name={key}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="sr-only">{label}</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={`Describe your organization's ${label.toLowerCase()}...`}
                                  className="min-h-[120px] resize-y bg-card"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Analysis
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <aside className="lg:col-span-2">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">AI Analysis</CardTitle>
                <CardDescription>
                  Review the AI-generated alignment analysis below.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[400px]">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : analysis ? (
                  <>
                    <div className="prose prose-sm max-w-none rounded-md border bg-background/50 p-4">
                        <Markdown content={analysis} />
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Refine Analysis</h3>
                        <Textarea 
                            placeholder="Provide feedback to improve the analysis. For example, 'Focus more on the disconnect between strategy and skills.'"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="min-h-[100px] bg-card mb-2"
                            disabled={isRefining}
                        />
                        <Button onClick={handleRefine} disabled={isRefining || !feedback}>
                            {isRefining ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Refining...
                                </>
                            ) : (
                                "Refine with Feedback"
                            )}
                        </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-8 text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      Your analysis will appear here once generated.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </TooltipProvider>
  );
}
