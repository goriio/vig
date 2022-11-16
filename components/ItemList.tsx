import {
  Center,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core';
import Link from 'next/link';
import { ItemCard } from './ItemCard';

export function ItemList({ title, rightButton, items, noItem }: any) {
  return (
    <>
      <Group position="apart" mt="xl" mb="md">
        {title && <Title order={4}>{title}</Title>}
        {rightButton}
      </Group>
      <SimpleGrid
        cols={6}
        breakpoints={[
          { maxWidth: 755, cols: 4, spacing: 'sm' },
          { maxWidth: 600, cols: 2, spacing: 'sm' },
        ]}
        spacing="xs"
        style={{ position: 'relative' }}
      >
        {items ? (
          items?.length ? (
            items?.map((item: any) => <ItemCard key={item.id} item={item} />)
          ) : (
            <Center
              style={{
                position: 'absolute',
                width: '100%',
                marginTop: '2rem',
              }}
            >
              <Stack>
                <Title order={2} color="dimmed">
                  {noItem.message}
                </Title>
                {noItem.redirect && (
                  <Link href={noItem.redirect.link}>
                    {noItem.redirect.message}
                  </Link>
                )}
              </Stack>
            </Center>
          )
        ) : (
          Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} height={180} />
          ))
        )}
      </SimpleGrid>
    </>
  );
}
