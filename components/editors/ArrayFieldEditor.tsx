'use client'
import { useState } from 'react'

interface Props {
  items: string[]
  onChange: (items: string[]) => void
  label: string
  placeholder: string
}

export default function ArrayFieldEditor({ items, onChange, label, placeholder }: Props) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()])
      setNewItem('')
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', padding: '6px 8px', background: '#F0EFE9', borderRadius: '6px', fontSize: '13px' }}>
          <span style={{ flex: 1 }}>{item}</span>
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#B8BDB4', fontSize: '14px' }}>×</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '4px' }}>
        <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} placeholder={placeholder} style={{ flex: 1, padding: '6px 8px', border: '1px solid #E8EBE4', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
        <button onClick={addItem} disabled={!newItem.trim()} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E8EBE4', background: '#FEFEFE', cursor: 'pointer', fontSize: '12px', color: '#1C201A', fontWeight: 500 }}>+</button>
      </div>
    </div>
  )
}
