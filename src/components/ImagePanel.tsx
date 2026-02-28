'use client';

interface ImageData {
  url: string;
  photographer: string;
  photographerUrl: string;
  unsplashLink: string;
}

interface ImagePanelProps {
  image: ImageData | null;
  isLoading: boolean;
}

export default function ImagePanel({ image, isLoading }: ImagePanelProps) {
  if (isLoading || !image) return null;

  return (
    <div className="image-panel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt="Visual resonance"
        loading="eager"
      />
      <div className="image-gradient" />
      <div className="image-credit">
        Photo by{' '}
        <a
          href={`${image.photographerUrl}?utm_source=recursive_engine&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {image.photographer}
        </a>
        {' / '}
        <a
          href={`${image.unsplashLink}?utm_source=recursive_engine&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
