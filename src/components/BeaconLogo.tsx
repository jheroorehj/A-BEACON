import React from "react";

interface BeaconLogoProps {
  className?: string;
  size?: number; // width/height in pixels
}

export default function BeaconLogo({ className = "", size = 40 }: BeaconLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
      aria-label="A-BEACON Logo"
    >
      {/* 1. Golden Beacon Light Beam (Shining Left) */}
      <path
        d="M 185 114 L 55 89 L 55 167 L 185 139 Z"
        fill="#E29E2E"
        className="opacity-95"
      />

      {/* 2. Golden Doorway Arch (Right Side) */}
      <path
        d="M 254 222 L 324 201 V 281 H 302 V 218 L 275 226 V 287 H 254 Z"
        fill="#E29E2E"
      />

      {/* 3. Golden Doorway Base Wedge */}
      <path
        d="M 233 321 L 306 321 L 324 305 V 286 H 302 L 285 302 Z"
        fill="#E29E2E"
      />

      {/* 4. Center Lighthouse (Beacon) */}
      <g>
        {/* Triangular Roof cap */}
        <path
          d="M 174 113 L 254 113 L 214 79 Z"
          fill="#1F242E"
        />

        {/* Lightchamber Glass window split */}
        {/* Left Glowing window (Gold) */}
        <path
          d="M 185 114 H 214 V 139 H 185 Z"
          fill="#E29E2E"
        />
        {/* Right Dark window (Navy) */}
        <path
          d="M 214 114 H 243 V 139 H 214 Z"
          fill="#1F242E"
        />

        {/* Elegant Tower Body with geometric architectural cuts */}
        <path
          d="M 184 144 L 255 144 L 255 163 L 242 163 L 247 282 L 201 323 L 152 323 Z"
          fill="#1F242E"
        />
      </g>
    </svg>
  );
}
