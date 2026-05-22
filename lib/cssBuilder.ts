import type { SiteConfig } from './types';

export function buildCss({ selector, width }: SiteConfig): string {
  return `
${selector} {
  max-width: ${width}px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
${selector} img {
  width: 100% !important;
  height: auto !important;
  display: block;
}
`;
}
