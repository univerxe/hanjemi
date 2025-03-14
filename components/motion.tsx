"use client"

import { type HTMLMotionProps, motion as framerMotion, AnimatePresence as FramerAnimatePresence } from "framer-motion"

// Re-export framer-motion components
export const motion = framerMotion
export const AnimatePresence = FramerAnimatePresence

// Common animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Animated components
export function AnimatedDiv(props: HTMLMotionProps<"div">) {
  return <motion.div {...props} />
}

export function FadeIn({ children, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay }} {...props}>
      {children}
    </motion.div>
  )
}

