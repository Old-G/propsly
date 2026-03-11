import { redirect } from "next/navigation";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.propsly.org";

export const metadata = {
  title: "Sign Up — Propsly",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  redirect(`${APP_URL}/signup`);
}
