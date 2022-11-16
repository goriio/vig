import {
  Button,
  Card,
  Center,
  Group,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

function truncate(string: string) {
  const maxLength = 40;
  if (string.length < maxLength) {
    return string;
  }
  return string.slice(0, maxLength) + '...';
}

function Item({ item }: any) {
  return (
    <Card>
      <Group position="apart">
        <Group>
          <Text fw={700} title={item.title}>
            {truncate(item.title)}
          </Text>
          <Text>Ref. No. {item.owner.id}</Text>
        </Group>
        <Group>
          <Button variant="subtle">Ignore</Button>
          <Button>Confirm</Button>
        </Group>
      </Group>
    </Card>
  );
}

export default function Sales() {
  const router = useRouter();

  const { data: virtualItems } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await fetch('/api/sale');
      return await response.json();
    },
  });

  return (
    <>
      <Group position="apart" mb="md">
        <Title order={4}>Sales</Title>
        <Button variant="subtle" onClick={() => router.push('/')}>
          Go home
        </Button>
      </Group>
      <Stack>
        {virtualItems ? (
          virtualItems?.length ? (
            virtualItems?.map((item: any) => {
              return <Item key={item.id} item={item.data()} />;
            })
          ) : (
            <Center
              style={{
                width: '100%',
                marginTop: '2rem',
              }}
            >
              <Title order={2} color="dimmed">
                There is nothing here.
              </Title>
            </Center>
          )
        ) : (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={70} />
          ))
        )}
      </Stack>
    </>
  );
}
