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
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useRouter } from 'next/router';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) =>
        value === ''
          ? 'Email is required'
          : !isEmail(value)
          ? 'Invalid email'
          : null,
      password: (value) => (value === '' ? 'Password is required' : null),
    },
  });

  async function login(values: { email: string; password: string }) {
    setLoading(true);

    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push('/');
      showNotification({
        title: '🎉 Successful',
        message: 'You have logged in.',
        icon: <BiCheck />,
        color: 'teal',
      });
    }

    if (res?.error) {
      showNotification({
        message: 'Invalid credentials',
        color: 'red',
      });
    }

    setLoading(false);
  }

  return (
    <Card p="lg" sx={{ width: '100%' }}>
      <Stack>
        <Center mb="md">
          <Logo />
        </Center>
        <Title order={4}>Login</Title>
        <form onSubmit={form.onSubmit((values) => login(values))}>
          <Stack>
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
            <Button type="submit" variant="default" loading={loading}>
              Log in
            </Button>
          </Stack>
        </form>
        <Divider labelPosition="center" label="or" />
        <Button onClick={() => signIn('discord', { callbackUrl: '/' })}>
          Login with Discord
        </Button>
        <Center>
          <Text size="sm" mt="sm">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup">Create an account</Link>
          </Text>
        </Center>
      </Stack>
    </Card>
  );
}
