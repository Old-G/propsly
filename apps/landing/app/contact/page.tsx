import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Propsly team. Questions, feedback, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-[600px] mx-auto pt-32 pb-20 px-6">
        <h1 className="heading-display text-4xl sm:text-5xl mb-4">
          Get in touch
        </h1>
        <p
          className="text-lg mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Questions, feedback, or just want to say hi? We&apos;d love to hear from you.
        </p>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
