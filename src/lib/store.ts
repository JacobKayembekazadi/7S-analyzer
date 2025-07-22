import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Generate7SAnalysisOutput, Recommendation } from '@/ai/flows/generate-7s-analysis';
import type { GenerateSwotAnalysisOutput } from '@/ai/flows/generate-swot-analysis';

export interface Goal {
    id: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    actions: ActionItem[];
}

export interface ActionItem {
    id: string;
    task: string;
    completed: boolean;
}

interface AppState {
  analysisResult: Generate7SAnalysisOutput | null;
  setAnalysisResult: (result: Generate7SAnalysisOutput | null) => void;
  swotResult: GenerateSwotAnalysisOutput | null;
  setSwotResult: (result: GenerateSwotAnalysisOutput | null) => void;
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  removeGoal: (index: number) => void;
  updateGoal: (index: number, goal: Goal) => void;
}

const useStoreRaw = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        analysisResult: null,
        setAnalysisResult: (result) => set({ analysisResult: result }),
        swotResult: null,
        setSwotResult: (result) => set({ swotResult: result }),
        goals: [],
        addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
        removeGoal: (index) => set((state) => ({ goals: state.goals.filter((_, i) => i !== index) })),
        updateGoal: (index, goal) => set((state) => {
            const newGoals = [...state.goals];
            newGoals[index] = goal;
            return { goals: newGoals };
        }),
      }),
      {
        name: 'strategic-os-storage',
      }
    )
  )
);

// HoC to deal with Zustand hydration issues in Next.js
import { useState, useEffect } from 'react';

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

// Custom hook to use the store
export const useAppStore = () => {
    const analysisResult = useStore(useStoreRaw, (state) => state.analysisResult);
    const setAnalysisResult = useStoreRaw((state) => state.setAnalysisResult);
    const swotResult = useStore(useStoreRaw, (state) => state.swotResult);
    const setSwotResult = useStoreRaw((state) => state.setSwotResult);
    const goals = useStore(useStoreRaw, (state) => state.goals);
    const addGoal = useStoreRaw((state) => state.addGoal);
    const removeGoal = useStoreRaw((state) => state.removeGoal);
    const updateGoal = useStoreRaw((state) => state.updateGoal);

    return { analysisResult, setAnalysisResult, swotResult, setSwotResult, goals, addGoal, removeGoal, updateGoal };
}

// Temporary solution until Zustand v5 is released
export { useStoreRaw as useStore };
