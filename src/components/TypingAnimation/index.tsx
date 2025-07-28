import { useState, useEffect, useCallback } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export default function TypingAnimation({ text, speed = 30, onComplete }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleComplete = useCallback(() => {
    if (!hasCompleted && onComplete) {
      setHasCompleted(true);
      onComplete();
    }
  }, [hasCompleted, onComplete]);

  useEffect(() => {
    if (speed === 0) {
      setCurrentIndex(text.length)
      setDisplayedText(text)
      handleComplete();
    } else {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, speed);

        return () => clearTimeout(timer);
      } else if (!hasCompleted) {
        handleComplete();
      }
    }
  }, [currentIndex, text, speed, hasCompleted, handleComplete]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setHasCompleted(false);
  }, [text]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-gray-400 ml-1 animate-pulse" />
      )}
    </span>
  );
} 