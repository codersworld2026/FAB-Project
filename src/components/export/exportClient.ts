import { slugifyTitle } from '@/lib/export/types';

export type ExportFormat = 'pdf' | 'pptx';

/**
 * POST the lesson id + options to the export route, then trigger a browser
 * download of the returned file. Throws with a user-friendly message on error.
 */
export async function downloadLessonExport(
  format: ExportFormat,
  packId: string,
  title: string,
  options?: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(`/api/export/${format}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packId, options }),
  });

  if (!res.ok) {
    let msg = 'Export failed. Please try again.';
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(msg);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugifyTitle(title)}${format === 'pptx' ? '-slides.pptx' : '.pdf'}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
