import React, { useRef, useState, MouseEvent } from 'react';

interface HoloCardProps {
  imageUrl: string;
}

export default function HoloCard({ imageUrl }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const px = x / width;
    const py = y / height;

    // Calculate rotation (-15 to +15 degrees)
    const rx = (py - 0.5) * -30;
    const ry = (px - 0.5) * 30;

    // Calculate hypotenuse for intensity
    const hyp = Math.min(1, Math.sqrt(Math.pow(px - 0.5, 2) + Math.pow(py - 0.5, 2)) / 0.707);

    setStyle({
      transform: `perspective(1000px) scale(1.05) rotateX(${rx}deg) rotateY(${ry}deg)`,
      '--mx': `${px * 100}%`,
      '--my': `${py * 100}%`,
      '--posx': `${50 + (px - 0.5) * 50}%`,
      '--posy': `${50 + (py - 0.5) * 50}%`,
      '--hyp': hyp.toFixed(2),
      '--o': 1,
    } as React.CSSProperties);
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`,
      '--mx': `50%`,
      '--my': `50%`,
      '--posx': `50%`,
      '--posy': `50%`,
      '--hyp': '0',
      '--o': 0,
    } as React.CSSProperties);
  };

  return (
    <div
      ref={cardRef}
      className="card-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      <div 
        className="card-image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="card-shine" />
      <div className="card-glare" />
    </div>
  );
}
