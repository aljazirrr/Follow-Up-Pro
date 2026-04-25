import { z } from "zod";
import {
  JobStatus,
  LeadSource,
  TaskStatus,
  TaskType,
  Channel,
} from "@prisma/client";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  ownerName: z.string().min(1, "Name is required"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const contactSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
  serviceType: z.string().optional().or(z.literal("")),
  source: z.nativeEnum(LeadSource).default(LeadSource.MANUAL),
  notes: z.string().optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const jobSchema = z.object({
  contactId: z.string().min(1),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  estimatedValue: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(parseFloat(v)), "Must be a number"),
  currency: z.string().default("USD"),
  status: z.nativeEnum(JobStatus).default(JobStatus.NEW),
});
export type JobInput = z.infer<typeof jobSchema>;

export const jobStatusSchema = z.object({
  jobId: z.string().min(1),
  status: z.nativeEnum(JobStatus),
});

export const taskSchema = z.object({
  contactId: z.string().min(1),
  jobId: z.string().optional().or(z.literal("")),
  type: z.nativeEnum(TaskType).default(TaskType.MANUAL),
  title: z.string().min(1),
  messagePreview: z.string().optional().or(z.literal("")),
  dueDate: z.string().min(1),
  channel: z.nativeEnum(Channel).default(Channel.MANUAL),
});
export type TaskInput = z.infer<typeof taskSchema>;

export const taskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.nativeEnum(TaskStatus),
});

export const templateSchema = z.object({
  type: z.nativeEnum(TaskType),
  name: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
});
export type TemplateInput = z.infer<typeof templateSchema>;

export const sendEmailSchema = z.object({
  taskId: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export const automationSettingsSchema = z.object({
  quoteFollowUpDays: z.number().int().min(1).max(30),
  reviewRequestDays: z.number().int().min(1).max(30),
});
