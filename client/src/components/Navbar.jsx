import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import hamburgerIcon from '../assets/hamburgericon.png'
import customAvatar from '../assets/customAvatar.png'

const Navbar = () => {
  const { setShowLogin, user, logout, axios, setIsOwner } = useAppContext()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showClose, setShowClose] = useState(false)
  const [changingRole, setChangingRole] = useState(false)

  const changeRole = async () => {
    setChangingRole(true)
    try {
      const { data } = await axios.post('/api/owner/change-role')
      data.success ? toast.success(data.message) : toast.error(data.message)
      if (data.success) setIsOwner(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setChangingRole(false)
    }
  }

  const handleHamburgerClick = () => {
    setSidebarOpen(true)
    setTimeout(() => setShowClose(true), 350)
  }
  const handleSidebarClose = () => {
    setShowClose(false)
    setTimeout(() => setSidebarOpen(false), 350)
  }

  // Close sidebar on route change
  useEffect(() => {
    if (sidebarOpen) handleSidebarClose()
    // eslint-disable-next-line
  }, [location.pathname])

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed w-full z-50 bg-[#F5DEB3] backdrop-blur-md border-b border-borderColor"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 md:px-12 lg:px-16 py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <motion.img
              src={assets.logo}
              alt="logo"
              className="h-8 w-8 min-w-[2rem]"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.span
              className="text-xl xs:text-2xl sm:text-3xl michroma-regular text-primary font-extrabold select-none truncate"
              style={{ letterSpacing: '1px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              DriveGood
            </motion.span>
          </Link>

          {/* Search */}
          <motion.div
            className="hidden md:flex flex-1 justify-center px-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Search cars..."
              className="w-full max-w-lg px-6 py-2 rounded-full bg-white/80 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-md transition"
            />
          </motion.div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <UserProfileDropdown user={user} logout={logout} changeRole={changeRole} changingRole={changingRole} />
            ) : (
              <motion.button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-sm md:text-base bg-primary text-white rounded-lg shadow hover:scale-105 transition-transform"
                whileHover={{ boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
              >
                Login
              </motion.button>
            )}

            {/* Hamburger */}
            {!sidebarOpen && (
              <motion.button
                onClick={handleHamburgerClick}
                className="relative w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                whileHover={{ rotate: 90 }}
                aria-label="Open menu"
              >
                <img src={hamburgerIcon} alt="Menu" className="w-6 h-6" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar open={showClose} onClose={handleSidebarClose} />
        )}
      </AnimatePresence>
    </>
  )
}

function UserProfileDropdown({ user, logout, changeRole, changingRole }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!btnRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={btnRef}>
      <motion.img
        src={customAvatar}
        alt="Avatar"
        className="w-11 h-11 rounded-full border-2 border-primary shadow-lg cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-5 flex flex-col gap-3"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img src={customAvatar} alt="Avatar" className="w-12 h-12 rounded-full border border-primary" />
              <div>
                <div
                  className="font-bold text-lg michroma-regular max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={user.name}
                >
                  {user.name}
                </div>
                <div
                  className="text-gray-500 text-sm max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={user.email}
                >
                  {user.email}
                </div>
              </div>
            </div>
            <div className="text-gray-700 text-sm">
              Role: <span className="font-semibold">{user.role}</span>
            </div>
            <motion.button
              onClick={changeRole}
              disabled={changingRole}
              className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dull transition"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {changingRole ? 'Switching…' : 'Become Owner'}
            </motion.button>
            <motion.button
              onClick={logout}
              className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar