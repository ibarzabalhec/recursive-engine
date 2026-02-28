'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchBoxProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBox({
  onSubmit,
  disabled = false,
  placeholder = 'Type anything...',
  autoFocus = false,
}: SearchBoxProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || trimmed.length > 100) return;

    // Debounce: 300ms after last keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onSubmit(trimmed);
      setValue('');
    }, 50); // Minimal delay on submit — debounce is for rapid resubmits
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={100}
        autoComplete="off"
        spellCheck={false}
      />
      <span className="search-arrow">&#8599;</span>
    </form>
  );
}
