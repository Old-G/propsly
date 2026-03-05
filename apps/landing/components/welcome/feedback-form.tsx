"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitFeedback } from "@/app/welcome/actions";

export function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const result = await submitFeedback(message.trim());
      if (result.error) {
        toast.error(result.error);
      } else {
        toast("Thanks! Your feedback helps us build the right thing.");
        setMessage("");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="What's your biggest pain with proposals today?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        disabled={loading}
      />
      <Button type="submit" className="btn-primary" disabled={loading || !message.trim()}>
        {loading ? "Sending..." : "Send Feedback \u2192"}
      </Button>
    </form>
  );
}
