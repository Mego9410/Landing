// A short message at the bottom of the screen, like the prototype's toast. One at a time.
import { useSyncExternalStore } from "react";

let current: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(text: string) {
  current = text;
  emit();
  clearTimeout(timer);
  timer = setTimeout(() => { current = null; emit(); }, 3200);
}
export const useToast = () => useSyncExternalStore((l) => { listeners.add(l); return () => { listeners.delete(l); }; }, () => current, () => current);
