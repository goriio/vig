import { SignupForm } from '@/components/SignupForm';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ReactElement } from 'react';

export default function SignUp() {
  return <SignupForm />;
}

SignUp.getLayout = function (page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
