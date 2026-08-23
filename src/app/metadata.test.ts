import robots from './robots';
import sitemap from './sitemap';

it('returns the expected robots rules and sitemap URL', () => {
  expect(robots()).toEqual({
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/admin/'] },
    sitemap: 'https://creativva.com/sitemap.xml',
  });
});

it('returns the site map entry with metadata fields', () => {
  expect(sitemap()).toEqual([
    {
      url: 'https://creativva.com',
      lastModified: new Date('2026-07-31'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]);
});
