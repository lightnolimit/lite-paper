'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';
import FileTree from '../../components/FileTree';
import ContentRenderer from '../../components/ContentRenderer';
import { documentationTree, documentationContent } from '../../data/documentation';
import { FileItem } from '../../components/FileTree';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentationPage() {
  const params = useParams<{ slug?: string[] }>();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [sidebarVisible, setSidebarVisible] = useState(true); // Always show sidebar by default
  const [backgroundType, setBackgroundType] = useState<string>('wave');
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to load the saved background preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the background type from localStorage if available
      const savedBackground = localStorage.getItem('backgroundType');
      
      // Use the saved value or fall back to the env var or default
      const envDefault = process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave';
      if (savedBackground === 'wave' || savedBackground === 'stars') {
        setBackgroundType(savedBackground);
      } else {
        setBackgroundType(envDefault);
      }
      
      // Set initial mobile state
      setIsMobile(window.innerWidth < 768);
    }
  }, []);
  
  // Dynamically import the correct background component
  const BackgroundComponent = dynamic(() => 
    backgroundType === 'stars' 
      ? import('../../components/StarsBackground')
      : backgroundType === 'dither'
        ? import('../../components/DitherBackground') 
        : import('../../components/WaveBackground'),
    { ssr: false }
  );
  
  useEffect(() => {
    // Set default path if none provided
    if (!params.slug || params.slug.length === 0) {
      setCurrentPath('introduction/synopsis');
    } else {
      setCurrentPath(params.slug.join('/'));
    }
  }, [params]);
  
  useEffect(() => {
    if (currentPath && documentationContent[currentPath]) {
      setContent(documentationContent[currentPath]);
    } else {
      setContent('# Not Found\n\nThe requested documentation page could not be found.');
    }
    
    // On mobile, close sidebar when a document is selected
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  }, [currentPath]);
  
  // Handle mobile behavior for sidebar based on screen size
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (!mobile) {
        setSidebarVisible(true); // Always visible on desktop
      } else if (mobile && sidebarVisible) {
        setSidebarVisible(false); // Hide on mobile by default
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarVisible]);
  
  const handleSelectFile = (item: FileItem) => {
    if (item.type === 'file') {
      setCurrentPath(item.path);
      
      // Use Next.js router for client-side navigation without animation for seamless experience
      router.push(`/docs/${item.path}`, { scroll: false });
      
      // Close sidebar on mobile after selection
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setSidebarVisible(false);
      }
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col">
      <BackgroundComponent />
      <Navigation />
      
      <div className="w-full flex flex-1 z-10 pt-16">
        {/* Mobile sidebar toggle button */}
        <div className="md:hidden fixed bottom-4 left-4 z-30">
          <button 
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="rounded-full p-3 shadow-lg"
            style={{ 
              backgroundColor: 'var(--primary-color)', 
              color: 'var(--background-color)' 
            }}
            aria-label="Toggle sidebar"
            tabIndex={0}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={sidebarVisible 
                  ? "M6 18L18 6M6 6l12 12" 
                  : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                } 
              />
            </svg>
          </button>
        </div>
        
        <div className="flex w-full">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarVisible && (
              <motion.aside 
                initial={{ 
                  opacity: isMobile ? 0 : 1, 
                  x: isMobile ? -100 : 0,
                  position: isMobile ? 'fixed' : 'sticky', 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  position: isMobile ? 'fixed' : 'sticky', 
                }}
                exit={{ 
                  opacity: isMobile ? 0 : 1, 
                  x: isMobile ? -100 : 0,
                  position: isMobile ? 'fixed' : 'sticky',
                }}
                transition={{
                  duration: isMobile ? 0.3 : 0
                }}
                className="w-[90%] md:w-72 lg:w-80 shrink-0 doc-card file-tree-panel p-4 h-[calc(100vh-64px)] top-16 overflow-y-auto z-20 border-r scrollbar-hide"
                style={{
                  left: isMobile ? '0' : 'auto',
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  overflowY: 'auto',
                  msOverflowStyle: 'none',  /* IE and Edge */
                  scrollbarWidth: 'none',  /* Firefox */
                }}
              >
                <FileTree 
                  items={documentationTree} 
                  onSelect={handleSelectFile}
                  currentPath={currentPath}
                />
              </motion.aside>
            )}
          </AnimatePresence>
          
          {/* Content */}
          <div 
            className={`flex-1 py-8 px-6 md:px-8 lg:px-16 ${
              sidebarVisible && isMobile ? 'opacity-50' : 'opacity-100'
            }`}
          >
            <div className="max-w-6xl mx-auto">
              <ContentRenderer content={content} path={currentPath} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 