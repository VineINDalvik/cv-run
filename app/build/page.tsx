'use client'

import { useState, useRef } from 'react'
import { ResumeData, Theme, InputSource } from '@/lib/schema'
import ThemeRenderer from '@/components/themes/ThemeRenderer'
import ExperienceEditor from '@/components/editors/ExperienceEditor'
import EducationEditor from '@/components/editors/EducationEditor'
import ArrayFieldEditor from '@/components/editors/ArrayFieldEditor'
import ContactInfoEditor from '@/components/editors/ContactInfoEditor'

type Step = 1 | 2 | 3

const THEME_LABELS: Record<Theme, { name: string; sub: string }> = {
  t3: { name: 'Terminal', sub: 'Dark · Monospace' },
  m1: { name: 'Editorial', sub: 'Serif · Elegant' },
  m3: { name: 'Organic', sub: 'Warm · Considered' },
}

const ERROR_MESSAGES: Record<string, string> = {
  parse_failed: 'AI could not parse your input. Try adding more detail.',
  timeout: 'Request timed out. Please try again.',
  no_text: 'This PDF has no extractable text (it may be scanned). Try copying and pasting the text instead.',
  file_too_large: 'File is too large (max 10MB).',
  too_many_pages: 'PDF has too many pages (max 50).',
  server_error: 'Something went wrong. Please try again.',
}

interface SourceEntry {
  source: InputSource
  file?: File  // kept alongside PDF sources so it's available at submit time
}

