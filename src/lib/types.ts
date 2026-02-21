
export type CellMap = Record<string, string | number>;

export interface ExerciseTest {
  overrideCells?: CellMap;
  expected: string | number;
}

export interface Exercise {
  id: string;
  skill: string;
  prompt: string;
  lesson?: string;
  cells: CellMap;
  targetCell: string;
  tests: ExerciseTest[];
  tolerance?: number;
}

export interface Attempt {
  exerciseId: string;
  userFormula: string;
  passed: boolean;
  details: {
    testResults: {
      passed: boolean;
      expected: string | number;
      actual: any;
      overrides?: CellMap;
    }[];
  };
  timestamp: string;
}
