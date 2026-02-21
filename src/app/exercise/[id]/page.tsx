"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Exercise, Attempt } from '@/lib/types';
import { evaluateFormula, EvaluationResult } from '@/lib/evaluator';
import { FormulaGrid } from '@/components/FormulaGrid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ChevronLeft, Lightbulb, Sparkles, Loader2, Trophy, BookOpen, Play } from 'lucide-react';
import { explainFormulaError } from '@/ai/flows/explain-formula-error-flow';

export default function ExercisePlayer() {
  const { id } = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [mode, setMode] = useState<'lesson' | 'practice'>('lesson');
  const [formula, setFormula] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/exercises/${id}`)
      .then(res => res.json())
      .then(data => {
        setExercise(data);
        setFormula('=');
        // If there's no lesson, skip straight to practice
        if (!data.lesson) setMode('practice');
      });
  }, [id]);

  const handleCheck = async () => {
    if (!exercise || !formula) return;
    
    setIsSubmitting(true);
    const evalResult = evaluateFormula(exercise, formula);
    setResult(evalResult);
    setAiHint(null);

    // Save attempt to backend
    const attempt: Omit<Attempt, 'timestamp'> = {
      exerciseId: exercise.id,
      userFormula: formula,
      passed: evalResult.passed,
      details: {
        testResults: evalResult.testResults
      }
    };

    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attempt)
      });
    } catch (e) {
      console.error("Failed to save attempt", e);
    }

    setIsSubmitting(false);
  };

  const handleAskAi = async () => {
    if (!exercise || !formula || !result) return;
    
    setIsAiLoading(true);
    try {
      const errorDetails = result.testResults
        .filter(r => !r.passed)
        .map((r, i) => `Test ${i+1} failed: Expected ${r.expected}, got ${JSON.stringify(r.actual)}`)
        .join('. ');

      const aiResponse = await explainFormulaError({
        exercise: {
          id: exercise.id,
          skill: exercise.skill,
          prompt: exercise.prompt,
          cells: exercise.cells,
          targetCell: exercise.targetCell,
          tests: exercise.tests.map(t => ({
            expected: t.expected,
            overrideCells: t.overrideCells
          }))
        },
        userFormula: formula,
        errorDetails
      });
      setAiHint(aiResponse.explanation);
    } catch (err) {
      console.error("AI error:", err);
      setAiHint("Something went wrong with the AI assistant. Try double checking your syntax!");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!exercise) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary h-12 w-12" />
    </div>
  );

  if (mode === 'lesson') {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => router.push('/')} className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>

          <Card className="border-none shadow-xl overflow-hidden">
            <div className="bg-primary p-8 text-white">
              <BookOpen className="h-12 w-12 mb-4 opacity-80" />
              <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-none">
                {exercise.skill}
              </Badge>
              <h1 className="text-3xl font-black tracking-tight">Lesson: Master {exercise.skill}</h1>
            </div>
            <CardContent className="p-8">
              <div className="prose prose-slate max-w-none">
                {exercise.lesson?.split('\n').map((line, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-8 flex justify-end">
              <Button onClick={() => setMode('practice')} size="lg" className="font-bold px-8">
                Start Practice <Play className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => setMode('lesson')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lesson
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="text-primary h-5 w-5" />
            <span className="font-bold text-slate-600">Earn 10 XP</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] uppercase font-bold tracking-widest">
                    {exercise.skill}
                  </Badge>
                  <div className="text-xs text-slate-400 font-medium">Challenge: {exercise.id}</div>
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">{exercise.prompt}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormulaGrid cells={exercise.cells} targetCell={exercise.targetCell} />
                
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-600 block">Your Formula</label>
                  <div className="relative">
                    <Input 
                      value={formula}
                      onChange={(e) => setFormula(e.target.value)}
                      className="font-code text-lg py-6 border-2 focus-visible:ring-primary h-16"
                      placeholder="=SUM(A1:A5)"
                      onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      <Button onClick={handleCheck} disabled={isSubmitting || !formula} size="lg" className="h-10 font-bold">
                        {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Check'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t p-6 rounded-b-xl flex justify-between items-center">
                <p className="text-xs text-slate-400 italic">Target cell: <span className="font-bold text-primary">{exercise.targetCell}</span></p>
                {result && !result.passed && (
                  <Button variant="outline" size="sm" onClick={handleAskAi} disabled={isAiLoading} className="text-primary hover:bg-primary/5 border-primary/20">
                    {isAiLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Ask AI Assistant
                  </Button>
                )}
              </CardFooter>
            </Card>

            {result && (
              <Alert variant={result.passed ? 'default' : 'destructive'} className={result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                <div className="flex gap-4">
                  {result.passed ? <CheckCircle2 className="text-green-600 h-6 w-6 shrink-0" /> : <XCircle className="text-red-600 h-6 w-6 shrink-0" />}
                  <div>
                    <AlertTitle className={result.passed ? 'text-green-800 font-bold' : 'text-red-800 font-bold'}>
                      {result.passed ? 'Excellent Work!' : 'Not Quite There...'}
                    </AlertTitle>
                    <AlertDescription className={result.passed ? 'text-green-700 mt-1' : 'text-red-700 mt-1'}>
                      {result.passed 
                        ? 'All test cases passed. You nailed it!' 
                        : `Your formula didn't produce the correct results for all scenarios.`}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            {aiHint && (
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-blue-600 h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-2">AI Instructor Hint</h4>
                      <p className="text-blue-800 leading-relaxed text-sm">{aiHint}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase text-slate-400 tracking-wider">Test Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exercise.tests.map((test, i) => {
                  const testRes = result?.testResults[i];
                  return (
                    <div key={i} className="p-3 border rounded-lg bg-white space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-500">Test {i + 1}</span>
                        {testRes && (
                          testRes.passed 
                            ? <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px]">PASS</Badge>
                            : <Badge variant="destructive" className="text-[10px]">FAIL</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Expected</p>
                          <p className="font-code font-bold">{test.expected}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Actual</p>
                          <p className="font-code font-bold">{testRes ? String(testRes.actual) : '—'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="p-6 bg-slate-900 rounded-xl text-white">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                Quick Tip
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Remember to start every formula with an equals sign (=). Excel uses this to distinguish text from math!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
