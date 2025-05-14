'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Debug state management
type DebugState = {
  showCursor: boolean;
  logging: boolean;
};

// Global debug state
declare global {
  interface Window {
    __DEBUG_MODE__?: DebugState;
  }
}

// Dithering pattern background
const DitherPattern = ({ 
  mouseX, 
  mouseY, 
  isDarkMode, 
  showCursor = false 
}: { 
  mouseX: number, 
  mouseY: number, 
  isDarkMode: boolean,
  showCursor?: boolean
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cursorRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<DOMRect | null>(null);
  const timeRef = useRef(0);
  
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    u_color1: { value: new THREE.Color(isDarkMode ? '#FF85A1' : '#678D58') },
    u_color2: { value: new THREE.Color(isDarkMode ? '#1A1A1F' : '#F3F5F0') },
    u_accent: { value: new THREE.Color(isDarkMode ? '#FF4989' : '#557153') },
    u_pattern_scale: { value: 100.0 },
    u_noise_scale: { value: 2.0 },
    u_noise_time: { value: 0.0 },
    u_dither_size: { value: 8.0 }
  }), [isDarkMode]);

  // Dithering pattern shader
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_accent;
    uniform float u_pattern_scale;
    uniform float u_noise_scale;
    uniform float u_noise_time;
    uniform float u_dither_size;

    // Simple hash function
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Noise function
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f); // Smooth interpolation
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Ordered dithering function
    bool dither(vec2 pos, float value) {
      // 8x8 Bayer matrix for ordered dithering
      const float bayerMatrix[64] = float[64](
        0.0/64.0, 32.0/64.0, 8.0/64.0, 40.0/64.0, 2.0/64.0, 34.0/64.0, 10.0/64.0, 42.0/64.0,
        48.0/64.0, 16.0/64.0, 56.0/64.0, 24.0/64.0, 50.0/64.0, 18.0/64.0, 58.0/64.0, 26.0/64.0,
        12.0/64.0, 44.0/64.0, 4.0/64.0, 36.0/64.0, 14.0/64.0, 46.0/64.0, 6.0/64.0, 38.0/64.0,
        60.0/64.0, 28.0/64.0, 52.0/64.0, 20.0/64.0, 62.0/64.0, 30.0/64.0, 54.0/64.0, 22.0/64.0,
        3.0/64.0, 35.0/64.0, 11.0/64.0, 43.0/64.0, 1.0/64.0, 33.0/64.0, 9.0/64.0, 41.0/64.0,
        51.0/64.0, 19.0/64.0, 59.0/64.0, 27.0/64.0, 49.0/64.0, 17.0/64.0, 57.0/64.0, 25.0/64.0,
        15.0/64.0, 47.0/64.0, 7.0/64.0, 39.0/64.0, 13.0/64.0, 45.0/64.0, 5.0/64.0, 37.0/64.0,
        63.0/64.0, 31.0/64.0, 55.0/64.0, 23.0/64.0, 61.0/64.0, 29.0/64.0, 53.0/64.0, 21.0/64.0
      );
      
      int x = int(mod(pos.x, 8.0));
      int y = int(mod(pos.y, 8.0));
      float threshold = bayerMatrix[y * 8 + x];
      
      return value > threshold;
    }

    void main() {
      // Normalized coordinates [0, 1]
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      
      // Aspect-corrected coordinates [-1, 1]
      vec2 position = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
      position.x *= u_resolution.x / u_resolution.y;
      
      // Normalized mouse coordinates
      vec2 mousePos = u_mouse / u_resolution.xy;
      mousePos = mousePos * 2.0 - 1.0;
      mousePos.x *= u_resolution.x / u_resolution.y;
      
      // Distance from mouse
      float mouseDist = length(position - mousePos);
      
      // Base pattern with moving noise
      float n = noise(position * u_pattern_scale + u_noise_time);
      
      // Create waves emanating from mouse
      float wave = sin(mouseDist * 10.0 - u_time * 2.0) * 0.5 + 0.5;
      wave *= smoothstep(1.0, 0.0, mouseDist * 2.0); // Fade with distance
      
      // Combine noise with mouse interaction
      float pattern = n * 0.7 + wave * 0.3;
      
      // Apply dithering at different scales
      vec2 ditherPos = gl_FragCoord.xy / u_dither_size;
      bool dith = dither(ditherPos, pattern);
      
      // Choose color based on dithering
      vec3 color = dith ? u_color1 : u_color2;
      
      // Add subtle accent color near mouse
      float mouseHighlight = smoothstep(0.3, 0.0, mouseDist);
      color = mix(color, u_accent, mouseHighlight * 0.3);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Vertex shader
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Update canvas reference and animation loop
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Update time uniform
    timeRef.current += 0.01;
    uniforms.u_time.value = timeRef.current;
    uniforms.u_noise_time.value = timeRef.current * 0.2;
    
    // Update canvas bounds for accurate mouse position
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas.getBoundingClientRect();
      uniforms.u_resolution.value.set(canvas.width, canvas.height);
    }
    
    // Calculate relative mouse position
    let relativeMouseX = mouseX;
    let relativeMouseY = mouseY;
    
    if (canvasRef.current) {
      relativeMouseX = mouseX - canvasRef.current.left;
      relativeMouseY = mouseY - canvasRef.current.top;
    }
    
    // Update mouse uniform
    uniforms.u_mouse.value.set(relativeMouseX, relativeMouseY);
    
    // Update cursor position if showing
    if (cursorRef.current && showCursor) {
      // Normalize mouse coordinates to [-1, 1]
      const canvasWidth = canvasRef.current?.width || window.innerWidth;
      const canvasHeight = canvasRef.current?.height || window.innerHeight;
      
      const normalizedMouseX = (relativeMouseX / canvasWidth) * 2 - 1;
      const normalizedMouseY = -(relativeMouseY / canvasHeight) * 2 + 1;
      
      cursorRef.current.position.x = normalizedMouseX * 5;
      cursorRef.current.position.y = normalizedMouseY * 3;
      cursorRef.current.position.z = 0.2;
      cursorRef.current.visible = true;
    } else if (cursorRef.current) {
      cursorRef.current.visible = false;
    }
  });

  // Update uniforms when dark mode changes
  useEffect(() => {
    uniforms.u_color1.value.set(isDarkMode ? '#FF85A1' : '#678D58');
    uniforms.u_color2.value.set(isDarkMode ? '#1A1A1F' : '#F3F5F0');
    uniforms.u_accent.value.set(isDarkMode ? '#FF4989' : '#557153');
  }, [isDarkMode, uniforms]);

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      
      {/* Debug cursor */}
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
    </>
  );
};

export default function DitherBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDebugCursor, setShowDebugCursor] = useState(false);
  
  // Setup debug mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for debug cursor in env or localStorage
      const debugCursorEnabled = process.env.NEXT_PUBLIC_DEBUG_CURSOR === 'true' || 
                                localStorage.getItem('debugCursor') === 'true';
      
      window.__DEBUG_MODE__ = window.__DEBUG_MODE__ || {
        showCursor: debugCursorEnabled,
        logging: process.env.NEXT_PUBLIC_DEBUG_LOGGING === 'true'
      };
      
      // Initialize state from window.__DEBUG_MODE__
      setShowDebugCursor(window.__DEBUG_MODE__.showCursor);
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
        <DitherPattern 
          mouseX={mousePos.x} 
          mouseY={mousePos.y} 
          isDarkMode={isDarkMode}
          showCursor={showDebugCursor}
        />
      </Canvas>
    </div>
  );
} 