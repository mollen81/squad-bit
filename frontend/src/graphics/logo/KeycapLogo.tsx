import { useId } from 'react';

export interface KeycapLogoProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

export function KeycapLogo({
  width = 52,
  height = 42,
  label = 'SB',
  className = ''
}: KeycapLogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '_');

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none transition-transform duration-100 active:translate-y-[2px] ${className}`}
      style={{ width, height }}
      aria-label={`Squad Bit ${label} Keycap Logo`}
    >
      <svg
        viewBox="0 0 64 52"
        width={width}
        height={height}
        className="block overflow-visible drop-shadow-[0_3px_5px_rgba(0,0,0,0.55)]"
      >
        <defs>
          {/* Общий объем основания клавиши */}
          <linearGradient id={`skirt-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6E1D6" />
            <stop offset="45%" stopColor="#C8C1B2" />
            <stop offset="100%" stopColor="#8F8878" />
          </linearGradient>

          {/* Нижняя скошенная грань (юбка) */}
          <linearGradient id={`bottom-bevel-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B8B1A1" />
            <stop offset="55%" stopColor="#9A9282" />
            <stop offset="100%" stopColor="#7C7567" />
          </linearGradient>

          {/* Левая светлая грань */}
          <linearGradient id={`left-bevel-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EAE5DB" />
            <stop offset="100%" stopColor="#D3CCC0" />
          </linearGradient>

          {/* Правая теневая грань */}
          <linearGradient id={`right-bevel-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B5AE9E" />
            <stop offset="100%" stopColor="#8B8475" />
          </linearGradient>

          {/* Верхняя слегка вогнутая рабочая поверхность клавиши */}
          <linearGradient id={`dish-${uid}`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#D8D2C5" />
            <stop offset="48%" stopColor="#CFC9BB" />
            <stop offset="100%" stopColor="#DDD8CC" />
          </linearGradient>

          {/* Легкая фактура PBT-пластика */}
          <filter id={`pbt-grain-${uid}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.25  0 0 0 0 0.23  0 0 0 0 0.20  0 0 0 0.06 0"
              in="noise"
              result="coloredNoise"
            />
            <feComposite in="coloredNoise" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Внешний корпус клавиши */}
        <rect
          x="1"
          y="1"
          width="62"
          height="50"
          rx="6.5"
          fill={`url(#skirt-${uid})`}
          stroke="#6A6458"
          strokeWidth="1"
        />

        {/* Левая скошенная стенка */}
        <path
          d="M 3 5 Q 2 2 7 2 L 12 6 L 12 37 L 4 47 Q 2 45 2 41 Z"
          fill={`url(#left-bevel-${uid})`}
        />

        {/* Правая скошенная стенка */}
        <path
          d="M 61 5 Q 62 2 57 2 L 52 6 L 52 37 L 60 47 Q 62 45 62 41 Z"
          fill={`url(#right-bevel-${uid})`}
        />

        {/* Выраженная нижняя юбка клавиши */}
        <path
          d="M 4 47 L 12 37 L 52 37 L 60 47 Q 58 50 54 50 L 10 50 Q 6 50 4 47 Z"
          fill={`url(#bottom-bevel-${uid})`}
        />

        {/* Мягкий верхний блик на кромке */}
        <path
          d="M 9 2.5 L 55 2.5"
          stroke="#F7F4EC"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Верхняя рабочая площадка клавиши */}
        <rect
          x="9.5"
          y="4.5"
          width="45"
          height="33"
          rx="4.2"
          fill={`url(#dish-${uid})`}
          stroke="#EFECE3"
          strokeWidth="0.9"
        />

        {/* Внутренняя мягкая тень по нижнему краю площадки */}
        <path
          d="M 12 37 L 52 37"
          stroke="#ACA495"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Текстура матового пластика */}
        <rect
          x="9.5"
          y="4.5"
          width="45"
          height="33"
          rx="4.2"
          fill="#ffffff"
          filter={`url(#pbt-grain-${uid})`}
        />

        {/* Надпись SB в левом верхнем углу (глубокий винтажный темно-синий) */}
        <text
          x="14.5"
          y="20.5"
          fill="#1B1636"
          fontSize="14.5"
          fontWeight="700"
          letterSpacing="0.03em"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {label}
        </text>
      </svg>
    </span>
  );
}

export default KeycapLogo;
