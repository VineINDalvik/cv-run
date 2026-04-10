'use client'

import { ResumeData } from '@/lib/schema'

interface Props {
  data: ResumeData
}

export default function T3TerminalOxide({ data }: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        .t3-root {
          background: #0D120E;
          color: #D1FAE5;
          font-family: 'IBM Plex Mono', monospace;
          min-height: 100vh;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }

        .t3-window {
          max-width: 860px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* Window chrome */
        .t3-chrome {
          background: rgba(110,231,183,0.04);
          border: 1px solid rgba(110,231,183,0.1);
          border-radius: 10px 10px 0 0;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0;
        }
        .t3-dot { width: 12px; height: 12px; border-radius: 50%; }
        .t3-dot-red { background: #FF5F57; }
        .t3-dot-yellow { background: #FFBD2E; }
        .t3-dot-green { background: #28C840; }
        .t3-chrome-title {
          flex: 1;
          text-align: center;
          font-size: 11px;
          color: rgba(110,231,183,0.3);
          letter-spacing: 0.1em;
        }

        .t3-body {
          background: rgba(110,231,183,0.02);
          border: 1px solid rgba(110,231,183,0.08);
          border-top: none;
          border-radius: 0 0 10px 10px;
          padding: 48px 56px 56px;
        }

        /* Header */
        .t3-name {
          font-size: 44px;
          font-weight: 500;
          color: #6EE7B7;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0 0 8px;
        }
        .t3-title {
          font-size: 13px;
          color: rgba(110,231,183,0.5);
          letter-spacing: 0.12em;
          font-weight: 300;
          margin: 0 0 24px;
        }
        .t3-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0 24px;
          font-size: 11px;
          color: rgba(110,231,183,0.4);
          margin-bottom: 40px;
          border-top: 1px solid rgba(110,231,183,0.08);
          border-bottom: 1px solid rgba(110,231,183,0.08);
          padding: 12px 0;
        }
        .t3-contact a { color: rgba(110,231,183,0.5); text-decoration: none; }
        .t3-contact a:hover { color: #6EE7B7; }

        /* Section */
        .t3-section { margin-bottom: 36px; }
        .t3-section-header {
          font-size: 11px;
          font-weight: 400;
          color: rgba(110,231,183,0.3);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .t3-section-header::before { content: '// '; color: rgba(110,231,183,0.2); }

        /* Summary */
        .t3-summary {
          font-size: 12.5px;
          line-height: 1.7;
          color: rgba(209,250,229,0.7);
          font-weight: 300;
        }

        /* Experience */
        .t3-job { margin-bottom: 28px; }
        .t3-job-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 4px;
        }
        .t3-job-title {
          font-size: 13px;
          font-weight: 500;
          color: #6EE7B7;
        }
        .t3-job-dates {
          font-size: 11px;
          color: rgba(110,231,183,0.35);
        }
        .t3-job-company {
          font-size: 11.5px;
          color: rgba(110,231,183,0.45);
          margin-bottom: 10px;
        }
        .t3-bullets { list-style: none; padding: 0; margin: 0; }
        .t3-bullet {
          font-size: 12px;
          line-height: 1.65;
          color: rgba(209,250,229,0.65);
          padding-left: 16px;
          position: relative;
          margin-bottom: 4px;
        }
        .t3-bullet::before {
          content: '▸';
          position: absolute;
          left: 0;
          color: rgba(110,231,183,0.4);
        }

        /* Skills */
        .t3-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .t3-skill {
          font-size: 11px;
          padding: 3px 10px;
          border: 1px solid rgba(110,231,183,0.15);
          border-radius: 3px;
          color: rgba(110,231,183,0.55);
          background: rgba(110,231,183,0.03);
        }

        /* Education */
        .t3-edu {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 6px;
        }
        .t3-edu-school { font-size: 12.5px; color: #D1FAE5; font-weight: 400; }
        .t3-edu-degree { font-size: 11px; color: rgba(110,231,183,0.4); }
        .t3-edu-year { font-size: 11px; color: rgba(110,231,183,0.3); }
      `}</style>
      <div className="t3-root">
        <div className="t3-window">
          <div className="t3-chrome">
            <div className="t3-dot t3-dot-red" />
            <div className="t3-dot t3-dot-yellow" />
            <div className="t3-dot t3-dot-green" />
            <span className="t3-chrome-title">{data.name.toLowerCase().replace(/\s/g, '.')} — resume.md</span>
          </div>
          <div className="t3-body">
            <h1 className="t3-name">{data.name}</h1>
            <p className="t3-title">{data.title}</p>
            <div className="t3-contact">
              {data.location && <span>{data.location}</span>}
              {data.contact.email && <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>}
              {data.contact.github && <a href={`https://${data.contact.github}`} target="_blank" rel="noopener noreferrer">{data.contact.github}</a>}
              {data.contact.linkedin && <a href={`https://${data.contact.linkedin}`} target="_blank" rel="noopener noreferrer">{data.contact.linkedin}</a>}
              {data.contact.website && <a href={data.contact.website} target="_blank" rel="noopener noreferrer">{data.contact.website}</a>}
            </div>

            {data.summary && (
              <div className="t3-section">
                <div className="t3-section-header">summary</div>
                <p className="t3-summary">{data.summary}</p>
              </div>
            )}

            {data.experience.length > 0 && (
              <div className="t3-section">
                <div className="t3-section-header">experience</div>
                {data.experience.map((job, i) => (
                  <div key={i} className="t3-job">
                    <div className="t3-job-header">
                      <span className="t3-job-title">{job.role}</span>
                      <span className="t3-job-dates">{job.start} – {job.end}</span>
                    </div>
                    <div className="t3-job-company">{job.company}{job.location ? ` · ${job.location}` : ''}</div>
                    <ul className="t3-bullets">
                      {job.bullets.map((b, j) => (
                        <li key={j} className="t3-bullet">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {data.skills.length > 0 && (
              <div className="t3-section">
                <div className="t3-section-header">skills</div>
                <div className="t3-skills">
                  {data.skills.map((s, i) => (
                    <span key={i} className="t3-skill">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.education.length > 0 && (
              <div className="t3-section">
                <div className="t3-section-header">education</div>
                {data.education.map((edu, i) => (
                  <div key={i} className="t3-edu">
                    <div>
                      <div className="t3-edu-school">{edu.school}</div>
                      <div className="t3-edu-degree">{edu.degree}</div>
                    </div>
                    <span className="t3-edu-year">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}

            {data.languages && data.languages.length > 0 && (
              <div className="t3-section">
                <div className="t3-section-header">languages</div>
                <div className="t3-skills">
                  {data.languages.map((l, i) => (
                    <span key={i} className="t3-skill">{l}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
