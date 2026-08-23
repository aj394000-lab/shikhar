import type { CSSProperties } from 'react';

export function gradientTextStyle(gradient: string): CSSProperties {
  return {
    background: gradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };
}
