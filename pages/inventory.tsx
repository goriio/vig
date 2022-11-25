import {
  Button,
  Image,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { ItemList } from '@/components/ItemList';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export type VirtualItem = {
  id?: string;
  name: string;
  price: string;
  image: string;
  gcash: string;
  inMarket?: boolean;
  ownerId?: string;
};

export default function Inventory() {
  const [opened, setOpened] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/signup');
  }

  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const data = await fetch('/api/inventory');
      return await data.json();
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (virtualItem: VirtualItem) => {
      await fetch('/api/virtualItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(virtualItem),
      });
    },
  });

  const form = useForm({
    initialValues: {
      name: '',
      price: '',
      image: '',
      gcash: '',
    },
    validate: {
      name: (value) => (!value ? 'Item name is required' : null),
      price: (value) =>
        !value
          ? 'Price is required'
          : isNaN(Number(value))
          ? 'Price is invalid'
          : null,
      image: (value) => (!value ? 'Image link is required' : null),
      gcash: (value) =>
        !value
          ? 'Phone number is required'
          : !/^09\d{9}$/.test(value)
          ? 'Phone number is invalid'
          : null,
    },
  });

  function addItem(virtualItem: VirtualItem) {
    try {
      mutate(virtualItem, {
        onSuccess: () => {
          showNotification({
            title: '🎉 Successful',
            message: 'You have added an item in your inventory.',
            icon: <BiCheck />,
            color: 'teal',
          });
          form.reset();
          setOpened(false);
        },
      });
    } catch (error: any) {
      showNotification({
        title: 'Something went wrong',
        message: error.message,
        color: 'red',
      });
    }
  }

  return (
    <>
      <Modal
        title="Add a virtual item to inventory"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <form onSubmit={form.onSubmit(addItem)}>
          <Stack>
            <TextInput
              label="Item name"
              placeholder="Item name"
              {...form.getInputProps('name')}
            />
            <NumberInput
              label="Price (PHP)"
              placeholder="Price"
              hideControls
              {...form.getInputProps('price')}
            />
            <TextInput
              label="Image"
              placeholder="Image link (png or jpeg)"
              {...form.getInputProps('image')}
            />
            <Image
              height={200}
              fit="contain"
              src={form.values.image}
              alt="Image preview"
              withPlaceholder
            />
            <TextInput
              label="Your GCash"
              placeholder="09123456789"
              {...form.getInputProps('gcash')}
            />
            <Button type="submit" loading={isLoading} mt="sm">
              Add item
            </Button>
          </Stack>
        </form>
      </Modal>
      <ItemList
        title="Inventory"
        rightButton={
          <Button variant="light" onClick={() => setOpened(true)}>
            Add Item
          </Button>
        }
        items={inventory}
        noItem={{
          message: `This section is empty. Try adding virtual items.`,
        }}
      />
    </>
  );
}
