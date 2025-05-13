'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';

export default function Home() {
  // State to track which background to use, with initial default
  const [backgroundType, setBackgroundType] = useState<string>('wave');
  
  // Effect to load the saved background preference
  useEffect(() => {
    // Get the background type from localStorage if available
    const savedBackground = localStorage.getItem('backgroundType');
    
    // Use the saved value or fall back to the env var or default
    const envDefault = process.env.NEXT_PUBLIC_BACKGROUND_TYPE || 'wave';
    if (savedBackground === 'wave' || savedBackground === 'stars') {
      setBackgroundType(savedBackground);
    } else {
      setBackgroundType(envDefault);
    }
  }, []);
  
  // Dynamically import the correct background component
  const BackgroundComponent = dynamic(() => 
    backgroundType === 'stars' 
      ? import('./components/StarsBackground') 
      : import('./components/WaveBackground'),
    { ssr: false }
  );
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <BackgroundComponent />
      <Navigation />
      
      <div className="container max-w-5xl mx-auto px-4 md:px-6 pt-20 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span 
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))' }}
            >
              PROJECT
            </span>
            <span style={{ color: 'var(--text-color)' }}> DOCS</span>
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10" style={{ color: 'var(--muted-color)' }}>
            Comprehensive documentation for your project
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/docs"
              className="px-6 py-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--primary-color)', 
                color: 'var(--background-color)',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-color)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
            >
              Explore Documentation
            </Link>
            
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--card-color)', 
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.color = 'var(--primary-color)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-color)';
              }}
            >
              GitHub Repository
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        >
          {[
            {
              title: 'Getting Started',
              description: 'Learn the basics and get up to speed with our platform',
              link: '/docs/project-overview/introduction'
            },
            {
              title: 'Core Concepts',
              description: 'Understand the key concepts and mechanisms',
              link: '/docs/core-mechanisms/tokenization'
            },
            {
              title: 'Advanced Usage',
              description: 'Dive deeper into advanced features and capabilities',
              link: '/docs/agent/using-the-model'
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="doc-card p-6 hover:border-primary-color transition-colors"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-color)' }}>{item.title}</h3>
              <p className="mb-4" style={{ color: 'var(--muted-color)' }}>{item.description}</p>
              <Link 
                href={item.link}
                className="font-medium transition-colors"
                style={{ color: 'var(--primary-color)' }}
              >
                Learn more →
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
      
      <footer className="w-full py-6 mt-20 border-t z-10" style={{ borderColor: 'var(--border-color)' }}>
        <div className="container max-w-5xl mx-auto px-4 md:px-6 text-center" style={{ color: 'var(--muted-color)' }}>
          <p>© 2024 Your Project. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/terms" className="hover:text-primary-color transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
