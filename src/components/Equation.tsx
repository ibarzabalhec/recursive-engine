'use client';

import { useEffect, useRef, useState } from 'react';

interface EquationProps {
  visible: boolean;
}

export default function Equation({ visible }: EquationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useKatex, setUseKatex] = useState(true);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!visible || rendered) return;

    const renderEquation = async () => {
      try {
        const katex = (await import('katex')).default;
        if (containerRef.current) {
          katex.render('r = \\sqrt{R^2 - w_0^2}', containerRef.current, {
            throwOnError: false,
            displayMode: false,
          });
          setRendered(true);
        }
      } catch {
        setUseKatex(false);
        setRendered(true);
      }
    };

    renderEquation();
  }, [visible, rendered]);

  if (!visible) return null;

  return (
    <div className="equation">
      {useKatex ? (
        <div ref={containerRef} className="equation-inner" />
      ) : (
        <span className="equation-inner">
          r = &radic;(R&sup2; &minus; w&#x2080;&sup2;)
        </span>
      )}
    </div>
  );
}
