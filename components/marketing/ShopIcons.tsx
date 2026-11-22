import type { SVGProps } from 'react'

/**
 * Original line icons drawn for this website. They are inline SVG so they ship with the
 * bundle, need no external files, and follow `currentColor` in light and dark themes.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 24, children, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{children}</svg>
}

/** Table QR card: a QR code standing on a little table tent. */
export function TableQrIcon(props: IconProps) {
  return <Base {...props}>
    <path d="M5 20.5h14" />
    <path d="M7 20.5 8.4 4.2a1 1 0 0 1 1-.9h5.2a1 1 0 0 1 1 .9L17 20.5" />
    <rect x="9.6" y="6.4" width="2" height="2" rx=".3" />
    <rect x="12.4" y="6.4" width="2" height="2" rx=".3" />
    <rect x="9.6" y="9.2" width="2" height="2" rx=".3" />
    <path d="M12.6 9.4h1.6v1.6M12.6 11.2h.2" />
    <path d="M10 14.2h4" />
  </Base>
}

/** Steaming cup on a saucer. */
export function CupIcon(props: IconProps) {
  return <Base {...props}>
    <path d="M4.5 10h11v4.5a4.5 4.5 0 0 1-4.5 4.5H9a4.5 4.5 0 0 1-4.5-4.5V10Z" />
    <path d="M15.5 11.2h1.3a2.3 2.3 0 0 1 0 4.6h-1.6" />
    <path d="M3 21h15" />
    <path d="M8 3.5c-.8.9.8 1.6 0 2.6M11.2 3.5c-.8.9.8 1.6 0 2.6" />
  </Base>
}

/** Kitchen ticket with a torn bottom edge. */
export function TicketIcon(props: IconProps) {
  return <Base {...props}>
    <path d="M6 3h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 20V3Z" />
    <path d="M9 7.5h6M9 11h6M9 14.5h3.5" />
  </Base>
}

/** A phone showing a menu list. */
export function MenuPhoneIcon(props: IconProps) {
  return <Base {...props}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.4" />
    <path d="M10.5 5h3" />
    <circle cx="9.6" cy="9.6" r="1.1" />
    <path d="M12 9.6h3.2" />
    <circle cx="9.6" cy="13.4" r="1.1" />
    <path d="M12 13.4h3.2" />
    <path d="M9 17.6h6" />
  </Base>
}

/** A cloche (serving dome) for "served at the table". */
export function ClocheIcon(props: IconProps) {
  return <Base {...props}>
    <path d="M3 17.5h18" />
    <path d="M4.5 17.5a7.5 7.5 0 0 1 15 0" />
    <path d="M12 7.5V5.6" />
    <path d="M10.6 5.2h2.8" />
    <path d="M8 13.4a4.6 4.6 0 0 1 2.4-2.6" />
  </Base>
}

/** Globe with meridians, used for the language switcher. */
export function GlobeLinesIcon(props: IconProps) {
  return <Base {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.4 3.9 5.4 3.9 9s-1.3 6.6-3.9 9c-2.6-2.4-3.9-5.4-3.9-9S9.4 5.4 12 3Z" />
    <path d="M4.6 7.4h14.8M4.6 16.6h14.8" />
  </Base>
}

/** Small pointer used for "try it yourself" hints. */
export function TapIcon(props: IconProps) {
  return <Base {...props}>
    <path d="M9.5 11.5V5a1.5 1.5 0 0 1 3 0v5.2" />
    <path d="M12.5 10.2V9a1.5 1.5 0 0 1 3 0v1.6" />
    <path d="M15.5 10.4a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.8-2.4L5 15.8a1.5 1.5 0 0 1 2.3-1.9l2.2 2.1" />
  </Base>
}
