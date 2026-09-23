function FlyArtwork() {
  return (
    <g stroke="#393126" strokeLinecap="round" strokeLinejoin="round">
      {/* Three pairs of jointed legs, attached to the thorax. */}
      <path
        d="M-2-3-7-7-8-11M2-3 7-7 8-11M-3 0-9 0-12 4M3 0 9 0 12 4M-2 3-6 8-5 12M2 3 6 8 5 12"
        fill="none"
        strokeWidth="1"
      />
      <path
        d="M-3 2C-7 8-4 13 0 14 4 13 7 8 3 2Z"
        fill="#393126"
        strokeWidth=".7"
      />
      <path
        d="M-3.5 7Q0 9 3.5 7M-2.5 10Q0 12 2.5 10"
        fill="none"
        stroke="#82745b"
        strokeWidth=".65"
      />
      {/* One pair of long, translucent wings with fine vein lines. */}
      <g fill="#f5efd9" fillOpacity=".82" stroke="#8b8065" strokeWidth=".7">
        <path d="M-1-2C-5-6-15-5-16 0-17 5-8 8-2 3Z" />
        <path d="M1-2C5-6 15-5 16 0 17 5 8 8 2 3Z" />
      </g>
      <path
        d="M-2 0-13 1M-7 .5-11 4M2 0 13 1M7 .5 11 4"
        fill="none"
        stroke="#a89c7d"
        strokeWidth=".5"
      />
      <ellipse cy="-1" rx="3.3" ry="4.5" fill="#393126" strokeWidth=".6" />
      <path d="M-1-3V1M1-3V1" stroke="#9b8c6e" strokeWidth=".6" />
      <ellipse cy="-6.5" rx="3.6" ry="2.9" fill="#302b23" strokeWidth=".6" />
      <ellipse
        cx="-2.5"
        cy="-7"
        rx="1.35"
        ry="1.8"
        fill="#796044"
        stroke="none"
      />
      <ellipse
        cx="2.5"
        cy="-7"
        rx="1.35"
        ry="1.8"
        fill="#796044"
        stroke="none"
      />
      <path d="m-1-9-.8-2m2.8 2 .8-2" fill="none" strokeWidth=".7" />
    </g>
  );
}

export function Fly() {
  return (
    <svg viewBox="-19 -15 38 32" aria-hidden="true">
      <g transform="rotate(25)">
        <FlyArtwork />
      </g>
    </svg>
  );
}

export function Trophy() {
  return (
    <svg
      viewBox="0 0 320 360"
      aria-label="The Golden Shitty, a gold poop-shaped award"
      role="img"
    >
      <defs>
        <linearGradient id="poopGold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#72501d" />
          <stop offset=".22" stopColor="#c49a3a" />
          <stop offset=".46" stopColor="#f3de8c" />
          <stop offset=".69" stopColor="#aa7a25" />
          <stop offset="1" stopColor="#5e4019" />
        </linearGradient>
        <linearGradient id="plinthGold" x1="0" x2="1">
          <stop stopColor="#79591f" />
          <stop offset=".5" stopColor="#dfc26a" />
          <stop offset="1" stopColor="#73531d" />
        </linearGradient>
        <linearGradient id="darkBase" x2="0" y2="1">
          <stop stopColor="#473321" />
          <stop offset="1" stopColor="#1f1812" />
        </linearGradient>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow
            dx="7"
            dy="12"
            stdDeviation="8"
            floodColor="#342215"
            floodOpacity=".22"
          />
        </filter>
      </defs>
      <ellipse cx="160" cy="307" rx="106" ry="9" fill="#3b281c" opacity=".16" />
      <ellipse cx="160" cy="306" rx="76" ry="3" fill="#2c2116" opacity=".24" />
      <g
        className="stink-lines"
        fill="none"
        stroke="#9f7c35"
        strokeLinecap="round"
        strokeWidth="3"
      >
        <path d="M88 110c-13-12 14-19 0-32-10-9 7-15 2-28" />
        <path d="M231 112c13-12-14-19 0-32 10-9-7-15-2-28" />
      </g>
      <g transform="translate(260 83)">
        <g className="trophy-fly">
          <g transform="rotate(-30)">
            <FlyArtwork />
          </g>
        </g>
      </g>
      <g filter="url(#softShadow)">
        <path
          d="M160 46c20 13 22 28 15 40 25 1 44 13 47 31 2 12-4 22-15 29 29 4 49 20 49 42 0 27-27 44-61 44H125c-34 0-61-17-61-44 0-22 20-38 49-42-11-7-17-17-15-29 3-18 22-30 47-31-5-9-5-22 6-31 3-3 6-6 9-9Z"
          fill="url(#poopGold)"
        />
        <path
          d="M141 79c11 3 26 2 36-2"
          fill="none"
          stroke="#f7e8a9"
          strokeLinecap="round"
          strokeWidth="5"
          opacity=".6"
        />
        <path
          d="M124 124c22 7 52 6 71-2"
          fill="none"
          stroke="#f7e8a9"
          strokeLinecap="round"
          strokeWidth="7"
          opacity=".45"
        />
        <path
          d="M102 175c31 12 79 11 112-2"
          fill="none"
          stroke="#f7e8a9"
          strokeLinecap="round"
          strokeWidth="8"
          opacity=".34"
        />
        <path d="M109 222h102l14 22H95Z" fill="url(#plinthGold)" />
        <path d="M85 244h150v62H85z" fill="url(#darkBase)" />
        <path
          d="M105 259h110v31H105z"
          fill="#b48b35"
          stroke="#e5cc78"
          strokeWidth="1"
        />
        <text
          x="160"
          y="272"
          textAnchor="middle"
          fontSize="8"
          letterSpacing="2.3"
          fill="#2c2116"
        >
          THE GOLDEN
        </text>
        <text
          x="160"
          y="284"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="12"
          fontWeight="700"
          letterSpacing="1.2"
          fill="#2c2116"
        >
          SHITTY
        </text>
      </g>
      <path
        d="m57 46 3 9 9 3-9 3-3 9-3-9-9-3 9-3Zm218 145 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z"
        fill="#aa8433"
      />
    </svg>
  );
}
