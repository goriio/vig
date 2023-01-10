import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Image,
  Modal,
  Skeleton,
  Space,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Sale, User, VirtualItem } from '@prisma/client';
import dayjs from 'dayjs';
import { useState } from 'react';

export type OrderWithVirtualItem = Sale & {
  virtualItem: VirtualItem & { owner: User };
};

function Order({ order }: { order: OrderWithVirtualItem }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Details">
        <Image
          height={200}
          fit="contain"
          src={order.virtualItem.image}
          alt={order.virtualItem.name}
          radius="sm"
          mb="sm"
          withPlaceholder
        />
        <Group mb="md" position="apart">
          <Text fw={700}>{order.virtualItem.name}</Text>
          {order.approvedAt ? (
            <Badge color="green"> Bought</Badge>
          ) : (
            <Badge>Pending</Badge>
          )}
        </Group>

        <Text c="dimmed" fz="sm">
          Seller
        </Text>
        <Group>
          <Text>{order.virtualItem.owner.name}</Text>
          &middot;
          <Text>{order.virtualItem.gcash}</Text>
        </Group>

        <Space h="md" />

        <Text c="dimmed" fz="sm">
          Ref. No.{' '}
        </Text>
        <Text>{order.referenceNo}</Text>

        <Space h="md" />

        <Text c="dimmed" fz="sm">
          Date ordered
        </Text>
        <Text>{dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}</Text>

        <Space h="md" />

        {order.approvedAt && (
          <>
            <Text c="dimmed" fz="sm">
              Date approved
            </Text>
            <Text>{dayjs(order.approvedAt).format('MMM D, YYYY h:mm A')}</Text>
          </>
        )}
      </Modal>
      <Box
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          textAlign: 'center',
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          cursor: 'pointer',

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[1],
          },
        })}
        onClick={() => setOpened(true)}
      >
        <Group>
          <Text fw={700} title={order.virtualItem.name}>
            {order.virtualItem.name}
          </Text>
        </Group>
        <Group>
          <Text fw={600}>{order.virtualItem.owner.name}</Text>
          &middot;
          <Text>Ordered on {dayjs(order.createdAt).format('MMM D, YYYY')}</Text>
        </Group>
      </Box>
    </>
  );
}

function OrderList({ orders }: { orders?: OrderWithVirtualItem[] }) {
  return (
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
  );
}

export default function Orders() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/signup');
  }

  const { data: orders } = useQuery<OrderWithVirtualItem[]>({
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
      <Tabs variant="pills" defaultValue="pending" mb="md">
        <Tabs.List>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="bought">Bought</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="pending" pt="xs">
          <OrderList orders={orders?.filter((order) => !order.approvedAt)} />
        </Tabs.Panel>
        <Tabs.Panel value="bought" pt="xs">
          <OrderList orders={orders?.filter((order) => order.approvedAt)} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
