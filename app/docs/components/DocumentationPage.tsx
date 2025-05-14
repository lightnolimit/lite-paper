'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';
import FileTree from '../../components/FileTree';
import ContentRenderer from '../../components/ContentRenderer';
import { documentationTree } from '../../data/documentation';
import { FileItem } from '../../components/FileTree';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentationPageProps {
  initialContent: string;
  currentPath: string;
}

export default function DocumentationPage({ initialContent, currentPath }: DocumentationPageProps) {
  const router = useRouter();
  const [content, setContent] = useState<string>(initialContent);
  const [path, setPath] = useState<string>(currentPath);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Default to hidden on mobile, shown on desktop
  const [backgroundType, setBackgroundType] = useState<string>('wave');
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to load the saved background preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get the background type from localStorage if available
      const savedBackground = localStorage.getItem('backgroundType');
      
      // Use the saved value or fall back to the env var or default
      const envDefault = process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave';
      const validBackgrounds = ['wave', 'stars', 'dither', 'solid'];
      
      if (savedBackground && validBackgrounds.includes(savedBackground)) {
        setBackgroundType(savedBackground);
      } else {
        setBackgroundType(envDefault);
      }
      
      // Set initial mobile state
      setIsMobile(window.innerWidth < 768);
      // Set initial sidebar state based on screen size
      setSidebarVisible(window.innerWidth >= 768);
    }
  }, []);
  
  // Update content when initialContent or currentPath changes
  useEffect(() => {
    setContent(initialContent);
    setPath(currentPath);
  }, [initialContent, currentPath]);
  
  // Dynamically import the correct background component
  const BackgroundComponent = dynamic(() => {
    switch (backgroundType) {
      case 'stars':
        return import('../../components/StarsBackground');
      case 'dither':
        return import('../../components/DitherBackground');
      case 'solid':
        return import('../../components/SolidBackground');
      default:
        return import('../../components/WaveBackground');
    }
  }, { ssr: false });
  
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
  
  // Handle sidebar layout clicks
  useEffect(() => {
    // For mobile, add a click handler to close sidebar when clicking outside
    if (typeof window === 'undefined') return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobile && sidebarVisible) {
        const sidebarEl = document.querySelector('.file-tree-panel');
        const target = e.target as Node;
        if (sidebarEl && !sidebarEl.contains(target)) {
          setSidebarVisible(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMobile, sidebarVisible]);
  
  const handleSelectFile = (item: FileItem) => {
    if (item.type === 'file') {
      // Use Next.js router for client-side navigation without animation
      router.push(`/docs/${item.path}`, { scroll: false });
      
      // Close sidebar on mobile after selection
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setSidebarVisible(false);
      }
    }
  };
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  
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
                className="w-full md:w-72 lg:w-80 shrink-0 doc-card file-tree-panel p-4 h-[calc(100vh-64px)] top-16 overflow-y-auto z-20 border-r scrollbar-hide"
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
          <div 
            className={`flex-1 py-8 px-6 md:px-8 lg:px-16 ${
              sidebarVisible && isMobile ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {/* Mobile file tree toggle button - only visible on mobile when sidebar is hidden */}
            {isMobile && !sidebarVisible && (
              <motion.button
                onClick={toggleSidebar}
                className="fixed z-30 bottom-6 left-6 rounded p-3 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                aria-label="Show documentation tree"
                style={{ 
                  backgroundColor: 'var(--background-color)', 
                  borderColor: 'var(--border-color)',
                  border: '1px solid'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                  style={{ color: 'var(--text-color)' }}
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
              <ContentRenderer content={content} path={path} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 