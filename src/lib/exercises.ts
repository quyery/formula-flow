
import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: "basic_sum_001",
    skill: "SUM Function",
    prompt: "Sum the values in A1 through A3 to calculate the total score.",
    lesson: "The SUM function is the most basic building block in Excel. It adds up all the numbers in a range of cells. \n\nSyntax: =SUM(range)\nExample: =SUM(A1:A10) adds everything from A1 down to A10.",
    cells: {
      "A1": 10, "A2": 20, "A3": 30, "B1": "Total Score:"
    },
    targetCell: "B2",
    tests: [
      { expected: 60 },
      { overrideCells: { "A1": 50 }, expected: 100 }
    ]
  },
  {
    id: "text_001",
    skill: "Text Manipulation",
    prompt: "Combine the First Name (A2) and Last Name (B2) with a space between them, and ensure the result is in Proper Case (e.g., 'John Doe').",
    lesson: "You can combine text using the ampersand (&) operator. To fix capitalization, use PROPER(). \n\nExample: =PROPER(A1 & \" \" & B1) joins two names with a space and makes them look professional.",
    cells: {
      "A2": "john", "B2": "smith"
    },
    targetCell: "C2",
    tests: [
      { expected: "John Smith" },
      { overrideCells: { "A2": "ALICE", "B2": "williams" }, expected: "Alice Williams" }
    ]
  },
  {
    id: "abs_ref_001",
    skill: "Absolute References",
    prompt: "Calculate the total price including tax for Item A. The tax rate is fixed in cell B1. Use absolute references for the tax rate.",
    lesson: "Normally, when you copy a formula, cell references move. Absolute references ($) lock a cell in place. \n\nUse $B$1 instead of B1 to ensure the tax rate always points to that specific cell, no matter where the formula is copied.",
    cells: {
      "A1": "Item", "B1": 0.08, "C1": "Base Price", "D1": "Total Price",
      "A2": "Item A", "C2": 100,
      "A3": "Item B", "C3": 250
    },
    targetCell: "D2",
    tests: [
      { expected: 108 },
      { overrideCells: { "C2": 200 }, expected: 216 },
      { overrideCells: { "B1": 0.10, "C2": 100 }, expected: 110 }
    ]
  },
  {
    id: "if_logic_001",
    skill: "IF Function",
    prompt: "Return 'Pass' if the score in A2 is 60 or higher, otherwise return 'Fail'.",
    lesson: "The IF function lets you make decisions. \n\nSyntax: =IF(condition, value_if_true, value_if_false)\nExample: =IF(A1 > 10, \"Big\", \"Small\") checks if A1 is greater than 10.",
    cells: {
      "A1": "Score", "B1": "Result",
      "A2": 75
    },
    targetCell: "B2",
    tests: [
      { expected: "Pass" },
      { overrideCells: { "A2": 45 }, expected: "Fail" },
      { overrideCells: { "A2": 60 }, expected: "Pass" }
    ]
  },
  {
    id: "xlookup_001",
    skill: "XLOOKUP",
    prompt: "Find the price of the fruit listed in cell E2. Search in A2:A5 and return from B2:B5.",
    lesson: "XLOOKUP is the modern way to find data in a table. \n\nSyntax: =XLOOKUP(lookup_value, lookup_array, return_array)\nIt searches for your value in the first list and grabs the corresponding value from the second list.",
    cells: {
      "A1": "Fruit", "B1": "Price",
      "A2": "Apple", "B2": 1.5,
      "A3": "Banana", "B3": 0.5,
      "A4": "Cherry", "B4": 3.0,
      "A5": "Date", "B5": 2.0,
      "D2": "Search:", "E2": "Banana", "F2": "Result"
    },
    targetCell: "G2",
    tests: [
      { expected: 0.5 },
      { overrideCells: { "E2": "Cherry" }, expected: 3.0 },
      { overrideCells: { "E2": "Apple" }, expected: 1.5 }
    ]
  },
  {
    id: "sumifs_001",
    skill: "SUMIFS",
    prompt: "Sum values in C2:C10 where Category (A2:A10) is 'Tech' AND Region (B2:B10) is 'West'.",
    lesson: "SUMIFS adds up numbers only if multiple conditions are met. \n\nSyntax: =SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2...)\nIt's perfect for complex reports.",
    cells: {
      "A1": "Category", "B1": "Region", "C1": "Sales",
      "A2": "Tech", "B2": "West", "C2": 500,
      "A3": "Home", "B3": "East", "C3": 200,
      "A4": "Tech", "B4": "East", "C4": 300,
      "A5": "Food", "B5": "West", "C5": 100,
      "A6": "Tech", "B6": "West", "C6": 700,
      "A7": "Home", "B7": "West", "C7": 400,
      "D1": "Total Tech West"
    },
    targetCell: "D2",
    tests: [
      { expected: 1200 },
      { overrideCells: { "C2": 1000 }, expected: 1700 }
    ]
  }
];
