'use client'
import { EducationEntry } from '@/lib/schema'
import { useState } from 'react'

interface Props {
  entries: EducationEntry[]
  onChange: (entries: EducationEntry[]) => void
}

export default function EducationEditor({ entries, onChange }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const updateEntry = (i: number, updates: Partial<EducationEntry>) => {
    onChange(entries.map((e, j) => j === i ? { ...e, ...updates } : e))
  }

  const removeEntry = (i: number) => {
    onChange(entries.filter((_, j) => j !== i))
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Education</div>

      {entries.map((entry, i) => (
        <div key={i} style={{ marginBottom: '12px', border: '1px solid #E8EBE4', borderRadius: '8px', padding: '12px', background: '#FEFEFE' }}>
          <button onClick={() => setExpanded(e => ({ ...e, [i]: !e[i] }))} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#1C201A' }}>
            {expanded[i] ? '▼' : '▶'} {entry.school} - {entry.year}
          </button>

          {expanded[i] && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8EBE4' }}>
              <input value={entry.school} onChange={e => updateEntry(i, { school: e.target.value })} placeholder="School" style={{ width: '100%', padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }} />
              <input value={entry.degree} onChange={e => updateEntry(i, { degree: e.target.value })} placeholder="Degree & Major" style={{ width: '100%', padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }} />
              <input value={entry.year} onChange={e => updateEntry(i, { year: e.target.value })} placeholder="Graduation year" style={{ width: '100%', padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }} />
              <button onClick={() => removeEntry(i)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', fontSize: '12px', cursor: 'pointer' }}>Delete entry</button>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => onChange([...entries, { school: '', degree: '', year: '' }])} style={{ fontSize: '12px', color: '#3D5C35', border: 'none', background: 'none', cursor: 'pointer' }}>+ Add education</button>
    </div>
  )
}
