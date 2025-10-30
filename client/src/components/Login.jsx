import React, { useRef, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext()
  const formRef = useRef(null)

  const [state, setState] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setShowLogin(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setShowLogin])

  
  useEffect(() => {
    formRef.current?.querySelector('input')?.focus()
  }, [state])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { email, password }
      if (state === 'register') payload.name = name
      const { data } = await axios.post(`/api/user/${state}`, payload)
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('token', data.token)
        navigate('/')
        setShowLogin(false)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowLogin(false)}
      >
        <motion.form
          key="form"
          ref={formRef}
          onClick={(e) => e.stopPropagation()}
          onSubmit={onSubmitHandler}
          className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-2xl shadow-2xl p-8 w-80 sm:w-[360px] overflow-hidden border border-blue-500"
          initial={{ y: -40, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {}
          <motion.div
            className="absolute -top-16 -left-16 w-40 h-40 bg-primary/20 rounded-full filter blur-2xl"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-16 -right-16 w-32 h-32 bg-secondary/20 rounded-full filter blur-2xl"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          />

          {}
          <motion.h2
            className="text-2xl font-semibold text-center mb-6 michroma-regular"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="text-primary dark:text-secondary">User</span>{' '}
            {state === 'login' ? 'Login' : 'Sign Up'}
          </motion.h2>

          {}
          <AnimatePresence>
            {state === 'register' && (
              <motion.div
                key="name"
                className="mb-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {}
          <motion.div
            className="mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg border border-blue-400 bg-blue-100 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
          </motion.div>

          {}
          <motion.div
            className="mb-6 relative"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label className="block text-sm mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-blue-400 bg-blue-100 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            />
            <motion.img
              src={showPassword ? assets.eye_close_icon : assets.eye_icon}
              alt="toggle visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 cursor-pointer"
              onClick={() => setShowPassword((v) => !v)}
              whileTap={{ scale: 0.8 }}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {}
          <motion.p
            className="text-xs text-center text-gray-600 dark:text-gray-400 mb-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={() => setState((s) => (s === 'login' ? 'register' : 'login'))}
          >
            {state === 'login'
              ? 'Create an account? '
              : 'Already have an account? '}
            <span className="text-primary dark:text-secondary underline">
              click here
            </span>
          </motion.p>

          {}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-transform shadow-lg"
            whileHover={{ boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            {loading
              ? 'Processing...'
              : state === 'login'
              ? 'Login'
              : 'Sign Up'}
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  )
}

export default Login