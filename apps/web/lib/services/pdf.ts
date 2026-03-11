/**
 * Server-side PDF generation via Gotenberg (Docker).
 * Only used in self-hosted Docker deployments.
 * For dev/cloud, PDF is generated client-side via window.print().
 */

const GOTENBERG_URL = process.env.GOTENBERG_URL || "http://localhost:3003"

export async function generatePdfFromUrl(url: string): Promise<Buffer> {
  const formData = new FormData()
  formData.append("url", url)
  formData.append("paperWidth", "8.27")
  formData.append("paperHeight", "11.69")
  formData.append("marginTop", "0.4")
  formData.append("marginBottom", "0.4")
  formData.append("marginLeft", "0.4")
  formData.append("marginRight", "0.4")
  formData.append("printBackground", "true")
  formData.append("waitDelay", "2s")
  formData.append("emulatedMediaType", "print")

  const response = await fetch(
    `${GOTENBERG_URL}/forms/chromium/convert/url`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Gotenberg error (${response.status}): ${text}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
