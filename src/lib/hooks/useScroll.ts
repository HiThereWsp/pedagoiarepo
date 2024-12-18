import { useEffect, useRef, RefObject } from 'react';

interface ScrollOptions {
  smooth?: boolean;
  block?: ScrollLogicBehavior;
  inline?: ScrollLogicBehavior;
}

type ScrollLogicBehavior = 'start' | 'center' | 'end' | 'nearest';

export function useScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  
  const scrollToBottom = (options: ScrollOptions = { smooth: true }) => {
    if (!ref.current) return;
    
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: options.smooth ? 'smooth' : 'auto',
      block: options.block || 'end',
      inline: options.inline || 'nearest'
    };

    requestAnimationFrame(() => {
      ref.current?.lastElementChild?.scrollIntoView(scrollOptions);
    });
  };

  const scrollTo = (element: HTMLElement, options: ScrollOptions = { smooth: true }) => {
    element.scrollIntoView({
      behavior: options.smooth ? 'smooth' : 'auto',
      block: options.block || 'start',
      inline: options.inline || 'nearest'
    });
  };

  return {
    ref,
    scrollToBottom,
    scrollTo
  };
}

export function useScrollRestoration(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Store scroll position before unmount
    const handleBeforeUnload = () => {
      sessionStorage.setItem(
        'scroll-position',
        container.scrollTop.toString()
      );
    };

    // Restore scroll position on mount
    const scrollPosition = sessionStorage.getItem('scroll-position');
    if (scrollPosition) {
      requestAnimationFrame(() => {
        container.scrollTop = parseInt(scrollPosition, 10);
      });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [containerRef]);
}