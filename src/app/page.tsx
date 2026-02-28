'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import SearchBox from '@/components/SearchBox';
import Response from '@/components/Response';
import ImagePanel from '@/components/ImagePanel';
import Equation from '@/components/Equation';

interface ImageData {
  url: string;
  photographer: string;
  photographerUrl: string;
  unsplashLink: string;
}

interface HistoryEntry {
  word: string;
  text: string;
  image: ImageData | null;
  expanded: boolean;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const responseRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch image from Unsplash
  const fetchImage = useCallback(async (imageQuery: string) => {
    setImageLoading(true);
    try {
      const res = await fetch(`/api/image?query=${encodeURIComponent(imageQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentImage(data);
      } else {
        setCurrentImage(null);
      }
    } catch {
      setCurrentImage(null);
    } finally {
      setImageLoading(false);
    }
  }, []);

  // Handle search submission
  const handleSearch = useCallback(
    async (query: string) => {
      // Cancel any existing stream
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      // Push current response to history (if exists)
      if (currentWord && currentText) {
        setHistory((prev) => {
          const newHistory = [
            { word: currentWord, text: currentText, image: currentImage, expanded: false },
            ...prev,
          ];
          return newHistory.slice(0, 10); // Max 10
        });
      }

      // Reset state
      setCurrentWord(query);
      setCurrentText('');
      setCurrentImage(null);
      setStreamComplete(false);
      setIsLoading(true);
      setIsStreaming(false);
      setHasResponse(true);

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error('Failed to generate');
        }

        setIsLoading(false);
        setIsStreaming(true);

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          // Check for IMAGE_QUERY marker
          if (fullText.includes('__IMAGE_QUERY__:')) {
            const parts = fullText.split('__IMAGE_QUERY__:');
            const displayText = parts[0].trimEnd();
            const imageQuery = parts[1]?.trim();

            setCurrentText(displayText);

            if (imageQuery) {
              fetchImage(imageQuery);
            }
          } else {
            setCurrentText(fullText);
          }
        }

        // Final cleanup — ensure IMAGE_QUERY is stripped from display
        if (fullText.includes('__IMAGE_QUERY__:')) {
          const parts = fullText.split('__IMAGE_QUERY__:');
          setCurrentText(parts[0].trimEnd());
        }

        setIsStreaming(false);
        setStreamComplete(true);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setIsLoading(false);
        setIsStreaming(false);
        setCurrentText('The engine could not reach the signal. Try again.');
      }
    },
    [currentWord, currentText, currentImage, fetchImage]
  );

  // Toggle history item expansion
  const toggleHistory = (index: number) => {
    setHistory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  // Scroll to response when it appears
  useEffect(() => {
    if (hasResponse && responseRef.current) {
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [currentWord, hasResponse]);

  return (
    <div className="container">
      <div className={`landing ${hasResponse ? 'has-response' : ''}`}>
        <div className="site-title">THE RECURSIVE ENGINE</div>

        {!hasResponse && <div className="tagline">The pattern is already there.</div>}

        <SearchBox
          onSubmit={handleSearch}
          disabled={isStreaming || isLoading}
          placeholder={hasResponse ? 'Try another...' : 'Type anything...'}
          autoFocus={true}
        />

        {isLoading && (
          <>
            <div className="loading-pulse" />
            <div className="loading-word">{currentWord}</div>
          </>
        )}
      </div>

      {hasResponse && currentWord && (
        <div ref={responseRef}>
          <ImagePanel image={currentImage} isLoading={imageLoading} />

          <Response
            word={currentWord}
            text={currentText}
            isStreaming={isStreaming}
          />

          <Equation visible={streamComplete && !isStreaming} />

          {streamComplete && (
            <div className="bottom-search">
              <SearchBox
                onSubmit={handleSearch}
                disabled={isStreaming || isLoading}
                placeholder="Try another..."
                autoFocus={false}
              />
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="history">
          {history.map((item, index) => (
            <div
              key={`${item.word}-${index}`}
              className="history-item"
              onClick={() => toggleHistory(index)}
            >
              <div className="history-item-word">{item.word}</div>
              {item.expanded ? (
                <div className="history-item-expanded">
                  {item.image && (
                    <div className="image-panel" style={{ marginBottom: 24, marginTop: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image.url}
                        alt="Visual resonance"
                        loading="lazy"
                      />
                      <div className="image-gradient" />
                    </div>
                  )}
                  <div className="response-text">
                    {item.text
                      .split(/\n\n+/)
                      .filter((p) => {
                        const clean = p.replace(/\s+/g, '').toUpperCase();
                        const wordClean = item.word.replace(/\s+/g, '').toUpperCase();
                        return clean !== wordClean && p.trim().length > 0;
                      })
                      .map((p, i) => (
                        <p key={i}>{p.trim()}</p>
                      ))}
                  </div>
                  <Equation visible={true} />
                </div>
              ) : (
                <div className="history-item-preview">
                  {item.text
                    .split(/\n\n+/)
                    .filter((p) => {
                      const clean = p.replace(/\s+/g, '').toUpperCase();
                      const wordClean = item.word.replace(/\s+/g, '').toUpperCase();
                      return clean !== wordClean && p.trim().length > 0;
                    })[0]
                    ?.substring(0, 120) || ''}
                  ...
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        Photos via{' '}
        <a href="https://unsplash.com/?utm_source=recursive_engine&utm_medium=referral" target="_blank" rel="noopener noreferrer">
          Unsplash
        </a>
      </footer>
    </div>
  );
}
