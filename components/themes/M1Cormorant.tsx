'use client'

import { ResumeData } from '@/lib/schema'

interface Props {
  data: ResumeData
}

export default function M1Cormorant({ data }: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&family=Geist+Mono:wght@300;400&display=swap');

        .m1-root {
          background: #FEFCF8;
          color: #1E1C18;
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        /* Floating nav */
        .m1-nav {
          position: sticky;
          top: 16px;
          z-index: 10;
          display: flex;
          justify-content: center;
          padding: 0 24px;
          margin-bottom: -56px;
          pointer-events: none;
        }
        .m1-nav-pill {
          background: rgba(254,252,248,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid #EDE8E0;
          border-radius: 100px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          pointer-events: all;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .m1-nav-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-weight: 400;
          color: #1E1C18;
          letter-spacing: -0.01em;
        }
        .m1-nav-links {
          display: flex;
          gap: 16px;
          font-size: 11px;
          font-weight: 400;
          color: #8C8479;
          font-family: 'Geist Mono', monospace;
          letter-spacing: 0.08em;
        }
        .m1-nav-links a { color: #8C8479; text-decoration: none; }
        .m1-nav-links a:hover { color: #7C3C2B; }
        .m1-nav-cta {
          font-family: 'Geist Mono', monospace;
          font-size: 10.5px;
          color: #7C3C2B;
          border: 1px solid #C4AFA7;
          border-radius: 100px;
          padding: 5px 14px;
          text-decoration: none;
          letter-spacing: 0.08em;
        }

        .m1-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 60px 100px;
        }

        /* Header */
        .m1-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .m1-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C4A882;
        }
        .m1-eyebrow-text {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #8C8479;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .m1-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 60px;
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
          color: #1E1C18;
        }
        .m1-name em {
          font-style: italic;
          font-weight: 300;
        }

        .m1-title-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }
        .m1-title {
          font-size: 13px;
          font-weight: 400;
          color: #8C8479;
          letter-spacing: 0.02em;
        }
        .m1-divider { width: 32px; height: 1px; background: #EDE8E0; }

        .m1-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0 20px;
          font-family: 'Geist Mono', monospace;
          font-size: 10.5px;
          color: #8C8479;
          margin-bottom: 56px;
          letter-spacing: 0.04em;
        }
        .m1-contact a { color: #8C8479; text-decoration: none; }
        .m1-contact a:hover { color: #7C3C2B; }

        /* Two-column sections */
        .m1-section {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0 40px;
          margin-bottom: 44px;
          padding-top: 24px;
          border-top: 1px solid #EDE8E0;
        }
        .m1-label {
          font-family: 'Geist Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C4BDB4;
          padding-top: 4px;
        }
        .m1-content {}

        /* Summary */
        .m1-summary {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.65;
          color: #1E1C18;
        }

        /* Experience */
        .m1-job { margin-bottom: 32px; }
        .m1-job:last-child { margin-bottom: 0; }
        .m1-job-header { margin-bottom: 6px; }
        .m1-job-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .m1-job-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          font-weight: 500;
          color: #1E1C18;
          letter-spacing: -0.01em;
        }
        .m1-job-dates {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #C4BDB4;
          letter-spacing: 0.08em;
        }
        .m1-job-company {
          font-size: 12px;
          font-weight: 400;
          color: #7C3C2B;
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }
        .m1-bullets { list-style: none; padding: 0; margin: 0; }
        .m1-bullet {
          font-size: 13px;
          line-height: 1.7;
          color: #4A4640;
          font-weight: 300;
          padding-left: 14px;
          position: relative;
          margin-bottom: 4px;
        }
        .m1-bullet::before {
          content: '—';
          position: absolute;
          left: 0;
          color: #C4BDB4;
          font-size: 10px;
          top: 4px;
        }

        /* Skills chips */
        .m1-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .m1-chip {
          font-family: 'Geist Mono', monospace;
          font-size: 10.5px;
          padding: 4px 12px;
          border: 1px solid rgba(124,60,43,0.2);
          border-radius: 100px;
          color: #7C3C2B;
          background: rgba(124,60,43,0.03);
          letter-spacing: 0.04em;
        }

        /* Education */
        .m1-edu { margin-bottom: 16px; }
        .m1-edu-school {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 400;
          color: #1E1C18;
        }
        .m1-edu-bottom {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .m1-edu-degree {
          font-size: 11.5px;
          color: #8C8479;
          font-weight: 300;
        }
        .m1-edu-year {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #C4BDB4;
        }
      `}</style>

      <div className="m1-root">
        <nav className="m1-nav">
          <div className="m1-nav-pill">
            <span className="m1-nav-wordmark">{data.name}</span>
            <div className="m1-nav-links">
              <a href="#experience">exp</a>
              <a href="#education">edu</a>
              <a href="#skills">skills</a>
            </div>
            {data.contact.email && (
              <a href={`mailto:${data.contact.email}`} className="m1-nav-cta">contact</a>
            )}
          </div>
        </nav>

        <div className="m1-body">
          {data.availability && (
            <div className="m1-eyebrow">
              <div className="m1-eyebrow-dot" />
              <span className="m1-eyebrow-text">{data.availability}</span>
            </div>
          )}

          <h1 className="m1-name">
            {data.name.split(' ').map((word, i, arr) =>
              i === arr.length - 1
                ? <em key={i}>{(i > 0 ? ' ' : '') + word}</em>
                : (i === 0 ? word : ' ' + word)
            )}
          </h1>

          <div className="m1-title-row">
            <span className="m1-title">{data.title}</span>
            <div className="m1-divider" />
            {data.location && <span className="m1-title">{data.location}</span>}
          </div>

          <div className="m1-contact">
            {data.contact.email && <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>}
            {data.contact.github && <a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer">{data.contact.github}</a>}
            {data.contact.linkedin && <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer">{data.contact.linkedin}</a>}
            {data.contact.website && <a href={data.contact.website} target="_blank" rel="noopener noreferrer">{data.contact.website}</a>}
          </div>

          {data.summary && (
            <div className="m1-section">
              <span className="m1-label">About</span>
              <p className="m1-summary">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="m1-section" id="experience">
              <span className="m1-label">Experience</span>
              <div>
                {data.experience.map((job, i) => (
                  <div key={i} className="m1-job">
                    <div className="m1-job-header">
                      <div className="m1-job-top">
                        <span className="m1-job-title">{job.role}</span>
                        <span className="m1-job-dates">{job.start} – {job.end}</span>
                      </div>
                      <div className="m1-job-company">{job.company}{job.location ? ` · ${job.location}` : ''}</div>
                    </div>
                    <ul className="m1-bullets">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="m1-bullet">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="m1-section" id="skills">
              <span className="m1-label">Skills</span>
              <div className="m1-chips">
                {data.skills.map((s, i) => <span key={i} className="m1-chip">{s}</span>)}
              </div>
            </div>
          )}

          {data.education.length > 0 && (
            <div className="m1-section" id="education">
              <span className="m1-label">Education</span>
              <div>
                {data.education.map((edu, i) => (
                  <div key={i} className="m1-edu">
                    <div className="m1-edu-school">{edu.school}</div>
                    <div className="m1-edu-bottom">
                      <span className="m1-edu-degree">{edu.degree}</span>
                      <span className="m1-edu-year">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div className="m1-section">
              <span className="m1-label">Languages</span>
              <div className="m1-chips">
                {data.languages.map((l, i) => <span key={i} className="m1-chip">{l}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
