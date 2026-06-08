import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { ExportLesson, PdfOptions } from './types';

/* Brand palette (matches the app's violet system). */
const C = {
  violet: '#7c3aed',
  violetDark: '#5b21b6',
  ink: '#18181b',
  slate: '#3f3f46',
  grey: '#71717a',
  line: '#e9e5ff',
  soft: '#f5f3ff',
  white: '#ffffff',
  amber: '#b45309',
  amberBg: '#fffbeb',
};

const s = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: C.slate,
    lineHeight: 1.5,
  },
  // Cover
  coverBand: { backgroundColor: C.violet, borderRadius: 12, padding: 26, marginBottom: 22 },
  eyebrow: { color: '#ddd6fe', fontSize: 9, letterSpacing: 2, fontFamily: 'Helvetica-Bold' },
  coverTitle: { color: C.white, fontSize: 28, fontFamily: 'Helvetica-Bold', marginTop: 10, lineHeight: 1.15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, gap: 6 },
  chip: { backgroundColor: 'rgba(255,255,255,0.18)', color: C.white, fontSize: 9, fontFamily: 'Helvetica-Bold', paddingVertical: 4, paddingHorizontal: 9, borderRadius: 999 },
  summaryCard: { backgroundColor: C.soft, borderRadius: 10, padding: 16, borderLeft: `3 solid ${C.violet}` },
  summaryLabel: { color: C.violet, fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 5 },
  // Sections
  section: { marginBottom: 16 },
  h2: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 8 },
  h2bar: { width: 22, height: 3, backgroundColor: C.violet, borderRadius: 2, marginBottom: 7 },
  card: { backgroundColor: C.white, borderRadius: 9, padding: 14, border: `1 solid ${C.line}` },
  para: { color: C.slate },
  // bullets
  bulletRow: { flexDirection: 'row', marginBottom: 4 },
  bulletDot: { color: C.violet, marginRight: 7, fontFamily: 'Helvetica-Bold' },
  bulletText: { flex: 1, color: C.slate },
  // timeline
  tlRow: { flexDirection: 'row', marginBottom: 6, alignItems: 'flex-start' },
  tlTime: { width: 52, color: C.violet, fontFamily: 'Helvetica-Bold', fontSize: 10 },
  tlBody: { flex: 1 },
  tlTitle: { fontFamily: 'Helvetica-Bold', color: C.ink },
  // numbered
  qRow: { flexDirection: 'row', marginBottom: 6 },
  qNum: { width: 18, color: C.violet, fontFamily: 'Helvetica-Bold' },
  qBody: { flex: 1 },
  marks: { color: C.grey, fontFamily: 'Helvetica-Bold' },
  // two-col grid for differentiation
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridCard: { width: '48%', backgroundColor: C.soft, borderRadius: 8, padding: 11 },
  gridLabel: { fontFamily: 'Helvetica-Bold', color: C.violetDark, fontSize: 9, marginBottom: 3 },
  noteBox: { backgroundColor: C.amberBg, borderRadius: 8, padding: 11, marginTop: 8 },
  noteLabel: { color: C.amber, fontFamily: 'Helvetica-Bold', fontSize: 9, marginBottom: 3 },
  // footer + section heading on later pages
  footer: { position: 'absolute', bottom: 24, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', color: C.grey, fontSize: 8 },
  pageTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 4 },
  pageSub: { color: C.grey, marginBottom: 16 },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((it, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section} wrap={false}>
      <View style={s.h2bar} />
      <Text style={s.h2}>{title}</Text>
      <View style={s.card}>{children}</View>
    </View>
  );
}

