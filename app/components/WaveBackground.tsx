'use client';

import React, { useRef, useEffect, useState } from 'react';
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

// Wave animation with interactive cursor, like nyko.cool
type WavesProps = {
  mouseX: number;
  mouseY: number;
  isDarkMode: boolean;
  showCursor?: boolean;
};

const Waves = ({ mouseX, mouseY, isDarkMode, showCursor = false }: WavesProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<DOMRect | null>(null);

  // Parameters for the grid
  const numLines = 72; // Even more vertical lines for thinner gaps
  const pointsPerLine = 100; // More points per line for smoother lines
  const width = 40;
  const height = 20;

  // Store original Y positions for elasticity
  const originalYPositions = useRef<number[][]>([]);

  // Initialize lines and store original Y positions
  useEffect(() => {
    if (!groupRef.current) return;
    originalYPositions.current = [];
    for (let i = 0; i < numLines; i++) {
      const y = (i / (numLines - 1) - 0.5) * height;
      const linePoints: number[] = [];
      for (let j = 0; j < pointsPerLine; j++) {
        linePoints.push(y);
      }
      originalYPositions.current.push(linePoints);
    }

    // Get canvas element bounds for accurate mouse positioning
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas.getBoundingClientRect();
    }
  }, []);

  // Animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Update canvas bounds on each frame for maximum accuracy
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas.getBoundingClientRect();
    }

    // Calculate normalized mouse coordinates
    let normalizedMouseX = 0;
    let normalizedMouseY = 0;
    
    if (canvasRef.current) {
      // Get mouse position relative to canvas
      const relativeMouseX = mouseX - (canvasRef.current.left || 0);
      const relativeMouseY = mouseY - (canvasRef.current.top || 0);
      
      // Normalize to range [-1, 1]
      normalizedMouseX = (relativeMouseX / canvasRef.current.width) * 2 - 1;
      normalizedMouseY = -(relativeMouseY / canvasRef.current.height) * 2 + 1;
    }

    // Update cursor position if showing cursor
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
    // Animate each line
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
        let elastic = Math.sin(y * 0.25 + time * 1.1) * 0.22;
        // Cursor influence (elastic strum + reverberation)
        const mouseYWorld = normalizedMouseY * (height / 2);
        const distToCursor = Math.sqrt(
          Math.pow(y - mouseYWorld, 2) + Math.pow(x - mouseXWorld, 2)
        );
        if (distToCursor < 1.2) { // More precise, smaller threshold
          // Strong elastic burst, only for the closest line/point
          const strum = Math.sin(time * 10 - distToCursor * 2) * (1 - distToCursor / 1.2) * 2.2 * lineReverbStrength;
          elastic += strum;
        }
        positions[j * 3 + 0] = x + elastic; // Only X is animated
      }
      geometry.attributes.position.needsUpdate = true;
    });
  });

  // Create vertical lines
  const lines = [];
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
        <lineBasicMaterial attach="material" color={isDarkMode ? '#FF85A1' : '#678D58'} linewidth={2} />
      </line>
    );
  }

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
};

export default function WaveBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  
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
        // Reset the canvasRef in the Waves component
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
  
  return (
    <div 
      ref={ref} 
      className="fixed inset-0 z-0 pointer-events-none"
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