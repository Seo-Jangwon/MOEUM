import { useEffect, useRef } from 'react';

const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  return ref;
};

export default useClickOutside;
