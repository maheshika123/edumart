'use server';

/**
 * @fileOverview Smart FAQ AI agent.
 *
 * - answerFaq - A function that answers frequently asked questions.
 * - AnswerFaqInput - The input type for the answerFaq function.
 * - AnswerFaqOutput - The return type for the answerFaq function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFaqInputSchema = z.object({
  query: z.string().describe('The question to be answered.'),
});
export type AnswerFaqInput = z.infer<typeof AnswerFaqInputSchema>;

const AnswerFaqOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerFaqOutput = z.infer<typeof AnswerFaqOutputSchema>;

export async function answerFaq(input: AnswerFaqInput): Promise<AnswerFaqOutput> {
  return answerFaqFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFaqPrompt',
  input: {schema: AnswerFaqInputSchema},
  output: {schema: AnswerFaqOutputSchema},
  prompt: `You are a helpful assistant that answers questions about a tuition center. Use the following information to answer the question.

Context: The tuition center offers classes in math, science, and English for students in grades K-12. Registration can be done online or in person. Payment can be made via cash, check, or credit card. The tuition center's schedule is available on its website.

Question: {{{query}}}`,
});

const answerFaqFlow = ai.defineFlow(
  {
    name: 'answerFaqFlow',
    inputSchema: AnswerFaqInputSchema,
    outputSchema: AnswerFaqOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
