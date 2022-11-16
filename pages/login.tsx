import { LoginForm } from '@/components/LoginForm';
import { AuthLayout } from '@/layouts/AuthLayout';
import { NextPage } from 'next';
import { ReactElement } from 'react';

export default function Login() {
  return <LoginForm />;
}

Login.getLayout = function (page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