function Footer({ title }: { title: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>{title}</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

function LessonPdfDocument({
  lesson,
  options,
}: {
  lesson: ExportLesson;
  options: PdfOptions;
}) {
  const includePlan = options.fullLessonPlan;
  const chips = [lesson.subject, lesson.examBoard, lesson.yearGroup, lesson.ability, lesson.duration].filter(Boolean);

  return (
    <Document
      title={`${lesson.title} — Lesson pack`}
      author="Lessons Generator"
      subject={`${lesson.subject} · ${lesson.yearGroup}`}
    >
      {/* Cover + core plan */}
      <Page size="A4" style={s.page} wrap>
        <View style={s.coverBand}>
          <Text style={s.eyebrow}>LESSON PACK</Text>
          <Text style={s.coverTitle}>{lesson.title}</Text>
          <View style={s.chipRow}>
            {chips.map((c) => (
              <Text key={c} style={s.chip}>{c}</Text>
            ))}
          </View>
        </View>

        <View style={[s.summaryCard, s.section]}>
          <Text style={s.summaryLabel}>OVERVIEW</Text>
          <Text style={s.para}>{lesson.summary}</Text>
        </View>

        {includePlan && (
          <>
            <Section title="Learning objectives">
              <Bullets items={lesson.learningObjectives} />
            </Section>

            {lesson.successCriteria.length > 0 && (
              <Section title="Success criteria">
                <Bullets items={lesson.successCriteria} />
              </Section>
            )}

            {lesson.timeline.length > 0 && (
              <Section title="Lesson timeline">
                {lesson.timeline.map((t, i) => (
                  <View key={i} style={s.tlRow}>
                    <Text style={s.tlTime}>{t.durationMins ? `${t.durationMins} min` : '—'}</Text>
                    <View style={s.tlBody}>
                      <Text style={s.tlTitle}>{t.title}</Text>
                      <Text style={s.para}>{t.detail}</Text>
                    </View>
                  </View>
                ))}
              </Section>
            )}

            {lesson.starterActivity ? (
              <Section title="Starter activity"><Text style={s.para}>{lesson.starterActivity}</Text></Section>
            ) : null}
            {lesson.mainTeaching ? (
              <Section title="Main teaching"><Text style={s.para}>{lesson.mainTeaching}</Text></Section>
            ) : null}
            {lesson.guidedPractice ? (
              <Section title="Guided practice"><Text style={s.para}>{lesson.guidedPractice}</Text></Section>
            ) : null}
            {lesson.independentTask ? (
              <Section title="Independent task"><Text style={s.para}>{lesson.independentTask}</Text></Section>
            ) : null}
            {lesson.plenary ? (
              <Section title="Plenary"><Text style={s.para}>{lesson.plenary}</Text></Section>
            ) : null}

            {lesson.assessmentQuestions.length > 0 && (
              <Section title="Assessment questions">
                {lesson.assessmentQuestions.map((q, i) => (
                  <View key={i} style={s.qRow}>
                    <Text style={s.qNum}>{i + 1}.</Text>
                    <View style={s.qBody}>
                      <Text style={s.para}>
                        {q.prompt} <Text style={s.marks}>({q.marks} marks)</Text>
                      </Text>
                    </View>
                  </View>
                ))}
              </Section>
            )}

            {lesson.differentiation.length > 0 && (
              <Section title="Differentiation">
                <View style={s.grid}>
                  {lesson.differentiation.map((d, i) => (
                    <View key={i} style={s.gridCard}>
                      <Text style={s.gridLabel}>{d.level.toUpperCase()}</Text>
                      <Text style={s.para}>{d.detail}</Text>
                    </View>
                  ))}
                </View>
              </Section>
            )}

            {lesson.resourcesNeeded.length > 0 && (
              <Section title="Resources needed">
                <Bullets items={lesson.resourcesNeeded} />
              </Section>
            )}

            {options.includeHomework && lesson.homework ? (
              <Section title="Homework"><Text style={s.para}>{lesson.homework}</Text></Section>
            ) : null}

            {options.includeTeacherNotes && (
              <Section title="Teacher notes">
                {lesson.teacherNotes.misconceptions.length > 0 && (
                  <>
                    <Text style={[s.gridLabel, { color: C.violet, marginBottom: 4 }]}>COMMON MISCONCEPTIONS</Text>
                    <Bullets items={lesson.teacherNotes.misconceptions} />
                  </>
                )}
                {lesson.teacherNotes.teachingPoints.length > 0 && (
                  <>
                    <Text style={[s.gridLabel, { color: C.violet, marginTop: 6, marginBottom: 4 }]}>KEY TEACHING POINTS</Text>
                    <Bullets items={lesson.teacherNotes.teachingPoints} />
                  </>
                )}
                {lesson.teacherNotes.safety ? (
                  <View style={s.noteBox}>
                    <Text style={s.noteLabel}>SAFETY</Text>
                    <Text style={s.para}>{lesson.teacherNotes.safety}</Text>
                  </View>
                ) : null}
              </Section>
            )}
          </>
        )}

        <Footer title={lesson.title} />
      </Page>

      {/* Student worksheet */}
      {options.studentWorksheet && lesson.worksheets.length > 0 && (
        <Page size="A4" style={s.page} wrap>
          <Text style={s.pageTitle}>Student worksheet</Text>
          <Text style={s.pageSub}>{lesson.title} · Name: ______________________  Class: __________</Text>
          {lesson.worksheets.map((w, wi) => (
            <View key={wi} style={s.section} wrap={false}>
              <View style={s.h2bar} />
              <Text style={s.h2}>{w.title}</Text>
              <View style={s.card}>
                {w.intro ? <Text style={[s.para, { marginBottom: 6, color: C.grey }]}>{w.intro}</Text> : null}
                {w.questions.map((q, i) => (
                  <View key={i} style={[s.qRow, { marginBottom: 12 }]}>
                    <Text style={s.qNum}>{i + 1}.</Text>
                    <View style={s.qBody}>
                      <Text style={s.para}>
                        {q.prompt} {q.marks ? <Text style={s.marks}>({q.marks} marks)</Text> : null}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
          <Footer title={`${lesson.title} — Worksheet`} />
        </Page>
      )}

      {/* Answer sheet */}
      {options.answerSheet && lesson.worksheets.length > 0 && (
        <Page size="A4" style={s.page} wrap>
          <Text style={s.pageTitle}>Answer sheet</Text>
          <Text style={s.pageSub}>{lesson.title} · Teacher copy</Text>
          {lesson.worksheets.map((w, wi) => (
            <View key={wi} style={s.section} wrap={false}>
              <View style={s.h2bar} />
              <Text style={s.h2}>{w.title}</Text>
              <View style={s.card}>
                {w.answers.map((a, i) => (
                  <View key={i} style={s.qRow}>
                    <Text style={s.qNum}>{i + 1}.</Text>
                    <Text style={s.qBody}>{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {lesson.markScheme.length > 0 && (
            <View style={s.section}>
              <View style={s.h2bar} />
              <Text style={s.h2}>Assessment mark scheme</Text>
              <View style={s.card}>
                {lesson.markScheme.map((m, i) => (
                  <View key={i} style={s.qRow}>
                    <Text style={[s.qNum, { width: 30 }]}>{m.questionRef}</Text>
                    <Text style={s.qBody}>
                      {m.answer} <Text style={s.marks}>[{m.marks}]</Text>
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <Footer title={`${lesson.title} — Answers`} />
        </Page>
      )}
    </Document>
  );
}

/** Render the lesson to a real PDF buffer (Node serverless). */
export async function renderLessonPdf(
  lesson: ExportLesson,
  options: PdfOptions,
): Promise<Buffer> {
  return renderToBuffer(<LessonPdfDocument lesson={lesson} options={options} />);
}
