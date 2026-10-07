import { useId } from "react";

// The Steadie lockup (packages/design-system/assets/Logos/steadie-lockup.svg), inlined so the wordmark can take
// the text colour: ink on light grounds, dark-mode ink on dark ones, as the brand guidelines ask. The mark keeps
// its fixed apricot and sage.
export function Lockup({ width = 137 }: { width?: number }) {
  const clip = `lockup-h-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 460 112" width={width} height={(width * 112) / 460} role="img" aria-label="steadie">
      <defs><clipPath id={clip}><rect x="0" y="0" width="64" height="52" /></clipPath></defs>
      <g transform="translate(4 22) scale(1.25)">
        <g clipPath={`url(#${clip})`}>
          <rect x="4" y="38" width="56" height="14" rx="7" fill="#CDE3D2" />
          <rect x="27" y="16" width="22" height="22" rx="11" fill="#F8C8AC" />
          <rect x="8" y="5" width="6" height="6" rx="3" fill="#F8C8AC" />
          <rect x="15.5" y="11.5" width="8" height="8" rx="4" fill="#F8C8AC" />
        </g>
      </g>
      <g transform="translate(112 4)">
        <g fill="none" stroke="var(--ink)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          <path d="M25.2 33.6A12 10 0 1 0 16 50A12 10 0 1 1 6.8 66.4" />
          <path d="M52 12V58a12 12 0 0 0 12 12M42 30H64" />
          <path d="M86 50H126A20 20 0 1 0 120.1 64.1" />
          <circle cx="168" cy="50" r="20" /><path d="M188 30V70" />
          <circle cx="230" cy="50" r="20" /><path d="M250 6V70" />
          <path d="M272 32V70" />
          <path d="M294 50H334A20 20 0 1 0 328.1 64.1" />
        </g>
        <circle cx="272" cy="12" r="6.5" fill="var(--ink)" />
      </g>
    </svg>
  );
}
