'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="py-16 px-4 md:px-8 border-t border-opacity-20" style={{ borderColor: 'var(--slate-graphite)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="/marrow.png" 
              alt="Marrow" 
              width={200} 
              height={80}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={() => {
                // Placeholder for whitepaper functionality
                console.log('Whitepaper button clicked');
              }}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-opacity-80"
              style={{ 
                backgroundColor: 'var(--slate-graphite)',
                color: 'var(--calcium-ivory)'
              }}
            >
              Whitepaper
            </button>
            
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--slate-graphite)' }}>
              <span>© 2024 Marrow</span>
              <span>•</span>
              <span>Open Source</span>
              <span>•</span>
              <span>Transparent</span>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-12 text-center">
          <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--slate-graphite)' }}>
            Building a fairer tax system through progressive consumption taxes, land value capture, 
            and AI-powered transparency. Join us in creating Nordic-level equality with full blockchain accountability.
          </p>
        </div>
      </div>
    </footer>
  );
}