import {
  Button,
  Card,
  Group,
  Image,
  Modal,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { BiCheck } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';

export function Purchase({ opened, setOpened, item }: any) {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
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
    onSuccess: (data: any) => {
      setPurchaseLoading(false);

      showNotification({
        title: '🎉 Successful',
        message: 'The owner has been notified.',
        icon: <BiCheck />,
        color: 'teal',
      });

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
                alt={item.title}
                height={170}
                fit="contain"
              />
            </Card>
            <Text align="center" weight="bold">
              {item.title}
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
