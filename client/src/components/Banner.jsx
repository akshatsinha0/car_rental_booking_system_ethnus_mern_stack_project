import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const Banner = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  // Animation presets
  const container = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { when: 'beforeChildren', staggerChildren: 0.25, duration: 0.7, ease: 'easeOut' }
    }
  }
  const textAnim = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } }
  }
  const imgAnim = {
    hidden: { opacity: 0, x: 40, rotate: -6, scale: 0.92 },
    show: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.85, ease: 'easeOut' }
    }
  }
  const btnAnim = {
    hover: { scale: 1.1, boxShadow: '0 10px 25px rgba(0,0,0,0.25)' },
    tap: { scale: 0.95 }
  }

  return (
    <motion.section
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className="relative flex flex-col md:flex-row items-center md:items-start justify-between p-8 pt-14 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-7xl mx-6 md:mx-auto rounded-3xl overflow-hidden shadow-2xl"
    >
      {/* Soft Ambient Glows */}
      <motion.div
        className="absolute top-0 left-1/2 w-[220px] h-[220px] bg-white/10 rounded-full filter blur-3xl mix-blend-overlay transform -translate-x-1/2 animate-spin-slow"
      />
      <motion.div
        className="absolute bottom-0 right-1/3 w-[160px] h-[160px] bg-white/20 rounded-full filter blur-2xl mix-blend-overlay animate-pulse-slow"
      />

      {/* Textual Panel */}
      <motion.div
        variants={textAnim}
        className="relative z-10 text-white text-center md:text-left space-y-5 md:space-y-7 max-w-lg"
      >
        <motion.h2 className="text-4xl md:text-5xl font-bold michroma-regular leading-tight">
          Have a Premium Ride?
        </motion.h2>
        <motion.p className="text-lg md:text-xl opacity-90">
          Turn your car into a revenue stream by partnering with DriveGood.
        </motion.p>
        <motion.p className="text-base md:text-lg opacity-80">
          We manage insurance, validate drivers, and secure payments—so you enjoy effortless earnings.
        </motion.p>
        <motion.button
          variants={btnAnim}
          whileHover="hover"
          whileTap="tap"
          className="mt-5 inline-flex items-center px-6 py-3 bg-[#F5DEB3] text-primary font-medium rounded-lg"
        >
          Start Listing Today
          <motion.span
            className="ml-2 inline-block"
            initial={{ x: -5 }}
            animate={{ x: 5 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.1, ease: 'easeInOut' }}
          >
            ➜
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Hero Image */}
      <motion.img
        variants={imgAnim}
        src={assets.banner_car_image}
        alt="Luxury vehicle"
        className="relative z-10 mt-10 md:mt-0 max-h-[320px] md:max-h-[380px] drop-shadow-2xl"
        whileHover={{ rotate: 3, scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      />
    </motion.section>
  )
}

export default Banner