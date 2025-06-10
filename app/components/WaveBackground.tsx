'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../providers/ThemeProvider';

/**
 * Debug state management type
 */
type DebugState = {
  /** Whether to show the cursor indicator */
  showCursor: boolean;
  /** Whether to enable debug logging */
  logging: boolean;
};

/**
 * Create a simple logger that respects debug state
 */
export const debugLogger = {
  /**
   * Logs a message if debug logging is enabled
   * @param {string} message - Message to log
   * @param {unknown[]} args - Additional arguments to log
   */
  log: (message: string, ...args: unknown[]): void => {
    if (window.__DEBUG_MODE__?.logging) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
};

/**
 * Global debug state interface
 */
declare global {
  interface Window {
    /** Debug mode settings */
    __DEBUG_MODE__?: DebugState;
    /** Function to toggle cursor visibility */
    toggleDebugCursor?: () => void;
    /** Function to toggle debug logging */
    toggleDebugLogging?: () => void;
  }
}

/**
 * Props for the Waves component
 */
type WavesProps = {
  /** Current mouse X position */
  mouseX: number;
  /** Current mouse Y position */
  mouseY: number;
  /** Whether dark mode is enabled */
  isDarkMode: boolean;
  /** Whether to show the debug cursor */
  showCursor?: boolean;
};

/**
 * Wave animation component with interactive cursor
 * 
 * Creates a grid of animated vertical lines that respond to cursor movement
 * with elastic deformation for an interactive wave effect.
 *
 * @param {WavesProps} props - Component props
 * @returns {React.ReactElement} The Three.js wave animation
 */
const Waves = React.memo(({ mouseX, mouseY, isDarkMode, showCursor = false }: WavesProps): React.ReactElement => {
  const groupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<DOMRect | null>(null);
  const mousePositionRef = useRef({ x: mouseX, y: mouseY });

  // Grid and animation configuration - memoized for performance
  const config = useMemo(() => ({
    numLines: 72,         // Number of vertical lines
    pointsPerLine: 100,   // Points per line for smoothness
    width: 40,            // Grid width
    height: 20,           // Grid height
    cursorThreshold: 1.2, // Distance threshold for cursor influence
    baseWaveSpeed: 1.1,   // Speed of the base wave animation
    baseWaveStrength: 0.22, // Strength of the base wave
    strumStrength: 2.2    // Strength of the strum effect when cursor is close
  }), []);
  
  const { numLines, pointsPerLine, width, height } = config;

  // Store original Y positions for elasticity calculations
  const originalYPositions = useRef<number[][]>([]);

  // Update mouse position ref for performance
  useEffect(() => {
    mousePositionRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  // Initialize lines and store original Y positions
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Initialize the 2D array for original positions
    originalYPositions.current = Array(numLines)
      .fill(0)
      .map((_, i) => {
        const y = (i / (numLines - 1) - 0.5) * height;
        return Array(pointsPerLine).fill(y);
      });

    // Get canvas element bounds for accurate mouse positioning
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas.getBoundingClientRect();
      
      // Add resize handler for the canvas - optimized
      let resizeTimeout: NodeJS.Timeout;
      const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          canvasRef.current = canvas.getBoundingClientRect();
        }, 100); // Debounce resize updates
      });
      
      resizeObserver.observe(canvas);
      return () => {
        resizeObserver.disconnect();
        clearTimeout(resizeTimeout);
      };
    }
  }, [numLines, pointsPerLine, height]);

  // Animation frame update - optimized
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const { cursorThreshold, baseWaveSpeed, baseWaveStrength, strumStrength } = config;

    // Update canvas bounds less frequently for performance
    const canvas = document.querySelector('canvas');
    if (canvas && (!canvasRef.current || Math.floor(time * 10) % 60 === 0)) {
      canvasRef.current = canvas.getBoundingClientRect();
    }

    // Calculate normalized mouse coordinates using ref for better performance
    let normalizedMouseX = 0;
    let normalizedMouseY = 0;
    
    if (canvasRef.current) {
      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const relativeMouseX = mouseX - (canvasRef.current.left || 0);
      const relativeMouseY = mouseY - (canvasRef.current.top || 0);
      
      // Normalize to range [-1, 1]
      normalizedMouseX = (relativeMouseX / canvasRef.current.width) * 2 - 1;
      normalizedMouseY = -(relativeMouseY / canvasRef.current.height) * 2 + 1;
    }

    // Update cursor position if showing debug cursor
    if (cursorRef.current && showCursor) {
      cursorRef.current.position.x = normalizedMouseX * (width / 2);
      cursorRef.current.position.y = normalizedMouseY * (height / 2);
      cursorRef.current.position.z = 0.2;
      cursorRef.current.visible = true;
    } else if (cursorRef.current) {
      cursorRef.current.visible = false;
    }
    
    // Calculate which line is closest to the cursor (vertical lines)
    const mouseXWorld = normalizedMouseX * (width / 2);
    let closestLine = 0;
    let minDist = Infinity;
    
    for (let i = 0; i < numLines; i++) {
      const x = (i / (numLines - 1) - 0.5) * width;
      const dist = Math.abs(x - mouseXWorld);
      if (dist < minDist) {
        minDist = dist;
        closestLine = i;
      }
    }
    
    // Animate each line - optimized
    groupRef.current.children.forEach((lineMesh, i) => {
      const x = (i / (numLines - 1) - 0.5) * width;
      const geometry = (lineMesh as THREE.Line).geometry as THREE.BufferGeometry;
      const positions = geometry.attributes.position.array as Float32Array;
      
      // Calculate reverberation strength for this line
      const lineDistance = Math.abs(i - closestLine);
      const lineReverbStrength = lineDistance === 0 ? 1 : 0; // Only the closest line gets the effect
      
      for (let j = 0; j < pointsPerLine; j++) {
        const y = (j / (pointsPerLine - 1) - 0.5) * height;
        
        // Slower, subtle base wave (animate X)
        let elastic = Math.sin(y * 0.25 + time * baseWaveSpeed) * baseWaveStrength;
        
        // Cursor influence (elastic strum + reverberation)
        const mouseYWorld = normalizedMouseY * (height / 2);
        const distToCursor = Math.sqrt(
          Math.pow(y - mouseYWorld, 2) + Math.pow(x - mouseXWorld, 2)
        );
        
        if (distToCursor < cursorThreshold) {
          // Strong elastic burst, only for the closest line/point
          const strum = Math.sin(time * 10 - distToCursor * 2) 
            * (1 - distToCursor / cursorThreshold) 
            * strumStrength 
            * lineReverbStrength;
          elastic += strum;
        }
        
        positions[j * 3 + 0] = x + elastic; // Only X is animated
      }
      
      geometry.attributes.position.needsUpdate = true;
    });
  });

  // Create vertical lines - memoized for performance
  const lines = useMemo(() => {
    const lines = [];
    const lineColor = isDarkMode ? '#FF85A1' : '#678D58';
    
    for (let i = 0; i < numLines; i++) {
      const x = (i / (numLines - 1) - 0.5) * width;
      const points = [];
      
      for (let j = 0; j < pointsPerLine; j++) {
        const y = (j / (pointsPerLine - 1) - 0.5) * height;
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      lines.push(
        <line key={i}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial attach="material" color={lineColor} linewidth={2} />
        </line>
      );
    }
    
    return lines;
  }, [numLines, pointsPerLine, width, height, isDarkMode]);

  return (
    <group ref={groupRef}>
      {lines}
      {/* Cursor visualization for debug */}
      <mesh ref={cursorRef} position={[0, 0, 0.2]} visible={showCursor}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#FF4989' : '#ff0000'} 
          emissive={isDarkMode ? '#FF85A1' : '#ff6666'}
          emissiveIntensity={0.8}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
});

