"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendTaskEmail } from "@/actions/followups";

type Props = {
  taskId: string;
  to: string;
  subject: string;
  body: string;
};

export function EmailComposer({ taskId, to, subject, body }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [s, setS] = useState(subject);
  const [b, setB] = useState(body);
  const [recipient, setRecipient] = useState(to);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.set("taskId", taskId);
    fd.set("to", recipient);
    fd.set("subject", s);
    fd.set("body", b);

    const res = await sendTaskEmail(fd);
    setSubmitting(false);

    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Email sent");
    router.push("/followups");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          type="email"
          required
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          required
          value={s}
          onChange={(e) => setS(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          required
          value={b}
          onChange={(e) => setB(e.target.value)}
          rows={12}
          className="font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={submitting || !recipient}>
          {submitting ? "Sending…" : "Send email"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Tip: if RESEND_API_KEY is not set locally, the email will be logged to the server console instead of being sent.
      </p>
    </form>
  );
}
