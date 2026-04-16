'use client';
import React, { useRef, useState } from 'react';
import Button from './Button';

interface MagneticButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, size = 'md', variant = 'primary', style, className, onClick }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const dX = e.clientX - centerX;
    const dY = e.clientY - centerY;
    
    // Magnetic intensity - pull button toward cursor
    setPosition({ x: dX * 0.35, y: dY * 0.35 });
  };

  const handleMouseLeave = () => {
    // Reset position
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        display: 'inline-block',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: `translate(${position.x}px, ${position.y}px)`,
        ...style
      }}
      className={className}
    >
      <Button size={size} variant={variant} onClick={onClick}>
        {children}
      </Button>
    </div>
  );
};

export default MagneticButton;
