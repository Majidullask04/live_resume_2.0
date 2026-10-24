import React, { useEffect, useState } from 'react';

/**
 * Simple elegant custom cursor — a glowing amber dot that follows the mouse.
 * Replaces the previous spider cursor with something clean and minimal.
 */
export const PatchrightCursorTracker: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, select, textarea, [role="button"], [data-important="true"], .important-asset'
        ) as HTMLElement | null;
        if (interactive) {
          setIsHovered(true);
          setIsImportant(
            interactive.getAttribute('data-important') === 'true' ||
              interactive.classList.contains('important-asset')
          );
        } else {
          setIsHovered(false);
          setIsImportant(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: isHovered ? 40 : 28,
          height: isHovered ? 40 : 28,
          borderColor: isImportant
            ? 'rgba(34, 211, 238, 0.7)'
            : 'rgba(245, 158, 11, 0.5)',
          boxShadow: isHovered
            ? `0 0 12px ${isImportant ? 'rgba(34,211,238,0.4)' : 'rgba(245,158,11,0.35)'}`
            : 'none',
        }}
      />
      {/* Center dot */}
      <div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-100"
        style={{
          left: pos.x,
          top: pos.y,
          width: isHovered ? 6 : 5,
          height: isHovered ? 6 : 5,
          backgroundColor: isImportant ? '#22d3ee' : '#f59e0b',
          boxShadow: `0 0 8px ${isImportant ? '#22d3ee' : '#f59e0b'}`,
        }}
      />
    </>
  );
};

export default PatchrightCursorTracker;
