
import { NextRequest, NextResponse } from 'next/server';
import { EXERCISES } from '@/lib/exercises';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const exercise = EXERCISES.find(e => e.id === id);
  
  if (!exercise) {
    return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
  }
  
  return NextResponse.json(exercise);
}
