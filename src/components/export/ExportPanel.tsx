'use client';

import { useEffect, useState } from 'react';
import { downloadLessonExport, type ExportFormat } from './exportClient';
import { clsx } from '@/components/clsx';

type Toast = { type: 'success' | 'error'; msg: string } | null;

const DEFAULT_PDF = {
  fullLessonPlan: true,
  includeTeacherNotes: true,
  includeHomework: true,
  studentWorksheet: false,
  answerSheet: false,
};
const DEFAULT_PPTX = {
  deck: 'standard' as 'standard' | 'detailed',
  includeStarter: true,
  includeAssessment: true,
  includePlenary: true,
};

export function ExportPanel({ packId, title }: { packId: string; title: string }) {
  const [modal, setModal] = useState<ExportFormat | null>(null);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [pdf, setPdf] = useState(DEFAULT_PDF);
  const [pptx, setPptx] = useState(DEFAULT_PPTX);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  async function run(format: ExportFormat, options: Record<string, unknown>) {
    setBusy(format);
    try {
      await downloadLessonExport(format, packId, title, options);
      setToast({ type: 'success', msg: format === 'pdf' ? 'PDF downloaded.' : 'PowerPoint downloaded.' });
      setModal(null);
    } catch (e) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Export failed.' });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Download your lesson as a polished, print-ready PDF or a classroom-ready
        PowerPoint deck. Choose what to include before you export.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <ExportButton
          onClick={() => setModal('pdf')}
          icon={<PdfIcon />}
          label="Download PDF"
          sub="Lesson plan & worksheets"
          accent="from-violet-600 to-fuchsia-600"
          loading={busy === 'pdf'}
          disabled={busy !== null}
        />
        <ExportButton
          onClick={() => setModal('pptx')}
          icon={<SlidesIcon />}
          label="PowerPoint Slides"
          sub="Classroom-ready deck"
          accent="from-indigo-600 to-cyan-500"
          loading={busy === 'pptx'}
          disabled={busy !== null}
        />
        <button
          type="button"
          onClick={() => window.print()}
          disabled={busy !== null}
          className="flex min-h-[68px] items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-violet-700"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100">
            <PrintIcon />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">Print Lesson</span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">Open print dialog</span>
          </span>
        </button>
      </div>

      <p className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500 ring-1 ring-inset ring-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:ring-zinc-800">
        Every pack is original content generated for your class — review before
        teaching and adapt anything you&apos;d like to tweak.
      </p>

      {/* PDF options modal */}
      {modal === 'pdf' && (
        <Modal title="Export PDF" onClose={() => (busy ? null : setModal(null))}>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose what to include in the PDF.</p>
          <div className="mt-4 space-y-1">
            <Check label="Full lesson plan" checked={pdf.fullLessonPlan} onChange={(v) => setPdf({ ...pdf, fullLessonPlan: v })} />
            <Check label="Include teacher notes" checked={pdf.includeTeacherNotes} onChange={(v) => setPdf({ ...pdf, includeTeacherNotes: v })} />
            <Check label="Include homework" checked={pdf.includeHomework} onChange={(v) => setPdf({ ...pdf, includeHomework: v })} />
            <Check label="Student worksheet" checked={pdf.studentWorksheet} onChange={(v) => setPdf({ ...pdf, studentWorksheet: v })} />
            <Check label="Answer sheet" checked={pdf.answerSheet} onChange={(v) => setPdf({ ...pdf, answerSheet: v })} />
          </div>
          <ModalActions
            busy={busy === 'pdf'}
            onCancel={() => setModal(null)}
            onConfirm={() => run('pdf', pdf)}
            confirmLabel="Download PDF"
          />
        </Modal>
      )}

      {/* PPTX options modal */}
      {modal === 'pptx' && (
        <Modal title="Export PowerPoint" onClose={() => (busy ? null : setModal(null))}>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Pick a deck style and what to include.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Radio label="Standard" sub="10 slides" checked={pptx.deck === 'standard'} onChange={() => setPptx({ ...pptx, deck: 'standard' })} />
            <Radio label="Detailed" sub="Extra teaching slides" checked={pptx.deck === 'detailed'} onChange={() => setPptx({ ...pptx, deck: 'detailed' })} />
          </div>
          <div className="mt-3 space-y-1">
            <Check label="Include starter activity" checked={pptx.includeStarter} onChange={(v) => setPptx({ ...pptx, includeStarter: v })} />
            <Check label="Include assessment questions" checked={pptx.includeAssessment} onChange={(v) => setPptx({ ...pptx, includeAssessment: v })} />
            <Check label="Include plenary" checked={pptx.includePlenary} onChange={(v) => setPptx({ ...pptx, includePlenary: v })} />
          </div>
          <ModalActions
            busy={busy === 'pptx'}
            onCancel={() => setModal(null)}
            onConfirm={() => run('pptx', pptx)}
            confirmLabel="Download PowerPoint"
          />
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={clsx(
            'fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ring-1 sm:left-auto sm:right-6 sm:mx-0 print:hidden',
            toast.type === 'success'
              ? 'bg-violet-600 text-white ring-violet-700'
              : 'bg-red-600 text-white ring-red-700',
          )}
        >
          {toast.type === 'success' ? <CheckIcon /> : <AlertIcon />}
          <span className="flex-1">{toast.msg}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="opacity-80 hover:opacity-100">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function ExportButton({
  onClick,
  icon,
  label,
  sub,
  accent,
  loading,
  disabled,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
  accent: string;
  loading: boolean;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'group flex min-h-[68px] items-center gap-3 rounded-2xl bg-gradient-to-r p-4 text-left text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
        accent,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
        {loading ? <Spinner /> : icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-bold">{loading ? 'Generating…' : label}</span>
        <span className="block text-xs text-white/80">{sub}</span>
      </span>
    </button>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 print:hidden">
      <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl dark:bg-zinc-900 dark:ring-1 dark:ring-zinc-800"
      >
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  busy,
  onCancel,
  onConfirm,
  confirmLabel,
}: {
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 font-display text-sm font-bold text-white shadow-sm transition-all hover:brightness-105 disabled:opacity-70"
      >
        {busy ? (
          <>
            <Spinner /> Generating…
          </>
        ) : (
          confirmLabel
        )}
      </button>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-800"
      />
    </label>
  );
}

function Radio({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={clsx(
        'rounded-xl border p-3 text-left transition-colors',
        checked
          ? 'border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/40'
          : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600',
      )}
    >
      <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-50">{label}</span>
      <span className="block text-xs text-zinc-500 dark:text-zinc-400">{sub}</span>
    </button>
  );
}

/* ------------------------------- icons ------------------------------- */
function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function PdfIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SlidesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v4M9 20h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9V3h12v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="3" y="9" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 17h10v4H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
