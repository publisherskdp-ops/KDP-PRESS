'use client';
import { useEffect } from 'react';

const InteractiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Scroll Reveal Logic
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      reveals.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return <>{children}</>;
};

export default InteractiveProvider;
