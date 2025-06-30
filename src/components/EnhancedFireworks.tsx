import React, { useEffect, useState } from 'react';

interface EnhancedFireworksProps {
  intensity: 'small' | 'medium' | 'large' | 'epic';
  message: string;
  particleImages: string[];
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
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
  particleImages,
  onComplete
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(true);

  const getParticleCount = () => {
    switch (intensity) {
      case 'small': return 15;
      case 'medium': return 30;
      case 'large': return 60;
      case 'epic': return 100;
      default: return 15;
    }
  };

  const createBurst = (centerX: number, centerY: number) => {
    const particleCount = getParticleCount();
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = Math.random() * 8 + 2;
      const size = Math.random() * 30 + 20; // Larger size for images
      const life = Math.random() * 60 + 40;

      newParticles.push({
        id: Date.now() + i + Math.random() * 1000,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        life: life,
        maxLife: life,
        imageUrl: particleImages[Math.floor(Math.random() * particleImages.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    return newParticles;
  };

  useEffect(() => {
    let animationId: number;
    let hasCompleted = false;

    // Create multiple bursts for different intensities
    const burstCount = intensity === 'epic' ? 5 : intensity === 'large' ? 3 : intensity === 'medium' ? 2 : 1;

    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.3 + 100;
        const burst = createBurst(x, y);
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
          size: particle.size * (particle.life / particle.maxLife),
          rotation: particle.rotation + particle.rotationSpeed
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
  }, [intensity, particleImages, onComplete, isActive]);

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
          <img
            src={particle.imageUrl}
            alt="firework"
            className="drop-shadow-lg"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              transform: `rotate(${particle.rotation}deg)`,
              filter: 'brightness(1.2) saturate(1.3)'
            }}
            onError={(e) => {
              // Fallback to a colored circle if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.style.width = `${particle.size}px`;
              fallback.style.height = `${particle.size}px`;
              fallback.style.backgroundColor = '#FFD700';
              fallback.style.borderRadius = '50%';
              fallback.className = 'animate-spin';
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      ))}

      {/* Enhanced Background Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-400/40 via-orange-400/30 to-transparent animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-yellow-400/10 to-transparent animate-pulse" />
    </div>
  );
};

export default EnhancedFireworks;