"use client"

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, TrendingUp, BookOpenCheck, CheckCircle, Activity, Sparkles, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getDashboardInsights, type DashboardDataInput } from "@/ai/flows/dashboard-insights";

// Data is now defined outside the component to be reused in the effect
const keyMetrics = {
    totalRevenue: 45231.89,
    revenueChange: 20.1,
    totalStudents: 125,
    studentChange: 12,
    activeClasses: 32,
    attendanceRate: 96.2,
};

const subjectData = [
  { subject: "Math", students: 45, fill: "var(--color-math)" },
  { subject: "Science", students: 35, fill: "var(--color-science)" },
  { subject: "English", students: 25, fill: "var(--color-english)" },
  { subject: "History", students: 10, fill: "var(--color-history)" },
  { subject: "Art", students: 10, fill: "var(--color-art)" },
]

const chartConfig = {
  students: {
    label: "Students",
  },
  math: {
    label: "Math",
    color: "hsl(var(--chart-1))",
  },
  science: {
    label: "Science",
    color: "hsl(var(--chart-2))",
  },
  english: {
    label: "English",
    color: "hsl(var(--chart-3))",
  },
  history: {
    label: "History",
    color: "hsl(var(--chart-4))",
  },
  art: {
    label: "Art",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

const recentActivities = [
    { name: "Liam Johnson", description: "registered for Math 101.", avatar: "https://placehold.co/40x40.png", hint: "person boy", time: "5m ago" },
    { name: "Olivia Smith", description: "paid the monthly fee.", avatar: "https://placehold.co/40x40.png", hint: "person girl", time: "1h ago" },
    { name: "Noah Williams", description: "registered for Science 9.", avatar: "https://placehold.co/40x40.png", hint: "person man", time: "3h ago" },
    { name: "Emma Brown", description: "cancelled their English class.", avatar: "https://placehold.co/40x40.png", hint: "person woman", time: "1d ago" },
    { name: "James Jones", description: "registered for Math 101.", avatar: "https://placehold.co/40x40.png", hint: "person child", time: "2d ago" },
];


export default function DashboardPage() {
  const [insights, setInsights] = React.useState<string>("");
  const [isLoadingInsights, setIsLoadingInsights] = React.useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      setIsLoadingInsights(true);
      try {
        const dashboardData: DashboardDataInput = {
          ...keyMetrics,
          studentDistribution: subjectData.map(({subject, students}) => ({subject, students})),
          recentActivities: recentActivities.map(({description, time}) => ({description, time})),
        };
        const result = await getDashboardInsights(dashboardData);
        setInsights(result.insights);
      } catch (error) {
        console.error("Failed to fetch dashboard insights:", error);
        setInsights("Could not load AI insights at the moment. Please try again later.");
      }
      setIsLoadingInsights(false);
    };

    fetchInsights();
  }, []);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your tuition center's performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${keyMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{keyMetrics.revenueChange}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{keyMetrics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +{keyMetrics.studentChange} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Classes
            </CardTitle>
            <BookOpenCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{keyMetrics.activeClasses}</div>
            <p className="text-xs text-muted-foreground">
              +4 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{keyMetrics.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              -0.5% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Student Distribution by Subject</CardTitle>
            <CardDescription>A breakdown of students enrolled in different subjects.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={subjectData}
                  dataKey="students"
                  nameKey="subject"
                  innerRadius={80}
                  strokeWidth={5}
                >
                    {subjectData.map((entry) => (
                        <Cell key={`cell-${entry.subject}`} fill={entry.fill} />
                    ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>An AI summary of your dashboard data.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInsights ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating insights...</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{insights}</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>A log of recent student and payment activities.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={activity.avatar} data-ai-hint={activity.hint} alt="Avatar" />
                        <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">
                          {activity.name}
                          <span className="font-normal text-muted-foreground"> {activity.description}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
