import { Lazy } from "constructs";

export function onSynth<T>(produce: () => T): T {
  return Lazy.anyValue({ produce: () => produce() }) as unknown as T;
}