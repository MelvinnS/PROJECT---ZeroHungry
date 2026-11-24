export default function AdminHomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl bg-white border border-black/10 p-8 shadow-sm">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary bg-primary-soft px-3 py-1 rounded-full mb-4">
          @zerohungry/admin
        </span>
        <h1 className="text-2xl font-bold text-ink mb-2">
          Panel Admin — Dari Sisa Jadi Nilai
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Scaffold awal aplikasi admin (port 3001). Modul autentikasi admin dan
          manajemen data akan ditambahkan pada tahap pengembangan berikutnya.
        </p>
      </div>
    </main>
  );
}
