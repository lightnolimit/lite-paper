'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../providers/ThemeProvider';

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

// Create a custom star shape
const createStarShape = () => {
  const shape = new THREE.Shape();
  const outerRadius = 0.5;
  const innerRadius = 0.2;
  const spikes = 5;
  
  // Straight lines for a regular 5-point star
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / spikes) * i;
    const x = Math.sin(angle) * radius;
    const y = Math.cos(angle) * radius;
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  
  shape.closePath();
  return shape;
};

// Stars component instead of waves
type StarFieldProps = {
  count?: number;
  mouseX: number;
  mouseY: number;
  isDarkMode: boolean;
  showCursor: boolean;
};

const StarField = ({ count = 800, mouseX, mouseY, isDarkMode, showCursor }: StarFieldProps) => {
  const starsGroup = useRef<THREE.Group>(null);
  const cursorMesh = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<DOMRect | null>(null);
  
  // Create star instances
  const [starPositions, setStarPositions] = useState<Float32Array | null>(null);
  const [starColors, setStarColors] = useState<Float32Array | null>(null);
  const [starSizes, setStarSizes] = useState<Float32Array | null>(null);
  
  // Create star geometry
  const starGeometry = useMemo(() => {
    const shape = createStarShape();
    const geometry = new THREE.ShapeGeometry(shape);
    geometry.scale(0.1, 0.1, 0.1); // Scale down the stars
    return geometry;
  }, []);
  
  // Create stars
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Generate random positions
    for (let i = 0; i < count; i++) {
      // Position stars across the full viewport
      positions[i * 3] = (Math.random() - 0.5) * 50;  // X-axis spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // Y-axis spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z-axis depth
      
      // Create stars with varying sizes, including some larger ones
      // Adjust distribution to 50% small, 30% medium, 20% large stars
      const sizeCategory = Math.random();
      if (sizeCategory < 0.5) {
        // Small stars
        sizes[i] = Math.random() * 2.3 + 0.2; // 0.2 to 0.5 (slightly larger)
      } else if (sizeCategory < 0.8) {
        // Medium stars
        sizes[i] = Math.random() * 3.5 + 0.5; // 0.5 to 1.0 (larger)
      } else {
        // Large stars
        sizes[i] = Math.random() * 5.8 + 1.0; // 1.0 to 1.8 (much larger)
      }
      
      // Set colors based on theme
      if (isDarkMode) {
        // Pink palette for dark mode
        colors[i * 3] = 0.9 + Math.random() * 0.1; // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
      } else {
        // Faded black palette for light mode
        colors[i * 3] = 0.2 + Math.random() * 0.1; // R (darker)
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.1; // G (darker)
        colors[i * 3 + 2] = 0.2 + Math.random() * 0.1; // B (darker)
      }
    }
    
    setStarPositions(positions);
    setStarColors(colors);
    setStarSizes(sizes);
    
    debugLogger.log('Stars created', { count });
  }, [count, isDarkMode]);
  
  // Animation
  useFrame((state) => {
    if (!starsGroup.current || !starPositions) return;
    
    const time = state.clock.getElapsedTime() * 0.1;
    
    // Update canvas bounds for accurate mouse position
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas.getBoundingClientRect();
    }
    
    // Calculate normalized mouse coordinates
    let normalizedMouseX = 0;
    let normalizedMouseY = 0;
    
    if (canvasRef.current) {
      // Ensure mouse position is relative to the canvas
      const relativeMouseX = mouseX - (canvasRef.current.left || 0);
      const relativeMouseY = mouseY - (canvasRef.current.top || 0);
      
      // Normalize to range [-1, 1]
      normalizedMouseX = (relativeMouseX / canvasRef.current.width) * 2 - 1;
      normalizedMouseY = -(relativeMouseY / canvasRef.current.height) * 2 + 1;
    }
    
    // Update cursor position if showing cursor
    if (cursorMesh.current && showCursor) {
      cursorMesh.current.position.x = normalizedMouseX * 15;
      cursorMesh.current.position.y = normalizedMouseY * 15;
      cursorMesh.current.position.z = 0.5;
      cursorMesh.current.visible = true;
    } else if (cursorMesh.current) {
      cursorMesh.current.visible = false;
    }
    
    // Apply subtle animations to star positions
    for (let i = 0; i < count; i++) {
      const meshStar = starsGroup.current.children[i] as THREE.Mesh;
      if (!meshStar) continue;
      
      const x = starPositions[i * 3];
      const y = starPositions[i * 3 + 1];
      const z = starPositions[i * 3 + 2];
      
      // Set base position
      meshStar.position.set(x, y, z);
      
      // Calculate distance from cursor (with reduced multiplier for less dramatic effect)
      const mouseInfluenceX = normalizedMouseX * 10; // Reduced from 15
      const mouseInfluenceY = normalizedMouseY * 10; // Reduced from 15
      
      const distanceToMouse = Math.sqrt(
        Math.pow(x - mouseInfluenceX, 2) + 
        Math.pow(y - mouseInfluenceY, 2)
      );
      
      // Much more subtle animation for stars
      if (distanceToMouse < 8) { // Increased range but smaller effect
        // Stars close to cursor move away slightly
        const dx = x - mouseInfluenceX;
        const dy = y - mouseInfluenceY;
        const angle = Math.atan2(dy, dx);
        // Greatly reduced force for subtler movement
        const force = (8 - distanceToMouse) * 0.01; // Reduced from 0.05 to 0.01
        
        meshStar.position.x += Math.cos(angle) * force;
        meshStar.position.y += Math.sin(angle) * force;
        
        // Make stars close to cursor rotate slightly
        meshStar.rotation.z += 0.01;
      }
      
      // Subtle floating effect
      meshStar.position.z += Math.sin(time * 2 + i) * 0.003; // Reduced movement
      
      // Subtle rotation for twinkling effect
      meshStar.rotation.z = time * 0.1 + i;
      
      // Subtle scale pulsing
      const originalScale = starSizes?.[i] || 0.2; // Add null check with default value
      const pulseFactor = 0.05 * Math.sin(time * 3 + i * 2) + 1;
      meshStar.scale.set(
        originalScale * pulseFactor,
        originalScale * pulseFactor,
        1
      );
    }
  });
  
  // Render star instances
  return (
    <>
      <group ref={starsGroup}>
        {starPositions && starColors && starSizes && Array.from({ length: count }).map((_, i) => (
          <mesh key={i} position={[
            starPositions[i * 3],
            starPositions[i * 3 + 1],
            starPositions[i * 3 + 2]
          ]}>
            <primitive object={starGeometry.clone()} attach="geometry" />
            <meshBasicMaterial 
              color={new THREE.Color(
                starColors[i * 3],
                starColors[i * 3 + 1],
                starColors[i * 3 + 2]
              )}
              transparent
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
      
      {/* Cursor visualization */}
      <mesh ref={cursorMesh} position={[0, 0, 0.5]} visible={showCursor}>
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

export default function StarsBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // For forcing re-renders

  // Setup debug mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize debug mode
      if (!window.__DEBUG_MODE__) {
        window.__DEBUG_MODE__ = {
          showCursor: localStorage.getItem('debugCursor') === 'true',
          logging: false
        };
      }
      
      // Add key handler for debug mode toggling
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
          window.__DEBUG_MODE__!.showCursor = !window.__DEBUG_MODE__!.showCursor;
          localStorage.setItem('debugCursor', window.__DEBUG_MODE__!.showCursor.toString());
          setShowCursor(window.__DEBUG_MODE__!.showCursor);
        };
        
        // Initialize state from window.__DEBUG_MODE__
        setShowCursor(window.__DEBUG_MODE__!.showCursor);
      }
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  
  // Effect for mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Store the actual mouse coordinates for the component to use
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    // Handle window resize to reset canvas bounds
    const handleResize = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // Reset the canvas
        canvas.dispatchEvent(new Event('resize'));
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Force update when theme changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [isDarkMode]);

  return (
    <div 
      ref={ref} 
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <Canvas
        key={`canvas-${isDarkMode}-${forceUpdate}`} // Force canvas recreation on theme change
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 50], fov: 60 }}
      >
        <StarField
          count={1000}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isDarkMode={isDarkMode}
          showCursor={showCursor}
        />
      </Canvas>
    </div>
  );
} 