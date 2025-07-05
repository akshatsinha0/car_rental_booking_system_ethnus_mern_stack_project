import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import Title from './Title';
import { assets } from '../assets/assets';


    const testimonials = [
  {
    id: 1,
    name: 'Akshat Sinha',
    location: 'VIT Vellore',
    role: 'Product Designer',
    company: 'DriveGood',
          image: assets.testimonial_image_1, 
    testimonial: "DriveGood revolutionized my travel experience with their innovative approach to mobility. The seamless booking process and premium vehicle selection exceeded every expectation.",
    rating: 5,
    journey: "From skeptical first-timer to loyal advocate",
    metric: "50+ trips booked",
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#45B7D1'
    },
    particles: { count: 50, type: 'floating' },
    story: {
      challenge: "Finding reliable transport for business trips",
      solution: "DriveGood's executive fleet service",
      outcome: "40% increase in productivity during travels"
    }
  },
  {
    id: 2,
    name: 'Arnav Sinha',
    location: 'VIT Vellore',
    role: 'Tech & Design',
    company: 'Startup',
          image: assets.testimonial_image_2, 
    testimonial: 'DriveGood made my entrepreneurial journey smoother than ever. Their door-to-door service and customer-first approach created unforgettable experiences that fuel my passion for innovation.',
    rating: 5,
    journey: "From startup struggles to scaling success",
    metric: "200+ team rides organized",
    colors: {
      primary: '#96CEB4',
      secondary: '#FFEAA7',
      accent: '#DDA0DD'
    },
    particles: { count: 75, type: 'swirling' },
    story: {
      challenge: "Coordinating team transportation for events",
      solution: "DriveGood's group booking system",
      outcome: "95% team satisfaction rate"
    }
  },
  {
    id: 3,
    name: 'Adit Pushan',
    location: 'VIT Chennai',
    role: 'Data Expert',
    company: 'DriveGood',
    image: assets.testimonial_image_3,
    testimonial: "The analytics-driven approach of DriveGood impressed me as a data professional. Their predictive maintenance and route optimization showcase true technological excellence in the mobility sector.",
    rating: 5,
    journey: "From data analysis to real-world impact",
    metric: "30% cost savings achieved",
    colors: {
      primary: '#A8E6CF',
      secondary: '#FFB347',
      accent: '#87CEEB'
    },
    particles: { count: 60, type: 'data-flow' },
    story: {
      challenge: "Optimizing travel costs for research trips",
      solution: "DriveGood's smart pricing algorithm",
      outcome: "Increased research budget efficiency"
    }
  },
  {
    id: 4,
    name: 'Lokesh',
    location: 'VIT Chennai',
    role: 'UX Designer',
    company: 'VIT clubs and chapters',
    image: assets.testimonial_image_4,
    testimonial: 'As a designer, I appreciate DriveGood\'s attention to user experience. Every touchpoint is crafted with precision, making each journey feel like a masterpiece of convenience and comfort.',
    rating: 5,
    journey: "From design thinking to design living",
    metric: "100% recommendation rate",
    colors: {
      primary: '#F8B500',
      secondary: '#FF69B4',
      accent: '#20B2AA'
    },
    particles: { count: 80, type: 'creative' },
    story: {
      challenge: "Finding inspiration through travel",
      solution: "DriveGood's scenic route recommendations",
      outcome: "Breakthrough in design creativity"
    }
  }
];


const ParticleSystem = ({ type, colors, count, isActive }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const initializeParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 520,
        y: Math.random() * 320,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 360,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 50
      });
    }
    particlesRef.current = particles;
  }, [count]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle, index) => {
      
      switch (type) {
        case 'floating':
          particle.y += Math.sin(Date.now() * 0.001 + index) * 0.5;
          particle.x += Math.cos(Date.now() * 0.001 + index) * 0.3;
          break;
        case 'swirling':
          const centerX = 260, centerY = 160;
          const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
          particle.x += Math.cos(angle + 0.02) * 0.8;
          particle.y += Math.sin(angle + 0.02) * 0.8;
          break;
        case 'data-flow':
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > 520) particle.vx *= -1;
          if (particle.y < 0 || particle.y > 320) particle.vy *= -1;
          break;
        case 'creative':
          particle.size = 2 + Math.sin(Date.now() * 0.003 + index) * 1.5;
          particle.opacity = 0.3 + Math.sin(Date.now() * 0.002 + index) * 0.3;
          break;
      }

      
      particle.x = Math.max(0, Math.min(520, particle.x));
      particle.y = Math.max(0, Math.min(320, particle.y));

      
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [type, isActive]);

  useEffect(() => {
    initializeParticles();
    if (isActive) {
      animate();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, animate, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={320}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.5s ease'
      }}
    />
  );
};


