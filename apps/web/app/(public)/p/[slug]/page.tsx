export default async function ProposalViewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen p-8">
      <p className="text-[var(--text-secondary)]">Proposal: {slug}</p>
    </div>
  )
}
