import type { TaskType } from "@prisma/client";

export type DefaultTemplate = {
  type: TaskType;
  name: string;
  subject: string;
  body: string;
};

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    type: "QUOTE_FOLLOW_UP",
    name: "Quote follow-up",
    subject: "Checking in on your quote",
    body: `Hi {{customer_name}},

Just following up on the quote for {{job_title}}. Let me know if you have any questions or if you'd like to move forward.

Best,
{{owner_name}}
{{company_name}}`,
  },
  {
    type: "CONFIRMATION",
    name: "Confirmation",
    subject: "Confirming your booking for {{job_title}}",
    body: `Hi {{customer_name}},

Thanks for choosing us for {{job_title}}. This email confirms we're all set. I'll be in touch shortly with the next steps.

If anything changes on your side, just reply to this email.

Best,
{{owner_name}}
{{company_name}}`,
  },
  {
    type: "REVIEW_REQUEST",
    name: "Review request",
    subject: "Quick favor — would you leave us a review?",
    body: `Hi {{customer_name}},

Thanks again for trusting us with {{job_title}}. If you have a minute, a short review would mean a lot and helps other customers find us.

You can reply to this email with any feedback, or leave a review using the link below.

Thanks,
{{owner_name}}
{{company_name}}`,
  },
  {
    type: "REACTIVATION",
    name: "Reactivation",
    subject: "It's been a while — anything we can help with?",
    body: `Hi {{customer_name}},

It's been a while since we last worked together on {{service_type}}. Just checking in to see if there's anything we can help with.

Reply to this email and I'll get back to you personally.

Best,
{{owner_name}}
{{company_name}}`,
  },
];
