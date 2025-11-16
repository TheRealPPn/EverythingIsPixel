// src/app/ecs/components/Generator.ts
import { defineComponent, Types } from "bitecs";

export const Generator = defineComponent({
  intervalSeconds: Types.f32,
});

export const GeneratorState = defineComponent({
  elapsed: Types.f32,
});
