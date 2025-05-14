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
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    u_color1: { value: new THREE.Color(isDarkMode ? '#555555' : '#678D58') },
    u_color2: { value: new THREE.Color(isDarkMode ? '#1A1A1F' : '#F3F5F0') },
    u_accent: { value: new THREE.Color(isDarkMode ? '#ffffff' : '#557153') },
    u_pattern_scale: { value: 60.0 },
    u_noise_scale: { value: 3.0 },
    u_noise_time: { value: 0.0 },
    u_dither_size: { value: 6.0 }
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

    // Improved noise function for better visual pattern
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      
      // Smoother interpolation
      f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Ordered dithering function with modified pattern
    bool dither(vec2 pos, float value) {
      // 4x4 Bayer matrix for more aesthetic dithering
      const float bayerMatrix[16] = float[16](
        0.0/16.0, 8.0/16.0, 2.0/16.0, 10.0/16.0,
        12.0/16.0, 4.0/16.0, 14.0/16.0, 6.0/16.0,
        3.0/16.0, 11.0/16.0, 1.0/16.0, 9.0/16.0,
        15.0/16.0, 7.0/16.0, 13.0/16.0, 5.0/16.0
      );
      
      int x = int(mod(pos.x, 4.0));
      int y = int(mod(pos.y, 4.0));
      float threshold = bayerMatrix[y * 4 + x];
      
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
      
      // Distance from mouse - improved calculation for better tracking
      float mouseDist = length(position - vec2(mousePos.x, -mousePos.y));
      
      // Base pattern with moving noise and better visual texture
      float n = noise(position * u_pattern_scale + vec2(u_noise_time, u_noise_time * 0.5));
      float n2 = noise(position * u_pattern_scale * 0.5 - vec2(u_noise_time * 0.3, u_noise_time * 0.7));
      float basePattern = mix(n, n2, 0.3); // Blend two noise patterns for better texture
      
      // Stronger and closer waves emanating from mouse
      float wave = sin(mouseDist * 20.0 - u_time * 2.0) * 0.5 + 0.5;
      wave *= smoothstep(0.3, 0.0, mouseDist); // Even more concentrated effect at cursor
      
      // Combine noise with mouse interaction
      float pattern = basePattern * 0.3 + wave * 2.0; // Increase wave influence
      
      // Apply dithering at different scales for better visual
      vec2 ditherPos = gl_FragCoord.xy / u_dither_size;
      bool dith = dither(ditherPos, pattern);
      
      // Choose color based on dithering
      vec3 color = dith ? u_color1 : u_color2;
      
      // Add stronger and more concentrated accent color near mouse
      float mouseHighlight = smoothstep(0.15, 0.0, mouseDist); // Smaller radius for more concentrated effect
      color = mix(color, u_accent, mouseHighlight * 1.2); // Stronger accent influence
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Vertex shader
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Create a new shader material when dark mode changes
  useEffect(() => {
    if (!meshRef.current) return;
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: timeRef.current },
        u_resolution: { value: new THREE.Vector2() },
        u_mouse: { value: new THREE.Vector2() },
        u_color1: { value: new THREE.Color(isDarkMode ? '#555555' : '#678D58') },
        u_color2: { value: new THREE.Color(isDarkMode ? '#1A1A1F' : '#F3F5F0') },
        u_accent: { value: new THREE.Color(isDarkMode ? '#ffffff' : '#557153') },
        u_pattern_scale: { value: 60.0 },
        u_noise_scale: { value: 3.0 },
        u_noise_time: { value: timeRef.current * 0.2 },
        u_dither_size: { value: 6.0 }
      }
    });
    
    materialRef.current = material;
    meshRef.current.material = material;
  }, [isDarkMode, vertexShader, fragmentShader]);

  // Update canvas reference and animation loop
  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Update time uniform
    timeRef.current += 0.01;
    materialRef.current.uniforms.u_time.value = timeRef.current;
    materialRef.current.uniforms.u_noise_time.value = timeRef.current * 0.2;
    
    // Update canvas bounds for accurate mouse position
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvasRef.current = canvas.getBoundingClientRect();
      materialRef.current.uniforms.u_resolution.value.set(canvas.width, canvas.height);
    }
    
    // Calculate relative mouse position in canvas pixel coordinates
    const relativeMouseX = mouseX;
    const relativeMouseY = mouseY;
    
    // Update mouse uniform - fix the offset by adjusting the position
    if (canvasRef.current && materialRef.current) {
      materialRef.current.uniforms.u_mouse.value.set(
        relativeMouseX, 
        canvasRef.current.height - relativeMouseY
      );
    }
    
    // Update cursor position if showing
    if (cursorRef.current && showCursor) {
      // Get screen size to handle scaling on 4K displays
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      
      // Normalize mouse coordinates to [-1, 1] with screen size awareness
      const normalizedMouseX = (mouseX / canvasWidth) * 2 - 1;
      const normalizedMouseY = -(mouseY / canvasHeight) * 2 + 1;
      
      // Adjust position scaling for different screen sizes
      const scaleFactorX = Math.max(5, canvasWidth / 400);
      const scaleFactorY = Math.max(3, canvasHeight / 400);
      
      cursorRef.current.position.x = normalizedMouseX * scaleFactorX;
      cursorRef.current.position.y = normalizedMouseY * scaleFactorY;
      cursorRef.current.position.z = 0.2;
      cursorRef.current.visible = true;
    } else if (cursorRef.current) {
      cursorRef.current.visible = false;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[100, 80]} />
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
          color={isDarkMode ? '#ffffff' : '#ff0000'} 
          emissive={isDarkMode ? '#ffffff' : '#ff6666'}
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
  
  // Check dark mode from localStorage and listen for theme changes
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true' ||
          document.documentElement.classList.contains('dark');
        setIsDarkMode(darkModeEnabled);
      }
    };
    
    // Initial check
    checkDarkMode();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        checkDarkMode();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a MutationObserver to catch theme changes in the DOM
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
    
    // Add event listener for custom theme change event
    window.addEventListener('themeChange', checkDarkMode);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', checkDarkMode);
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