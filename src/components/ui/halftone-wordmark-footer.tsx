import { type ReactNode } from 'react';
import HalftoneWordmark from '@/components/ui/halftone-wordmark';
import './halftone-wordmark-footer.css';

export interface HalftoneWordmarkFooterProps {
  children: ReactNode;
  wordmark?: string;
  className?: string;
}

/**
 * Site footer. Its wordmark is set enormous and cropped by the bottom edge,
 * printed as a field of halftone dots (see HalftoneWordmark). The content above
 * it — heading, resume link, social links and copyright — is the caller's, so
 * this composes rather than dictates it.
 */
export default function HalftoneWordmarkFooter({
  children,
  wordmark = 'aliplfrh',
  className = '',
}: HalftoneWordmarkFooterProps) {
  return (
    <footer className={`hwf-root ${className}`}>
      <div className="hwf-content">{children}</div>
      <span className="hwf-sr">{wordmark}</span>
      <HalftoneWordmark wordmark={wordmark} crop={0.18} />
    </footer>
  );
}
