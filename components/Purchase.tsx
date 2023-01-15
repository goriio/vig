import {
  ActionIcon,
  Button,
  Card,
  Center,
  Group,
  Image,
  Modal,
  Paper,
  Space,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Dispatch, useState, SetStateAction, useRef } from 'react';
import { BiCheck, BiDownload } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { Logo } from './Logo';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

type VirtualItemWithOwner = Prisma.VirtualItemGetPayload<{
  include: {
    owner: true;
  };
}>;

export function Purchase({
  opened,
  setOpened,
  item,
}: {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  item: VirtualItemWithOwner;
}) {
  const [active, setActive] = useState(0);
  const [orderedDate, setOrderedDate] = useState<Date | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const form = useForm({
    initialValues: {
      referenceNo: '',
    },
    validate: {
      referenceNo: (value) =>
        !value
          ? 'Reference number is required'
          : !/^\d{11}/.test(value)
          ? 'Invalid reference number'
          : null,
    },
  });

  const { mutate: purchase } = useMutation({
    mutationFn: async ({ referenceNo }: { referenceNo: String }) => {
      setPurchaseLoading(true);

      await fetch(`/api/buy/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referenceNo }),
      });
    },
    onSuccess: () => {
      setPurchaseLoading(false);

      showNotification({
        title: '🎉 Successful',
        message: 'The owner has been notified.',
        icon: <BiCheck />,
        color: 'teal',
      });

      setOrderedDate(new Date());

      nextStep();
    },
    onError: () => {
      showNotification({
        message: 'Something went wrong',
        color: 'red',
      });
      setPurchaseLoading(false);
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Buy"
      sx={{ margin: '0 1rem', right: 0 }}
    >
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Step 1" description="Check">
          <Stack>
            <Card
              sx={(theme) => ({
                backgroundImage: theme.fn.gradient(),
              })}
            >
              <Image
                src={item.image}
                alt={item.name}
                height={170}
                fit="contain"
              />
            </Card>
            <Text align="center" weight="bold">
              {item.name}
            </Text>
            <Text align="center" size="sm" color="dimmed">
              The item&apos;s price is{' '}
              <Text color="blue" span>
                PHP {item.price}
              </Text>
              . Would you like to buy it?
            </Text>
          </Stack>
          <Group grow position="right" mt="xl">
            <Button variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={nextStep}>Confirm</Button>
          </Group>
        </Stepper.Step>
        <Stepper.Step label="Step 2" description="Purchase">
          <form onSubmit={form.onSubmit((values) => purchase(values))}>
            <Stack>
              <Text align="center" weight="bold">
                <Image
                  src="gcash-logo.png"
                  alt="GCash Logo"
                  height={50}
                  fit="contain"
                />
                <Text>
                  Pay PHP {item.price} to {item.gcash}
                </Text>
              </Text>
              <TextInput
                placeholder="00012345678"
                label="Payment Reference Number"
                size="md"
                {...form.getInputProps('referenceNo')}
              />
            </Stack>
            <Group grow position="right" mt="xl">
              <Button type="button" variant="default" onClick={prevStep}>
                Back
              </Button>
              <Button type="submit" loading={purchaseLoading}>
                Buy
              </Button>
            </Group>
          </form>
        </Stepper.Step>
        <Stepper.Completed>
          <Stack>
            <Center>
              <div style={{ position: 'relative', maxWidth: 300 }}>
                <ActionIcon
                  size="lg"
                  variant="filled"
                  pos="absolute"
                  top={12}
                  right={8}
                  title="Download"
                  color="blue"
                  onClick={() => {
                    if (receiptRef.current === null) return;

                    toPng(receiptRef.current).then((dataUrl) => {
                      download(dataUrl, `vig-${form.values.referenceNo}`);
                    });
                  }}
                >
                  <BiDownload size={20} />
                </ActionIcon>

                <Paper
                  ref={receiptRef}
                  radius={0}
                  pt="lg"
                  pb="md"
                  px="sm"
                  bg="blue"
                >
                  <Paper
                    sx={(theme) => ({
                      backgroundColor: theme.white,
                      color: theme.colors.dark[8],
                    })}
                    p="md"
                  >
                    <Stack align="center">
                      <Space h="sm" />
                      <Logo />
                      <Group>
                        <Text size="sm" color="dimmed">
                          Successfully ordered
                        </Text>
                      </Group>
                      <Text size="sm" color="blue" fw={600} align="center">
                        {item.name}
                      </Text>
                      <Group position="apart" w={170}>
                        <Text size="sm" fw={600}>
                          Price
                        </Text>
                        <Text size="sm" fw={600}>
                          PHP {item.price.toFixed(2)}
                        </Text>
                      </Group>
                      <Group position="apart" w={170}>
                        <Text size="sm">Seller</Text>
                        <Text size="sm">{item.owner.name}</Text>
                      </Group>
                      <Group position="apart" w={170}>
                        <Text size="sm">GCash</Text>
                        <Text size="sm">{item.gcash}</Text>
                      </Group>
                      <Space h="sm" />
                      <Text size="xs">Ref. No. {form.values.referenceNo}</Text>
                      <Text size="xs">
                        {dayjs(orderedDate).format('MMM DD YYYY, h:mm A')}
                      </Text>
                      <Space h="sm" />
                    </Stack>
                  </Paper>
                </Paper>
              </div>
            </Center>
            <Text align="center" weight="bold">
              Item is waiting for approval
            </Text>
            <Text align="center" size="sm" color="dimmed">
              You can view your purchased virtual items
              <br />
              in your orders.
            </Text>
          </Stack>
          <Group grow position="right" mt="xl">
            <Button variant="default" onClick={() => setOpened(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                router.push('orders');
              }}
            >
              Go to Orders
            </Button>
          </Group>
        </Stepper.Completed>
      </Stepper>
    </Modal>
  );
}
