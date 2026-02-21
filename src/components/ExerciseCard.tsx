
"use client";

import React from 'react';
import { Exercise } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Link from 'next/link';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-wider">
            {exercise.skill}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold">{exercise.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {exercise.prompt}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full font-semibold" variant="default">
          <Link href={`/exercise/${exercise.id}`}>
            <Play className="mr-2 h-4 w-4" /> Start Exercise
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
