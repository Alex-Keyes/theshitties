export function Trophy() {
  return (
    <svg viewBox="0 0 300 340" aria-label="The Golden Shitty trophy" role="img">
      <defs>
        <linearGradient id="gold" x1="0" x2="1">
          <stop stopColor="#8f6f28" />
          <stop offset=".3" stopColor="#d4b96f" />
          <stop offset=".55" stopColor="#ecdc9f" />
          <stop offset=".8" stopColor="#b4974b" />
          <stop offset="1" stopColor="#826529" />
        </linearGradient>
        <linearGradient id="base" x2="0" y2="1">
          <stop stopColor="#39372e" />
          <stop offset="1" stopColor="#181a16" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="316" rx="96" ry="10" fill="#25251f" opacity=".13" />
      <path
        d="M94 83H53v24c0 47 39 68 73 66M206 83h41v24c0 47-39 68-73 66"
        fill="none"
        stroke="url(#gold)"
        strokeWidth="12"
      />
      <path
        d="M85 66h130l-12 70c-4 30-24 51-45 55v43h34v14h-84v-14h34v-43c-21-4-41-25-45-55Z"
        fill="url(#gold)"
      />
      <ellipse cx="150" cy="66" rx="65" ry="9" fill="#e3ce8b" />
      <ellipse cx="150" cy="66" rx="54" ry="5" fill="#877035" />
      <path
        d="m150 99 7 15 17 2-12 12 3 17-15-8-15 8 3-17-12-12 17-2Z"
        fill="#f5e9ba"
        opacity=".85"
      />
      <path d="M102 246h96l12 19H90Z" fill="url(#gold)" />
      <path d="M88 265h124v42H88z" fill="url(#base)" />
      <path d="M112 276h76v19h-76z" fill="#b79b53" />
      <text
        x="150"
        y="289"
        textAnchor="middle"
        fontSize="8"
        letterSpacing="1.7"
        fill="#28281f"
      >
        THE SHITTIES
      </text>
      <path
        d="m249 35 3 9 9 3-9 3-3 9-3-9-9-3 9-3ZM49 196l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"
        fill="#a38743"
      />
    </svg>
  );
}
