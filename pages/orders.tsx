import {
  Badge,
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
import { useSession } from 'next-auth/react';
import { Sale, VirtualItem } from '@prisma/client';

export type OrderWithVirtualItem = Sale & { virtualItem: VirtualItem };

function truncate(string: string) {
  const maxLength = 40;
  if (string.length < maxLength) {
    return string;
  }
  return string.slice(0, maxLength) + '...';
}

function Order({ order }: { order: OrderWithVirtualItem }) {
  return (
    <Card>
      <Group position="apart">
        <Group>
          <Text fw={700} title={order.virtualItem.name}>
            {truncate(order.virtualItem.name)}
          </Text>
          <Text>Ref. No. {order.referenceNo}</Text>
        </Group>
        <Group>
          {order.approvedAt ? (
            <Badge color="green"> Bought</Badge>
          ) : (
            <Badge>Pending</Badge>
          )}
        </Group>
      </Group>
    </Card>
  );
}

export default function Orders() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/signup');
  }

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/order');
      return await response.json();
    },
  });

  return (
    <>
      <Group position="apart" mb="md">
        <Title order={4}>Orders</Title>
        <Button variant="subtle" onClick={() => router.push('/')}>
          Go home
        </Button>
      </Group>
      <Stack>
        {orders ? (
          orders?.length ? (
            orders?.map((order: OrderWithVirtualItem) => {
              return <Order key={order.id} order={order} />;
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
