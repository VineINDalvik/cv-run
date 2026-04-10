'use client'
import { ExperienceEntry } from '@/lib/schema'
import { useState } from 'react'

interface Props {
  entries: ExperienceEntry[]
  onChange: (entries: ExperienceEntry[]) => void
}

export default function ExperienceEditor({ entries, onChange }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const updateEntry = (i: number, updates: Partial<ExperienceEntry>) => {
    onChange(entries.map((e, j) => j === i ? { ...e, ...updates } : e))
  }

  const removeEntry = (i: number) => {
    onChange(entries.filter((_, j) => j !== i))
  }

  const addBullet = (i: number) => {
    updateEntry(i, { bullets: [...entries[i].bullets, ''] })
  }

  const updateBullet = (i: number, bulletIdx: number, value: string) => {
    const bullets = [...entries[i].bullets]
    bullets[bulletIdx] = value
    updateEntry(i, { bullets })
  }

  const removeBullet = (i: number, bulletIdx: number) => {
    updateEntry(i, { bullets: entries[i].bullets.filter((_, j) => j !== bulletIdx) })
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      {entries.map((entry, i) => (
        <div key={i} style={{ marginBottom: '12px', border: '1px solid #E8EBE4', borderRadius: '8px', padding: '12px', background: '#FEFEFE' }}>
          <button onClick={() => setExpanded(e => ({ ...e, [i]: !e[i] }))} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: '#1C201A' }}>
            {expanded[i] ? '▼' : '▶'} {entry.role} {entry.company ? `at ${entry.company}` : ''}
          </button>

          {expanded[i] && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E8EBE4' }}>
              <input value={entry.company} onChange={e => updateEntry(i, { company: e.target.value })} placeholder="Company" style={{ width: '100%', padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }} />
              <input value={entry.role} onChange={e => updateEntry(i, { role: e.target.value })} placeholder="Job Title" style={{ width: '100%', padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                <input value={entry.start} onChange={e => updateEntry(i, { start: e.target.value })} placeholder="Start (Jan 2020)" style={{ padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
                <input value={entry.end} onChange={e => updateEntry(i, { end: e.target.value })} placeholder="End (Present)" style={{ padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
              </div>
              <input value={entry.location ?? ''} onChange={e => updateEntry(i, { location: e.target.value })} placeholder="Location (optional)" style={{ width: '100%', padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }} />

              <div style={{ fontSize: '11px', color: '#B8BDB4', marginBottom: '6px', marginTop: '8px' }}>Bullets</div>
              {entry.bullets.map((bullet, j) => (
                <div key={j} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  <input value={bullet} onChange={e => updateBullet(i, j, e.target.value)} placeholder="Achievement…" style={{ flex: 1, padding: '4px 8px', border: '1px solid #E8EBE4', borderRadius: '4px', fontSize: '11px', boxSizing: 'border-box' }} />
                  <button onClick={() => removeBullet(i, j)} style={{ width: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#B8BDB4', fontSize: '14px' }}>×</button>
                </div>
              ))}
              <button onClick={() => addBullet(i)} style={{ fontSize: '11px', color: '#3D5C35', border: 'none', background: 'none', cursor: 'pointer', padding: '0', marginBottom: '8px' }}>+ Add bullet</button>

              <button onClick={() => removeEntry(i)} style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#B91C1C', fontSize: '12px', cursor: 'pointer' }}>Delete entry</button>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => onChange([...entries, { company: '', role: '', start: '', end: '', bullets: [] }])} style={{ fontSize: '12px', color: '#3D5C35', border: 'none', background: 'none', cursor: 'pointer' }}>+ Add experience</button>
    </div>
  )
}
