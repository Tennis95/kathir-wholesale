'use client';

import { animate } from 'motion';

function getVisibleCartIcon(): HTMLElement | null {
  const desktop = document.getElementById('header-cart-icon-desktop');
  const mobile = document.getElementById('header-cart-icon-mobile');

  for (const el of [desktop, mobile]) {
    if (el && el.offsetParent !== null) return el;
  }
  return desktop || mobile;
}

export function flyToCart(sourceEl: HTMLElement, emoji: string = '📦') {
  if (typeof window === 'undefined') return;

  const target = getVisibleCartIcon();
  if (!target) return;

  const from = sourceEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const startX = from.left + from.width / 2;
  const startY = from.top + from.height / 2;
  const endX = to.left + to.width / 2;
  const endY = to.top + to.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;

  // Bow the path upward relative to the straight line, for an arcing throw
  const distance = Math.sqrt(dx * dx + dy * dy);
  const peakOffset = Math.max(70, distance * 0.4);
  const midX = dx * 0.5;
  const midY = dy * 0.5 - peakOffset;

  const clone = document.createElement('div');
  clone.textContent = emoji;
  clone.style.position = 'fixed';
  clone.style.left = `${startX - 20}px`;
  clone.style.top = `${startY - 20}px`;
  clone.style.width = '40px';
  clone.style.height = '40px';
  clone.style.display = 'flex';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';
  clone.style.fontSize = '26px';
  clone.style.zIndex = '9999';
  clone.style.pointerEvents = 'none';
  clone.style.willChange = 'transform, opacity';
  document.body.appendChild(clone);

  animate(
    clone,
    {
      transform: [
        'translate(0px, 0px) scale(1) rotate(0deg)',
        `translate(${midX}px, ${midY}px) scale(0.85) rotate(20deg)`,
        `translate(${dx}px, ${dy}px) scale(0.15) rotate(35deg)`,
      ],
      opacity: [1, 1, 0.5],
    },
    {
      duration: 0.6,
      times: [0, 0.55, 1],
      ease: ['easeOut', 'easeIn'],
    }
  ).then(() => {
    clone.remove();
    window.dispatchEvent(new Event('cart-fly-landed'));
  });
}
