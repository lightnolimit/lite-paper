'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navigation from '../../components/Navigation';
import FileTree from '../../components/FileTree';
import ContentRenderer from '../../components/ContentRenderer';
import { documentationTree, documentationContent } from '../../data/documentation';
import { FileItem } from '../../components/FileTree';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentationPage() {
  const params = useParams<{ slug?: string[] }>();
  const [currentPath, setCurrentPath] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [backgroundType, setBackgroundType] = useState<string>('wave');
  
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
    }
  }, []);
  
  // Dynamically import the correct background component
  const BackgroundComponent = dynamic(() => 
    backgroundType === 'stars' 
      ? import('../../components/StarsBackground') 
      : import('../../components/WaveBackground'),
    { ssr: false }
  );
  
  useEffect(() => {
    // Set default path if none provided
    if (!params.slug || params.slug.length === 0) {
      setCurrentPath('project-overview/introduction');
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
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  }, [currentPath]);
  
  // Initialize sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      setSidebarVisible(window.innerWidth >= 768);
    };
    
    // Set initial state
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleSelectFile = (item: FileItem) => {
    if (item.type === 'file') {
      setCurrentPath(item.path);
      
      // Update the URL to match the current content
      window.history.pushState({}, '', `/docs/${item.path}`);
      
      // Close sidebar on mobile after selection
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      }
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col">
      <BackgroundComponent />
      <Navigation />
      
      <div className="container max-w-5xl mx-auto px-4 md:px-6 flex flex-1 z-10">
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
        
        <div className="flex flex-col md:flex-row w-full gap-4 relative">
          {/* Sidebar - conditionally visible on mobile */}
          <AnimatePresence>
            {sidebarVisible && (
              <motion.aside 
                initial={{ 
                  opacity: 0, 
                  x: -100,
                  position: window.innerWidth < 768 ? 'fixed' : 'sticky', 
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  position: window.innerWidth < 768 ? 'fixed' : 'sticky', 
                }}
                exit={{ 
                  opacity: 0, 
                  x: -100,
                  position: window.innerWidth < 768 ? 'fixed' : 'sticky',
                }}
                className="w-[90%] md:w-64 lg:w-72 shrink-0 doc-card p-4 h-[calc(100vh-120px)] top-20 overflow-y-auto z-20"
                style={{
                  left: window.innerWidth < 768 ? '0' : 'auto',
                }}
              >
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                  Documentation
                </h2>
                <FileTree 
                  items={documentationTree} 
                  onSelect={handleSelectFile}
                  currentPath={currentPath}
                />
              </motion.aside>
            )}
          </AnimatePresence>
          
          {/* Content */}
          <div className={`flex-1 min-w-0 ${sidebarVisible && window.innerWidth < 768 ? 'opacity-50' : 'opacity-100'}`}>
            <ContentRenderer content={content} path={currentPath} />
          </div>
        </div>
      </div>
    </main>
  );
} 