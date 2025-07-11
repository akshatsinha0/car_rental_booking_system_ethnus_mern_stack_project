import React, { useRef, useEffect, useCallback, useState } from 'react';

const creators = [
  {
    id: 1,
    name: "Gaurav Poosarla",
    company: "Samsung",
    companyLogo: "https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo.png",
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Prajwal Shah",
    company: "Deutsche Bank",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Deutsche_Bank_logo_without_wordmark.svg",
    photo: "https://randomuser.me/api/portraits/men/33.jpg"
  },
  {
    id: 3,
    name: "K Sanketh Kumar",
    company: "EA",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Electronic_Arts_Logo.svg",
    photo: "https://randomuser.me/api/portraits/men/34.jpg"
  },
  {
    id: 4,
    name: "Sankalp Jain",
    company: "Samsung",
    companyLogo: "https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo.png",
    photo: "https://randomuser.me/api/portraits/men/35.jpg"
  },
  {
    id: 5,
    name: "Anubhuti Pandey",
    company: "Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    photo: "https://randomuser.me/api/portraits/women/36.jpg"
  }
];

const CreatorsBanner = () => {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const animationRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  // Configuration for smooth animation
  const ANIMATION_CONFIG = {
    speed: 50, // pixels per second - adjust for desired speed
    gap: 32, // gap between cards in pixels
  };

  // Measure dimensions when component mounts or window resizes
  const measureDimensions = useCallback(() => {
    if (containerRef.current && marqueeRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const marqueeRect = marqueeRef.current.getBoundingClientRect();
      
      setContainerWidth(containerRect.width);
      setMarqueeWidth(marqueeRect.width);
    }
  }, []);

  // Handle window resize with debouncing
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measureDimensions, 100);
    };

    measureDimensions();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [measureDimensions]);

  // Smooth infinite animation using requestAnimationFrame
  useEffect(() => {
    if (!containerWidth || !marqueeWidth || isPaused) return;

    let startTime = null;
    let position = containerWidth; // Start from right edge
    
    // Total distance to travel for one complete cycle
    const totalDistance = marqueeWidth + containerWidth;
    
    // Duration for one complete cycle (milliseconds)
    const cycleDuration = (totalDistance / ANIMATION_CONFIG.speed) * 1000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = (elapsed % cycleDuration) / cycleDuration;
      
      // Calculate position: start from right, move to complete left
      position = containerWidth - (progress * totalDistance);
      
      if (marqueeRef.current) {
        marqueeRef.current.style.transform = `translateX(${position}px)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [containerWidth, marqueeWidth, isPaused, ANIMATION_CONFIG.speed]);

  // Pause/resume on hover
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Create the card component
  const CreatorCard = ({ creator, index }) => (
    <div
      className="flex flex-col items-center bg-[#23232a] rounded-xl px-6 py-4 min-w-[200px] shadow-lg flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#2a2a32]"
      style={{ 
        border: "2px solid #2563EB",
        marginRight: index < creators.length - 1 ? `${ANIMATION_CONFIG.gap}px` : '0'
      }}
    >
      {/* Company Logo */}
      <div className="h-8 mb-3 flex items-center justify-center w-full">
        <img
          src={creator.companyLogo}
          alt={creator.company}
          className="h-6 max-w-full object-contain filter brightness-90 hover:brightness-100 transition-all duration-200"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      
      {/* Profile Photo */}
      <div className="relative mb-3">
        <img
          src={creator.photo}
          alt={creator.name}
          className="w-20 h-20 rounded-full border-4 border-[#2563EB] object-cover shadow-lg transition-all duration-300 hover:border-[#3b82f6]"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=2563EB&color=fff&size=80`;
          }}
        />
        {/* Online status indicator */}
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#23232a] flex items-center justify-center">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Creator Name */}
      <h3 className="text-white font-semibold text-lg text-center leading-tight hover:text-[#3b82f6] transition-colors duration-200">
        {creator.name}
      </h3>
      
      {/* Company Name */}
      <p className="text-gray-400 text-sm mt-1 font-medium">
        @{creator.company}
      </p>
    </div>
  );

  return (
    <div className="w-full overflow-hidden py-8 bg-[#18181B] relative">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#18181B] via-transparent to-[#18181B] pointer-events-none z-10"></div>
      
      {/* Performance optimization: use will-change and contain */}
      <div
        ref={containerRef}
        className="relative w-full h-full"
        style={{ contain: 'layout style paint' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={marqueeRef}
          className="flex items-center"
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            position: 'relative',
            width: 'max-content'
          }}
        >
          {/* Render unique cards only */}
          {creators.map((creator, index) => (
            <CreatorCard key={creator.id} creator={creator} index={index} />
          ))}
        </div>
      </div>
      
      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          Paused
        </div>
      )}
    </div>
  );
};

export default CreatorsBanner;
