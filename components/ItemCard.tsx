import {
  Avatar,
  Button,
  Card,
  Group,
  Image,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { BiCheck } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { Purchase } from './Purchase';
import { useSession } from 'next-auth/react';

type ItemCardProps = {
  item: any;
};

export function ItemCard({ item }: ItemCardProps) {
  const [opened, setOpened] = useState(false);
  const [moving, setMoving] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const isOwner = session?.user?.email === item.owner?.email;

  function handleClick() {
    if (!session) {
      router.push('/signup');
      return;
    }
    setOpened(true);
  }

  async function moveToInventory() {
    try {
      setMoving(true);
      await fetch(`/api/inMarket/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inMarket: false }),
      });
      showNotification({
        message: `${item.name} has been moved to inventory.`,
        icon: <BiCheck />,
        color: 'teal',
      });
    } catch (error: any) {
      showNotification({
        title: 'Something went wrong',
        message: error.message,
        color: 'red',
      });
    } finally {
      setMoving(false);
      setOpened(false);
    }
  }

  async function moveToSell() {
    try {
      setMoving(true);
      await fetch(`/api/inMarket/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inMarket: true }),
      });
      showNotification({
        message: `${item.name} is now on sell.`,
        icon: <BiCheck />,
        color: 'teal',
      });
    } catch (error: any) {
      showNotification({
        title: 'Something went wrong',
        message: error.message,
        color: 'red',
      });
    } finally {
      setMoving(false);
      setOpened(false);
    }
  }

  return (
    <>
      <Card onClick={handleClick} sx={{ cursor: 'pointer' }}>
        <Card.Section p="md">
          {/* shadow="sm" */}
          <Image
            height={90}
            fit="cover"
            src={item.image}
            alt={item.name}
            radius="sm"
            mb="sm"
            withPlaceholder
          />
          <Group spacing="xs" mb="sm">
            <Avatar
              radius="xl"
              size="sm"
              src={item.owner.image}
              alt={`${item.owner.name}'s image`}
            />
            <Text size="xs" color="dimmed" underline>
              {item.owner.name}
            </Text>
          </Group>
          <Text size="sm" fw={600}>
            {item.name}
          </Text>
          <Text size="xs" color="blue">
            PHP {item.price}
          </Text>
        </Card.Section>
      </Card>
      {!isOwner && (
        <Purchase item={item} opened={opened} setOpened={setOpened} />
      )}
      {isOwner && (
        <Modal opened={opened} onClose={() => setOpened(false)}>
          <Stack spacing="xs">
            {item.inMarket ? (
              <Button
                onClick={moveToInventory}
                variant="subtle"
                color="gray"
                loading={moving}
              >
                {moving ? 'Moving' : 'Move'} to inventory
              </Button>
            ) : (
              <Button
                onClick={moveToSell}
                variant="subtle"
                color="gray"
                loading={moving}
              >
                Move to sell
              </Button>
            )}

            <Button
              variant="subtle"
              color="gray"
              onClick={() => setOpened(false)}
            >
              Delete
            </Button>
          </Stack>
        </Modal>
      )}
    </>
  );
}
