'use server';
/**
 * @fileOverview An AI agent that analyzes dashboard data and provides insights.
 *
 * - getDashboardInsights - A function that handles the insight generation process.
 * - DashboardDataInput - The input type for the getDashboardInsights function.
 * - DashboardInsightsOutput - The return type for the getDashboardInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DashboardDataInputSchema = z.object({
  totalRevenue: z.number(),
  revenueChange: z.number(),
  totalStudents: z.number(),
  studentChange: z.number(),
  activeClasses: z.number(),
  attendanceRate: z.number(),
  studentDistribution: z.array(z.object({ subject: z.string(), students: z.number() })),
  recentActivities: z.array(z.object({ description: z.string(), time: z.string() })),
});
export type DashboardDataInput = z.infer<typeof DashboardDataInputSchema>;

const DashboardInsightsOutputSchema = z.object({
  insights: z.string().describe('A 2-3 bullet point summary of key insights from the data, formatted as a string with each point starting with a bullet (e.g., "• Insight one.\\n• Insight two.").'),
});
export type DashboardInsightsOutput = z.infer<typeof DashboardInsightsOutputSchema>;

export async function getDashboardInsights(input: DashboardDataInput): Promise<DashboardInsightsOutput> {
  return dashboardInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dashboardInsightsPrompt',
  input: { schema: DashboardDataInputSchema },
  output: { schema: DashboardInsightsOutputSchema },
  prompt: `You are an expert business analyst for a tuition center. Your task is to analyze the following dashboard data and provide a concise, 2-3 bullet point summary of the most important trends, achievements, or areas for attention. Frame the insights as if you are advising the center's manager. Be brief, actionable, and encouraging.

Here is the data for your analysis:

## Key Metrics
- Total Revenue: \${{totalRevenue}} ({{revenueChange}}% from last month)
- Total Students: {{totalStudents}} (+{{studentChange}} from last month)
- Active Classes: {{activeClasses}}
- Attendance Rate: {{attendanceRate}}%

## Student Distribution by Subject
{{#each studentDistribution}}
- {{subject}}: {{students}} students
{{/each}}

## Recent Activities
{{#each recentActivities}}
- {{description}} ({{time}})
{{/each}}

Based on this data, provide your summary.
`,
});

const dashboardInsightsFlow = ai.defineFlow(
  {
    name: 'dashboardInsightsFlow',
    inputSchema: DashboardDataInputSchema,
    outputSchema: DashboardInsightsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
