
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import sqlite3
import json
from datetime import datetime

app = FastAPI(title="FormulaFlow Backend")

# Database setup
def init_db():
    conn = sqlite3.connect('formulaflow.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS attempts
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  exercise_id TEXT,
                  user_formula TEXT,
                  passed BOOLEAN,
                  details TEXT,
                  timestamp TEXT)''')
    conn.commit()
    conn.close()

init_db()

# Models
class Test(BaseModel):
    overrideCells: Optional[Dict[str, Any]] = None
    expected: Any

class Exercise(BaseModel):
    id: str
    skill: str
    prompt: str
    cells: Dict[str, Any]
    targetCell: str
    tests: List[Test]
    tolerance: Optional[float] = 0.0001

class Attempt(BaseModel):
    exercise_id: str
    user_formula: str
    passed: bool
    details: Dict[str, Any]

# Seed Data (usually in DB, here for MVP simplicity)
EXERCISES = {
    "sumifs_001": {
        "id": "sumifs_001",
        "skill": "SUMIFS",
        "prompt": "Sum values in C2:C10 where Category is 'Tech' and Region is 'West'.",
        "cells": {"A2": "Tech", "B2": "West", "C2": 500},
        "targetCell": "D2",
        "tests": [{"expected": 500}]
    }
}

@app.get("/api/exercises/{exercise_id}")
async def get_exercise(exercise_id: str):
    if exercise_id not in EXERCISES:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return EXERCISES[exercise_id]

@app.post("/api/attempts")
async def create_attempt(attempt: Attempt):
    conn = sqlite3.connect('formulaflow.db')
    c = conn.cursor()
    c.execute("INSERT INTO attempts (exercise_id, user_formula, passed, details, timestamp) VALUES (?, ?, ?, ?, ?)",
              (attempt.exercise_id, attempt.user_formula, attempt.passed, json.dumps(attempt.details), datetime.now().isoformat()))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Attempt logged"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
