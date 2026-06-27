export default function Hero() {
  return (
    <section className="mx-auto max-w-[1140px] px-6 py-14 pb-10 dark:text-ink">
      <span className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-[#190046] px-4 py-2 text-[0.85rem] font-semibold tracking-wide text-white">
        <span className="relative h-[9px] w-[9px] shrink-0 rounded-full bg-accent animate-pulse-dot" />
        <strong className="text-[0.8rem] font-extrabold tracking-[0.06em] text-accent uppercase">
          Live
        </strong>
        <span className="h-3.5 w-px bg-white/25" />
        47 neue Meldungen heute
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
