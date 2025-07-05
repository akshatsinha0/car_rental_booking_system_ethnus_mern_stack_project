import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
import Sidebar from './Sidebar'
import hamburgerIcon from '../assets/hamburgericon.png'

const Navbar = () => {
    const {setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showClose, setShowClose] = useState(false)

    const changeRole = async ()=>{
        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (data.success) {
                setIsOwner(true)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Handle hamburger to close animation
    const handleHamburgerClick = () => {
        setSidebarOpen(true)
        setTimeout(() => setShowClose(true), 350) // sync with sidebar animation
    }
    const handleSidebarClose = () => {
        setShowClose(false)
        setTimeout(() => setSidebarOpen(false), 350) // sync with sidebar animation
    }

    return (
        <>
            <motion.div 
            initial={{y: -20, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            transition={{duration: 0.5}}
            className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-text border-b border-borderColor relative transition-all bg-[#F5DEB3]`}>

                <Link to='/'>
                    <span className="flex items-center gap-2">
                        <motion.img whileHover={{scale: 1.05}} src={assets.logo} alt="logo" className="h-8"/>
                        <span className="text-3xl michroma-regular text-primary font-extrabold select-none" style={{letterSpacing: '1px'}}>
                          DriveGood
                        </span>
                    </span>
                </Link>

                {/* Search bar */}
                <div className="flex-1 flex justify-center">
                    <input
                      type="text"
                      className="py-1.5 w-[420px] max-w-full bg-white/70 outline-none placeholder-gray-500 rounded-full px-6 shadow"
                      placeholder="Search cars"
                    />
                </div>

                {/* Login/Logout button */}
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={() => { user ? logout() : setShowLogin(true); }}
                        className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
                    >
                        {user ? 'Logout' : 'Login'}
                    </button>
                </div>
            </motion.div>

            {/* Hamburger/Close Button - absolutely positioned, outside flex row */}
            {!sidebarOpen && (
              <button
                className="fixed top-6 right-10 z-[2100] flex items-center justify-center w-12 h-12 bg-white/80 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                onClick={handleHamburgerClick}
                aria-label="Open menu"
                style={{ border: 'none', outline: 'none' }}
              >
                <img src={hamburgerIcon} alt="Menu" className="w-7 h-7 transition-all duration-300" />
              </button>
            )}

            {/* Sidebar */}
            <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
        </>
    )
}

export default Navbar
