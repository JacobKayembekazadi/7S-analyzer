"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/store";

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


export default function ActionPlanPage() {
    const { goals, removeGoal, updateGoal } = useStore();

    const actionPlanForm = useForm<z.infer<typeof actionPlanSchema>>({
        resolver: zodResolver(actionPlanSchema),
        values: { goals },
        mode: "onChange"
    });

    const { fields: goalFields, update: updateFormField } = useFieldArray({
        control: actionPlanForm.control,
        name: "goals",
    });

    // Sync zustand state with react-hook-form state
    React.useEffect(() => {
        const subscription = actionPlanForm.watch((value) => {
            if (value.goals) {
                value.goals.forEach((goal, index) => {
                    updateGoal(index, goal);
                });
            }
        });
        return () => subscription.unsubscribe();
    }, [actionPlanForm.watch, updateGoal]);


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


  return (
    <div className="container mx-auto p-4">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Your Action Plan</CardTitle>
                <CardDescription>
                    This is where your strategic goals and tasks live. Turn insights into trackable actions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...actionPlanForm}>
                <form>
                    {goalFields.length > 0 ? (
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
                    ) : (
                         <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-8 text-center">
                            <h3 className="text-lg font-semibold">Your Action Plan is Empty</h3>
                            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                                Generate a 7-S Analysis and add recommendations to build your plan.
                            </p>
                        </div>
                    )}
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
