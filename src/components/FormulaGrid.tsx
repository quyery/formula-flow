
"use client";

import React from 'react';
import { CellMap } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FormulaGridProps {
  cells: CellMap;
  targetCell: string;
  className?: string;
}

export const FormulaGrid: React.FC<FormulaGridProps> = ({ cells, targetCell, className }) => {
  // Extract max row and col to size the grid
  const allAddresses = Object.keys(cells).concat([targetCell]);
  let maxRow = 0;
  let maxCol = 0;

  allAddresses.forEach(addr => {
    const match = addr.match(/^([A-Z]+)(\d+)$/);
    if (match) {
      const colStr = match[1];
      const row = parseInt(match[2], 10);
      maxRow = Math.max(maxRow, row);
      let col = 0;
      for (let i = 0; i < colStr.length; i++) col = col * 26 + (colStr.charCodeAt(i) - 64);
      maxCol = Math.max(maxCol, col);
    }
  });

  // Ensure minimum size
  maxRow = Math.max(maxRow, 4);
  maxCol = Math.max(maxCol, 4);

  const colLabels = Array.from({ length: maxCol }, (_, i) => String.fromCharCode(65 + i));
  const rowLabels = Array.from({ length: maxRow }, (_, i) => i + 1);

  return (
    <div className={cn("overflow-x-auto border rounded-lg bg-white shadow-inner", className)}>
      <table className="min-w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="bg-slate-50 border p-1 text-slate-400 font-normal w-8 text-center"></th>
            {colLabels.map(label => (
              <th key={label} className="bg-slate-50 border p-1 text-slate-500 font-medium text-center w-24">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map(rowNum => (
            <tr key={rowNum}>
              <td className="bg-slate-50 border p-1 text-slate-400 text-center font-normal">
                {rowNum}
              </td>
              {colLabels.map(colLabel => {
                const addr = `${colLabel}${rowNum}`;
                const isTarget = addr === targetCell;
                const value = cells[addr];
                return (
                  <td 
                    key={addr} 
                    className={cn(
                      "border p-2 text-slate-700 min-h-[2rem]",
                      isTarget ? "bg-accent/10 border-accent border-2 ring-1 ring-accent ring-inset" : "bg-white"
                    )}
                  >
                    {isTarget ? (
                      <span className="text-accent font-semibold italic text-[10px] uppercase">Formula</span>
                    ) : (
                      value ?? ''
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