const FloatingElements = ({ colors, isActive }) => {
  const elements = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: 3 + Math.random() * 4
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {elements.map((el) => (
                    <motion.div 
          key={el.id}
          style={{
            position: 'absolute',
            width: el.size,
            height: el.size,
            background: `linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20)`,
            borderRadius: '50%',
            filter: 'blur(1px)',
          }}
          initial={{
            x: `${el.initialX}%`,
            y: `${el.initialY}%`,
            scale: 0,
            opacity: 0
          }}
          animate={isActive ? {
            x: [`${el.initialX}%`, `${el.initialX + 20}%`, `${el.initialX}%`],
            y: [`${el.initialY}%`, `${el.initialY - 15}%`, `${el.initialY}%`],
            scale: [0, 1, 0.8, 1],
            opacity: [0, 0.6, 0.4, 0.6],
            rotate: [0, 180, 360]
          } : {
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.id * 0.2
          }}
        />
                            ))}
                        </div>
  );
};


const TestimonialCard = ({ testimonial, isActive, stackPosition }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const handleMouseMove = useCallback((event) => {
    if (!isActive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  }, [isActive, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  
  const stackProps = useMemo(() => {
    const configs = [
      { y: 0, scale: 1, opacity: 1, zIndex: 30, blur: 0 },
      { y: -12, scale: 0.94, opacity: 0.8, zIndex: 20, blur: 0.5 },
      { y: -20, scale: 0.88, opacity: 0.6, zIndex: 10, blur: 1 },
    ];
    return configs[stackPosition] || configs[2];
  }, [stackPosition]);

  
  const springY = useSpring(stackProps.y, { stiffness: 120, damping: 18, mass: 0.7 });
  const springScale = useSpring(stackProps.scale, { stiffness: 120, damping: 18, mass: 0.7 });

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 320,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        zIndex: stackProps.zIndex,
        y: isActive ? springY : stackProps.y,
        scale: isActive ? springScale : stackProps.scale,
      }}
      initial={false}
      animate={{
        opacity: stackProps.opacity,
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 25,
        mass: 0.8
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isActive ? { scale: stackProps.scale * 1.02 } : {}}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${testimonial.colors.primary}15, ${testimonial.colors.secondary}10)`,
          backdropFilter: `blur(${stackProps.blur}px)`,
          borderRadius: 24,
          padding: 32,
          border: `2px solid ${testimonial.colors.primary}30`,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {}
        <ParticleSystem
          type={testimonial.particles.type}
          colors={testimonial.colors}
          count={testimonial.particles.count}
          isActive={isActive}
        />

        {}
        <FloatingElements colors={testimonial.colors} isActive={isActive} />

        {}
        <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}
            initial={{ y: 20, opacity: 0 }}
            animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              style={{
                position: 'relative',
                width: 60,
                height: 60,
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${testimonial.colors.accent}`,
                boxShadow: `0 0 20px ${testimonial.colors.accent}30`
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(45deg, ${testimonial.colors.primary}20, transparent)`,
                }}
                animate={isActive ? { opacity: [0, 0.5, 0] } : { opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
                    </motion.div>

            <div>
              <motion.h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: 0,
                  background: `linear-gradient(45deg, ${testimonial.colors.primary}, ${testimonial.colors.accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {testimonial.name}
              </motion.h3>
              <motion.p
                style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '4px 0',
                  fontWeight: '500'
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                {testimonial.role} at {testimonial.company}
              </motion.p>
              <motion.p
                style={{
                  fontSize: '12px',
                  color: '#888',
                  margin: 0
                }}
                initial={{ x: -20, opacity: 0 }}
                animate={isActive ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                📍 {testimonial.location}
              </motion.p>
            </div>
          </motion.div>

          {}
          <motion.div
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <motion.div
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  position: 'relative'
                }}
                initial={{ rotate: 0, scale: 0 }}
                animate={isActive ? { rotate: 360, scale: 1 } : { rotate: 0, scale: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              >
                <img
                  src={assets.star_icon}
                  alt="star"
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: `drop-shadow(0 0 4px ${testimonial.colors.accent}50)`
                  }}
                />
              </motion.div>
            ))}
            <motion.span
              style={{
                fontSize: '12px',
                color: '#666',
                marginLeft: 8,
                fontWeight: '600'
              }}
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {testimonial.journey}
            </motion.span>
          </motion.div>

          {}
          <motion.div
            style={{ flex: 1, marginBottom: 16 }}
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.p
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: '#555',
                fontStyle: 'italic',
                position: 'relative',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                border: `1px solid ${testimonial.colors.primary}20`,
                backdropFilter: 'blur(5px)'
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.span
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 12,
                  fontSize: '24px',
                  color: testimonial.colors.primary,
                  opacity: 0.3
                }}
                initial={{ scale: 0, rotate: -45 }}
                animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                "
              </motion.span>
              "{testimonial.testimonial}"
              <motion.span
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 12,
                  fontSize: '24px',
                  color: testimonial.colors.primary,
                  opacity: 0.3
                }}
                initial={{ scale: 0, rotate: 45 }}
                animate={isActive ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 45 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                "
              </motion.span>
            </motion.p>
          </motion.div>

          {}
          <motion.div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              style={{
                background: `linear-gradient(45deg, ${testimonial.colors.primary}20, ${testimonial.colors.secondary}20)`,
                padding: '8px 12px',
                borderRadius: 20,
                fontSize: '12px',
                fontWeight: '600',
                color: '#333',
                border: `1px solid ${testimonial.colors.primary}30`
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              📊 {testimonial.metric}
            </motion.div>

            <motion.div
              style={{
                background: `linear-gradient(45deg, ${testimonial.colors.accent}, ${testimonial.colors.primary})`,
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${testimonial.colors.accent}30`
              }}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span style={{ fontSize: '18px' }}>🏆</span>
            </motion.div>
          </motion.div>
        </div>

        {}
        <motion.div
          style={{
            position: 'absolute',
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            background: `radial-gradient(circle at 50% 50%, ${testimonial.colors.primary}08, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={isActive ? {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          } : { scale: 1, opacity: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};


const Testimonial = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <motion.div
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              background: `linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={isInView ? {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0, 1, 0.8, 1],
              rotate: [0, 180, 360]
            } : { scale: 0 }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {}
      <motion.div
        style={{ marginBottom: 60, textAlign: 'center', zIndex: 10 }}
        initial={{ y: -50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Title
          title="Voices of Excellence"
          subTitle="Transformative journeys and breakthrough moments shared by our community of innovators and visionaries"
        />
      </motion.div>

      {}
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 520,
          height: 320,
          zIndex: 10
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <AnimatePresence>
          {testimonials.map((testimonial, index) => {
            const stackPosition = index - activeIndex;
            if (stackPosition < 0 || stackPosition > 2) return null;

            return (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={stackPosition === 0}
                stackPosition={stackPosition}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {}
      <motion.div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 40,
          zIndex: 10
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            style={{
              width: activeIndex === index ? 32 : 12,
              height: 12,
              borderRadius: 6,
              border: 'none',
              background: activeIndex === index
                ? `linear-gradient(45deg, ${testimonials[index].colors.primary}, ${testimonials[index].colors.accent})`
                : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeIndex === index
                ? `0 4px 12px ${testimonials[index].colors.primary}40`
                : 'none'
            }}
            onClick={() => setActiveIndex(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={activeIndex === index ? {
              boxShadow: [
                `0 4px 12px ${testimonials[index].colors.primary}40`,
                `0 6px 20px ${testimonials[index].colors.primary}60`,
                `0 4px 12px ${testimonials[index].colors.primary}40`
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 10
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.div
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${testimonials[activeIndex].colors.primary}, ${testimonials[activeIndex].colors.accent})`,
            borderRadius: 2,
            transformOrigin: 'left'
          }}
          animate={{ scaleX: (activeIndex + 1) / testimonials.length }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Testimonial;
