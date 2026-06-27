interface HeroProps {
  todayCount: number;
}

export default function Hero({ todayCount }: HeroProps) {
  const countLabel =
    todayCount === 1
      ? "1 neue Meldung heute"
      : `${todayCount} neue Meldungen heute`;

  return (
    <section className="mx-auto max-w-[1140px] px-6 py-8 pb-6 md:py-14 md:pb-10 dark:text-ink">
      <span className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#190046] py-1.5 pr-5 pl-1.5 text-[0.85rem] font-semibold tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(25,0,70,0.5)]">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 py-1 pr-3 pl-2.5">
          <span className="relative h-2 w-2 shrink-0 rounded-full bg-accent animate-pulse-dot" />
          <strong className="text-[0.72rem] font-extrabold tracking-[0.12em] text-accent uppercase">
            Live
          </strong>
        </span>
        <span className="text-white/90">{countLabel}</span>
      </span>
      <h1 className="mb-4 max-w-[16ch] text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
        Die wichtigsten News für Entscheider — in 3 Minuten.
      </h1>
      <p className="max-w-[60ch] text-[1.15rem] text-muted">
        KI-zusammengefasste Nachrichten aus Tech, Business und Trends. Täglich.
        Kostenlos.
      </p>
    </section>
  );
}
