import type {
  Contact,
  Job,
  FollowUpTask,
  MessageTemplate,
  Subscription,
  User,
} from "@prisma/client";

export type { Contact, Job, FollowUpTask, MessageTemplate, Subscription, User };

export type ContactWithJobs = Contact & { jobs: Job[] };

export type TaskWithRelations = FollowUpTask & {
  contact: Contact;
  job: Job | null;
};

export type JobWithContact = Job & { contact: Contact };
