const STATS = [
  { icon: '🌍', value: '100+', label: 'Countries' },
  { icon: '👩‍🏫', value: '1,000,000+', label: 'Teachers helped' },
  { icon: '⭐', value: '4.9/5', label: 'Teacher rating' },
  { icon: '💬', value: '40+', label: 'Languages supported' },
];

export function StatsRow() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="grid grid-cols-2 gap-3 rounded-3xl border border-violet-100 bg-white p-4 shadow-sm sm:gap-4 sm:p-8 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl bg-violet-50/40 p-3 sm:bg-transparent sm:p-0"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg sm:h-11 sm:w-11 sm:text-xl">
              {s.icon}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold tracking-tight text-zinc-900 sm:text-xl">
                {s.value}
              </p>
              <p className="text-[11px] text-zinc-500 sm:text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
