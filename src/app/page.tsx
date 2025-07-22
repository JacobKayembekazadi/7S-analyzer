"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Info, Lightbulb, ListChecks, Loader2, Sparkles, Target, Shield, Skull, Telescope, Wind, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";


import { generateAnalysis, getTemplate, refineAnalysis, generateSwotAnalysis } from "@/app/actions";
import { Markdown } from "@/components/markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { Generate7SAnalysisOutput, Recommendation } from "@/ai/flows/generate-7s-analysis";
import type { SevenSElements, SwotElements } from "@/lib/types";
import { GenerateSwotAnalysisOutput } from "@/ai/flows/generate-swot-analysis";
import { Checkbox } from "@/components/ui/checkbox";

const sevenSFormSchema = z.object({
  strategy: z.string().min(1, "Strategy description is required."),
  structure: z.string().min(1, "Structure description is required."),
  systems: z.string().min(1, "Systems description is required."),
  sharedValues: z.string().min(1, "Shared Values description is required."),
  style: z.string().min(1, "Style description is required."),
  staff: z.string().min(1, "Staff description is required."),
  skills: z.string().min(1, "Skills description is required."),
});

const swotFormSchema = z.object({
  strengths: z.string().min(1, "Strengths description is required."),
  weaknesses: z.string().min(1, "Weaknesses description is required."),
  opportunities: z.string().min(1, "Opportunities description is required."),
  threats: z.string().min(1, "Threats description is required."),
});

const actionPlanSchema = z.object({
  goals: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Goal title is required."),
    priority: z.enum(["High", "Medium", "Low"]),
    actions: z.array(z.object({
      id: z.string(),
      task: z.string().min(1, "Task description is required."),
      completed: z.boolean(),
    })),
  })),
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

const SWOT_ELEMENTS: {
  key: keyof SwotElements;
  label: string;
  tooltip: string;
  icon: React.ElementType,
}[] = [
    { key: "strengths", label: "Strengths", tooltip: "Internal attributes and resources that support a positive outcome.", icon: Shield },
    { key: "weaknesses", label: "Weaknesses", tooltip: "Internal attributes that work against a positive outcome.", icon: Skull },
    { key: "opportunities", label: "Opportunities", tooltip: "External factors that the entity can use to its advantage.", icon: Telescope },
    { key: "threats", label: "Threats", tooltip: "External factors that could jeopardize the entity's success.", icon: Wind },
  ];


