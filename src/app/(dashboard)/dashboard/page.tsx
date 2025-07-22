import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">7-S Analysis</CardTitle>
                 <Link href="/seven-s-analysis">
                    <Button variant="outline" size="sm" className="ml-auto gap-1">
                        Start Analysis
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                 </Link>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">Align Your Organization</div>
                <p className="text-xs text-muted-foreground">
                    Use the McKinsey 7-S framework to analyze internal alignment and identify areas for improvement.
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SWOT Analysis</CardTitle>
                 <Link href="/swot-analysis">
                    <Button variant="outline" size="sm" className="ml-auto gap-1">
                        Start Analysis
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </Link>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">Assess Your Position</div>
                <p className="text-xs text-muted-foreground">
                   Analyze Strengths, Weaknesses, Opportunities, and Threats to inform your strategic planning.
                </p>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                    <CardTitle>Welcome to your Strategic Alignment OS</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                        From insight to action. Transform your organization with an integrated strategic toolkit.
                        This dashboard provides the tools you need to analyze your organization, identify key opportunities,
                        and build a concrete action plan for success.
                    </CardDescription>
                </CardHeader>
                 <CardContent>
                    <Link href="/action-plan">
                        <Button>View Your Action Plan</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
