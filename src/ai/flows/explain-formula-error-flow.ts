'use server';
/**
 * @fileOverview An AI agent to provide explanations or hints for Excel formula errors.
 *
 * - explainFormulaError - A function that handles generating AI explanations for formula errors.
 * - ExplainFormulaErrorInput - The input type for the explainFormulaError function.
 * - ExplainFormulaErrorOutput - The return type for the explainFormulaError function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExerciseCellSchema = z.record(z.string(), z.union([z.string(), z.number()]));

const ExerciseTestSchema = z.object({
  overrideCells: ExerciseCellSchema.optional().describe('Optional cell overrides for this test case.'),
  expected: z.union([z.string(), z.number()]).describe('The expected result for this test case.'),
});

const ExerciseSchema = z.object({
  id: z.string().describe('Unique identifier for the exercise.'),
  skill: z.string().describe('The Excel skill targeted by the exercise (e.g., SUMIFS, XLOOKUP).'),
  prompt: z.string().describe('The problem statement or prompt for the exercise.'),
  cells: ExerciseCellSchema.describe('A map of pre-filled cells (A1-style) and their values.'),
  targetCell: z.string().describe('The cell where the user is expected to enter their formula.'),
  tests: z.array(ExerciseTestSchema).describe('An array of test cases to validate the user\'s formula.'),
});

const ExplainFormulaErrorInputSchema = z.object({
  exercise: ExerciseSchema.describe('The details of the exercise the user is attempting.'),
  userFormula: z.string().describe('The Excel formula entered by the user.'),
  errorDetails: z.string().optional().describe('Optional details about why the user\'s formula failed, including which test failed and expected vs actual values.'),
});
export type ExplainFormulaErrorInput = z.infer<typeof ExplainFormulaErrorInputSchema>;

const ExplainFormulaErrorOutputSchema = z.object({
  explanation: z.string().describe('An explanation or hint to help the user understand their formula error or approach the problem more effectively.'),
});
export type ExplainFormulaErrorOutput = z.infer<typeof ExplainFormulaErrorOutputSchema>;

export async function explainFormulaError(input: ExplainFormulaErrorInput): Promise<ExplainFormulaErrorOutput> {
  return explainFormulaErrorFlow(input);
}

const explainFormulaErrorPrompt = ai.definePrompt({
  name: 'explainFormulaErrorPrompt',
  input: {schema: ExplainFormulaErrorInputSchema},
  output: {schema: ExplainFormulaErrorOutputSchema},
  prompt: `You are an expert Microsoft Excel tutor. Your goal is to help a user understand why their Excel formula is incorrect or how to approach a problem more effectively, without directly giving them the correct answer. Provide a clear, concise, and educational explanation.

Here is the exercise:
Prompt: {{{exercise.prompt}}}

Pre-filled cells:
{{#each exercise.cells}}
- {{@key}}: {{this}}
{{/each}}

The user's formula should go into cell: {{{exercise.targetCell}}}

The test cases are:
{{#each exercise.tests}}
- Expected: {{this.expected}} {{#if this.overrideCells}}(with overrides: {{#each this.overrideCells}}{{@key}}: {{this}}, {{/each}}){{/if}}
{{/each}}

The user submitted the following formula:
{{{userFormula}}}

{{#if errorDetails}}
The formula resulted in the following error details:
{{{errorDetails}}}
{{/if}}

Please explain what might be wrong with their formula or guide them on how to approach the problem. Focus on the concepts involved and general strategies, rather than just pointing out syntax errors directly. Keep your explanation concise and encouraging.`,
});

const explainFormulaErrorFlow = ai.defineFlow(
  {
    name: 'explainFormulaErrorFlow',
    inputSchema: ExplainFormulaErrorInputSchema,
    outputSchema: ExplainFormulaErrorOutputSchema,
  },
  async input => {
    const {output} = await explainFormulaErrorPrompt(input);
    return output!;
  }
);
