import React, { useRef, useEffect, useCallback, useState } from 'react';

// ok so these are the creators, just randomly using some names, coz we are at the basic stage as of now
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
  const lastTimeRef = useRef(null);
  const positionRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [marqueeWidth, setMarqueeWidth] = useState(0);


  const ANIMATION_CONFIG = {
    speed: 50, 
    gap: 32, 
  };

  // measure widths, call this on mount and resize, hope it works everywhere
  const measureDimensions = useCallback(() => {
    if (containerRef.current && marqueeRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const marqueeRect = marqueeRef.current.getBoundingClientRect();
      setContainerWidth(containerRect.width);
      setMarqueeWidth(marqueeRect.width);
    }
  }, []);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(measureDimensions, 100); // 100ms is fine
    };
    measureDimensions();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [measureDimensions]);


  // Smooth, delta-time based marquee that resumes from the last position
  useEffect(() => {
    if (!containerWidth || !marqueeWidth || isPaused) return;

    // initialize position on first run or when dimensions change
    if (positionRef.current === 0 && !marqueeRef.current?.style.transform) {
      positionRef.current = containerWidth; // start at right edge
    }

    const step = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current; // ms
      lastTimeRef.current = time;

      // move left by speed px/sec
      positionRef.current -= (ANIMATION_CONFIG.speed * delta) / 1000;

      // when the whole strip has left the view, reset to the right edge
      if (positionRef.current <= -marqueeWidth) {
        positionRef.current = containerWidth;
      }

      if (marqueeRef.current) {
        marqueeRef.current.style.transform = `translateX(${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = null; // so resume has fresh delta
    };
  }, [containerWidth, marqueeWidth, isPaused, ANIMATION_CONFIG.speed]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
  }, []);


  const CreatorCard = ({ creator, index }) => (
    <div
      className="flex flex-col items-center bg-[#23232a] rounded-xl px-6 py-4 min-w-[200px] shadow-lg flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#2a2a32]"
      style={{ 
        border: "2px solid #2563EB",
        marginRight: index < creators.length - 1 ? `${ANIMATION_CONFIG.gap}px` : '0'
      }}
    >

      <div className="h-8 mb-3 flex items-center justify-center w-full">
        <img
          src={creator.companyLogo}
          alt={creator.company}
          className="h-6 max-w-full object-contain filter brightness-90 hover:brightness-100 transition-all duration-200"
          onError={(e) => {
            e.target.style.display = 'none'; // just hide if broken
          }}
        />
      </div>

      <div className="relative mb-3">
        <img
          src={creator.photo}
          alt={creator.name}
          className="w-20 h-20 rounded-full border-4 border-[#2563EB] object-cover shadow-lg transition-all duration-300 hover:border-[#3b82f6]"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=2563EB&color=fff&size=80`;
          }}
        />

        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#23232a] flex items-center justify-center">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <h3 className="text-white font-semibold text-lg text-center leading-tight hover:text-[#3b82f6] transition-colors duration-200">
        {creator.name}
      </h3>
      <p className="text-gray-400 text-sm mt-1 font-medium">
        @{creator.company}
      </p>
    </div>
  );

  return (
    <div className="w-full overflow-hidden py-8 bg-[#18181B] relative">

      <div className="absolute inset-0 bg-gradient-to-r from-[#18181B] via-transparent to-[#18181B] pointer-events-none z-10"></div>
 
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

          {creators.map((creator, index) => (
            <CreatorCard key={creator.id} creator={creator} index={index} />
          ))}
        </div>
      </div>
      {isPaused && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          Paused
        </div>
      )}
    </div>
  );
};

export default CreatorsBanner;
