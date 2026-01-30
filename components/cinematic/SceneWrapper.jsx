'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * SceneWrapper
 * 
 * Wraps a section to be part of the cinematic timeline.
 * Handles scene entry/exit animations and visibility.
 */
export default function SceneWrapper({
  children,
  sceneId,
  className = '',
  onEnter = () => {},
  onExit = () => {},
  duration = 8000,
  ...props
}) {
  const sceneRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    // Register scene with parent controller if available
    if (sceneRef.current && window.__cinematicController) {
      window.__cinematicController.registerScene({
        id: sceneId,
        element: sceneRef.current,
        duration,
      });
    }
  }, [sceneId, duration]);

  const handleEnter = () => {
    setIsVisible(true);
    if (!hasEntered) {
      setHasEntered(true);
      onEnter();
    }
  };

  const handleExit = () => {
    setIsVisible(false);
    onExit();
  };

  return (
    <section
      ref={sceneRef}
      data-scene-id={sceneId}
      className={`min-h-screen relative ${className}`}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 2,
          ease: [0.25, 0.1, 0.25, 1], // Cinematic easing
        }}
        onAnimationStart={() => {
          if (isVisible) handleEnter();
          else handleExit();
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
