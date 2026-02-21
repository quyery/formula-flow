
import { NextResponse } from 'next/server';
import { EXERCISES } from '@/lib/exercises';

export async function GET() {
  return NextResponse.json(EXERCISES);
}
