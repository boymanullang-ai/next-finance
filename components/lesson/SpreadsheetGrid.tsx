'use client'

import { useState } from 'react'

export interface GridCell {
  value: string
  type: 'label' | 'input' | 'locked-value' | 'answer-target'
}

export interface GridData {
  rows: number
  cols: number
  cells: Record<string, GridCell>
}

interface SpreadsheetGridProps {
  grid: GridData
  userValues: Record<string, string>
  feedback: Record<string, { ok: boolean; explanation: string }>
  revealed: boolean
  onCellChange: (cellRef: string, value: string) => void
}

export function SpreadsheetGrid({ grid, userValues, feedback, revealed, onCellChange }: SpreadsheetGridProps) {
  const { rows, cols, cells } = grid

  const getColLetter = (index: number) => String.fromCharCode(65 + index)

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col font-mono text-sm max-w-full overflow-x-auto">
      {/* Header Row */}
      <div className="flex bg-gray-100 border-b w-max min-w-full">
        <div className="w-10 border-r flex items-center justify-center text-xs text-gray-400 shrink-0"></div>
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="w-32 border-r flex items-center justify-center p-2 font-medium shrink-0">
            {getColLetter(c)}
          </div>
        ))}
      </div>

      {/* Body Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex border-b last:border-b-0 min-h-10 w-max min-w-full">
          <div className="w-10 border-r flex items-center justify-center text-xs text-gray-400 bg-gray-50 shrink-0">
            {r + 1}
          </div>
          {Array.from({ length: cols }).map((_, c) => {
            const colLetter = getColLetter(c)
            const cellRef = `${colLetter}${r + 1}`
            const cell = cells[cellRef]
            const isEditable = cell?.type === 'input' || cell?.type === 'answer-target'
            const fb = feedback[cellRef]

            let bgColor = 'bg-white'
            if (isEditable) {
              if (fb) {
                bgColor = fb.ok ? 'bg-green-50' : 'bg-red-50'
              } else if (revealed && cell.type === 'answer-target') {
                bgColor = 'bg-green-50'
              } else {
                bgColor = 'bg-blue-50/30'
              }
            }

            return (
              <div 
                key={cellRef} 
                className={`w-32 border-r last:border-r-0 p-2 flex items-center shrink-0 ${bgColor} ${isEditable ? 'focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 outline-none' : ''}`}
              >
                {isEditable ? (
                  <input 
                    type="text" 
                    value={userValues[cellRef] ?? cell?.value ?? ''}
                    onChange={(e) => onCellChange(cellRef, e.target.value)}
                    disabled={revealed || fb?.ok}
                    className={`w-full bg-transparent outline-none ${fb?.ok || revealed ? 'font-semibold text-green-700' : ''} ${fb && !fb.ok ? 'text-red-700' : ''}`}
                    placeholder=""
                  />
                ) : (
                  <span className={`${cell?.type === 'label' && c === 0 ? 'font-medium' : ''}`}>
                    {cell?.value || ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
