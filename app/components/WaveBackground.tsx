'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Debug state management
type DebugState = {
  showCursor: boolean;
  logging: boolean;
};

// Create a simple logger that respects debug state
export const debugLogger = {
  log: (message: string, ...args: unknown[]) => {
    if (window.__DEBUG_MODE__?.logging) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }
};

// Global debug state
declare global {
  interface Window {
    __DEBUG_MODE__?: DebugState;
    toggleDebugCursor?: () => void;
    toggleDebugLogging?: () => void;
  }
}

// Custom types to handle the originalPositions property
interface CustomPlaneGeometry extends THREE.PlaneGeometry {
  originalPositions: Float32Array;
}

// Wave animation with interactive cursor, like nyko.cool
type WavesProps = {
  mouseX: number;
  mouseY: number;
  isDarkMode: boolean;
  showCursor?: boolean;
};

const Waves = ({ mouseX, mouseY, isDarkMode, showCursor = false }: WavesProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  
  // Create geometry
  useEffect(() => {
    if (!meshRef.current) return;
    
    const geometry = meshRef.current.geometry as CustomPlaneGeometry;
    const position = geometry.attributes.position;
    const count = position.count;
    
    // Store original positions
    const originalPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      originalPositions[i * 3] = position.getX(i);
      originalPositions[i * 3 + 1] = position.getY(i);
      originalPositions[i * 3 + 2] = position.getZ(i);
    }
    
    // Attach to the geometry for use in animation
    geometry.originalPositions = originalPositions;
  }, []);
  
  // Animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const mesh = meshRef.current;
    const geometry = mesh.geometry as CustomPlaneGeometry;
    const position = geometry.attributes.position;
    const originalPositions = geometry.originalPositions;
    const count = position.count;
    
    if (!originalPositions) return;
    
    const time = state.clock.getElapsedTime();
    
    // Normalize mouse coordinates to [-1, 1]
    const normalizedMouseX = (mouseX / window.innerWidth) * 2 - 1;
    const normalizedMouseY = -(mouseY / window.innerHeight) * 2 + 1;
    
    // Update cursor position if showing cursor
    if (cursorRef.current && showCursor) {
      cursorRef.current.position.x = normalizedMouseX * 10;
      cursorRef.current.position.y = normalizedMouseY * 5;
      cursorRef.current.position.z = 0.2;
      cursorRef.current.visible = true;
    } else if (cursorRef.current) {
      cursorRef.current.visible = false;
    }
    
    // Animate wave vertices
    for (let i = 0; i < count; i++) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      
      // Basic wave motion
      const waveX = Math.sin(x * 0.5 + time * 0.7) * 0.2;
      const waveY = Math.sin(y * 0.5 + time * 0.8) * 0.2;
      
      // Mouse influence (stronger effect when closer to mouse)
      const mouseInfluenceX = normalizedMouseX * 10;
      const mouseInfluenceY = normalizedMouseY * 5;
      
      const distanceToMouse = Math.sqrt(
        Math.pow(x - mouseInfluenceX, 2) + 
        Math.pow(y - mouseInfluenceY, 2)
      );
      
      let mouseEffect = 0;
      if (distanceToMouse < 5) {
        mouseEffect = (1 - distanceToMouse / 5) * 0.8;
      }
      
      // Combine animations
      position.setZ(i, waveX + waveY + mouseEffect);
    }
    
    position.needsUpdate = true;
  });
  
  return (
    <>
      <mesh ref={meshRef} rotation={[-Math.PI * 0.1, 0, 0]}>
        <planeGeometry args={[40, 20, 32, 32]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#FF85A1' : '#678D58'} 
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      
      {/* Secondary mesh for depth */}
      <mesh rotation={[-Math.PI * 0.1, 0, 0]} position={[0, 0, -1]}>
        <planeGeometry args={[40, 20, 16, 16]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#FF4989' : '#557153'} 
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Cursor visualization for debug */}
      <mesh ref={cursorRef} position={[0, 0, 0.2]} visible={showCursor}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#FFC4DD' : '#A3C9A8'} 
          emissive={isDarkMode ? '#FF4989' : '#557153'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
};

export default function WaveBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDebugCursor, setShowDebugCursor] = useState(false);
  
  // Setup debug mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__DEBUG_MODE__ = window.__DEBUG_MODE__ || {
        showCursor: false,
        logging: false
      };
      
      // Add debug toggle functions to window for development
      window.toggleDebugCursor = () => {
        window.__DEBUG_MODE__!.showCursor = !window.__DEBUG_MODE__!.showCursor;
        setShowDebugCursor(window.__DEBUG_MODE__!.showCursor);
      };
    }
  }, []);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Check dark mode from localStorage
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(darkModeEnabled);
      }
    };
    
    // Initial check
    checkDarkMode();
    
    // Listen for theme changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        checkDarkMode();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also set up a MutationObserver to catch theme changes in the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);
  
  return (
    <div 
      ref={ref}
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" 
      style={{ zIndex: 0 }}
    >
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 75, near: 0.1, far: 1000 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 5, 5]} intensity={0.5} />
        <Waves 
          mouseX={mousePos.x} 
          mouseY={mousePos.y} 
          isDarkMode={isDarkMode}
          showCursor={showDebugCursor}
        />
      </Canvas>
    </div>
  );
} 