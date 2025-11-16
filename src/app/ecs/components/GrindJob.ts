// src/app/ecs/components/GrindJob.ts
import { defineComponent, Types } from "bitecs";

export const GrindJob = defineComponent({
  sourceGenerator: Types.eid,
  status: Types.ui8,
});

export const GRIND_JOB_STATUS = {
  Pending: 0,
  Processing: 1,
} as const;

export type GrindJobStatus =
  (typeof GRIND_JOB_STATUS)[keyof typeof GRIND_JOB_STATUS];
