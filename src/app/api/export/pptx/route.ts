import { requireProfile } from '@/lib/auth';
import { getPack } from '@/lib/packs';
import { buildExportLesson } from '@/lib/export/lesson';
import { buildLessonPptx } from '@/lib/export/lessonPptx';
import { pptxRequestSchema, pptxOptionsSchema, slugifyTitle } from '@/lib/export/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const PPTX_MIME =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';

export async function POST(req: Request) {
  try {
    await requireProfile();

    const parsed = pptxRequestSchema.safeParse(await req.json().catch(() => null));
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

    const options = pptxOptionsSchema.parse(parsed.data.options ?? {});
    const lesson = buildExportLesson(pack);
    const pptx = await buildLessonPptx(lesson, options);

    return new Response(new Uint8Array(pptx), {
      status: 200,
      headers: {
        'Content-Type': PPTX_MIME,
        'Content-Disposition': `attachment; filename="${slugifyTitle(lesson.title)}-slides.pptx"`,
        'Content-Length': String(pptx.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PPTX export failed:', err);
    return Response.json({ error: 'Could not generate the PowerPoint. Please try again.' }, { status: 500 });
  }
}
