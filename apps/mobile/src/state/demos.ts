import { mixFor } from "@landing/motion";
import type { AppState } from "./store";

/** Who shows a move: the chosen person, or with "Mix it up" a different one per exercise, the same each time. */
export const whoFor = (s: AppState, key: string) => (s.demos.who === "mix" ? mixFor(key) : s.demos.who);
