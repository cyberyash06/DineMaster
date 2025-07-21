// AuthLayout.jsx  (no scrolling version)
import { motion } from 'framer-motion';

export default function AuthLayout({ title, children }) {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1350&q=80   ')",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="absolute inset-0 bg-black/20 backdrop-blur-xs"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center"
      >
        {/* cap */}
        <svg xmlns="http://www.w3.org/2000/svg SVG namespace SVG namespace  " viewBox="0 0 64 60" width="130" height="124">

          <path fill="#fff" stroke="#000" stroke-width="2" d="M32,10c-6,0-10,3-12,6c-4,0-8,4-8,8c0,4,2,6,4,8h32c2-2,4-4,4-8c0-4-4-8-8-8c-2-3-6-6-12-6z" />

          <path fill="#fff" stroke="#000" stroke-width="2" d="M19,42h26v8H19z" />


          <path fill="#ddd" stroke="#000" stroke-width="2" d="M20,50h24v4H20z" />


          <text x="32" y="39" stroke="black" stroke-width="0.1" font-weight="bold" fill="gold" text-anchor="middle" font-size="7" font-family="Georgia" >DINE MASTER</text>
        </svg>





        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-indigo-500/50 p-6 w-full">
          <h1 className="text-xl font-bold text-center text-white mb-3">{title}</h1>
          <div className="space-y-3">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}