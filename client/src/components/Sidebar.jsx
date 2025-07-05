import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Cars', path: '/cars' },
  { name: 'My Bookings', path: '/my-bookings' },
  { name: 'List Cars', path: '/owner/add-car' },
];

const sidebarVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 400, damping: 40 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 400, damping: 40 } },
};

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sidebar"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sidebarVariants}
          className="fixed top-0 right-0 h-full w-72 max-w-full z-[2000] bg-white/70 backdrop-blur-lg shadow-2xl border-l border-gray-200 flex flex-col pt-20 px-8"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
        >
          <button
            className="absolute top-6 right-8 flex items-center gap-2 text-lg font-mono text-gray-700 group"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <span className="typewriter group-hover:font-bold">close</span>
            <span className="ml-1 text-2xl transition-transform duration-300 group-hover:rotate-90">&#10005;</span>
          </button>
          <nav className="flex flex-col gap-8 mt-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xl font-semibold transition-colors duration-200 ${location.pathname === link.path ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                onClick={onClose}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar; 