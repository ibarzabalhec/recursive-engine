import { NextRequest } from 'next/server';

// In-memory cache for images
const imageCache = new Map<string, { data: ImageResult; timestamp: number }>();
const IMAGE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

interface ImageResult {
  url: string;
  photographer: string;
  photographerUrl: string;
  unsplashLink: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check cache
    const cacheKey = query.toLowerCase().trim();
    const cached = imageCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return new Response(JSON.stringify({ error: 'Unsplash API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return new Response(JSON.stringify({ error: 'Image search failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return new Response(JSON.stringify({ error: 'No images found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const photo = data.results[0];
    const result: ImageResult = {
      url: photo.urls?.regular || photo.urls?.small,
      photographer: photo.user?.name || 'Unknown',
      photographerUrl: photo.user?.links?.html || 'https://unsplash.com',
      unsplashLink: photo.links?.html || 'https://unsplash.com',
    };

    // Cache the result
    imageCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  } catch (error) {
    console.error('Image route error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
