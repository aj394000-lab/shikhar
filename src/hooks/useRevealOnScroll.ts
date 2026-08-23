'use client';
import { RefObject, useEffect } from 'react';

interface RevealTarget {
  ref: RefObject<HTMLElement | null>;
  className: string;
}

/**
 * Observes each element in `cardRefs` and reveals it (adds `className` and
 * sets opacity to 1) once it enters the viewport.
 */
export function useRevealCards(
  cardRefs: RefObject<(HTMLElement | null)[]>,
  options?: IntersectionObserverInit,
  className = 'animate-slide-up'
) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          (entry.target as HTMLElement).style.opacity = '1';
        }
      });
    }, options);
    cardRefs.current?.forEach((card) => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Observes `sectionRef` and reveals each target (adds its class and sets
 * opacity to 1) once the section enters the viewport.
 */
export function useSectionReveal(
  sectionRef: RefObject<HTMLElement | null>,
  targets: RevealTarget[],
  threshold = 0.2
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          targets.forEach(({ ref, className }) => {
            if (ref.current) {
              ref.current.style.opacity = '1';
              ref.current.classList.add(className);
            }
          });
        });
      },
      { threshold }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
