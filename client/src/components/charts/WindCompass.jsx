// src/components/charts/WindCompass.jsx
import { useRef, useEffect, useState } from 'react';

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function getCardinal(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/**
 * CHART: Animated SVG compass rose showing wind direction.
 * @param {number} direction  — wind direction in degrees (0–360, 0 = North)
 * @param {number} speed      — wind speed in m/s
 */
export function WindCompass({ direction = 0, speed = 0 }) {
  const [displayDir, setDisplayDir] = useState(direction);
  const prevDirRef = useRef(direction);

  useEffect(() => {
    let prev = prevDirRef.current;
    let next = direction;
    let diff = ((next - prev + 540) % 360) - 180;

    let start = null;
    const duration = 600;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayDir(prev + diff * ease);
      if (progress < 1) requestAnimationFrame(step);
      else prevDirRef.current = direction;
    }
    requestAnimationFrame(step);
  }, [direction]);

  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 16;
  const innerR = r - 16;
  const needleLen = innerR - 10;

  const needleRad = degToRad(displayDir - 90);
  const tipX = cx + needleLen * Math.cos(needleRad);
  const tipY = cy + needleLen * Math.sin(needleRad);
  const tailX = cx - (needleLen * 0.45) * Math.cos(needleRad);
  const tailY = cy - (needleLen * 0.45) * Math.sin(needleRad);

  const wingAngle = 0.4;
  const wingLen = 14;
  const lx = tipX - wingLen * Math.cos(needleRad - wingAngle);
  const ly = tipY - wingLen * Math.sin(needleRad - wingAngle);
  const rx = tipX - wingLen * Math.cos(needleRad + wingAngle);
  const ry = tipY - wingLen * Math.sin(needleRad + wingAngle);

  const cardinals = [
    { label: 'N', deg: 0, color: '#ff6b6b', fontWeight: 800 },
    { label: 'E', deg: 90, color: 'var(--text-muted)', fontWeight: 600 },
    { label: 'S', deg: 180, color: 'var(--text-muted)', fontWeight: 600 },
    { label: 'W', deg: 270, color: 'var(--text-muted)', fontWeight: 600 },
  ];

  const intercardinals = [
    { label: 'NE', deg: 45 }, { label: 'SE', deg: 135 },
    { label: 'SW', deg: 225 }, { label: 'NW', deg: 315 },
  ];

  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ filter: 'drop-shadow(0 0 16px rgba(92,124,250,0.2))' }}
      >
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--border-subtle)" />
            <stop offset="100%" stopColor="var(--neu-surface)" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer bezel */}
        <circle cx={cx} cy={cy} r={r + 14} fill="url(#ringGrad)" />
        <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke="var(--border-subtle)" strokeWidth={1} />

        {/* Inner face */}
        <circle cx={cx} cy={cy} r={r} fill="var(--neu-bg)" />

        {/* Ticks */}
        {ticks.map(deg => {
          const rad = degToRad(deg - 90);
          const isMain = deg % 90 === 0;
          const isSub = deg % 45 === 0;
          const outer = r - 2;
          const inner = isMain ? r - 12 : isSub ? r - 9 : r - 6;
          return (
            <line key={deg}
              x1={cx + outer * Math.cos(rad)} y1={cy + outer * Math.sin(rad)}
              x2={cx + inner * Math.cos(rad)} y2={cy + inner * Math.sin(rad)}
              stroke={isMain ? 'var(--accent-primary)' : 'var(--border-subtle)'}
              strokeWidth={isMain ? 2 : isSub ? 1.5 : 0.8}
            />
          );
        })}

        {/* Inter-cardinals */}
        {intercardinals.map(({ label, deg }) => {
          const rad = degToRad(deg - 90);
          const lr = innerR - 8;
          return (
            <text key={label}
              x={cx + lr * Math.cos(rad)} y={cy + lr * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="middle"
              fill="var(--text-subtle)" fontSize={8} fontWeight={500}
            >
              {label}
            </text>
          );
        })}

        {/* Cardinals */}
        {cardinals.map(({ label, deg, color, fontWeight }) => {
          const rad = degToRad(deg - 90);
          const lr = innerR - 4;
          return (
            <text key={label}
              x={cx + lr * Math.cos(rad)} y={cy + lr * Math.sin(rad)}
              textAnchor="middle" dominantBaseline="middle"
              fill={color} fontSize={12} fontWeight={fontWeight}
            >
              {label}
            </text>
          );
        })}

        {/* Center ring */}
        <circle cx={cx} cy={cy} r={12} fill="var(--neu-surface)" stroke="var(--border-subtle)" strokeWidth={1} />

        {/* Needle tail */}
        <line x1={cx} y1={cy} x2={tailX} y2={tailY}
              stroke="#4dabf7" strokeWidth={3} strokeLinecap="round"
              filter="url(#needleGlow)" />

        {/* Needle tip */}
        <line x1={cx} y1={cy} x2={tipX} y2={tipY}
              stroke="#ff6b6b" strokeWidth={3} strokeLinecap="round"
              filter="url(#needleGlow)" />
        <polygon points={`${tipX},${tipY} ${lx},${ly} ${rx},${ry}`}
                 fill="#ff6b6b" filter="url(#needleGlow)" />

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={5} fill="var(--neu-surface)" stroke="var(--accent-primary)" strokeWidth={2} />
      </svg>

      {/* Readout below compass */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-subtle text-xs uppercase tracking-wider">Direction</p>
          <p className="font-bold text-lg" style={{ color: '#ff6b6b' }}>
            {Math.round(direction)}°
          </p>
          <p className="text-muted text-xs font-medium">{getCardinal(direction)}</p>
        </div>
        <div className="text-center">
          <p className="text-subtle text-xs uppercase tracking-wider">Speed</p>
          <p className="font-bold text-lg" style={{ color: '#cc5de8' }}>
            {speed?.toFixed(1)}
          </p>
          <p className="text-muted text-xs">m/s</p>
        </div>
      </div>
    </div>
  );
}
