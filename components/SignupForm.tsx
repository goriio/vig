import {
  Button,
  Card,
  Center,
  Divider,
  Text,
  TextInput,
  Title,
  PasswordInput,
  Stack,
} from '@mantine/core';
import { Logo } from './Logo';
import { BiAt, BiCheck, BiLock } from 'react-icons/bi';
import { useForm } from '@mantine/form';
import { isEmail } from '@/utils/validate';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';

export function SignupForm() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },

    validate: {
      email: (value) =>
        value === ''
          ? 'Email is required'
          : !isEmail(value)
          ? 'Invalid email'
          : null,
      password: (value, values) =>
        value === ''
          ? 'Password is required'
          : value !== values.passwordConfirm
          ? 'Password did not match'
          : null,
    },
  });

  const { mutate: signup, isLoading } = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
    },
    onSuccess: async () => {
      showNotification({
        message: 'Your account has been created.',
        icon: <BiCheck />,
        color: 'teal',
      });

      const res = await signIn('credentials', {
        email: form.values.email,
        password: form.values.password,
        redirect: false,
      });

      if (res?.ok) {
        router.push('/');
      }

      if (res?.error) {
        showNotification({
          message: 'Invalid credentials',
          color: 'red',
        });
      }
    },
    onError: (error: Error) => {
      showNotification({
        message: error.message || 'Something went wrong',
        color: 'red',
      });
    },
  });

  return (
    <Card p="lg" sx={{ width: '100%' }}>
      <Stack>
        <Center mb="md">
          <Logo />
        </Center>
        <form onSubmit={form.onSubmit((values) => signup(values))}>
          <Stack>
            <Title order={4}>Sign Up</Title>
            <TextInput
              label="Email"
              placeholder="mail@example.com"
              icon={<BiAt />}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              placeholder="Your secret here"
              label="Password"
              icon={<BiLock />}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              placeholder="Your secret here"
              label="Confirm Password"
              icon={<BiLock />}
              {...form.getInputProps('passwordConfirm')}
            />
            <Button type="submit" variant="default" loading={isLoading}>
              Sign up
            </Button>
          </Stack>
        </form>
        <Divider labelPosition="center" label="or" />
        <Button onClick={() => signIn('discord', { callbackUrl: '/' })}>
          Sign up with Discord
        </Button>
        <Center>
          <Text size="sm" mt="sm">
            Already have an account? <Link href="/login">Log in</Link>
          </Text>
        </Center>
      </Stack>
    </Card>
  );
}
