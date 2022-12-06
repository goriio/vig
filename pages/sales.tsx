import {
  Button,
  Card,
  Center,
  Group,
  Modal,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Sale, VirtualItem } from '@prisma/client';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { BiCheck } from 'react-icons/bi';

type SaleWithVirtualItem = Sale & { virtualItem: VirtualItem };

function truncate(string: string) {
  const maxLength = 40;
  if (string.length < maxLength) {
    return string;
  }
  return string.slice(0, maxLength) + '...';
}

function Sale({ sale }: { sale: SaleWithVirtualItem }) {
  const [ignoreDialogOpen, setIgnoreDialogOpen] = useState(false);

  const { mutate: ignore, isLoading: ignoring } = useMutation({
    mutationFn: async (sale: SaleWithVirtualItem) => {
      await fetch('/api/sale/ignore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      });
    },
    onSuccess: () => {
      showNotification({
        title: 'Success',
        message: 'The item has been ignored.',
        icon: <BiCheck />,
        color: 'teal',
      });
      setIgnoreDialogOpen(false);
    },
    onError: (error: any) => {
      showNotification({
        title: 'Something went wrong',
        message: error.message,
        color: 'red',
      });
    },
  });

  const { mutate: confirm, isLoading: confirming } = useMutation({
    mutationFn: async (sale: SaleWithVirtualItem) => {
      await fetch('/api/sale/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale),
      });
    },
    onSuccess: () => {
      showNotification({
        title: 'Success',
        message: 'The item has been confirmed.',
        icon: <BiCheck />,
        color: 'teal',
      });
    },
    onError: (error: any) => {
      showNotification({
        title: 'Something went wrong',
        message: error.message,
        color: 'red',
      });
    },
  });

  return (
    <>
      <Modal
        opened={ignoreDialogOpen}
        onClose={() => setIgnoreDialogOpen(false)}
        withCloseButton={false}
      >
        <Text mb="md">
          Are you sure you want to ignore ref. no. {sale.referenceNo}?
        </Text>
        <Group position="right">
          <Button
            variant="subtle"
            color="red"
            onClick={() => setIgnoreDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button color="red" loading={ignoring} onClick={() => ignore(sale)}>
            I am sure
          </Button>
        </Group>
      </Modal>

      <Card>
        <Group position="apart">
          <Group>
            <Text fw={700} title={sale.virtualItem.name}>
              {truncate(sale.virtualItem.name)}
            </Text>
            <Text>Ref. No. {sale.referenceNo}</Text>
          </Group>
          <Group>
            <Button variant="subtle" onClick={() => setIgnoreDialogOpen(true)}>
              Ignore
            </Button>
            <Button onClick={() => confirm(sale)} loading={confirming}>
              Confirm
            </Button>
          </Group>
        </Group>
      </Card>
    </>
  );
}

export default function Sales() {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/signup');
  }

  const { data: sales } = useQuery({
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
        {sales ? (
          sales?.length ? (
            sales?.map((sale: SaleWithVirtualItem) => {
              return <Sale key={sale.id} sale={sale} />;
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
