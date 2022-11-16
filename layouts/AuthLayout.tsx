import { Container } from '@mantine/core';
import { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Container
      size="xs"
      sx={{ display: 'grid', placeItems: 'center', height: '100vh' }}
    >
      {children}
    </Container>
  );
}