Waves.displayName = 'Waves';

/**
 * WaveBackground component
 * 
 * Creates an animated wave background using Three.js that responds
 * to mouse movement and changes color based on the current theme.
 * 
 * @returns {React.ReactElement} The wave background component
 */
export default function WaveBackground(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  
  // Setup debug mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize debug mode
    if (!window.__DEBUG_MODE__) {
      window.__DEBUG_MODE__ = {
        showCursor: localStorage.getItem('debugCursor') === 'true',
        logging: false
      };
    }
    
    // Initialize debug cursor state
    setShowCursor(window.__DEBUG_MODE__.showCursor);
    
    // Add key handler for debug mode toggling
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
        // Toggle cursor visibility
        window.__DEBUG_MODE__!.showCursor = !window.__DEBUG_MODE__!.showCursor;
        localStorage.setItem('debugCursor', window.__DEBUG_MODE__!.showCursor.toString());
        setShowCursor(window.__DEBUG_MODE__!.showCursor);
      } else if (e.key === 'l' && e.ctrlKey && e.shiftKey) {
        // Toggle logging
        window.__DEBUG_MODE__!.logging = !window.__DEBUG_MODE__!.logging;
        console.log(`Debug logging ${window.__DEBUG_MODE__!.logging ? 'enabled' : 'disabled'}`);
      }
    };
    
    // Add global debug toggles
    window.toggleDebugCursor = () => {
      window.__DEBUG_MODE__!.showCursor = !window.__DEBUG_MODE__!.showCursor;
      localStorage.setItem('debugCursor', window.__DEBUG_MODE__!.showCursor.toString());
      setShowCursor(window.__DEBUG_MODE__!.showCursor);
    };
    
    window.toggleDebugLogging = () => {
      window.__DEBUG_MODE__!.logging = !window.__DEBUG_MODE__!.logging;
      console.log(`Debug logging ${window.__DEBUG_MODE__!.logging ? 'enabled' : 'disabled'}`);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete window.toggleDebugCursor;
      delete window.toggleDebugLogging;
    };
  }, []);
  
  // Optimized mouse tracking with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY
    });
  }, []);
  
  // Effect for mouse tracking
  useEffect(() => {
    let animationFrameId: number;
    let lastMouseEvent: MouseEvent | null = null;
    
    const throttledMouseMove = (e: MouseEvent) => {
      lastMouseEvent = e;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          if (lastMouseEvent) {
            handleMouseMove(lastMouseEvent);
          }
          animationFrameId = 0;
        });
      }
    };
    
    window.addEventListener('mousemove', throttledMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [handleMouseMove]);
  
  return (
    <div 
      ref={ref} 
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 100], fov: 7 }}
      >
        <Waves
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isDarkMode={isDarkMode}
          showCursor={showCursor}
        />
      </Canvas>
    </div>
  );
} 