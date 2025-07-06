import React, { useState, useEffect, useRef } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

const Hero = () => {
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()
  const [pickupLocation, setPickupLocation] = useState('')
  const typewriterText =
    "Discover thousands of cars ready for you. Instant bookings, trusted owners, and zero hassle—DriveGood takes you there."
  const [displayedText, setDisplayedText] = useState('')
  const cursorRef = useRef(null)

  
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayedText(typewriterText.slice(0, i + 1))
      i++
      if (i === typewriterText.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  
  useEffect(() => {
    const blink = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity =
          cursorRef.current.style.opacity === '0' ? '1' : '0'
      }
    }, 500)
    return () => clearInterval(blink)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!pickupLocation) return
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    )
  }

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center bg-[#F5DEB3] text-center px-2 sm:px-6 pt-28 md:pt-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {}
      <motion.h1
        className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold michroma-regular text-primary mb-4 md:mb-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Ride in Style with DriveGood
      </motion.h1>

      {}
      <motion.p
        className="max-w-md sm:max-w-xl md:max-w-2xl text-base xs:text-lg md:text-xl text-gray-800 mb-6 md:mb-10 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {displayedText}
        <span ref={cursorRef} className="inline-block ml-1">
          |
        </span>
      </motion.p>

      {}
      <motion.form
        onSubmit={handleSearch}
        className="w-full max-w-xs sm:max-w-md md:max-w-3xl bg-white rounded-3xl md:rounded-full shadow-lg p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4"
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {/* Pickup Location */}
        <div className="flex-1 flex flex-col">
          <label className="text-xs font-semibold text-primary mb-1 ml-2">Select City</label>
          <select
            required
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full md:w-56 p-3 rounded-full border border-gray-300 bg-white text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition placeholder-gray-500"
          >
            <option value="">Select City</option>
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Date */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="pickup-date" className="text-xs font-semibold text-primary mb-1 ml-2">
            Going Date
          </label>
          <input
            id="pickup-date"
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition text-gray-700"
          />
        </div>

        {/* Return Date */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="return-date" className="text-xs font-semibold text-primary mb-1 ml-2">
            Return Date
          </label>
          <input
            id="return-date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
            className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary transition text-gray-700"
          />
        </div>

        {}
        <motion.button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary-dull transition w-full md:w-auto justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
          Search
        </motion.button>
      </motion.form>

      {}
      <motion.img
        src={assets.main_car}
        alt="Luxury Car"
        className="mt-8 md:mt-12 max-h-48 xs:max-h-64 md:max-h-80 drop-shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl mx-auto"
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        whileHover={{ scale: 1.02, rotate: 1 }}
      />
    </motion.section>
  )
}

export default Hero