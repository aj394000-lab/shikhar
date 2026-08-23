export const SERVICE_OPTIONS = [
  { value: 'social-media', label: 'Social Media Marketing' },
  { value: 'content-creation', label: 'Content Creation' },
  { value: 'paid-ads', label: 'Paid Advertising' },
  { value: 'seo', label: 'SEO & Analytics' },
  { value: 'social-media-management', label: 'Social Media Management' },
  { value: 'brand-identity', label: 'Brand Identity & Strategy' },
  { value: 'performance', label: 'Performance Marketing' },
  { value: 'video-editing', label: 'Video Editing' },
] as const;

const LEGACY_SERVICE_LABELS: Record<string, string> = {
  'social-media-marketing': 'Social Media Marketing',
  'paid-advertising': 'Paid Advertising',
  'seo-analytics': 'SEO & Analytics',
  'performance-marketing': 'Performance Marketing',
};

export const SERVICE_LABELS: Record<string, string> = {
  ...LEGACY_SERVICE_LABELS,
  ...Object.fromEntries(SERVICE_OPTIONS.map((option) => [option.value, option.label])),
};
