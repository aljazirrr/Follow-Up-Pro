import type { DefaultTemplate } from "@/emails/defaults";
import { DEFAULT_TEMPLATES } from "@/emails/defaults";

export type IndustryConfig = {
  quoteFollowUpDays: number;
  reviewRequestDays: number;
  templates: DefaultTemplate[];
};

export const INDUSTRY_DEFAULTS: Record<string, IndustryConfig> = {
  INSTALLER: {
    quoteFollowUpDays: 3,
    reviewRequestDays: 2,
    templates: [
      {
        type: "QUOTE_FOLLOW_UP",
        name: "Installation quote follow-up",
        subject: "Following up on your installation quote",
        body: `Hi {{customer_name}},

Just checking in on the quote I sent for {{job_title}}. I know installation projects take some thought — happy to answer any questions about timelines, materials, or warranty.

Let me know if you'd like to move forward or if anything needs adjusting.

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "CONFIRMATION",
        name: "Installation booking confirmation",
        subject: "Your installation is confirmed — {{job_title}}",
        body: `Hi {{customer_name}},

Great news — your installation for {{job_title}} is confirmed. Here's what to expect:

- I'll be in touch before the scheduled date with any prep details
- Please make sure the work area is accessible on the day
- If anything changes on your end, just reply to this email

Looking forward to getting this done for you.

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REVIEW_REQUEST",
        name: "Installation review request",
        subject: "How did the installation go?",
        body: `Hi {{customer_name}},

Now that your {{job_title}} has been completed, I'd love to hear how everything turned out. A quick review helps other homeowners find reliable installers.

If anything isn't right, just reply — I want to make sure you're 100% satisfied.

Thanks,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REACTIVATION",
        name: "Installation check-in",
        subject: "Time for a check-up on your installation?",
        body: `Hi {{customer_name}},

It's been a while since we completed {{service_type}} for you. Just wanted to check in — is everything still working well?

If you need any maintenance, adjustments, or have a new project in mind, I'm happy to help.

Best,
{{owner_name}}
{{company_name}}`,
      },
    ],
  },

  DETAILER: {
    quoteFollowUpDays: 2,
    reviewRequestDays: 1,
    templates: [
      {
        type: "QUOTE_FOLLOW_UP",
        name: "Detailing quote follow-up",
        subject: "Still interested in getting your vehicle detailed?",
        body: `Hi {{customer_name}},

Following up on the quote for {{job_title}}. Your vehicle deserves the best care — and the sooner we get started, the better the protection.

Let me know if you have any questions about the process or products we use.

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "CONFIRMATION",
        name: "Detailing appointment confirmation",
        subject: "Your detailing appointment is confirmed",
        body: `Hi {{customer_name}},

Your appointment for {{job_title}} is confirmed. A few things to keep in mind:

- Please remove personal items from the vehicle
- If mobile: make sure the vehicle is accessible and near a water/power source
- The process typically takes a few hours depending on the package

See you soon!

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REVIEW_REQUEST",
        name: "Detailing review request",
        subject: "Loving the results? Share your experience!",
        body: `Hi {{customer_name}},

Hope you're enjoying how your vehicle looks after the {{job_title}}! If you have a moment, a quick review would mean a lot — and maybe snap a photo of the finish.

It really helps other car owners find quality detailing.

Thanks,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REACTIVATION",
        name: "Detailing refresh reminder",
        subject: "Time for a detail refresh?",
        body: `Hi {{customer_name}},

It's been a while since your last {{service_type}}. Depending on driving conditions, now might be a good time for a maintenance wash or a fresh coat of protection.

Want me to get you on the schedule?

Best,
{{owner_name}}
{{company_name}}`,
      },
    ],
  },

  SALON: {
    quoteFollowUpDays: 1,
    reviewRequestDays: 1,
    templates: [
      {
        type: "QUOTE_FOLLOW_UP",
        name: "Salon booking follow-up",
        subject: "Ready to book your appointment?",
        body: `Hi {{customer_name}},

Just following up on {{job_title}} — wanted to make sure you had all the info you need. I have some availability coming up if you'd like to get booked in.

Let me know what works for you!

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "CONFIRMATION",
        name: "Salon appointment confirmation",
        subject: "Your appointment is confirmed!",
        body: `Hi {{customer_name}},

Your appointment for {{job_title}} is confirmed! Just a quick reminder:

- Please arrive on time so we can give you the full session
- If you need to reschedule, let me know at least 24 hours in advance

Looking forward to seeing you!

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REVIEW_REQUEST",
        name: "Salon review request",
        subject: "Loved your visit? Tell others!",
        body: `Hi {{customer_name}},

Thanks for coming in for {{job_title}}! If you're happy with the results, I'd really appreciate a quick review. It helps new clients find us and means a lot to a small business.

See you next time!

Thanks,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REACTIVATION",
        name: "Salon rebooking reminder",
        subject: "Time for a refresh?",
        body: `Hi {{customer_name}},

It's been a while since your last visit for {{service_type}}. If you're due for a refresh or want to try something new, I'd love to get you back in the chair.

Reply to this email or book directly — I have some availability this week.

Best,
{{owner_name}}
{{company_name}}`,
      },
    ],
  },

  REPAIR: {
    quoteFollowUpDays: 2,
    reviewRequestDays: 1,
    templates: [
      {
        type: "QUOTE_FOLLOW_UP",
        name: "Repair quote follow-up",
        subject: "Following up on your repair quote",
        body: `Hi {{customer_name}},

Just checking in on the quote for {{job_title}}. I understand repairs can be unexpected — happy to discuss the scope or explore options that fit your budget.

Let me know how you'd like to proceed.

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "CONFIRMATION",
        name: "Repair service confirmation",
        subject: "Your repair is scheduled — {{job_title}}",
        body: `Hi {{customer_name}},

Your repair for {{job_title}} is confirmed. Here's what to expect:

- I'll arrive within the scheduled time window
- Please make sure the area is accessible
- If you need to reschedule, let me know as soon as possible

See you soon.

Best,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REVIEW_REQUEST",
        name: "Repair review request",
        subject: "Everything working well? Leave a quick review",
        body: `Hi {{customer_name}},

Hope everything is working well after the {{job_title}}. If you're satisfied with the work, a short review would help other customers find reliable service.

And if anything's not right, just reply — I'll make it right.

Thanks,
{{owner_name}}
{{company_name}}`,
      },
      {
        type: "REACTIVATION",
        name: "Service check-in",
        subject: "Need any repairs or maintenance?",
        body: `Hi {{customer_name}},

It's been a while since we last helped you with {{service_type}}. Just wanted to reach out in case you have any new repairs or maintenance needs.

Seasonal check-ups can prevent bigger problems down the road. Happy to take a look if anything comes to mind.

Best,
{{owner_name}}
{{company_name}}`,
      },
    ],
  },

  OTHER: {
    quoteFollowUpDays: 2,
    reviewRequestDays: 1,
    templates: DEFAULT_TEMPLATES,
  },
};
