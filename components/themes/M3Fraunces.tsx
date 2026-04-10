'use client'

import { ResumeData } from '@/lib/schema'

interface Props {
  data: ResumeData
}

export default function M3Fraunces({ data }: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..900;1,9..144,200..900&family=Manrope:wght@200;300;400;500&family=Geist+Mono:wght@300;400&display=swap');

        .m3-root {
          background: #FAFAF6;
          color: #1C201A;
          font-family: 'Manrope', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Ambient gradient */
        .m3-root::before {
          content: '';
          position: fixed;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(61,92,53,0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Simple nav */
        .m3-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(250,250,246,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #E8EBE4;
          padding: 14px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .m3-nav-wordmark {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-size: 16px;
          font-weight: 300;
          font-style: italic;
          color: #1C201A;
        }
        .m3-availability-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(61,92,53,0.2);
          border-radius: 100px;
          padding: 5px 12px;
          background: rgba(61,92,53,0.04);
        }
        .m3-avail-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3D5C35;
        }
        .m3-avail-text {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #3D5C35;
          letter-spacing: 0.08em;
        }
        .m3-location-pill {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #6B7068;
          letter-spacing: 0.06em;
        }

        .m3-body {
          max-width: 880px;
          margin: 0 auto;
          padding: 72px 60px 100px;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .m3-name {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-size: 54px;
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -0.02em;
          margin: 0 0 14px;
          color: #1C201A;
        }
        .m3-name em {
          font-style: italic;
          color: #3D5C35;
        }

        .m3-title {
          font-size: 14px;
          font-weight: 300;
          color: #6B7068;
          margin-bottom: 24px;
          letter-spacing: 0.01em;
        }

        .m3-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0 20px;
          font-family: 'Geist Mono', monospace;
          font-size: 10.5px;
          color: #6B7068;
          margin-bottom: 64px;
          letter-spacing: 0.04em;
        }
        .m3-contact a { color: #6B7068; text-decoration: none; }
        .m3-contact a:hover { color: #3D5C35; }

        /* Sections: two-col with 80px label */
        .m3-section {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 0 48px;
          margin-bottom: 48px;
          padding-top: 28px;
          border-top: 1px solid #E8EBE4;
        }
        .m3-label {
          font-family: 'Geist Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #B8BDB4;
          padding-top: 5px;
        }

        /* Summary */
        .m3-summary {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.7;
          color: #1C201A;
        }

        /* Timeline-style experience */
        .m3-job {
          display: grid;
          grid-template-columns: 1px 1fr;
          gap: 0 24px;
          margin-bottom: 36px;
          padding-bottom: 8px;
          position: relative;
        }
        .m3-job:last-child { margin-bottom: 0; }
        .m3-timeline-line {
          width: 1px;
          background: linear-gradient(to bottom, #3D5C35 0%, #E8EBE4 100%);
          min-height: 100%;
          margin-top: 6px;
        }
        .m3-timeline-dot {
          position: absolute;
          left: -3px;
          top: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3D5C35;
          border: 1.5px solid #FAFAF6;
          box-shadow: 0 0 0 1px rgba(61,92,53,0.3);
        }
        .m3-job-content { padding-bottom: 8px; }
        .m3-job-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }
        .m3-job-title {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-size: 18px;
          font-weight: 400;
          color: #1C201A;
          letter-spacing: -0.01em;
        }
        .m3-job-dates {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #B8BDB4;
          letter-spacing: 0.06em;
        }
        .m3-job-company {
          font-size: 12px;
          font-weight: 400;
          color: #3D5C35;
          margin-bottom: 10px;
        }
        .m3-bullets { list-style: none; padding: 0; margin: 0; }
        .m3-bullet {
          font-size: 13px;
          line-height: 1.7;
          color: #4A4E47;
          font-weight: 300;
          padding-left: 14px;
          position: relative;
          margin-bottom: 5px;
        }
        .m3-bullet::before {
          content: '·';
          position: absolute;
          left: 4px;
          color: #B8BDB4;
          font-size: 16px;
          top: -1px;
        }

        /* Skills chips */
        .m3-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .m3-chip {
          font-family: 'Geist Mono', monospace;
          font-size: 10.5px;
          padding: 4px 12px;
          border: 1px solid rgba(61,92,53,0.18);
          border-radius: 6px;
          color: #3D5C35;
          background: rgba(61,92,53,0.04);
          letter-spacing: 0.04em;
        }

        /* Education */
        .m3-edu { margin-bottom: 16px; }
        .m3-edu-school {
          font-family: 'Fraunces', serif;
          font-optical-sizing: auto;
          font-size: 17px;
          font-weight: 300;
          color: #1C201A;
        }
        .m3-edu-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .m3-edu-degree { font-size: 12px; font-weight: 300; color: #6B7068; }
        .m3-edu-year {
          font-family: 'Geist Mono', monospace;
          font-size: 10px;
          color: #B8BDB4;
        }
      `}</style>

      <div className="m3-root">
        <nav className="m3-nav">
          <span className="m3-nav-wordmark">{data.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {data.location && (
              <span className="m3-location-pill">{data.location}</span>
            )}
            {data.availability && data.availability !== 'Not looking' && (
              <div className="m3-availability-pill">
                <div className="m3-avail-dot" />
                <span className="m3-avail-text">{data.availability}</span>
              </div>
            )}
          </div>
        </nav>

        <div className="m3-body">
          <h1 className="m3-name">
            {data.name.split(' ').map((word, i, arr) =>
              i === arr.length - 1
                ? <em key={i}>{(i > 0 ? ' ' : '') + word}</em>
                : (i === 0 ? word : ' ' + word)
            )}
          </h1>
          <p className="m3-title">{data.title}</p>

          <div className="m3-contact">
            {data.contact.email && <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>}
            {data.contact.github && <a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer">{data.contact.github}</a>}
            {data.contact.linkedin && <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer">{data.contact.linkedin}</a>}
            {data.contact.website && <a href={data.contact.website} target="_blank" rel="noopener noreferrer">{data.contact.website}</a>}
          </div>

          {data.summary && (
            <div className="m3-section">
              <span className="m3-label">About</span>
              <p className="m3-summary">{data.summary}</p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div className="m3-section">
              <span className="m3-label">Experience</span>
              <div>
                {data.experience.map((job, i) => (
                  <div key={i} className="m3-job">
                    <div className="m3-timeline-line" />
                    <div className="m3-timeline-dot" />
                    <div className="m3-job-content">
                      <div className="m3-job-top">
                        <span className="m3-job-title">{job.role}</span>
                        <span className="m3-job-dates">{job.start} – {job.end}</span>
                      </div>
                      <div className="m3-job-company">{job.company}{job.location ? ` · ${job.location}` : ''}</div>
                      <ul className="m3-bullets">
                        {job.bullets.map((b, j) => (
                          <li key={j} className="m3-bullet">{b}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.skills.length > 0 && (
            <div className="m3-section">
              <span className="m3-label">Skills</span>
              <div className="m3-chips">
                {data.skills.map((s, i) => <span key={i} className="m3-chip">{s}</span>)}
              </div>
            </div>
          )}

          {data.education.length > 0 && (
            <div className="m3-section">
              <span className="m3-label">Education</span>
              <div>
                {data.education.map((edu, i) => (
                  <div key={i} className="m3-edu">
                    <div className="m3-edu-school">{edu.school}</div>
                    <div className="m3-edu-row">
                      <span className="m3-edu-degree">{edu.degree}</span>
                      <span className="m3-edu-year">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages && data.languages.length > 0 && (
            <div className="m3-section">
              <span className="m3-label">Languages</span>
              <div className="m3-chips">
                {data.languages.map((l, i) => <span key={i} className="m3-chip">{l}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
