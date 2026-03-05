import { Resend } from "resend";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://propsly.org";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const resend = getResend();
  if (!resend) return;

  const firstName = name?.split(" ")[0] ?? "there";

  return resend.emails.send({
    from: "Propsly <hello@propsly.org>",
    to,
    subject: "Welcome to Propsly!",
    html: `<!DOCTYPE html>
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
        <tr><td style="padding-bottom:16px">
          <h1 style="margin:0;font-size:28px;font-weight:600;color:#fafafa">Hey ${firstName}!</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding-bottom:24px;color:#a1a1a1;font-size:16px;line-height:1.6">
          Welcome to Propsly — the open-source proposal platform. We're building the best way to create interactive proposals as web pages, and you're in early.
        </td></tr>

        <tr><td style="padding-bottom:24px;color:#a1a1a1;font-size:16px;line-height:1.6">
          Here's what's coming:
        </td></tr>

        <tr><td style="padding-bottom:24px">
          <table cellpadding="0" cellspacing="0" style="color:#a1a1a1;font-size:15px;line-height:1.6">
            <tr><td style="padding:4px 12px 4px 0;color:#34d399">&#10003;</td><td>Drag-and-drop proposal editor</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#34d399">&#10003;</td><td>Interactive pricing tables</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#34d399">&#10003;</td><td>Real-time view tracking</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#34d399">&#10003;</td><td>E-signatures built in</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#34d399">&#10003;</td><td>Self-hostable, free forever</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding-bottom:32px;color:#a1a1a1;font-size:16px;line-height:1.6">
          We'll email you when the MVP is ready. In the meantime, star us on GitHub to follow progress.
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding-bottom:40px">
          <a href="https://github.com/Old-G/propsly" style="display:inline-block;padding:12px 24px;background-color:#34d399;color:#0a0a0a;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px">Star on GitHub</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="border-top:1px solid #1a1a1a;padding-top:24px;color:#525252;font-size:13px;line-height:1.5">
          <a href="${BASE_URL}" style="color:#525252;text-decoration:none">propsly.org</a>
          <br>Open-source proposal platform
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
