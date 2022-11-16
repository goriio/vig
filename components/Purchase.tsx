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
import GCashLogo from '@/assets/gcash-logo.png';
import { useRouter } from 'next/router';

export function Purchase({ opened, setOpened, item }: any) {
  const [active, setActive] = useState(0);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const form = useForm({
    initialValues: {
      number: '',
    },
    validate: {
      number: (value) =>
        !value
          ? 'Reference number is required'
          : !/^\d{11}/.test(value)
          ? 'Invalid reference number'
          : null,
    },
  });

  const router = useRouter();
  const currentUser = false;

  async function handlePurchase({ number }: any) {
    try {
      setPurchaseLoading(true);
      // await updateDoc(doc(db, 'items', item.id), {
      //   'buyer.id': currentUser.uid,
      //   'buyer.number': number,
      //   inMarket: false,
      // });
      showNotification({
        title: '🎉 Successful',
        message: 'The owner has been notified.',
        icon: <BiCheck />,
        color: 'teal',
      });

      nextStep();
    } catch (error: any) {
      showNotification({
        title: 'Something went wrong',
        message: error.message,
        color: 'red',
      });
    } finally {
      setPurchaseLoading(false);
    }
  }

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
                height={100}
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
          <form onSubmit={form.onSubmit(handlePurchase)}>
            <Stack>
              <Text align="center" weight="bold">
                <Image
                  src="gcash-logo.png"
                  alt="GCash Logo"
                  height={50}
                  fit="contain"
                />
                <Text>
                  Pay PHP {item.price} to {item.owner.wallet}
                </Text>
              </Text>
              <TextInput
                placeholder="00012345678"
                label="Payment Reference Number"
                size="md"
                {...form.getInputProps('number')}
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
              Item successfully purchased
            </Text>
            <Text align="center" size="sm" color="dimmed">
              You can view your purchased virtual items
              <br />
              in your inventory.
            </Text>
          </Stack>
          <Group grow position="right" mt="xl">
            <Button variant="default" onClick={() => setOpened(false)}>
              Close
            </Button>
            <Button onClick={() => router.push('/inventory')}>
              Go to my inventory
            </Button>
          </Group>
        </Stepper.Completed>
      </Stepper>
    </Modal>
  );
}
