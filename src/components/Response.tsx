'use client';

import { useMemo } from 'react';

interface ResponseProps {
  word: string;
  text: string;
  isStreaming: boolean;
}

export default function Response({ word, text, isStreaming }: ResponseProps) {
  // Format the word as spaced heading: "skyscraper" -> "S K Y S C R A P E R"
  const spacedWord = useMemo(() => {
    return word.toUpperCase().split('').join(' ');
  }, [word]);

  // Split text into paragraphs
  const paragraphs = useMemo(() => {
    if (!text) return [];
    return text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [text]);

  // Detect if the first paragraph is the spaced word heading (from Claude's response)
  // and skip it since we render it ourselves
  const filteredParagraphs = useMemo(() => {
    if (paragraphs.length === 0) return [];
    return paragraphs.filter((p) => {
      const cleaned = p.replace(/\s+/g, '').toUpperCase();
      const wordClean = word.replace(/\s+/g, '').toUpperCase();
      if (cleaned === wordClean) return false;
      if (/^IMAGE(_QUERY)?/i.test(p.trim())) return false;
      return true;
    });
  }, [paragraphs, word]);

  if (!text && !isStreaming) return null;

  return (
    <div className="response-area">
      <div className="word-heading">{spacedWord}</div>
      <div className="response-text">
        {filteredParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {isStreaming && filteredParagraphs.length === 0 && (
          <p style={{ opacity: 0.3 }}>&nbsp;</p>
        )}
      </div>
    </div>
  );
}
