'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';
import FileTree from '../../components/FileTree';
import ContentRenderer from '../../components/ContentRenderer';
import DocumentationGraph from '../../components/DocumentationGraph';
import { documentationTree } from '../../data/documentation';
import { FileItem } from '../../components/FileTree';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentationPageProps {
  initialContent: string;
  currentPath: string;
}

// Memoized dynamic imports to prevent recreating on every render
const BackgroundComponents = {
  wave: dynamic(() => import('../../components/WaveBackground'), { ssr: false }),
  stars: dynamic(() => import('../../components/StarsBackground'), { ssr: false }),
  dither: dynamic(() => import('../../components/DitherBackground'), { ssr: false }),
  solid: dynamic(() => import('../../components/SolidBackground'), { ssr: false })
};

const DocumentationPage = React.memo(({ initialContent, currentPath }: DocumentationPageProps) => {
  const router = useRouter();
  const [content, setContent] = useState<string>(initialContent);
  const [path, setPath] = useState<string>(currentPath);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [backgroundType, setBackgroundType] = useState<string>('wave');
  const [isMobile, setIsMobile] = useState(false);
  const [graphViewVisible, setGraphViewVisible] = useState(false);
  
  // Memoized animation variants
  const sidebarAnimationVariants = useMemo(() => ({
    mobile: {
      initial: { opacity: 0, x: -100, position: 'fixed' as const },
      animate: { opacity: 1, x: 0, position: 'fixed' as const },
      exit: { opacity: 0, x: -100, position: 'fixed' as const }
    },
    desktop: {
      initial: { opacity: 1, x: 0, position: 'sticky' as const },
      animate: { opacity: 1, x: 0, position: 'sticky' as const },
      exit: { opacity: 1, x: 0, position: 'sticky' as const }
    }
  }), []);

  // Memoized transition config
  const transitionConfig = useMemo(() => ({
    duration: 0.3
  }), []);

  // Memoized button animation config
  const buttonAnimationConfig = useMemo(() => ({
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.2 }
  }), []);

  // Effect to initialize component state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize mobile state and sidebar visibility
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSidebarVisible(!mobile); // Show on desktop, hide on mobile by default
    
    // Load background preference
    const savedBackground = localStorage.getItem('backgroundType');
    const envDefault = process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave';
    const validBackgrounds = ['wave', 'stars', 'dither', 'solid'];
    
    if (savedBackground && validBackgrounds.includes(savedBackground)) {
      setBackgroundType(savedBackground);
    } else {
      setBackgroundType(envDefault);
    }
  }, []);
  
  // Update content when initialContent or currentPath changes
  useEffect(() => {
    setContent(initialContent);
    setPath(currentPath);
  }, [initialContent, currentPath]);

  // Listen for graph view toggle events
  useEffect(() => {
    const handleGraphViewToggle = () => {
      setGraphViewVisible(!graphViewVisible);
    };

    window.addEventListener('toggleGraphView', handleGraphViewToggle);
    return () => window.removeEventListener('toggleGraphView', handleGraphViewToggle);
  }, [graphViewVisible]);
  
  // Memoized background component selection
  const BackgroundComponent = useMemo(() => {
    return BackgroundComponents[backgroundType as keyof typeof BackgroundComponents] || BackgroundComponents.wave;
  }, [backgroundType]);
  
  // Optimized resize handler with useCallback
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    // Auto-show on desktop, auto-hide on mobile
    if (!mobile) {
      setSidebarVisible(true);
    } else if (mobile && sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [sidebarVisible]);

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
  
  // Optimized outside click handler with useCallback
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const sidebarEl = document.querySelector('.file-tree-panel');
    const target = e.target as Node;
    if (sidebarEl && !sidebarEl.contains(target)) {
      setSidebarVisible(false);
    }
  }, []);

  // Handle outside clicks on mobile
  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile || !sidebarVisible) return;
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobile, sidebarVisible, handleOutsideClick]);
  
  // Optimized file selection handler
  const handleSelectFile = useCallback((item: FileItem) => {
    if (item.type === 'file') {
      router.push(`/docs/${item.path}`, { scroll: false });
      
      // Close sidebar on mobile after selection
      if (isMobile) {
        setSidebarVisible(false);
      }
    }
  }, [router, isMobile]);
  
  // Optimized sidebar toggle function
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible);
  }, [sidebarVisible]);

  // Memoized style objects
  const sidebarStyle = useMemo(() => ({
    left: isMobile ? '0' : 'auto',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    overflowY: 'auto' as const,
  }), [isMobile]);

  const contentOpacityClass = useMemo(() => 
    sidebarVisible && isMobile ? 'opacity-50' : 'opacity-100'
  , [sidebarVisible, isMobile]);

  const buttonStyle = useMemo(() => ({
    backgroundColor: 'var(--background-color)', 
    borderColor: 'var(--border-color)',
    border: '1px solid'
  }), []);

  const iconStyle = useMemo(() => ({
    color: 'var(--text-color)'
  }), []);
  
  return (
    <main className="flex min-h-screen flex-col">
      <BackgroundComponent />
      <Navigation docsPath={path} onToggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />
      
      <div className="w-full flex flex-1 z-10 pt-16">
        <div className="flex w-full">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarVisible && (
              <motion.aside 
                initial={isMobile ? sidebarAnimationVariants.mobile.initial : sidebarAnimationVariants.desktop.initial}
                animate={isMobile ? sidebarAnimationVariants.mobile.animate : sidebarAnimationVariants.desktop.animate}
                exit={isMobile ? sidebarAnimationVariants.mobile.exit : sidebarAnimationVariants.desktop.exit}
                transition={isMobile ? transitionConfig : { duration: 0 }}
                className="w-full md:w-72 lg:w-80 shrink-0 doc-card file-tree-panel p-4 h-[calc(100vh-64px)] top-16 overflow-y-auto z-20 border-r scrollbar-hide"
                style={sidebarStyle}
              >
                <div className="flex justify-between items-center mb-3 md:hidden">
                  <div></div>
                  <button 
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close sidebar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FileTree 
                  items={documentationTree} 
                  onSelect={handleSelectFile}
                  currentPath={path}
                />
              </motion.aside>
            )}
          </AnimatePresence>
          
          {/* Content */}
          <div className={`flex-1 py-8 px-6 md:px-8 lg:px-16 ${contentOpacityClass}`}>
            {/* Mobile file tree toggle button - only visible on mobile when sidebar is hidden */}
            {isMobile && !sidebarVisible && (
              <motion.button
                onClick={toggleSidebar}
                className="fixed z-30 bottom-6 left-6 rounded p-3 shadow-lg"
                {...buttonAnimationConfig}
                aria-label="Show documentation tree"
                style={buttonStyle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={iconStyle}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                  />
                </svg>
              </motion.button>
            )}
            
            <div className="max-w-6xl mx-auto">
              {graphViewVisible ? (
                <DocumentationGraph 
                  currentPath={path}
                  onNodeClick={(nodePath) => {
                    router.push(`/docs/${nodePath}`, { scroll: false });
                  }}
                  className="w-full"
                />
              ) : (
                <ContentRenderer content={content} path={path} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
});

DocumentationPage.displayName = 'DocumentationPage';

export default DocumentationPage; 