import type { ConstructionMeta } from "./types";

export const registry: Record<string, ConstructionMeta> = {};

export function registerConstruction(meta: ConstructionMeta): ConstructionMeta {
  registry[meta.id] = meta;
  return meta;
}

export function pathFor(id: string): string {
  return `/c/${id}`;
}

export function getConstruction(id: string): ConstructionMeta | undefined {
  return registry[id];
}
