'use client';

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../providers/ThemeProvider';

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

// Move shader definitions outside component to prevent recreation
const VERTEX_SHADER = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
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

// Memoized color values to prevent recreation
const getThemeColors = (isDarkMode: boolean) => ({
  color1: new THREE.Color(isDarkMode ? '#555555' : '#678D58'),
  color2: new THREE.Color(isDarkMode ? '#1A1A1F' : '#F3F5F0'),
  accent: new THREE.Color(isDarkMode ? '#FFC4DD' : '#557153')
});

// Dithering pattern background
const DitherPattern = React.memo(({ 
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
  const mousePositionRef = useRef({ x: 0, y: 0 });
  
  // Memoize theme colors
  const themeColors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);
  
  // Memoize uniforms
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    u_color1: { value: themeColors.color1 },
    u_color2: { value: themeColors.color2 },
    u_accent: { value: themeColors.accent },
    u_pattern_scale: { value: 60.0 },
    u_noise_scale: { value: 3.0 },
    u_noise_time: { value: 0.0 },
    u_dither_size: { value: 6.0 }
  }), [themeColors]);

  // Update colors when theme changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_color1.value = themeColors.color1;
      materialRef.current.uniforms.u_color2.value = themeColors.color2;
      materialRef.current.uniforms.u_accent.value = themeColors.accent;
    }
  }, [themeColors]);

  // Create shader material once
  useEffect(() => {
    if (!meshRef.current) return;
    
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        u_time: { value: timeRef.current },
        u_resolution: { value: new THREE.Vector2() },
        u_mouse: { value: new THREE.Vector2() },
        u_color1: { value: themeColors.color1 },
        u_color2: { value: themeColors.color2 },
        u_accent: { value: themeColors.accent },
        u_pattern_scale: { value: 60.0 },
        u_noise_scale: { value: 3.0 },
        u_noise_time: { value: timeRef.current * 0.2 },
        u_dither_size: { value: 6.0 }
      }
    });
    
    materialRef.current = material;
    meshRef.current.material = material;
  }, []); // Only create once, let color updates happen separately

  // Debounced mouse position update
  useEffect(() => {
    mousePositionRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  // Update canvas reference and animation loop
  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    
    // Update time uniform
    timeRef.current += 0.01;
    materialRef.current.uniforms.u_time.value = timeRef.current;
    materialRef.current.uniforms.u_noise_time.value = timeRef.current * 0.2;
    
    // Update canvas bounds less frequently
    const canvas = document.querySelector('canvas');
    if (canvas && (!canvasRef.current || timeRef.current % 60 === 0)) {
      canvasRef.current = canvas.getBoundingClientRect();
      (materialRef.current.uniforms.u_resolution.value as THREE.Vector2).set(canvas.width, canvas.height);
    }
    
    // Calculate normalized mouse position
    if (canvasRef.current && materialRef.current) {
      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const relativeMouseX = mouseX - (canvasRef.current.left || 0);
      const relativeMouseY = mouseY - (canvasRef.current.top || 0);
      
      // Update mouse uniform - y needs to be flipped in WebGL
      (materialRef.current.uniforms.u_mouse.value as THREE.Vector2).set(
        relativeMouseX, 
        canvasRef.current.height - relativeMouseY
      );
      
      // Update debug cursor with normalized coordinates
      if (cursorRef.current && showCursor && canvasRef.current.width > 0) {
        const normalizedX = (relativeMouseX / canvasRef.current.width) * 2 - 1;
        const normalizedY = -(relativeMouseY / canvasRef.current.height) * 2 + 1;
        
        cursorRef.current.position.x = normalizedX * 5;
        cursorRef.current.position.y = normalizedY * 5;
        cursorRef.current.position.z = 0.2;
        cursorRef.current.visible = true;
      } else if (cursorRef.current) {
        cursorRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[100, 80]} />
        <shaderMaterial
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
        />
      </mesh>
      
      {/* Debug cursor */}
      <mesh ref={cursorRef} position={[0, 0, 0.2]} visible={showCursor}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={isDarkMode ? '#FFC4DD' : '#ff0000'} 
          emissive={isDarkMode ? '#FFC4DD' : '#ff6666'}
          emissiveIntensity={0.8}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </>
  );
});

DitherPattern.displayName = 'DitherPattern';

export default function DitherBackground() {
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
      
      setShowCursor(window.__DEBUG_MODE__.showCursor);
      
      // Add key handler for debug mode toggling
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
          window.__DEBUG_MODE__!.showCursor = !window.__DEBUG_MODE__!.showCursor;
          localStorage.setItem('debugCursor', window.__DEBUG_MODE__!.showCursor.toString());
          setShowCursor(window.__DEBUG_MODE__!.showCursor);
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
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
    >
      <Canvas
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <DitherPattern
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isDarkMode={isDarkMode}
          showCursor={showCursor}
        />
      </Canvas>
    </div>
  );
} 