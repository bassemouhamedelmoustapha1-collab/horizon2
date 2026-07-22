"use client";

import { useEffect, useRef } from "react";

/**
 * Barre de progression de lecture fixée en haut de la page.
 * Sa longueur et la position de son dégradé reflètent directement le
 * scroll de l'utilisateur (pas d'animation en boucle) : dynamique sans
 * être distrayante.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    function update() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      const bar = barRef.current;
      if (bar) {
        bar.style.transform = `scaleX(${clamped})`;
        bar.style.backgroundPosition = `${clamped * 100}% 0`;
      }
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress-track" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  );
}
