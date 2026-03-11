import { redirect } from "next/navigation";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.propsly.org";

export const metadata = {
  title: "Log In — Propsly",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  redirect(`${APP_URL}/login`);
}
