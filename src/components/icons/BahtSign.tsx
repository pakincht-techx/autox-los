import { type SVGProps } from "react";

/**
 * Thai Baht (฿) sign icon — drop-in replacement for Lucide's DollarSign.
 * Matches Lucide's default viewBox (24×24), stroke style, and prop interface.
 */
export function BahtSign(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Vertical bar */}
            <line x1="12" y1="2" x2="12" y2="22" />
            {/* Top bowl */}
            <path d="M8 6h5a3 3 0 0 1 0 6H8" />
            {/* Bottom bowl */}
            <path d="M8 12h6a3 3 0 0 1 0 6H8" />
            {/* Horizontal bar at top */}
            <line x1="8" y1="6" x2="8" y2="18" />
        </svg>
    );
}
