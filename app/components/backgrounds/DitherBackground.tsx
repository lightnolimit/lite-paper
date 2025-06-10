import React, { useEffect, useRef } from 'react';
import { componentLogger } from '../../utils/logger';

const DitherBackground: React.FC = () => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const animationRef = useRef<number | null>(null);
  const throttledMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize scene and start animation loop
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) {
      componentLogger.warn('Scene components not initialized, skipping render setup');
      return;
    }

    componentLogger.debug('Setting up render loop');
    
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;
      
      // Update uniforms with throttled mouse position and time
      const material = materialRef.current;
      if (material && material.uniforms) {
        material.uniforms.u_time.value = performance.now() * 0.001;
        material.uniforms.u_mouse.value.set(
          throttledMousePos.current.x / window.innerWidth,
          1.0 - (throttledMousePos.current.y / window.innerHeight)
        );
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [throttledMousePos]);

  // Handle window resize with cleanup
  useEffect(() => {
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      
      const container = containerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      rendererRef.current.setSize(width, height);
      
      const material = materialRef.current;
      if (material && material.uniforms) {
        material.uniforms.u_resolution.value.set(width, height);
      }
    };

    // Debounced resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {/* Render content here */}
    </div>
  );
};

export default DitherBackground; 