import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface ViewEvent {
  event: "view"
  proposalId: string
}

interface SectionEntry {
  nodeIndex: number
  blockId: string
  blockType: string
  timeMs: number
}

interface SectionsEvent {
  event: "sections"
  proposalId: string
  viewId: string
  sections: SectionEntry[]
}

type TrackingEvent = ViewEvent | SectionsEvent

function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TrackingEvent

    if (!body.event || !body.proposalId || !isValidUUID(body.proposalId)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const supabase = await createClient()

    if (body.event === "view") {
      return handleViewEvent(request, supabase, body)
    }

    if (body.event === "sections") {
      return handleSectionsEvent(supabase, body as SectionsEvent)
    }

    return NextResponse.json({ error: "Unknown event type" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}

async function handleViewEvent(
  request: Request,
  supabase: Awaited<ReturnType<typeof createClient>>,
  body: ViewEvent
) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const viewerIp =
    forwardedFor?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  const userAgent = request.headers.get("user-agent") ?? null

  // Simple rate limit: check if this IP viewed this proposal in the last minute
  if (viewerIp) {
    const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString()
    const { count } = await supabase
      .from("proposal_views")
      .select("*", { count: "exact", head: true })
      .eq("proposal_id", body.proposalId)
      .eq("viewer_ip", viewerIp)
      .gte("viewed_at", oneMinuteAgo)

    if (count && count > 0) {
      // Return the most recent view ID so the client can still track sections
      const { data: existingView } = await supabase
        .from("proposal_views")
        .select("id")
        .eq("proposal_id", body.proposalId)
        .eq("viewer_ip", viewerIp)
        .order("viewed_at", { ascending: false })
        .limit(1)
        .single()

      return NextResponse.json({
        success: true,
        rateLimited: true,
        viewId: existingView?.id ?? null,
      })
    }
  }

  // Parse user agent for device type (simple heuristic)
  let viewerDevice: string | null = null
  if (userAgent) {
    if (/mobile/i.test(userAgent)) {
      viewerDevice = "mobile"
    } else if (/tablet|ipad/i.test(userAgent)) {
      viewerDevice = "tablet"
    } else {
      viewerDevice = "desktop"
    }
  }

  // Insert the view record
  const { data: viewRecord, error: viewError } = await supabase
    .from("proposal_views")
    .insert({
      proposal_id: body.proposalId,
      viewer_ip: viewerIp,
      viewer_ua: userAgent,
      viewer_device: viewerDevice,
    })
    .select("id")
    .single()

  if (viewError) {
    console.error("Failed to insert view:", viewError)
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 })
  }

  // Update the proposal's viewed_at timestamp
  await supabase
    .from("proposals")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", body.proposalId)

  // Check if this is a first view or >24h since last view for notification flagging
  const twentyFourHoursAgo = new Date(Date.now() - 86_400_000).toISOString()
  const { count: recentViewCount } = await supabase
    .from("proposal_views")
    .select("*", { count: "exact", head: true })
    .eq("proposal_id", body.proposalId)
    .gte("viewed_at", twentyFourHoursAgo)
    .neq("id", viewRecord.id)

  if (recentViewCount === 0) {
    // First view or first view in 24h — create a notification for the proposal creator
    const { data: proposalData } = await supabase
      .from("proposals")
      .select("created_by, title")
      .eq("id", body.proposalId)
      .single()

    if (proposalData?.created_by) {
      const deviceLabel = viewerDevice ? ` from a ${viewerDevice} device` : ""
      // Notifications insert may fail due to RLS — silently ignore
      await supabase
        .from("notifications")
        .insert({
          user_id: proposalData.created_by,
          proposal_id: body.proposalId,
          type: "proposal_viewed",
          message: `Your proposal "${proposalData.title}" was just viewed${deviceLabel}.`,
        })
    }
  }

  return NextResponse.json({
    success: true,
    viewId: viewRecord.id,
  })
}

async function handleSectionsEvent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  body: SectionsEvent
) {
  if (!body.viewId || !isValidUUID(body.viewId)) {
    return NextResponse.json({ error: "Invalid viewId" }, { status: 400 })
  }

  if (!Array.isArray(body.sections) || body.sections.length === 0) {
    return NextResponse.json({ success: true })
  }

  // Filter out sections with no meaningful time
  const validSections = body.sections.filter(
    (s) =>
      typeof s.nodeIndex === "number" &&
      typeof s.timeMs === "number" &&
      s.timeMs > 0 &&
      s.timeMs < 600_000 // Cap at 10 minutes per block per batch
  )

  if (validSections.length === 0) {
    return NextResponse.json({ success: true })
  }

  // Upsert section views — we accumulate time for existing entries
  // Since Supabase doesn't support upsert with increment easily,
  // we insert new rows for each batch. The engagement calculation
  // will SUM the time_spent_ms for each block.
  const rows = validSections.map((s) => ({
    proposal_id: body.proposalId,
    view_id: body.viewId,
    block_id: s.blockId,
    block_type: s.blockType,
    time_spent_ms: s.timeMs,
  }))

  const { error } = await supabase.from("section_views").insert(rows)

  if (error) {
    console.error("Failed to insert section views:", error)
    return NextResponse.json(
      { error: "Failed to record sections" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
