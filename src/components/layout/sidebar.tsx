import Link from "next/link";
import { Home, BarChart, CheckSquare, GanttChartSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  return (
    <aside className="hidden border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Strategic OS</span>
            </Link>
            <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                <GanttChartSquare className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="/seven-s-analysis"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                <BarChart className="h-5 w-5" />
                <span className="sr-only">7-S Analysis</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">7-S Analysis</TooltipContent>
            </Tooltip>
            <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="/swot-analysis"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                <CheckSquare className="h-5 w-5" />
                <span className="sr-only">SWOT Analysis</span>
                </a >
            </TooltipTrigger>
            <TooltipContent side="right">SWOT Analysis</TooltipContent>
            </Tooltip>
             <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="/action-plan"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                <CheckSquare className="h-5 w-5" />
                <span className="sr-only">Action Plan</span>
                </a >
            </TooltipTrigger>
            <TooltipContent side="right">Action Plan</TooltipContent>
            </Tooltip>
        </nav>
    </aside>
  );
}
