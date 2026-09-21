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
      <ellipse
        cx="160"
        cy="333"
        rx="106"
        ry="12"
        fill="#3b281c"
        opacity=".16"
      />
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
          <ellipse
            cx="0"
            cy="0"
            rx="5"
            ry="8"
            fill="#292319"
            transform="rotate(-35)"
          />
          <ellipse
            cx="-8"
            cy="-6"
            rx="7"
            ry="4"
            fill="#d8c88f"
            opacity=".72"
            transform="rotate(22)"
          />
          <ellipse
            cx="7"
            cy="-7"
            rx="7"
            ry="4"
            fill="#d8c88f"
            opacity=".72"
            transform="rotate(-28)"
          />
          <path d="m-2 7-8 7m13-6 7 7" stroke="#292319" strokeWidth="1.5" />
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
