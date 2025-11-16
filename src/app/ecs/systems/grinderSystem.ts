// src/app/ecs/systems/grinderSystem.ts
import { defineQuery, removeEntity } from "bitecs";
import type { IWorld } from "bitecs";
import type { GameWorld, System } from "@/app/ecs/types";
import {
  GrindJob,
  GRIND_JOB_STATUS,
} from "@/app/ecs/components/GrindJob";

export interface GrinderResultPixelPacket {
  colorId: number;
  amount: number;
}

export interface GrinderBackend {
  requestGrinding(jobEid: number, world: GameWorld): void;
  pollResults(world: GameWorld): Array<{
    jobEid: number;
    pixels: GrinderResultPixelPacket[];
  }>;
}

export type AddPixelsToPoolFn = (
  world: GameWorld,
  pixels: GrinderResultPixelPacket[]
) => void;

export interface GrinderSystemConfig {
  backend: GrinderBackend;
  addPixelsToPool: AddPixelsToPoolFn;
}

export function createGrinderSystem(config: GrinderSystemConfig): System {
  const { backend, addPixelsToPool } = config;

  const pendingJobsQuery = defineQuery([GrindJob]);

  return (world: GameWorld): GameWorld => {
    const jobs = pendingJobsQuery(world as IWorld);

    for (const eid of jobs) {
      const status = GrindJob.status[eid];

      if (status === GRIND_JOB_STATUS.Pending) {
        GrindJob.status[eid] = GRIND_JOB_STATUS.Processing;
        backend.requestGrinding(eid, world);
      }
    }

    const results = backend.pollResults(world);
    for (const { jobEid, pixels } of results) {
      addPixelsToPool(world, pixels);
      removeEntity(world as IWorld, jobEid);
    }

    return world;
  };
}
