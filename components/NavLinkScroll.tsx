'use client';

import { useCallback } from 'react';

export default function NavLinkScroll({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        window.history.pushState(null, '', `#${id}`);
      }
    },
    [id]
  );

  return (
    <a href={`#${id}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
