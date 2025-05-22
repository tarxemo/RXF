import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number; // duration in ms
}

const AnimatedCounter = ({ from, to, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const start = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const current = Math.floor(from + (to - from) * progress);
      setCount(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [from, to, duration]);

  return <span>{count}</span>;
};

export default AnimatedCounter;
