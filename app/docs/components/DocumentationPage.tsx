'use client';

import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import ContentRenderer from '../../components/ContentRenderer';
import DocumentationGraph from '../../components/DocumentationGraph';
import FileTree from '../../components/FileTree';
import { FileItem } from '../../components/FileTree';
import fileTreeStyles from '../../components/FileTree.module.css';
import Navigation from '../../components/Navigation';
import { uiConfig, getMobileTogglePositionClasses } from '../../config/ui';
import { socialLinks } from '../../constants/social';
import { documentationTree } from '../../data/documentation';
import { useTheme } from '../../providers/ThemeProvider';

interface DocumentationPageProps {
  initialContent: string;
  currentPath: string;
}

const DocumentationPage = React.memo(({ initialContent, currentPath }: DocumentationPageProps) => {
  const router = useRouter();
  const { prefersReducedMotion } = useTheme();
  const [content, setContent] = useState<string>(initialContent);
  const [path, setPath] = useState<string>(currentPath);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMapVisible, setMobileMapVisible] = useState(false);

  // Handle custom event from Navigation to open mind map
  useEffect(() => {
    const handleOpenMindMap = () => {
      setMobileMapVisible(true);
    };

    window.addEventListener('openMindMap', handleOpenMindMap);
    return () => window.removeEventListener('openMindMap', handleOpenMindMap);
  }, []);

  // Memoized animation variants (disabled if motion is reduced)
  const sidebarAnimationVariants = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        mobile: {
          initial: { opacity: 0, position: 'fixed' as const },
          animate: { opacity: 1, position: 'fixed' as const },
          exit: { opacity: 0, position: 'fixed' as const },
        },
        desktop: {
          initial: { opacity: 1, position: 'sticky' as const },
          animate: { opacity: 1, position: 'sticky' as const },
          exit: { opacity: 1, position: 'sticky' as const },
        },
      };
    }
    return {
      mobile: {
        initial: { opacity: 0, x: -100, position: 'fixed' as const },
        animate: { opacity: 1, x: 0, position: 'fixed' as const },
        exit: { opacity: 0, x: -100, position: 'fixed' as const },
      },
      desktop: {
        initial: { opacity: 1, x: 0, position: 'sticky' as const },
        animate: { opacity: 1, x: 0, position: 'sticky' as const },
        exit: { opacity: 1, x: 0, position: 'sticky' as const },
      },
    };
  }, [prefersReducedMotion]);

  // Memoized transition config (faster if motion is reduced)
  const transitionConfig = useMemo(
    () => ({
      duration: prefersReducedMotion ? 0.05 : 0.3,
    }),
    [prefersReducedMotion]
  );

  // Memoized button animation config (disabled if motion is reduced)
  const buttonAnimationConfig = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0.05 },
      };
    }
    return {
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.9 },
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.2 },
    };
  }, [prefersReducedMotion]);

  // Effect to initialize component state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize mobile state and sidebar visibility
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSidebarVisible(!mobile); // Show on desktop, hide on mobile by default

    // Load right sidebar state from localStorage
    const savedRightSidebarState = localStorage.getItem('rightSidebarVisible');
    if (savedRightSidebarState !== null) {
      setRightSidebarVisible(savedRightSidebarState === 'true');
    }
  }, [currentPath]);

  // Update content when initialContent or currentPath changes
  useEffect(() => {
    setContent(initialContent);
    setPath(currentPath);
  }, [initialContent, currentPath]);

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
  const handleSelectFile = useCallback(
    (item: FileItem) => {
      if (item.type === 'file') {
        router.push(`/docs/${item.path}`);

        // Close sidebar on mobile after selection
        if (isMobile) {
          setSidebarVisible(false);
        }
      }
    },
    [router, isMobile]
  );

  // Optimized sidebar toggle function
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(!sidebarVisible);
  }, [sidebarVisible]);

  const toggleRightSidebar = useCallback(() => {
    const newState = !rightSidebarVisible;
    setRightSidebarVisible(newState);
    localStorage.setItem('rightSidebarVisible', newState.toString());
  }, [rightSidebarVisible]);

  // Memoized style objects
  const sidebarStyle = useMemo(
    () => ({
      left: isMobile ? '0' : 'auto',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      overflowY: 'auto' as const,
    }),
    [isMobile]
  );

  const contentOpacityClass = useMemo(
    () => (sidebarVisible && isMobile ? 'opacity-50' : 'opacity-100'),
    [sidebarVisible, isMobile]
  );

  const buttonStyle = useMemo(
    () => ({
      backgroundColor: 'var(--background-color)',
      borderColor: 'var(--border-color)',
      border: '1px solid',
    }),
    []
  );

  const iconStyle = useMemo(
    () => ({
      color: 'var(--text-color)',
    }),
    []
  );

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <Navigation docsPath={path} onToggleSidebar={toggleSidebar} sidebarVisible={sidebarVisible} />

      <div className="w-full flex flex-1 z-10 pt-12 overflow-hidden">
        <div className="flex w-full h-full">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarVisible && (
              <motion.aside
                initial={
                  isMobile
                    ? sidebarAnimationVariants.mobile.initial
                    : sidebarAnimationVariants.desktop.initial
                }
                animate={
                  isMobile
                    ? sidebarAnimationVariants.mobile.animate
                    : sidebarAnimationVariants.desktop.animate
                }
                exit={
                  isMobile
                    ? sidebarAnimationVariants.mobile.exit
                    : sidebarAnimationVariants.desktop.exit
                }
                transition={isMobile ? transitionConfig : { duration: 0 }}
                className={`w-full md:w-60 lg:w-64 shrink-0 ${fileTreeStyles.fileTreePanel} p-3 h-[calc(100vh-48px)] top-12 overflow-y-auto z-20 scrollbar-hide`}
                style={sidebarStyle}
              >
                {/* Mobile close button - positioned absolutely */}
                <button
                  onClick={toggleSidebar}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10 md:hidden"
                  aria-label="Close sidebar"
                >
                  <Icon icon="mingcute:close-line" className="w-4 h-4" />
                </button>
                <FileTree
                  items={documentationTree}
                  onSelect={handleSelectFile}
                  currentPath={path}
                  defaultOpenAll={isMobile}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content Area - Center Column */}
          <div className={`flex-1 h-full overflow-hidden ${contentOpacityClass} relative`}>
            {/* Mobile file tree toggle button - configurable via uiConfig */}
            {uiConfig.showMobileFileTreeToggle &&
              isMobile &&
              !sidebarVisible &&
              (prefersReducedMotion ? (
                <button
                  onClick={toggleSidebar}
                  className={`fixed z-30 ${getMobileTogglePositionClasses(uiConfig.mobileTogglePosition)} rounded p-3 shadow-lg`}
                  aria-label="Show documentation tree"
                  style={buttonStyle}
                >
                  <Icon icon="mingcute:folder-line" className="w-5 h-5" style={iconStyle} />
                  <span className="sr-only" style={{ fontFamily: 'var(--mono-font)' }}>
                    show documentation tree
                  </span>
                </button>
              ) : (
                <motion.button
                  onClick={toggleSidebar}
                  className={`fixed z-30 ${getMobileTogglePositionClasses(uiConfig.mobileTogglePosition)} rounded p-3 shadow-lg`}
                  {...buttonAnimationConfig}
                  aria-label="Show documentation tree"
                  style={buttonStyle}
                >
                  <Icon icon="mingcute:folder-line" className="w-5 h-5" style={iconStyle} />
                  <span className="sr-only" style={{ fontFamily: 'var(--mono-font)' }}>
                    show documentation tree
                  </span>
                </motion.button>
              ))}

            {/* Right sidebar toggle button - positioned absolutely */}
            <button
              onClick={toggleRightSidebar}
              className="hidden lg:flex absolute top-2 right-4 z-20 items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-300 dark:border-gray-600"
              aria-label={rightSidebarVisible ? 'Hide documentation map' : 'Show documentation map'}
            >
              <Icon
                icon={
                  rightSidebarVisible ? 'mingcute:arrow-right-line' : 'mingcute:arrow-left-line'
                }
                className="w-4 h-4"
              />
            </button>

            <ContentRenderer content={content} path={path} />
          </div>

          {/* Right Column - Documentation Graph/Mindmap */}
          <AnimatePresence>
            {rightSidebarVisible && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.05 : 0.3 }}
                className="hidden lg:block shrink-0 h-full overflow-hidden border-l border-gray-300 dark:border-gray-700 bg-[#f3f5f0] dark:bg-[#18151a]"
              >
                <div className="w-72 xl:w-80 h-full flex flex-col p-4">
                  <div className="mb-4">
                    <h3
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                      style={{ fontFamily: 'var(--mono-font)' }}
                    >
                      Interactive Map
                    </h3>
                  </div>
                  <DocumentationGraph
                    currentPath={path}
                    onNodeClick={(nodePath) => {
                      router.push(`/docs/${nodePath}`);
                    }}
                    className="w-full h-96"
                  />

                  {/* Footer with social icons and copyright */}
                  <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                    {/* Social Icons */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      {socialLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={link.name}
                          className="opacity-40 hover:opacity-60 transition-opacity"
                        >
                          <div className="w-5 h-5">{link.icon}</div>
                        </a>
                      ))}
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                      <p
                        className="text-xs text-gray-400 dark:text-gray-600"
                        style={{ fontFamily: 'var(--mono-font)' }}
                      >
                        © 2024 @lightnolimit
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Mind Map Modal */}
      <AnimatePresence>
        {isMobile && mobileMapVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setMobileMapVisible(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-4 bottom-4 top-24 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setMobileMapVisible(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close mind map"
              >
                <Icon icon="mingcute:close-line" className="w-5 h-5" />
              </button>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--mono-font)' }}>
                Interactive Map
              </h3>

              {/* Mind Map */}
              <div className="h-full pb-16">
                <DocumentationGraph
                  currentPath={path}
                  onNodeClick={(nodePath) => {
                    router.push(`/docs/${nodePath}`);
                    setMobileMapVisible(false);
                  }}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
});

DocumentationPage.displayName = 'DocumentationPage';

export default DocumentationPage;