export default function BuildPage() {
  const [step, setStep] = useState<Step>(1)
  const [entries, setEntries] = useState<SourceEntry[]>([])
  const [textInput, setTextInput] = useState('')
  const [activeTab, setActiveTab] = useState<'linkedin' | 'pdf' | 'latex' | 'text'>('text')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [theme, setTheme] = useState<Theme>('m1')
  const [jdText, setJdText] = useState('')
  const [jdOpen, setJdOpen] = useState(false)
  const [jdLoading, setJdLoading] = useState(false)
  const [slug, setSlug] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editMode, setEditMode] = useState<'edit' | 'preview'>('edit')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const addSource = () => {
    const trimmed = textInput.trim()
    if (!trimmed && activeTab !== 'pdf') return
    if (activeTab === 'pdf' && !pdfFile) return

    const source: InputSource =
      activeTab === 'pdf'
        ? { type: 'pdf', content: '', filename: pdfFile!.name }
        : activeTab === 'linkedin'
          ? { type: 'linkedin', content: trimmed }
          : activeTab === 'latex'
            ? { type: 'latex', content: trimmed }
            : { type: 'text', content: trimmed }

    setEntries(prev => [...prev, { source, file: pdfFile ?? undefined }])
    setTextInput('')
    setPdfFile(null)
  }

  const removeSource = (i: number) => setEntries(prev => prev.filter((_, j) => j !== i))

  const parseInputs = async () => {
    if (entries.length === 0) {
      setError('Add at least one source.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.set('sources', JSON.stringify(entries.map(e => e.source)))

      entries.forEach(({ source, file }) => {
        if (source.type === 'pdf' && file) {
          formData.set(`pdf_${source.filename}`, file)
        }
      })

      const res = await fetch('/api/parse', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        setError(ERROR_MESSAGES[json.error] ?? ERROR_MESSAGES.server_error)
        return
      }

      setResumeData(json.data)
      setStep(2)
    } catch {
      setError(ERROR_MESSAGES.server_error)
    } finally {
      setLoading(false)
    }
  }

  const optimizeJD = async () => {
    if (!resumeData || !jdText.trim()) return
    setJdLoading(true)
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resumeData, jobDescription: jdText }),
      })
      const json = await res.json()
      if (res.ok) setResumeData(json.data)
      else setError(ERROR_MESSAGES[json.error] ?? ERROR_MESSAGES.server_error)
    } catch {
      setError(ERROR_MESSAGES.server_error)
    } finally {
      setJdLoading(false)
    }
  }

  const saveAndExport = async () => {
    if (!resumeData) return
    setLoading(true)
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: resumeData, theme, email: email || undefined }),
      })
      const json = await res.json()
      if (res.ok) {
        setSlug(json.slug)
        setStep(3)
      } else {
        setError(ERROR_MESSAGES.server_error)
      }
    } catch {
      setError(ERROR_MESSAGES.server_error)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    if (!slug) return
    await navigator.clipboard.writeText(`${window.location.origin}/r/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabStyle = (active: boolean) => ({
    padding: '6px 14px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: active ? 500 : 400,
    background: active ? '#1C201A' : 'transparent',
    color: active ? '#FAFAF6' : '#6B7068',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  })

  const sourceTypeLabel = (s: InputSource) => {
    switch (s.type) {
      case 'linkedin': return '🔗 LinkedIn'
      case 'pdf': return `📄 ${s.filename}`
      case 'latex': return '📝 LaTeX'
      case 'text': return '✏️ Text'
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF6', fontFamily: 'system-ui, sans-serif' }}>
      {/* Full-screen loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(250,250,246,0.92)',
          backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '20px',
        }}>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg) } }
            @keyframes pulse-dot {
              0%, 80%, 100% { opacity: 0.2; transform: scale(0.8) }
              40% { opacity: 1; transform: scale(1) }
            }
          `}</style>
          {/* Spinner */}
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid #E8EBE4',
            borderTopColor: '#1C201A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#1C201A', marginBottom: '6px' }}>
              Parsing with AI…
            </div>
            <div style={{ fontSize: '13px', color: '#6B7068' }}>
              Extracting and polishing your resume
            </div>
          </div>
          {/* Three bouncing dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#3D5C35',
                animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}
      {/* Step indicator */}
      <div style={{ padding: '24px 40px', borderBottom: '1px solid #E8EBE4', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <a href="/" style={{ fontSize: '16px', fontWeight: 600, color: '#1C201A', textDecoration: 'none' }}>cv.run</a>
        <span style={{ color: '#B8BDB4', margin: '0 8px' }}>›</span>
        {[1, 2, 3].map(n => (
          <span key={n} style={{
            width: '28px', height: '28px', borderRadius: '50%', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '12px',
            fontWeight: 500,
            background: step === n ? '#1C201A' : step > n ? '#3D5C35' : '#E8EBE4',
            color: step >= n ? '#FAFAF6' : '#6B7068',
          }}>{n}</span>
        ))}
        <span style={{ fontSize: '13px', color: '#6B7068', marginLeft: '4px' }}>
          {step === 1 ? 'Add sources' : step === 2 ? 'Preview & theme' : 'Export'}
        </span>
      </div>

      {/* Step 1: Inputs */}
      {step === 1 && (
        <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1C201A', marginBottom: '8px' }}>Add your resume sources</h1>
          <p style={{ fontSize: '14px', color: '#6B7068', marginBottom: '32px' }}>
            Stack multiple sources — AI merges them into one coherent resume.
          </p>

          {/* Tab picker */}
          <div style={{ display: 'flex', gap: '4px', background: '#F0EFE9', borderRadius: '100px', padding: '4px', marginBottom: '16px', width: 'fit-content' }}>
            {(['text', 'linkedin', 'pdf', 'latex'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={tabStyle(activeTab === t)}>
                {t === 'text' ? 'Text' : t === 'linkedin' ? 'LinkedIn' : t === 'pdf' ? 'PDF' : 'LaTeX'}
              </button>
            ))}
          </div>

          {/* Input area */}
          {activeTab === 'pdf' ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #E8EBE4', borderRadius: '12px', padding: '40px',
                textAlign: 'center', cursor: 'pointer', marginBottom: '12px',
                background: pdfFile ? 'rgba(61,92,53,0.03)' : 'transparent',
              }}
            >
              <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }}
                onChange={e => setPdfFile(e.target.files?.[0] ?? null)} />
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
              <div style={{ fontSize: '14px', color: '#6B7068' }}>
                {pdfFile ? pdfFile.name : 'Click to upload PDF (max 10MB)'}
              </div>
            </div>
          ) : (
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder={
                activeTab === 'linkedin'
                  ? 'Paste your LinkedIn About + Experience sections here…'
                  : activeTab === 'latex'
                    ? 'Paste your LaTeX resume source here…'
                    : 'Paste your resume text, or just describe your experience…'
              }
              style={{
                width: '100%', minHeight: '160px', padding: '14px 16px',
                border: '1px solid #E8EBE4', borderRadius: '12px',
                fontSize: '13px', lineHeight: '1.6', color: '#1C201A',
                background: '#FEFEFE', resize: 'vertical', marginBottom: '12px',
                outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          )}

          <button
            onClick={addSource}
            disabled={activeTab === 'pdf' ? !pdfFile : !textInput.trim()}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: '1px solid #E8EBE4',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: '#FEFEFE',
              color: '#1C201A', marginBottom: '24px',
            }}
          >
            + Add source
          </button>

          {/* Added sources */}
          {entries.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>Sources added</div>
              {entries.map(({ source: s }, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', border: '1px solid #E8EBE4', borderRadius: '8px',
                  marginBottom: '6px', background: '#FEFEFE', fontSize: '13px',
                }}>
                  <span>{sourceTypeLabel(s)}</span>
                  <button onClick={() => removeSource(i)} style={{ border: 'none', background: 'none', color: '#B8BDB4', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '13px', color: '#B91C1C', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            onClick={parseInputs}
            disabled={loading || entries.length === 0}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: loading || entries.length === 0 ? '#E8EBE4' : '#1C201A',
              color: '#FAFAF6', fontSize: '14px', fontWeight: 600, border: 'none',
              cursor: loading || entries.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Parsing with AI…' : 'Parse & Structure →'}
          </button>
        </div>
      )}

      {/* Step 2: Preview + Theme + JD */}
      {step === 2 && resumeData && (
        <div style={{ display: 'grid', gridTemplateColumns: '450px 1fr', height: 'calc(100vh - 73px)' }}>
          {/* Left panel: editor */}
          <div style={{ borderRight: '1px solid #E8EBE4', overflowY: 'auto', padding: '32px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1C201A', margin: 0 }}>Edit & customize</h2>
              <div style={{ display: 'flex', gap: '4px', background: '#F0EFE9', borderRadius: '100px', padding: '4px' }}>
                {(['edit', 'preview'] as const).map(mode => (
                  <button key={mode} onClick={() => setEditMode(mode)} style={{
                    padding: '6px 12px', borderRadius: '100px', border: 'none', fontSize: '12px', fontWeight: 500,
                    background: editMode === mode ? '#1C201A' : 'transparent', color: editMode === mode ? '#FAFAF6' : '#6B7068',
                    cursor: 'pointer',
                  }}>
                    {mode === 'edit' ? 'Edit' : 'Preview'}
                  </button>
                ))}
              </div>
            </div>

            {editMode === 'edit' ? (
              <>
                {/* Theme switcher - always visible */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Theme</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['t3', 'm1', 'm3'] as const).map(t => (
                      <button key={t} onClick={() => setTheme(t)} style={{
                        flex: 1, padding: '10px 8px', borderRadius: '10px', border: `2px solid ${theme === t ? '#1C201A' : '#E8EBE4'}`,
                        background: theme === t ? '#1C201A' : '#FEFEFE', cursor: 'pointer',
                        color: theme === t ? '#FAFAF6' : '#1C201A', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{THEME_LABELS[t].name}</div>
                        <div style={{ fontSize: '10px', opacity: 0.6 }}>{THEME_LABELS[t].sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Basic fields */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Name</div>
                  <input value={resumeData.name}
                    onChange={e => setResumeData(d => d ? { ...d, name: e.target.value } : d)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Title</div>
                  <input value={resumeData.title}
                    onChange={e => setResumeData(d => d ? { ...d, title: e.target.value } : d)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Location</div>
                  <input value={resumeData.location}
                    onChange={e => setResumeData(d => d ? { ...d, location: e.target.value } : d)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Summary</div>
                  <textarea value={resumeData.summary}
                    onChange={e => setResumeData(d => d ? { ...d, summary: e.target.value } : d)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>

                {/* Collapsible Contact Info */}
                <div style={{ marginBottom: '24px', borderTop: '1px solid #E8EBE4', paddingTop: '16px' }}>
                  <button onClick={() => setExpandedSections(s => ({ ...s, contact: !s.contact }))} style={{
                    background: 'none', border: 'none', fontSize: '13px', fontWeight: 500,
                    color: '#1C201A', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left', marginBottom: '10px',
                  }}>
                    {expandedSections.contact ? '▼' : '▶'} Contact Info
                  </button>
                  {expandedSections.contact && (
                    <ContactInfoEditor contact={resumeData.contact} onChange={contact => setResumeData(d => d ? { ...d, contact } : d)} />
                  )}
                </div>

                {/* Experience */}
                <div style={{ marginBottom: '24px' }}>
                  <button onClick={() => setExpandedSections(s => ({ ...s, experience: !s.experience }))} style={{
                    background: 'none', border: 'none', fontSize: '13px', fontWeight: 500,
                    color: '#1C201A', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left', marginBottom: '10px',
                  }}>
                    {expandedSections.experience ? '▼' : '▶'} Experience
                  </button>
                  {expandedSections.experience && (
                    <ExperienceEditor entries={resumeData.experience} onChange={experience => setResumeData(d => d ? { ...d, experience } : d)} />
                  )}
                </div>

                {/* Education */}
                <div style={{ marginBottom: '24px' }}>
                  <button onClick={() => setExpandedSections(s => ({ ...s, education: !s.education }))} style={{
                    background: 'none', border: 'none', fontSize: '13px', fontWeight: 500,
                    color: '#1C201A', cursor: 'pointer', padding: 0, width: '100%', textAlign: 'left', marginBottom: '10px',
                  }}>
                    {expandedSections.education ? '▼' : '▶'} Education
                  </button>
                  {expandedSections.education && (
                    <EducationEditor entries={resumeData.education} onChange={education => setResumeData(d => d ? { ...d, education } : d)} />
                  )}
                </div>

                {/* Skills */}
                <ArrayFieldEditor items={resumeData.skills} onChange={skills => setResumeData(d => d ? { ...d, skills } : d)} label="Skills" placeholder="Add skill..." />

                {/* Languages */}
                {resumeData.languages && (
                  <ArrayFieldEditor items={resumeData.languages} onChange={languages => setResumeData(d => d ? { ...d, languages } : d)} label="Languages" placeholder="Add language..." />
                )}

                {/* JD optimizer */}
                <div style={{ borderTop: '1px solid #E8EBE4', paddingTop: '20px', marginBottom: '24px' }}>
                  <button onClick={() => setJdOpen(o => !o)} style={{
                    background: 'none', border: 'none', fontSize: '13px', fontWeight: 500,
                    color: '#3D5C35', cursor: 'pointer', padding: 0,
                  }}>
                    {jdOpen ? '▼' : '▶'} Optimize for a specific role
                  </button>
                  {jdOpen && (
                    <div style={{ marginTop: '12px' }}>
                      <textarea value={jdText} onChange={e => setJdText(e.target.value)}
                        placeholder="Paste the job description here…"
                        style={{ width: '100%', minHeight: '120px', padding: '10px 12px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' }} />
                      <button onClick={optimizeJD} disabled={jdLoading || !jdText.trim()} style={{
                        marginTop: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none',
                        background: '#3D5C35', color: '#FAFAF6', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      }}>
                        {jdLoading ? 'Optimizing…' : 'Optimize →'}
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontSize: '12px', color: '#B91C1C', marginBottom: '16px' }}>
                    {error}
                  </div>
                )}

                <button onClick={saveAndExport} disabled={loading} style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: loading ? '#E8EBE4' : '#1C201A', color: '#FAFAF6',
                  fontSize: '14px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Saving…' : 'Continue to Export →'}
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '11px', color: '#B8BDB4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>Theme</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['t3', 'm1', 'm3'] as const).map(t => (
                      <button key={t} onClick={() => setTheme(t)} style={{
                        flex: 1, padding: '10px 8px', borderRadius: '10px', border: `2px solid ${theme === t ? '#1C201A' : '#E8EBE4'}`,
                        background: theme === t ? '#1C201A' : '#FEFEFE', cursor: 'pointer',
                        color: theme === t ? '#FAFAF6' : '#1C201A', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{THEME_LABELS[t].name}</div>
                        <div style={{ fontSize: '10px', opacity: 0.6 }}>{THEME_LABELS[t].sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#6B7068', marginBottom: '24px' }}>
                  Click "Edit" to modify resume content. Switch between themes below.
                </div>

                <button onClick={saveAndExport} disabled={loading} style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  background: loading ? '#E8EBE4' : '#1C201A', color: '#FAFAF6',
                  fontSize: '14px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '24px',
                }}>
                  {loading ? 'Saving…' : 'Continue to Export →'}
                </button>
              </>
            )}
          </div>

          {/* Right panel: live preview */}
          <div style={{ overflowY: 'auto', background: '#F4F4F0' }}>
            <div style={{ transform: 'scale(0.75)', transformOrigin: 'top left', width: '133.33%' }}>
              <ThemeRenderer data={resumeData} theme={theme} />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Export */}
      {step === 3 && slug && resumeData && (
        <div style={{ maxWidth: '560px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, color: '#1C201A', marginBottom: '8px' }}>Your resume is ready</h1>
          <p style={{ fontSize: '14px', color: '#6B7068', marginBottom: '40px' }}>
            Share the link below or download as PDF.
          </p>

          <div style={{ background: '#F4F4F0', borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', fontFamily: 'monospace', fontSize: '14px', color: '#1C201A', wordBreak: 'break-all' }}>
            {typeof window !== 'undefined' ? window.location.origin : ''}/r/{slug}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
            <button onClick={copyLink} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #E8EBE4',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', background: '#FEFEFE', color: '#1C201A',
            }}>
              {copied ? '✓ Copied!' : 'Copy link'}
            </button>
            <a href={`/r/${slug}/pdf`} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: '#1C201A', color: '#FAFAF6',
              textDecoration: 'none', display: 'inline-block', textAlign: 'center',
            }}>
              Download PDF
            </a>
          </div>

          {!saved && (
            <div style={{ borderTop: '1px solid #E8EBE4', paddingTop: '28px' }}>
              <div style={{ fontSize: '14px', color: '#1C201A', fontWeight: 500, marginBottom: '4px' }}>Save permanently</div>
              <div style={{ fontSize: '13px', color: '#6B7068', marginBottom: '14px' }}>Anonymous links expire in 72h. Add your email to make it permanent.</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid #E8EBE4', borderRadius: '8px', fontSize: '13px' }}
                />
                <button onClick={async () => {
                  const res = await fetch('/api/resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: resumeData, theme, email }),
                  })
                  if (res.ok) setSaved(true)
                }} style={{
                  padding: '10px 20px', borderRadius: '8px', border: 'none',
                  background: '#3D5C35', color: '#FAFAF6', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}>
                  Save
                </button>
              </div>
              {saved && <div style={{ marginTop: '8px', fontSize: '13px', color: '#3D5C35' }}>✓ Link is now permanent. Check your email.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
