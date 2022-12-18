import { useState } from 'react';
import { isEmail } from '@/utils/validate';
import {
  Avatar,
  Button,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BiBomb, BiCheck } from 'react-icons/bi';

export default function Profile() {
  const { status, data } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/signup');
  }

  const form = useForm({
    initialValues: {
      name: data?.user?.name || '',
      email: data?.user?.email || '',
      image: data?.user?.image || '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name is required' : null),
      email: (value) =>
        value.length < 2
          ? 'Email is required'
          : !isEmail(value)
          ? 'Invalid email'
          : null,
      image: (value) => (value.length < 2 ? 'Image is required' : null),
    },
  });

  const { mutate: updateProfile, isLoading: updatingProfile } = useMutation({
    mutationFn: async (user: Omit<User, 'id' | 'emailVerified'>) => {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
    },
    onSuccess: () => {
      showNotification({
        title: '🎉 Successful',
        message: 'You have updated your information.',
        icon: <BiCheck />,
        color: 'teal',
      });
    },
    onError: () => {
      showNotification({
        message: 'Something went wrong',
        color: 'red',
      });
    },
  });

  const { mutate: deleteAccount, isLoading: deletingAccount } = useMutation({
    mutationFn: async () => {
      await fetch('/api/profile', {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      signOut();
      showNotification({
        message: 'Account has been deleted.',
        icon: <BiCheck />,
        color: 'teal',
      });
    },
    onError: () => {
      showNotification({
        message: 'Something went wrong',
        color: 'red',
      });
    },
  });

  return (
    <>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title="Delete account"
      >
        <Text mb="md">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Text>
        <Group position="right">
          <Button color="red" variant="subtle" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            loading={deletingAccount}
            onClick={() => deleteAccount()}
          >
            I am sure
          </Button>
        </Group>
      </Modal>
      <Title weight="normal" size="h3">
        General Settings
      </Title>
      <Divider my="lg" />
      <Title order={2} size="h4" mb="md">
        Profile Information
      </Title>
      <form onSubmit={form.onSubmit((values) => updateProfile(values))}>
        <SimpleGrid cols={1} mb="xl" breakpoints={[{ minWidth: 600, cols: 2 }]}>
          <TextInput
            label="Name"
            placeholder="name"
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="email"
            disabled
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Image"
            placeholder="image"
            {...form.getInputProps('image')}
          />
          <Avatar
            src={form.values.image}
            alt={`${data?.user?.name}'s avatar`}
            size="lg"
            radius="xl"
          />
        </SimpleGrid>
        <Button
          type="submit"
          disabled={!form.isDirty()}
          loading={updatingProfile}
        >
          Update Profile
        </Button>
      </form>
      <Divider variant="dashed" label="Danger" color="red" my="lg" />
      <Button
        variant="outline"
        color="red"
        leftIcon={<BiBomb />}
        onClick={() => setOpen(true)}
      >
        Delete Account
      </Button>
    </>
  );
}
