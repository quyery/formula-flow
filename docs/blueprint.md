# **App Name**: FormulaFlow

## Core Features:

- Exercise Fetching: Fetch exercise data, including skill, prompt, cell data, target cell, and test cases, from the backend API.
- Interactive Grid Display: Display a grid of cells with pre-filled values and a designated target cell for formula input.
- Formula Evaluation Engine: Evaluate the user's Excel formula using HyperFormula across multiple test cases with cell overrides and expected results.
- Automated Grading and Feedback: Provide immediate pass/fail feedback based on formula evaluation, including details of failed tests (expected vs actual values).
- Attempt Submission: Submit exercise attempts (formula, pass/fail status, details) to the backend API for storage and progress tracking.
- Exercise Persistence: Store exercise data, user attempts, and progress using the SQLite database.
- AI-Powered Explanation (Placeholder): An AI tool to provide explanations or hints based on the current exercise and the user's attempts.

## Style Guidelines:

- Primary color: A calming blue (#4682B4) to promote focus and learning.
- Background color: Light gray (#F0F8FF) for a clean and unobtrusive learning environment.
- Accent color: A contrasting orange (#FFA500) to highlight interactive elements and feedback.
- Body and headline font: 'Inter' (sans-serif) for a modern, readable experience.
- Code font: 'Source Code Pro' (monospace) for the formula input area to distinguish formulas clearly.
- Use minimalist icons to represent Excel functions and concepts.
- Implement a card-based layout with clear sections for the exercise prompt, grid preview, formula input, and feedback panel.
- Subtle animations and transitions to provide engaging feedback, celebrate successes, and prompt next steps.