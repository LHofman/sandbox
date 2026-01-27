import { useRef } from 'react';

// Refs are used to remember information but don't want to trigger re-renders.*/
export const Refs = () => {
  // UC1: Accessing DOM elements directly
  const inputRef = useRef<HTMLInputElement>(null);
  // UC2: Storing mutable values that persist across renders
  const intervalIdRef = useRef<number | null>(null);

  const startInterval = () => {
    intervalIdRef.current = window.setInterval(() => {
      console.log('Interval running');
    }, 1000);
  };

  const stopInterval = () => {
    clearInterval(intervalIdRef.current!);
  }

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>

      <button onClick={startInterval}>Start</button>
      <button onClick={stopInterval}>Stop</button>
    </div>
  );
};
