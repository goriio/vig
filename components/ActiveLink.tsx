import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type ActiveLinkProps = {
  children: ReactNode;
  href: string;
  className: string;
};

export function ActiveLink({ children, href, className }: ActiveLinkProps) {
  const router = useRouter();

  const isPath = router.asPath === href ? ' active' : '';

  return (
    <Link href={href} className={className + isPath}>
      {children}
    </Link>
  );
}
