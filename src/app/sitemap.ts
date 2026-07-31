import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://creativva.com',
      lastModified: new Date('2026-07-31'),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}