import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WelcomeHero } from "@/components/welcome/welcome-hero";
import { FeedbackForm } from "@/components/welcome/feedback-form";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-[600px] px-6 py-20">
      <WelcomeHero
        user={{
          email: user.email!,
          full_name: user.user_metadata?.full_name,
        }}
      />

      <div
        className="mt-8 rounded-xl border border-[var(--border-default)] p-6"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        <h2 className="text-sm font-medium mb-4">
          Help us build what you need:
        </h2>
        <FeedbackForm />
      </div>
    </main>
  );
}
