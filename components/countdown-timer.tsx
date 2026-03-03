"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  targetDate: string | Date;
  compact?: boolean;
}

export function CountdownTimer({
  targetDate,
  compact = false,
}: CountdownTimerProps) {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate).getTime() - Date.now();
    if (difference <= 0) return null;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs font-mono">
        <span className="bg-black/70 text-white px-1.5 py-0.5 rounded">
          {timeLeft.days}j
        </span>
        <span className="bg-black/70 text-white px-1.5 py-0.5 rounded">
          {timeLeft.hours}h
        </span>
        <span className="bg-black/70 text-white px-1.5 py-0.5 rounded">
          {timeLeft.minutes}m
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {[
        { value: timeLeft.days, label: "Jours" },
        { value: timeLeft.hours, label: "Heures" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sec" },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="bg-black text-white rounded-lg px-3 py-2 text-xl font-bold font-mono min-w-[48px]">
            {String(item.value).padStart(2, "0")}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