export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<Generate7SAnalysisOutput | null>(null);
  const [swotResult, setSwotResult] = useState<GenerateSwotAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const sevenSForm = useForm<z.infer<typeof sevenSFormSchema>>({
    resolver: zodResolver(sevenSFormSchema),
    defaultValues: {
      strategy: "", structure: "", systems: "",
      sharedValues: "", style: "", staff: "", skills: "",
    },
  });

  const swotForm = useForm<z.infer<typeof swotFormSchema>>({
    resolver: zodResolver(swotFormSchema),
    defaultValues: {
      strengths: "", weaknesses: "", opportunities: "", threats: "",
    },
  });

  const actionPlanForm = useForm<z.infer<typeof actionPlanSchema>>({
    resolver: zodResolver(actionPlanSchema),
    defaultValues: {
      goals: [],
    },
  });

  const { fields: goalFields, append: appendGoal, remove: removeGoal, update: updateGoal } = useFieldArray({
    control: actionPlanForm.control,
    name: "goals",
  });

  const addRecommendationAsGoal = (rec: Recommendation) => {
    appendGoal({
      id: `goal_${Date.now()}`,
      title: rec.recommendation,
      priority: rec.priority,
      actions: [{ id: `action_${Date.now()}`, task: "", completed: false }],
    });
     toast({
        title: "Goal Added",
        description: `"${rec.recommendation}" has been added to your action plan.`,
      });
  };
  
  const addActionItem = (goalIndex: number) => {
    const newAction = { id: `action_${Date.now()}`, task: "", completed: false };
    const goal = actionPlanForm.getValues(`goals.${goalIndex}`);
    updateGoal(goalIndex, { ...goal, actions: [...goal.actions, newAction] });
  };
  
  const removeActionItem = (goalIndex: number, actionIndex: number) => {
     const goal = actionPlanForm.getValues(`goals.${goalIndex}`);
     const newActions = goal.actions.filter((_, i) => i !== actionIndex);
     updateGoal(goalIndex, { ...goal, actions: newActions });
  };


  const handleTemplateChange = async (templateName: string) => {
    if (!templateName) return;
    setIsLoading(true);
    try {
      const templateData = await getTemplate({ templateName });
      if (templateData) {
        sevenSForm.reset(templateData);
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

  const on7sSubmit = async (values: z.infer<typeof sevenSFormSchema>) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setSwotResult(null);
    actionPlanForm.reset({ goals: [] });
    try {
      const result = await generateAnalysis(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The AI could not generate an analysis. Please check the console for errors and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSwotSubmit = async (values: z.infer<typeof swotFormSchema>) => {
    setIsLoading(true);
    setSwotResult(null);
    setAnalysisResult(null);
    actionPlanForm.reset({ goals: [] });
    try {
      const result = await generateSwotAnalysis(values);
      setSwotResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "SWOT Analysis Failed",
        description: "The AI could not generate a SWOT analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!analysisResult || !feedback) return;
    setIsRefining(true);
    try {
      const result = await refineAnalysis({
        analysis: analysisResult.analysis,
        recommendations: analysisResult.recommendations,
        chartData: analysisResult.chartData,
        feedback
      });
      setAnalysisResult(result);
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
  
  const priorityIcon = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High': return <Target className="text-red-500" />;
      case 'Medium': return <Lightbulb className="text-yellow-500" />;
      case 'Low': return <ListChecks className="text-blue-500" />;
      default: return null;
    }
  };


  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-background">
        <main className="container mx-auto grid grid-cols-1 gap-12 px-4 py-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <header className="mb-8">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">Strategic Alignment OS</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                From insight to action. Transform your organization with an integrated strategic toolkit.
              </p>
            </header>

            <Tabs defaultValue="7s">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="7s">7-S Analysis</TabsTrigger>
                <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="7s">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Load a 7-S Example</CardTitle>
                    <CardDescription>
                      Select an industry template to pre-fill the 7-S inputs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select onValueChange={handleTemplateChange} disabled={isLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech-startup">Tech Startup</SelectItem>
                        <SelectItem value="traditional-manufacturing">Traditional Manufacturing</SelectItem>
                        <SelectItem value="non-profit">Non-Profit</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                <Form {...sevenSForm}>
                  <form onSubmit={sevenSForm.handleSubmit(on7sSubmit)} className="mt-8 space-y-4">
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
                              control={sevenSForm.control}
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
                      {isLoading && !isRefining ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate 7-S Analysis
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="swot">
                <Form {...swotForm}>
                  <form onSubmit={swotForm.handleSubmit(onSwotSubmit)} className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {SWOT_ELEMENTS.map(({ key, label, tooltip, icon: Icon }) => (
                        <Card key={key}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                              <Icon className="h-6 w-6" />
                              {label}
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <FormField
                              control={swotForm.control}
                              name={key}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="sr-only">{label}</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder={`List your organization's internal ${label.toLowerCase()}...`}
                                      className="min-h-[150px] resize-y bg-card"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading && !isRefining ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating SWOT...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate SWOT Analysis
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

            </Tabs>
          </div>

          <aside className="lg:col-span-3">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Strategic Blueprint</CardTitle>
                <CardDescription>
                  AI-generated insights to drive your business forward.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[600px]">
                {isLoading ? (
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="h-64 w-full pt-8">
                      <Skeleton className="h-full w-full rounded-md" />
                    </div>
                  </div>
                ) : analysisResult ? (
                  <Tabs defaultValue="actions" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                       <TabsTrigger value="actions">Goals &amp; Actions</TabsTrigger>
                       <TabsTrigger value="analysis">7-S Full Analysis</TabsTrigger>
                       <TabsTrigger value="chart">7-S Alignment Chart</TabsTrigger>
                    </TabsList>
                    
                     <TabsContent value="actions" className="mt-6">
                      <Card>
                        <CardHeader>
                            <CardTitle>Recommended Goals</CardTitle>
                            <CardDescription>Click to add a recommendation to your action plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {analysisResult.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md border p-2 bg-background/50">
                               <div className="flex items-center gap-3">
                                  {priorityIcon(rec.priority)}
                                  <span className="text-sm font-medium">{rec.recommendation}</span>
                                  <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'} className="hidden sm:inline-flex">{rec.priority}</Badge>
                               </div>
                               <Button variant="ghost" size="icon" onClick={() => addRecommendationAsGoal(rec)}>
                                  <PlusCircle className="h-5 w-5 text-primary" />
                               </Button>
                            </div>
                           ))}
                        </CardContent>
                      </Card>

                       <Form {...actionPlanForm}>
                        <form>
                          {goalFields.length > 0 && <h3 className="text-xl font-bold mt-6 mb-4">Your Action Plan</h3>}
                          <div className="space-y-6">
                            {goalFields.map((goal, goalIndex) => (
                              <Card key={goal.id} className="bg-background/80">
                                <CardHeader>
                                  <div className="flex justify-between items-start">
                                    <FormField
                                        control={actionPlanForm.control}
                                        name={`goals.${goalIndex}.title`}
                                        render={({ field }) => (
                                          <Input {...field} className="text-lg font-semibold border-none shadow-none p-0 focus-visible:ring-0" />
                                        )}
                                      />
                                    <Button variant="ghost" size="icon" onClick={() => removeGoal(goalIndex)}>
                                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                  </div>
                                  <Badge variant={goal.priority === 'High' ? 'destructive' : 'secondary'} className="w-min">{goal.priority} Priority</Badge>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {goal.actions.map((action, actionIndex) => (
                                    <div key={action.id} className="flex items-center gap-2">
                                      <FormField
                                        control={actionPlanForm.control}
                                        name={`goals.${goalIndex}.actions.${actionIndex}.completed`}
                                        render={({ field }) => (
                                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        )}
                                      />
                                      <FormField
                                        control={actionPlanForm.control}
                                        name={`goals.${goalIndex}.actions.${actionIndex}.task`}
                                        render={({ field }) => (
                                          <Input {...field} placeholder="Describe the action item..." className="flex-grow" />
                                        )}
                                      />
                                      <Button variant="ghost" size="icon" onClick={() => removeActionItem(goalIndex, actionIndex)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                      </Button>
                                    </div>
                                  ))}
                                   <Button type="button" variant="outline" size="sm" onClick={() => addActionItem(goalIndex)}>
                                      <PlusCircle className="mr-2 h-4 w-4" /> Add Action Item
                                   </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </form>
                       </Form>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-4">
                      <div className="prose prose-sm max-w-none rounded-md border bg-background/50 p-4 max-h-[450px] overflow-y-auto">
                        <Markdown content={analysisResult.analysis} />
                      </div>
                       <div className="mt-6 border-t pt-6">
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
                    </TabsContent>
                    
                    <TabsContent value="chart" className="mt-4">
                      <ChartContainer
                        config={{
                          score: {
                            label: "Score",
                            color: "hsl(var(--primary))",
                          },
                        }}
                        className="mx-auto aspect-square h-[350px]"
                      >
                        <RadarChart data={analysisResult.chartData}>
                          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                          <PolarAngleAxis dataKey="name" />
                          <PolarGrid />
                          <Radar
                            dataKey="score"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.6}
                            stroke="hsl(var(--primary))"
                          />
                        </RadarChart>
                      </ChartContainer>
                    </TabsContent>

                  </Tabs>
                ) : swotResult ? (
                  <Tabs defaultValue="swot-analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="swot-analysis">SWOT Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="swot-analysis" className="mt-4">
                       <div className="prose prose-sm max-w-none rounded-md border bg-background/50 p-4 max-h-[550px] overflow-y-auto">
                          <Markdown content={swotResult.analysis} />
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-8 text-center">
                    <Award className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 max-w-sm text-center text-muted-foreground">
                      Your personalized strategic blueprint will appear here. Choose an analysis type to get started.
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
