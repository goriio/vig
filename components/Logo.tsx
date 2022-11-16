import { Image } from '@mantine/core';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.svg" alt="VIG Logo" />
    </Link>
  );
}
