"use client";
import { useEffect, useRef } from 'react';

export default function AdUnit({ className = "", format = "rectangle" }) {
  const adRef = useRef(null);
  
  useEffect(() => {
    const formats = {
      rectangle: { width: 300, height: 250 },
      leaderboard: { width: 728, height: 90 },
      mobile: { width: 320, height: 100 },
      sidebar: { width: 300, height: 600 },
      banner: { width: 468, height: 60 }
    };
    
    const selectedFormat = formats[format] || formats.rectangle;
    
    if (typeof window !== 'undefined') {
      window.atOptions = {
        'key': '972d48c5a9dca92a769dac63b0030ab9',
        'format': 'iframe',
        'height': selectedFormat.height,
        'width': selectedFormat.width,
        'params': {}
      };
      
      const script = document.createElement('script');
      script.src = '//www.highperformanceformat.com/972d48c5a9dca92a769dac63b0030ab9/invoke.js';
      script.async = true;
      
      if (adRef.current) {
        adRef.current.appendChild(script);
      }
    }
    
    return () => {
      if (adRef.current) {
        const scripts = adRef.current.querySelectorAll('script');
        scripts.forEach(script => script.remove());
      }
    };
  }, [format]);
  
  return (
    <div className={`ad-container ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-1">Advertisement</div>
      <div ref={adRef} className="flex justify-center"></div>
    </div>
  );
}