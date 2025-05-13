'use client';

import Navigation from '../components/Navigation';
import WaveBackground from '../components/WaveBackground';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <WaveBackground />
      <Navigation />
      
      <div className="container max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto doc-card p-6 md:p-8"
        >
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Terms of Service</h1>
          
          <div className="space-y-6" style={{ color: 'var(--muted-color)' }}>
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>1. Introduction</h2>
              <p>
                Welcome to Project Docs. These Terms of Service govern your use of our website and services. 
                By accessing or using our platform, you agree to be bound by these terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>2. Definitions</h2>
              <p>
                <strong>&quot;Service&quot;</strong> refers to the documentation website accessible at projectdocs.com.<br />
                <strong>&quot;User&quot;</strong> refers to any individual accessing or using the Service.<br />
                <strong>&quot;Content&quot;</strong> refers to all information displayed on the Service, including text, images, and data.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>3. Use of Service</h2>
              <p>
                Users may access and view documentation for personal and educational purposes. 
                Commercial use may require separate agreements.
              </p>
              <p className="mt-2">
                You agree not to:
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Copy or redistribute the Content without permission</li>
                <li>Use the Service in any way that could damage or overburden it</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>4. Intellectual Property</h2>
              <p>
                All Content on the Service is the property of Project Docs or its licensors and is protected 
                by intellectual property laws. Users are granted a limited license to access and use the 
                Content for personal use only.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>5. Privacy</h2>
              <p>
                Our Privacy Policy governs the collection and use of personal information. By using our 
                Service, you consent to the practices described in our Privacy Policy.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of 
                significant changes through the Service. Continued use of the Service after such 
                modifications constitutes acceptance of the updated Terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-color)' }}>7. Contact</h2>
              <p>
                If you have any questions about these Terms, please contact us at contact@projectdocs.com.
              </p>
            </section>
            
            <div className="pt-4 mt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p>Last updated: June 1, 2024</p>
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/"
              className="font-medium transition-colors"
              style={{ color: 'var(--primary-color)' }}
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
} 