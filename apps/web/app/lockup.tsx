import { useId } from "react";

// The landing lockup (packages/design-system/assets/Logos/landing-lockup.svg), inlined so the wordmark can take
// the text colour: ink on light grounds, dark-mode ink on dark ones, as the brand guidelines ask. The mark keeps
// its fixed apricot and sage.
export function Lockup({ width = 137 }: { width?: number }) {
  const clip = `lockup-h-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 480 112" width={width} height={(width * 112) / 480} role="img" aria-label="landing">
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
          <path d="M10 6V70" />
          <circle cx="52" cy="50" r="20" /><path d="M72 30V70" />
          <path d="M94 30V70M94 50a20 20 0 0 1 40 0V70" />
          <circle cx="176" cy="50" r="20" /><path d="M196 6V70" />
          <path d="M218 32V70" />
          <path d="M240 30V70M240 50a20 20 0 0 1 40 0V70" />
          <circle cx="322" cy="50" r="20" /><path d="M342 30V80a20 20 0 0 1-36 11" />
        </g>
        <circle cx="218" cy="12" r="6.5" fill="var(--ink)" />
      </g>
    </svg>
  );
}
