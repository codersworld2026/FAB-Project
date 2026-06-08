const STATS = [
  { icon: '🌍', value: '100+', label: 'Countries' },
  { icon: '👩‍🏫', value: '1,000,000+', label: 'Teachers helped' },
  { icon: '⭐', value: '4.9/5', label: 'Teacher rating' },
  { icon: '💬', value: '40+', label: 'Languages supported' },
];

export function StatsRow() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-xl">
              {s.icon}
            </span>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-zinc-900">
                {s.value}
              </p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
