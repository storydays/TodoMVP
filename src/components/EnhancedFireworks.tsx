import React, { useEffect, useState } from 'react';

interface EnhancedFireworksProps {
  intensity: 'small' | 'medium' | 'large' | 'epic';
  message: string;
  onComplete?: () => void;
  particleImages?: string[];
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
  rotation: number;
  rotationSpeed: number;
  imageUrl: string;
}

const EnhancedFireworks: React.FC<EnhancedFireworksProps> = ({
  intensity,
  message,
  onComplete,
  particleImages = []
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Fallback images if no custom images are provided
  const fallbackImages = [
    '/images/fireworks/basketball.png',
    '/images/fireworks/hoop.png',
    '/images/fireworks/trophy.png',
    '/images/fireworks/net.png',
    '/images/fireworks/medal.png'
  ];

  const imagesToUse = particleImages.length > 0 ? particleImages : fallbackImages;

  const getParticleCount = () => {
    switch (intensity) {
      case 'small': return 15;
      case 'medium': return 30;
      case 'large': return 60;
      case 'epic': return 100;
      default: return 15;
    }
  };

  const getParticleSize = () => {
    switch (intensity) {
      case 'small': return { min: 20, max: 35 };
      case 'medium': return { min: 25, max: 45 };
      case 'large': return { min: 30, max: 55 };
      case 'epic': return { min: 35, max: 65 };
      default: return { min: 20, max: 35 };
    }
  };

  const createBurst = (centerX: number, centerY: number) => {
    const particleCount = getParticleCount();
    const sizeRange = getParticleSize();
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.8;
      const speed = Math.random() * 12 + 3;
      const size = Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min;
      const life = Math.random() * 80 + 60;
      
      // Randomly select an image from the available images
      const randomImageIndex = Math.floor(Math.random() * imagesToUse.length);
      const imageUrl = imagesToUse[randomImageIndex];

      newParticles.push({
        id: Date.now() + i + Math.random() * 10000,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        life: life,
        maxLife: life,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        imageUrl: imageUrl
      });
    }

    return newParticles;
  };

  useEffect(() => {
    let animationId: number;
    let hasCompleted = false;

    // Create multiple bursts for different intensities
    const burstCount = intensity === 'epic' ? 6 : intensity === 'large' ? 4 : intensity === 'medium' ? 2 : 1;
    const burstDelay = intensity === 'epic' ? 300 : intensity === 'large' ? 400 : 500;

    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        const x = Math.random() * (window.innerWidth - 200) + 100;
        const y = Math.random() * (window.innerHeight * 0.4) + 100;
        const burst = createBurst(x, y);
        setParticles(prev => [...prev, ...burst]);
      }, i * burstDelay);
    }

    // Animation loop
    const animate = () => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98, // air resistance
          vy: particle.vy + 0.15, // gravity
          life: particle.life - 1,
          rotation: particle.rotation + particle.rotationSpeed,
          size: particle.size * Math.max(0.3, particle.life / particle.maxLife) // shrink but maintain minimum size
        })).filter(particle => particle.life > 0 && particle.y < window.innerHeight + 100);

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
  }, [intensity, onComplete, isActive, imagesToUse]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-l from-green-400/15 via-blue-500/15 to-purple-500/15 animate-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Central Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className={`text-center animate-bounce drop-shadow-2xl ${
          intensity === 'epic' ? 'text-5xl md:text-7xl' : ''
        } ${
          intensity === 'large' ? 'text-4xl md:text-6xl' : ''
        } ${
          intensity === 'medium' ? 'text-3xl md:text-5xl' : ''
        } ${
          intensity === 'small' ? 'text-2xl md:text-4xl' : ''
        } font-bold text-white`}>
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            {message}
          </div>
        </div>
      </div>

      {/* Custom Image Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute transition-opacity duration-300"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
            opacity: Math.max(0.3, particle.life / particle.maxLife),
            filter: `brightness(${0.8 + (particle.life / particle.maxLife) * 0.4}) saturate(1.2)`
          }}
        >
          <img
            src={particle.imageUrl}
            alt="firework particle"
            className="block"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
            }}
            onError={(e) => {
              // Fallback to a simple colored circle if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallbackDiv = document.createElement('div');
              fallbackDiv.style.width = `${particle.size}px`;
              fallbackDiv.style.height = `${particle.size}px`;
              fallbackDiv.style.backgroundColor = '#FFD700';
              fallbackDiv.style.borderRadius = '50%';
              fallbackDiv.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))';
              target.parentNode?.appendChild(fallbackDiv);
            }}
          />
        </div>
      ))}

      {/* Ground Effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-400/30 via-orange-500/20 to-transparent animate-pulse" />
      
      {/* Side Sparkles */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-400/20 to-transparent animate-pulse" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-purple-400/20 to-transparent animate-pulse" />
    </div>
  );
};

export default EnhancedFireworks;