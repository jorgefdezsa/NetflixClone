import type { ImgHTMLAttributes, SyntheticEvent } from 'react';

const PLACEHOLDER = '/assets/placeholder.svg';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> & {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export default function SafeImage({ onError, ...props }: Props) {
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (!e.currentTarget.src.endsWith(PLACEHOLDER)) e.currentTarget.src = PLACEHOLDER;
    onError?.(e);
  };
  return <img loading="lazy" {...props} onError={handleError} />;
}
