export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 50% 40%, var(--accent-glow), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
