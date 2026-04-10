'use client'
import { ContactInfo } from '@/lib/schema'

interface Props {
  contact: ContactInfo
  onChange: (contact: ContactInfo) => void
}

export default function ContactInfoEditor({ contact, onChange }: Props) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Contact Info</div>

      <input value={contact.email ?? ''} onChange={e => onChange({ ...contact, email: e.target.value || undefined })} placeholder="Email" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }} />
      <input value={contact.github ?? ''} onChange={e => onChange({ ...contact, github: e.target.value || undefined })} placeholder="GitHub URL" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }} />
      <input value={contact.linkedin ?? ''} onChange={e => onChange({ ...contact, linkedin: e.target.value || undefined })} placeholder="LinkedIn URL" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }} />
      <input value={contact.website ?? ''} onChange={e => onChange({ ...contact, website: e.target.value || undefined })} placeholder="Website" style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
    </div>
  )
}
