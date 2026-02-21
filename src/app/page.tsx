
"use client";

import React, { useEffect, useState } from 'react';
import { Exercise } from '@/lib/types';
import { ExerciseCard } from '@/components/ExerciseCard';
import { Trophy, Flame, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exercises')
      .then(res => res.json())
      .then(data => {
        setExercises(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">FormulaFlow</h1>
          <p className="text-lg text-slate-500 max-w-xl">
            Master Microsoft Excel through bite-sized, interactive formula challenges.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Card className="bg-accent text-white border-none shadow-orange-200 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <Flame className="fill-current" />
              <div>
                <p className="text-xs font-bold uppercase opacity-80">Streak</p>
                <p className="text-xl font-black">5 Days</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary text-white border-none shadow-blue-200 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy />
              <div>
                <p className="text-xs font-bold uppercase opacity-80">XP Total</p>
                <p className="text-xl font-black">1,250</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <section className="md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <Target className="text-primary" />
            <h2 className="text-2xl font-bold">Recommended Skills</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {exercises.map(ex => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <Card className="border-2 border-slate-100">
            <CardHeader>
              <CardTitle className="text-lg">Recent Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>VLOOKUP MASTERY</span>
                  <span>80%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[80%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>LOGICAL OPERATORS</span>
                  <span>45%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[45%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>TEXT FUNCTIONS</span>
                  <span>10%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[10%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
