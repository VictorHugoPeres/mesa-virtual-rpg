import { InnateTechnique } from "./types";
import { CLANS3A_TECHNIQUES } from "./clans3a";
import { CLANS3B_TECHNIQUES } from "./clans3b";

export const CLANS3_TECHNIQUES: InnateTechnique[] = [
  ...CLANS3A_TECHNIQUES,
  ...CLANS3B_TECHNIQUES,
];

export { CLANS3A_TECHNIQUES, CLANS3B_TECHNIQUES };
