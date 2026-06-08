import { requireProfile } from '@/lib/auth';
import { getPack } from '@/lib/packs';
import { buildExportLesson } from '@/lib/export/lesson';
import { renderLessonPdf } from '@/lib/export/LessonPdf';
import { pdfRequestSchema, pdfOptionsSchema, slugifyTitle } from '@/lib/export/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    await requireProfile();

    const parsed = pdfRequestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 },
      );
    }

    const pack = await getPack(parsed.data.packId);
    if (!pack) {
      return Response.json({ error: 'Lesson not found.' }, { status: 404 });
    }
    if (!pack.content) {
      return Response.json({ error: 'This lesson has no generated content yet.' }, { status: 422 });
    }

    const options = pdfOptionsSchema.parse(parsed.data.options ?? {});
    const lesson = buildExportLesson(pack);
    const pdf = await renderLessonPdf(lesson, options);

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${slugifyTitle(lesson.title)}.pdf"`,
        'Content-Length': String(pdf.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF export failed:', err);
    return Response.json({ error: 'Could not generate the PDF. Please try again.' }, { status: 500 });
  }
}
