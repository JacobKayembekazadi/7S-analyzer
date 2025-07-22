"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, Sparkles, Shield, Skull, Telescope, Wind } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { generateSwotAnalysis } from "@/app/actions";
import { Markdown } from "@/components/markdown";
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
} from "@/components/ui/form";
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
import type { SwotElements } from "@/lib/types";
import { useStore } from "@/lib/store";

const swotFormSchema = z.object({
  strengths: z.string().min(1, "Strengths description is required."),
  weaknesses: z.string().min(1, "Weaknesses description is required."),
  opportunities: z.string().min(1, "Opportunities description is required."),
  threats: z.string().min(1, "Threats description is required."),
});


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


export default function SwotAnalysisPage() {
  const { swotResult, setSwotResult } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const swotForm = useForm<z.infer<typeof swotFormSchema>>({
    resolver: zodResolver(swotFormSchema),
    defaultValues: {
      strengths: "", weaknesses: "", opportunities: "", threats: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof swotFormSchema>) => {
    setIsLoading(true);
    setSwotResult(null);
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

  return (
    <TooltipProvider>
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>SWOT Analysis Input</CardTitle>
                    <CardDescription>
                        Describe your organization's strengths, weaknesses, opportunities, and threats.
                    </CardDescription>
                </CardHeader>
            </Card>
            <Form {...swotForm}>
                <form onSubmit={swotForm.handleSubmit(onSubmit)} className="mt-8 space-y-4">
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
                            </FormItem>
                            )}
                        />
                        </CardContent>
                    </Card>
                    ))}
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
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
          </div>

          <aside className="lg:col-span-3">
            <Card className="sticky top-8 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Your SWOT Analysis</CardTitle>
                <CardDescription>
                  AI-generated insights from your SWOT inputs.
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[600px]">
                {isLoading ? (
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
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
                    <h3 className="text-lg font-semibold">Generate an Analysis</h3>
                     <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                      Your SWOT analysis will appear here. Fill out the form on the left to get started.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
      </div>
    </TooltipProvider>
  );
}
