import type { ExportLesson } from '@/lib/export/types';

/**
 * Full, single-flow lesson rendering used only for printing (window.print()).
 * Hidden on screen; revealed by the `@media print` rules in globals.css.
 * Uses fixed light colours so it always prints cleanly, even in dark mode.
 */
export function PrintableLesson({ lesson }: { lesson: ExportLesson }) {
  const chips = [lesson.subject, lesson.examBoard, lesson.yearGroup, lesson.ability, lesson.duration].filter(Boolean);

  return (
    <div className="printable hidden print:block" aria-hidden="true">
      <header style={{ borderBottom: '3px solid #7c3aed', paddingBottom: 12, marginBottom: 16 }}>
        <p style={{ color: '#7c3aed', fontWeight: 700, fontSize: 11, letterSpacing: 2, margin: 0 }}>LESSON PACK</p>
        <h1 style={{ color: '#18181b', fontSize: 26, margin: '6px 0 0' }}>{lesson.title}</h1>
        <p style={{ color: '#52525b', fontSize: 12, margin: '6px 0 0' }}>{chips.join('  •  ')}</p>
      </header>

      <Block title="Overview"><p style={p}>{lesson.summary}</p></Block>

      <Block title="Learning objectives"><Ul items={lesson.learningObjectives} /></Block>
      {lesson.successCriteria.length > 0 && (
        <Block title="Success criteria"><Ul items={lesson.successCriteria} /></Block>
      )}

      {lesson.timeline.length > 0 && (
        <Block title="Lesson timeline">
          {lesson.timeline.map((t, i) => (
            <p key={i} style={p}>
              <strong style={{ color: '#7c3aed' }}>{t.durationMins ? `${t.durationMins} min` : '—'}</strong>
              {'  '}<strong>{t.title}.</strong> {t.detail}
            </p>
          ))}
        </Block>
      )}

      {lesson.starterActivity && <Block title="Starter activity"><p style={p}>{lesson.starterActivity}</p></Block>}
      {lesson.mainTeaching && <Block title="Main teaching"><p style={p}>{lesson.mainTeaching}</p></Block>}
      {lesson.guidedPractice && <Block title="Guided practice"><p style={p}>{lesson.guidedPractice}</p></Block>}
      {lesson.independentTask && <Block title="Independent task"><p style={p}>{lesson.independentTask}</p></Block>}
      {lesson.plenary && <Block title="Plenary"><p style={p}>{lesson.plenary}</p></Block>}

      {lesson.assessmentQuestions.length > 0 && (
        <Block title="Assessment questions">
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {lesson.assessmentQuestions.map((q, i) => (
              <li key={i} style={{ ...p, marginBottom: 4 }}>
                {q.prompt} <span style={{ color: '#71717a' }}>({q.marks} marks)</span>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {lesson.differentiation.length > 0 && (
        <Block title="Differentiation">
          {lesson.differentiation.map((d, i) => (
            <p key={i} style={p}><strong>{d.level}:</strong> {d.detail}</p>
          ))}
        </Block>
      )}

      {lesson.resourcesNeeded.length > 0 && <Block title="Resources needed"><Ul items={lesson.resourcesNeeded} /></Block>}
      {lesson.homework && <Block title="Homework"><p style={p}>{lesson.homework}</p></Block>}

      <Block title="Teacher notes">
        {lesson.teacherNotes.misconceptions.length > 0 && (
          <>
            <p style={{ ...subLabel }}>Common misconceptions</p>
            <Ul items={lesson.teacherNotes.misconceptions} />
          </>
        )}
        {lesson.teacherNotes.teachingPoints.length > 0 && (
          <>
            <p style={{ ...subLabel }}>Key teaching points</p>
            <Ul items={lesson.teacherNotes.teachingPoints} />
          </>
        )}
        {lesson.teacherNotes.safety && (
          <>
            <p style={{ ...subLabel }}>Safety</p>
            <p style={p}>{lesson.teacherNotes.safety}</p>
          </>
        )}
      </Block>
    </div>
  );
}

const p: React.CSSProperties = { color: '#3f3f46', fontSize: 12.5, lineHeight: 1.55, margin: '0 0 6px' };
const subLabel: React.CSSProperties = { color: '#7c3aed', fontWeight: 700, fontSize: 11, margin: '8px 0 4px' };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 14, breakInside: 'avoid' }}>
      <h2 style={{ color: '#18181b', fontSize: 15, margin: '0 0 6px', borderLeft: '3px solid #7c3aed', paddingLeft: 8 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 18, margin: 0 }}>
      {items.map((it, i) => (
        <li key={i} style={{ ...p, marginBottom: 3 }}>{it}</li>
      ))}
    </ul>
  );
}
