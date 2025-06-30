import React, { useEffect, useState } from 'react';

interface EnhancedFireworksProps {
  intensity: 'small' | 'medium' | 'large' | 'epic';
  message: string;
  iconUrls: string[];
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
  imageUrl: string;
  rotation: number;
  rotationSpeed: number;
}

const EnhancedFireworks: React.FC<EnhancedFireworksProps> = ({
  intensity,
  message,
  iconUrls,
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
      case 'small': return 25;
      case 'medium': return 50;
      case 'large': return 100;
      case 'epic': return 200;
      default: return 25;
    }
  };

  const createBurst = (centerX: number, centerY: number, burstColors: string[], icons: string[]) => {
    const particleCount = getParticleCount();
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = Math.random() * 12 + 3;
      const size = Math.random() * 30 + 20; // Larger size for icons
      const life = Math.random() * 80 + 60; // Longer life for better visibility

      newParticles.push({
        id: Date.now() + i + Math.random() * 1000,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        size: size,
        life: life,
        maxLife: life,
        imageUrl: icons[Math.floor(Math.random() * icons.length)],
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 10 // Random rotation speed
      });
    }

    return newParticles;
  };

  useEffect(() => {
    const burstColors = colors[intensity];
    let animationId: number;
    let hasCompleted = false;

    // Ensure we have icons to work with
    if (iconUrls.length === 0) {
      console.warn('No icons provided for fireworks animation');
      return;
    }

    // Create multiple bursts for different intensities
    const burstCount = intensity === 'epic' ? 6 : intensity === 'large' ? 4 : intensity === 'medium' ? 3 : 2;

    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * (window.innerHeight * 0.4) + 100;
        const burst = createBurst(x, y, burstColors, iconUrls);
        setParticles(prev => [...prev, ...burst]);
      }, i * 400);
    }

    // Animation loop using requestAnimationFrame for better performance
    const animate = () => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98, // Air resistance
          vy: particle.vy + 0.15, // Gravity
          life: particle.life - 1,
          size: particle.size * Math.max(0.3, particle.life / particle.maxLife), // Don't let icons get too small
          rotation: particle.rotation + particle.rotationSpeed
        })).filter(particle => particle.life > 0);

        // Check if animation should complete
        if (updated.length === 0 && prev.length > 0 && !hasCompleted) {
          hasCompleted = true;
          setIsActive(false);
          setTimeout(() => {
            onComplete?.();
          }, 200);
        }

        return updated;
      });

      if (isActive) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [intensity, onComplete, isActive, iconUrls]);

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

      {/* Basketball Icon Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            opacity: Math.max(0.3, particle.life / particle.maxLife)
          }}
        >
          <div
            className="relative"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: `drop-shadow(0 0 8px ${particle.color})`,
            }}
          >
            <img
              src={particle.imageUrl}
              alt="Basketball celebration"
              className="w-full h-full object-contain"
              style={{
                filter: `brightness(1.2) saturate(1.3)`,
              }}
            />
            {/* Glow effect behind the icon */}
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `radial-gradient(circle, ${particle.color}40 0%, transparent 70%)`,
                transform: 'scale(1.5)',
                zIndex: -1
              }}
            />
          </div>
        </div>
      ))}

      {/* Enhanced ground sparkles with basketball theme */}
      <div className="absolute bottom-0 left-0 w-full h-32">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-400/20 via-yellow-400/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-red-400/15 via-pink-400/8 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default EnhancedFireworks;