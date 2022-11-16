import { Center, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Stack mt="7rem">
      <Center>
        <Title sx={{ fontSize: '7rem' }}>404</Title>
      </Center>
      <Center>
        <Text>
          Page does not exist. Go to <Link href="/">homepage</Link> instead.
        </Text>
      </Center>
    </Stack>
  );
}
