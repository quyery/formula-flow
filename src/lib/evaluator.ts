
import { HyperFormula } from 'hyperformula';
import { Exercise, CellMap } from './types';

export interface EvaluationResult {
  passed: boolean;
  testResults: {
    passed: boolean;
    expected: string | number;
    actual: any;
    overrides?: CellMap;
  }[];
}

export function evaluateFormula(
  exercise: Exercise,
  userFormula: string
): EvaluationResult {
  if (!userFormula.startsWith('=')) {
    userFormula = '=' + userFormula;
  }

  const hf = HyperFormula.buildEmpty({
    licenseKey: 'gpl-v3',
  });

  const sheetName = 'Sheet1';
  hf.addSheet(sheetName);

  const testResults = exercise.tests.map((test) => {
    // Start with base data
    const data: CellMap = { ...exercise.cells };
    
    // Apply overrides
    if (test.overrideCells) {
      Object.assign(data, test.overrideCells);
    }

    // Load data into HF
    for (const [cell, value] of Object.entries(data)) {
      const { row, col } = parseA1(cell);
      hf.setCellContents({ sheet: 0, row, col }, [[value]]);
    }

    // Set user formula in target cell
    const target = parseA1(exercise.targetCell);
    hf.setCellContents({ sheet: 0, row: target.row, col: target.col }, [[userFormula]]);

    // Get calculated value
    const actual = hf.getCellValue({ sheet: 0, row: target.row, col: target.col });

    // Comparison with tolerance
    const passed = compareValues(actual, test.expected, exercise.tolerance);

    return {
      passed,
      expected: test.expected,
      actual,
      overrides: test.overrideCells
    };
  });

  return {
    passed: testResults.every(r => r.passed),
    testResults
  };
}

function parseA1(address: string) {
  const match = address.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid A1 address: ${address}`);
  
  const colStr = match[1];
  const row = parseInt(match[2], 10) - 1;
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  
  return { row, col: col - 1 };
}

function compareValues(actual: any, expected: string | number, tolerance: number = 0.0001): boolean {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) <= tolerance;
  }
  return String(actual).toLowerCase() === String(expected).toLowerCase();
}
