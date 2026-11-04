import { cn } from '@/lib/utils';

/* Byte, the chat assistant's robot: an ink shell with a lime face, drawn on a
   64-unit grid. It keeps its own colours in both themes, like the footer.
   It stands in for the 3D Byte (fx/robot3d.js) where WebGL can't, so it
   copies its moods, in CSS (globals.css, "Byte"):
     idle   blinks, antenna glows
     wave   the right arm comes up beside the head and wags
     think  eyes look up while an answer is on its way, antenna flickers
     talk   mouth opens and closes while an answer streams in
     happy  eyes turn to arcs (also on hover over the launcher) */
export function Robot({ mood = 'idle', className }) {
  return (
    <svg viewBox="0 0 64 64" data-mood={mood} className={cn('robot', className)} aria-hidden="true" focusable="false">
      <g className="robot-antenna">
        <path d="M32 13V7" stroke="#3b3f3b" strokeWidth="2.5" strokeLinecap="round" />
        <circle className="robot-bulb" cx="32" cy="5.5" r="3.6" fill="#d5f66b" />
      </g>

      {/* ears */}
      <rect x="5.5" y="24" width="5" height="12" rx="2.5" fill="#2b2e2b" />
      <rect x="53.5" y="24" width="5" height="12" rx="2.5" fill="#2b2e2b" />

      {/* body and resting arms */}
      <g fill="#2b2e2b">
        <rect x="20" y="46" width="24" height="15" rx="7.5" />
        <path className="robot-arm-rest" d="M44.5 52l4.5 5" stroke="#2b2e2b" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M19.5 52L15 57" stroke="#2b2e2b" strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <circle className="robot-heart" cx="32" cy="53.5" r="2.3" fill="#d5f66b" />

      {/* head, with a soft top light so it reads as rounded */}
      <rect x="10" y="12" width="44" height="36" rx="14" fill="#2b2e2b" />
      <path d="M17 16.5c5-2.6 25-2.6 30 0" stroke="#ffffff" strokeOpacity=".16" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <rect x="14.5" y="18" width="35" height="25" rx="10" fill="#090a0a" />

      <g>
        <g className="robot-eyes">
          <rect className="robot-eye" x="21" y="24" width="6" height="9" rx="3" fill="#d5f66b" />
          <rect className="robot-eye" x="37" y="24" width="6" height="9" rx="3" fill="#d5f66b" />
        </g>
        <g className="robot-joy" fill="none" stroke="#d5f66b" strokeWidth="2.4" strokeLinecap="round">
          <path d="M21 30.5q3-5 6 0" />
          <path d="M37 30.5q3-5 6 0" />
        </g>
      </g>

      <ellipse cx="19" cy="37" rx="2.6" ry="1.5" fill="#d5f66b" opacity=".3" />
      <ellipse cx="45" cy="37" rx="2.6" ry="1.5" fill="#d5f66b" opacity=".3" />
      <path className="robot-smile" d="M29 36.5q3 2.8 6 0" stroke="#d5f66b" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse className="robot-mouth" cx="32" cy="37.5" rx="2.8" ry="2.2" fill="#d5f66b" />

      {/* the waving arm: drawn raised, shown only while waving */}
      <g className="robot-arm-up">
        <path d="M45 51l11-11" stroke="#2b2e2b" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="57" cy="39" r="3.4" fill="#d5f66b" />
      </g>
    </svg>
  );
}
