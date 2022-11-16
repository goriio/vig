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
import { BiAt, BiLock } from 'react-icons/bi';
import { useForm } from '@mantine/form';
import { isEmail } from '@/utils/validate';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export function LoginForm() {
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

  return (
    <Card p="lg" sx={{ width: '100%' }}>
      <Stack>
        <Center mb="md">
          <Logo />
        </Center>
        <Title order={4}>Login</Title>
        <form onSubmit={form.onSubmit(() => false)}>
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
            <Button type="submit" variant="default">
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
