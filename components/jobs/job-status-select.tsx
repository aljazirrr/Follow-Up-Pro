"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select } from "@/components/ui/select";
import { JobStatus } from "@prisma/client";
import { updateJobStatus } from "@/actions/jobs";
import { useTranslation } from "@/lib/i18n/client";

export function JobStatusSelect({ jobId, status }: { jobId: string; status: JobStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const { t } = useTranslation();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as JobStatus;
    start(async () => {
      const fd = new FormData();
      fd.set("jobId", jobId);
      fd.set("status", newStatus);
      const res = await updateJobStatus(fd);
      if (!res.ok) { toast.error(res.error); return; }
      toast.success(`${t.jobs.statusUpdated} ${t.status.job[newStatus]}`);
      router.refresh();
    });
  }

  return (
    <Select value={status} onChange={onChange} disabled={pending} className="w-44">
      {Object.values(JobStatus).map((s) => (
        <option key={s} value={s}>{t.status.job[s]}</option>
      ))}
    </Select>
  );
}
