const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002"

interface ProposalSharedEmailProps {
  proposalTitle: string
  senderName: string
  senderCompany?: string
  message?: string
  proposalSlug: string
}

export function buildProposalSharedEmail({
  proposalTitle,
  senderName,
  senderCompany,
  message,
  proposalSlug,
}: ProposalSharedEmailProps): string {
  const viewUrl = `${BASE_URL}/p/${proposalSlug}`
  const fromLine = senderCompany
    ? `${senderName} from ${senderCompany}`
    : senderName

  const messageBlock = message
    ? `<tr><td style="padding-bottom:24px">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:16px;background-color:#141414;border-radius:8px;border-left:3px solid #34d399;color:#d4d4d4;font-size:15px;line-height:1.6;font-style:italic">
            ${escapeHtml(message)}
          </td></tr>
        </table>
      </td></tr>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
        <!-- Logo -->
        <tr><td style="padding-bottom:32px">
          <span style="font-size:24px;font-style:italic;color:#fafafa;font-family:Georgia,serif">Propsly</span><span style="font-size:24px;color:#34d399;font-family:Georgia,serif">.</span>
        </td></tr>

        <!-- Heading -->
        <tr><td style="padding-bottom:8px">
          <h1 style="margin:0;font-size:24px;font-weight:600;color:#fafafa">You've received a proposal</h1>
        </td></tr>

        <!-- From -->
        <tr><td style="padding-bottom:24px;color:#a1a1a1;font-size:16px;line-height:1.6">
          <strong style="color:#d4d4d4">${escapeHtml(fromLine)}</strong> has shared a proposal with you.
        </td></tr>

        <!-- Proposal title -->
        <tr><td style="padding-bottom:24px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:20px;background-color:#141414;border-radius:12px;border:1px solid #262626">
              <p style="margin:0 0 4px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#737373">Proposal</p>
              <p style="margin:0;font-size:20px;font-weight:600;color:#fafafa">${escapeHtml(proposalTitle)}</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Personal message -->
        ${messageBlock}

        <!-- CTA -->
        <tr><td style="padding-bottom:40px">
          <a href="${viewUrl}" style="display:inline-block;padding:14px 28px;background-color:#34d399;color:#0a0a0a;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px">View Proposal</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;color:#525252;font-size:13px;line-height:1.5">
          Sent via <a href="${BASE_URL}" style="color:#525252;text-decoration:none">Propsly</a> — the open-source proposal platform.
          <br>This email was sent because someone shared a proposal with you.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>")
}
