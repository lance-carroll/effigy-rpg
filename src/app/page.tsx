export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="surface-shadow-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <h1 className="text-3xl font-semibold text-[var(--color-accent)]">Effigy</h1>
        <p className="mt-2 text-[var(--foreground)]/70">
          Character sheet and roller coming soon.
        </p>
      </div>
    </main>
  );
}
