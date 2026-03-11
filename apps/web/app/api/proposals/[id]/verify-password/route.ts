import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface VerifyPasswordBody {
  password: string
  proposalId: string
}

/**
 * Compares a plain-text password against a bcrypt hash.
 * Uses bcryptjs for comparison. If bcryptjs is not installed,
 * logs an error and returns false.
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const bcrypt = await import("bcryptjs")
    return bcrypt.compare(password, hash)
  } catch {
    console.error(
      "bcryptjs is not installed. Run: pnpm --filter @propsly/web add bcryptjs"
    )
    return false
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as VerifyPasswordBody

    if (!body.password || !body.proposalId) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      )
    }

    // Ensure the route param matches the body
    if (id !== body.proposalId) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: proposal, error } = await supabase
      .from("proposals")
      .select("id, password_hash")
      .eq("id", id)
      .single()

    if (error || !proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      )
    }

    if (!proposal.password_hash) {
      // No password set — allow access
      return NextResponse.json({ success: true })
    }

    const isValid = await verifyPassword(body.password, proposal.password_hash as string)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password" },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
