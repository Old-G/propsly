export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="hidden w-64 border-r border-[var(--border-default)] bg-[var(--bg-surface)] lg:block">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Propsly</h2>
        </div>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
