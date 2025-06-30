import React, { useEffect, useState } from 'react';

interface EnhancedFireworksProps {
  intensity: 'small' | 'medium' | 'large' | 'epic';
  message: string;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: 'spark' | 'star' | 'heart' | 'circle';
}

const EnhancedFireworks: React.FC<EnhancedFireworksProps> = ({
  intensity,
  message,
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(true);

  const colors = {
    small: ['#FFD700', '#FFA500', '#FF6347'],
    medium: ['#FF69B4', '#00CED1', '#32CD32', '#FFD700'],
    large: ['#FF1493', '#00BFFF', '#ADFF2F', '#FF4500', '#DA70D6'],
    epic: ['#FF0000', '#FF8C00', '#FFD700', '#ADFF2F', '#00CED1', '#FF69B4', '#DA70D6', '#F0E68C']
  };

  const getParticleCount = () => {
    switch (intensity) {
      case 'small': return 20;
      case 'medium': return 40;
      case 'large': return 80;
      case 'epic': return 150;
      default: return 20;
    }
  };

  const createBurst = (centerX: number, centerY: number, burstColors: string[]) => {
    const particleCount = getParticleCount();
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = Math.random() * 8 + 2;
      const size = Math.random() * 4 + 2;
      const life = Math.random() * 60 + 40;

      newParticles.push({
        id: Date.now() + i + Math.random() * 1000, // Ensure unique IDs
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        size: size,
        life: life,
        maxLife: life,
        type: ['spark', 'star', 'heart', 'circle'][Math.floor(Math.random() * 4)] as any
      });
    }

    return newParticles;
  };

  useEffect(() => {
    const burstColors = colors[intensity];
    let animationId: number;
    let hasCompleted = false;

    // Create multiple bursts for different intensities
    const burstCount = intensity === 'epic' ? 5 : intensity === 'large' ? 3 : intensity === 'medium' ? 2 : 1;

    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.3 + 100;
        const burst = createBurst(x, y, burstColors);
        setParticles(prev => [...prev, ...burst]);
      }, i * 500);
    }

    // Animation loop using requestAnimationFrame for better performance
    const animate = () => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
          life: particle.life - 1,
          size: particle.size * (particle.life / particle.maxLife)
        })).filter(particle => particle.life > 0);

        // Check if animation should complete
        if (updated.length === 0 && prev.length > 0 && !hasCompleted) {
          hasCompleted = true;
          setIsActive(false);
          // Delay the completion callback slightly to ensure smooth transition
          setTimeout(() => {
            onComplete?.();
          }, 100);
        }

        return updated;
      });

      if (isActive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup function to prevent memory leaks
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [intensity, onComplete, isActive]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`text-center animate-bounce drop-shadow-2xl ${
          intensity === 'epic' ? 'text-6xl md:text-8xl' : ''
        } ${
          intensity === 'large' ? 'text-5xl md:text-7xl' : ''
        } ${
          intensity === 'medium' ? 'text-4xl md:text-6xl' : ''
        } ${
          intensity === 'small' ? 'text-3xl md:text-5xl' : ''
        } font-bold text-white`}>
          {message}
        </div>
      </div>

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: 'translate(-50%, -50%)',
            opacity: particle.life / particle.maxLife
          }}
        >
          {particle.type === 'star' && (
            <div
              className="animate-spin"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
              }}
            />
          )}
          {particle.type === 'heart' && (
            <div
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                borderRadius: '50px 50px 0 0',
                transform: 'rotate(-45deg)'
              }}
            />
          )}
          {particle.type === 'circle' && (
            <div
              className="rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color
              }}
            />
          )}
          {particle.type === 'spark' && (
            <div
              style={{
                width: `${particle.size}px`,
                height: `${particle.size * 3}px`,
                background: `linear-gradient(to bottom, ${particle.color}, transparent)`,
                borderRadius: '50%'
              }}
            />
          )}
        </div>
      ))}

      {/* Ground sparkles */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-yellow-400/30 via-green-400/20 to-transparent animate-pulse" />
    </div>
  );
};

export default EnhancedFireworks;