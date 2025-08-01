import Image from 'next/image';
import { ComponentProps } from 'react';
import SpinnerImage from './spinner.svg';

export function Spinner(props: Omit<ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
      src={SpinnerImage}
      alt='spinner'
      {...props}
    />
  );
}