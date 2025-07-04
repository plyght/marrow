'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const GeneratedFlickerEffect = dynamic(() => import('./m'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-black" />,
});

export default function FlickerWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full bg-black" />;
  }

  return <GeneratedFlickerEffect />;
}