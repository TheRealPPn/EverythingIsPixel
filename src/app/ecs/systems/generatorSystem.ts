// src/app/ecs/systems/generatorSystem.ts
import {
  defineQuery,
  enterQuery,
  addEntity,
  addComponent,
} from "bitecs";
import type { IWorld } from "bitecs";
import type { GameWorld, System } from "@/app/ecs/types";
import {
  Generator,
  GeneratorState,
} from "@/app/ecs/components/Generator";
import {
  GrindJob,
  GRIND_JOB_STATUS,
} from "@/app/ecs/components/GrindJob";

export interface GeneratorSystemConfig {
  defaultIntervalSeconds?: number;
}

export function createGeneratorSystem(
  config: GeneratorSystemConfig = {}
): System {
  const { defaultIntervalSeconds = 5 } = config;

  const generatorQuery = defineQuery([Generator, GeneratorState]);
  const generatorEnterQuery = enterQuery(generatorQuery);

  return (world: GameWorld): GameWorld => {
    const dt = world.time?.delta ?? 0;

    const entered = generatorEnterQuery(world as IWorld);
    for (const eid of entered) {
      GeneratorState.elapsed[eid] = 0;
    }

    const entities = generatorQuery(world as IWorld);
    for (const eid of entities) {
      const interval =
        Generator.intervalSeconds[eid] || defaultIntervalSeconds;

      GeneratorState.elapsed[eid] += dt;

      while (GeneratorState.elapsed[eid] >= interval) {
        GeneratorState.elapsed[eid] -= interval;

        const jobEid = addEntity(world as IWorld);
        addComponent(world as IWorld, GrindJob, jobEid);

        GrindJob.sourceGenerator[jobEid] = eid;
        GrindJob.status[jobEid] = GRIND_JOB_STATUS.Pending;
      }
    }

    return world;
  };
}
