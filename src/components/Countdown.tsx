import { useEffect, useState, useCallback } from 'react';

interface CountdownProps {
  expiresAt: string;
  onExpired?: () => void;
  className?: string;
}

export default function Countdown({ expiresAt, onExpired, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const calculateTimeLeft = useCallback(() => {
    const expires = new Date(expiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expires - now) / 1000));
  }, [expiresAt]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft, onExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = timeLeft < 60 && timeLeft > 0;

  return (
    <span className={`font-headline font-bold tabular-nums ${isUrgent ? 'text-error' : ''} ${className}`}>
      {formatted}
    </span>
  );
}
